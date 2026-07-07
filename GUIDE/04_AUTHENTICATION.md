# Authentication System - Deep Dive

Files: `BACKEND/src/controllers/authController.js`, `BACKEND/src/middleware/authMiddleware.js`, `BACKEND/src/models/User.js`

---

## Overview

INTERCEPTOR uses **JWT (JSON Web Token)** based authentication with support for:
- Local email/password login
- OAuth (Google, LinkedIn) via `oauthController.js`
- Email verification (required before first login)
- Password reset via emailed token
- TOTP-based Two-Factor Authentication (2FA)

---

## Registration Flow

**Endpoint:** `POST /api/v1/auth/register`

```
Client → POST /register { name, email, password }
         ↓
   Check email is not already taken
         ↓
   Create User document (password gets bcrypt-hashed in pre-save hook)
         ↓
   Generate verification token:
     - crypto.randomBytes(32) → 32 random bytes
     - Return the plain (hex) token → send in email
     - Store SHA-256 hash of token in DB  ← never store raw token
         ↓
   Send email with link: /verify-email?token=<plain_token>
         ↓
   Respond 201: "Check your email"
```

Why is only the **hash** stored in the database? If an attacker reads your database (SQL injection, backup leak, etc.), they get hashes - not raw tokens. A SHA-256 hash cannot be reversed to produce the original token, so they cannot use the database values to verify emails or reset passwords.

---

## Email Verification Flow

**Endpoint:** `POST /api/v1/auth/verify-email` `{ token: "<plain>" }`

```
   Hash the incoming token: SHA-256(plain_token)
         ↓
   Find user where verificationToken == hash AND expire > now
         ↓
   Set isEmailVerified = true, clear token fields
         ↓
   200 OK
```

A user cannot log in until `isEmailVerified` is `true`. This is checked in the login handler.

---

## Login Flow

**Endpoint:** `POST /api/v1/auth/login` `{ email, password }`

```
   Find user by email - select password and twoFactorSecret fields
   (these are select: false in the schema, so you must explicitly request them)
         ↓
   If user signed up via OAuth (provider != "local") → return error
   telling them to use the social login button
         ↓
   bcrypt.compare(candidate, stored_hash) → if false → 401
         ↓
   if isEmailVerified == false → 403 with emailNotVerified flag
         ↓
   if isTwoFactorEnabled == true:
     → return { twoFactorRequired: true, userId } (no JWT yet)
   else:
     → generate JWT, set HttpOnly cookie, return token + user data
```

**JWT generation:**

```js
jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: "30d" })
```

The token payload only contains the user's MongoDB ObjectId (`id`). The JWT is signed with `JWT_SECRET_KEY` from the environment. Anyone with that secret can forge tokens - it must stay private.

**Cookie settings:**

```js
{
  expires: 30 days from now,
  httpOnly: true,    // JavaScript cannot read this cookie
  secure: true,      // only sent over HTTPS (in production)
  sameSite: "Lax",  // prevents CSRF from cross-site POST requests
}
```

`httpOnly: true` is the critical security property. It means even if an attacker injects JavaScript into your page (XSS), they cannot read the cookie and steal the token.

---

## Two-Factor Authentication (2FA)

INTERCEPTOR implements **TOTP** (Time-based One-Time Password) - the same standard used by Google Authenticator and Authy.

### Setup Flow

**Endpoint:** `POST /api/v1/auth/2fa/setup` (requires `protect`)

1. `speakeasy.generateSecret()` creates a base32-encoded TOTP secret
2. The secret and OTP Auth URL are returned; `qrcode.toDataURL()` converts the URL into a QR code image
3. The temp secret is saved to `user.twoFactorAuthTempSecret` (not yet the real secret)
4. The frontend displays the QR code - user scans it with their authenticator app

### Activation Flow

**Endpoint:** `POST /api/v1/auth/2fa/activate` `{ token: "123456" }`

1. `speakeasy.totp.verify()` checks the 6-digit code against the temp secret
2. If valid: `twoFactorSecret = twoFactorAuthTempSecret`, `isTwoFactorEnabled = true`
3. From now on, every login requires a TOTP code after the password

### Login with 2FA

When `isTwoFactorEnabled` is true, the login endpoint returns early with:
```json
{ "twoFactorRequired": true, "userId": "..." }
```
No JWT is issued. The frontend shows a "Enter your 6-digit code" screen. The user submits:

**Endpoint:** `POST /api/v1/auth/2fa/verify-login` `{ userId, token }`

1. Fetch user and their `twoFactorSecret`
2. `speakeasy.totp.verify()` - TOTP codes are time-based: they change every 30 seconds and are derived from `SHA1-HMAC(secret, floor(unix_timestamp / 30))`
3. If valid → issue JWT and set cookie (normal login completion)

### Disabling 2FA

**Endpoint:** `POST /api/v1/auth/2fa/disable` `{ password }`

Requires the user to re-enter their password to confirm the action. `bcrypt.compare()` is called before clearing the 2FA fields.

---

## Password Reset Flow

**Endpoint:** `POST /api/v1/auth/forgot-password` `{ email }`

Same token pattern as email verification:
- `crypto.randomBytes(32)` → plain token → send in email
- SHA-256 hash stored in DB
- Expires in 10 minutes (much shorter than verification tokens)

**Endpoint:** `POST /api/v1/auth/reset-password` `{ token, password }`

- Hash incoming token, find user where hash matches and expiry > now
- Set `user.password = req.body.password` (Mongoose pre-save hook hashes it)
- Clear reset token fields

---

## Logout

**Endpoint:** `POST /api/v1/auth/logout`

Sets the cookie to a value of `"none"` with a 10-second expiry. Since the cookie is HttpOnly, the frontend cannot delete it directly - this server-side replacement is the correct approach. The short expiry means the old JWT stops being sent very quickly.

---

## OAuth (Google / LinkedIn)

Handled in `oauthController.js`. The OAuth flow works differently from local auth:
- No password is required or stored
- The `provider` field is set to `"google"` or `"linkedin"`
- The `providerId` field stores the OAuth provider's unique user ID
- A composite unique index on `{ provider, providerId }` prevents duplicate accounts

When an OAuth user tries to use the local login form, the login handler detects `provider !== "local"` and returns a friendly error message telling them to use the social login button.

---

## How `protect` Ties It All Together

Once logged in, every protected API call:

1. Sends the JWT (either in the cookie automatically by the browser, or in `Authorization: Bearer` header)
2. The `protect` middleware verifies the JWT signature and expiry
3. Fetches the current user document from MongoDB (so changes like account deactivation are reflected immediately - the JWT is not self-contained with user data)
4. Attaches the user to `req.user`

This is why routes can access `req.user._id`, `req.user.role`, `req.user.profileTags` etc. without any extra database call inside the controller.

---

## Security Properties Summary

| Threat | Defence |
|---|---|
| Password theft from DB | bcrypt hash with cost factor 12 |
| Token theft from DB | Only SHA-256 hashes stored, never raw tokens |
| XSS stealing JWT | HttpOnly cookie - JS cannot read it |
| CSRF forging requests | `sameSite: Lax` cookie attribute |
| Brute-force login | Rate limit: 50 requests / 15 min per IP |
| Privilege escalation | `authorize()` middleware checks role on every admin route |
| Expired 2FA codes | TOTP standard: codes valid for 30-second windows only |
| Weak HTTP headers | `helmet()` middleware sets security headers automatically |
