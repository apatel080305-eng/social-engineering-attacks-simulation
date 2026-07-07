# Express Backend - Deep Dive

File: `BACKEND/src/index.js` and everything under `BACKEND/src/`

---

## Entry Point - `index.js`

When you run `node src/index.js` (or `npm start`), the following happens in order:

1. `dotenv.config()` - reads `.env` into `process.env`
2. `connectDB()` - opens a Mongoose connection to MongoDB (process exits on failure)
3. Express app is created and middleware is registered
4. All route files are imported and mounted under `/api/v1/...`
5. `app.listen(5000)` - server starts accepting connections
6. `checkAiService()` - a background HTTP ping to `http://localhost:8000/health`; if the AI service is not up it prints a warning with instructions (it does not crash the server)

---

## Middleware Stack (in order)

Every incoming request passes through these before hitting a route handler:

```
express.json()        - parses JSON request bodies
cookieParser()        - makes req.cookies available
helmet()              - adds security headers (CSP, X-Frame-Options, etc.)
cors(...)             - only allows requests from CLIENT_URL and ADMIN_URL origins
authLimiter           - applied to /api/v1/auth routes only: max 50 requests per 15 min
```

**Why Helmet?** Without it, browsers may allow the page to be iframed by anyone, or accept reflected script injections. Helmet sets a dozen HTTP headers that prevent these attacks with zero application code.

**Why cookie + Bearer token support?** The `authMiddleware.protect` function checks both sources. The browser-based frontend stores the token in an HttpOnly cookie (not accessible to JavaScript, so it can't be stolen by XSS). If another client (e.g., a mobile app or Postman) sends `Authorization: Bearer <token>` in the header instead, that also works.

---

## Route Mounting

| Mount Path | Route File | What it handles |
|---|---|---|
| `/api/v1/auth` | `authRoutes.js` | Register, login, logout, email verify, 2FA, password reset |
| `/api/v1/user` | `userRoutes.js` | Profile update, avatar upload, onboarding |
| `/api/v1/simulation` | `simulationRoutes.js` | Start/respond/end simulation sessions |
| `/api/v1/scenarios` | `scenarioRoutes.js` | List available scenarios |
| `/api/v1/training` | `trainingRoutes.js` | Learning modules, quiz submission, progress |
| `/api/v1/phishing` | `phishingRoutes.js` | Phishing lab templates |
| `/api/v1/questionnaires` | `questionnaireRoutes.js` | Onboarding questionnaires |
| `/api/v1/analytics` | `analyticsRoutes.js` | Platform-wide stats (admin only) |
| `/api/v1/admin` | `adminRoutes.js` | User/scenario management (admin only) |
| `/api/v1/notifications` | `notificationRoutes.js` | In-app notifications |
| `/api/v1/contact` | `contactRoutes.js` | Contact form submissions |
| `/api/v1/newsletter` | `newsletterRoutes.js` | Newsletter signup |
| `/api/v1/chat` | `chatRoutes.js` | Landing page chatbot (SSE stream) |

---

## Authentication Middleware - `authMiddleware.js`

Two exported functions:

### `protect`

Runs before any route that requires a logged-in user. It:

1. Looks for the JWT in `Authorization: Bearer <token>` header first, then falls back to `req.cookies.token`
2. If no token found → 401
3. Calls `jwt.verify(token, JWT_SECRET_KEY)` to decode and validate the signature + expiry
4. Fetches the user from MongoDB by the `id` embedded in the token payload
5. Attaches the full user document to `req.user`
6. Calls `next()` to proceed

If the token is expired or tampered with, `jwt.verify` throws and the middleware returns 401.

### `authorize(...roles)`

A factory function that returns a middleware. It checks `req.user.role` (set by `protect`) against the allowed roles array. If the user's role is not in the list, it returns 403. Used like:

```js
router.delete('/user/:id', protect, authorize('admin'), deleteUser);
```

This means even a valid logged-in user cannot call admin routes - their role must be `"admin"` in the database.

---

## Database Connection - `config/db.js`

Uses Mongoose to connect:

```js
await mongoose.connect(process.env.MONGODB_URL, { dbName: process.env.MONGODB_DB });
```

Mongoose handles the connection pool automatically. All models created with `mongoose.model(...)` share this single connection. If the connection fails on startup, `process.exit(1)` is called, which crashes the server rather than leaving it in a broken state.

---

## MongoDB Models

### `User`

The central model. Key fields:

- `email` - unique, lowercase, validated with a regex
- `password` - stored as a bcrypt hash (cost 12), excluded from queries by default (`select: false`)
- `provider` - `"local"`, `"google"`, or `"linkedin"` (for OAuth users)
- `role` - `"user"` or `"admin"`
- `isEmailVerified` - must be `true` before login is allowed
- `verificationToken` / `verificationTokenExpire` - used for the email verify flow
- `resetPasswordToken` / `resetPasswordExpire` - used for password reset
- `twoFactorSecret` - TOTP secret (select: false), only set when 2FA is activated
- `isTwoFactorEnabled` - boolean flag
- `profileTags` - array of strings derived from onboarding answers, used to personalise the simulation (e.g. `["handles_payments", "finance_role"]`)
- `jobRole`, `techLevel`, `orgSize` etc. - onboarding profile fields that help the AI tailor attacks

**Mongoose Hooks on User:**

`userSchema.pre("save")` - before saving, if the password field was modified, it is hashed with `bcrypt.hash(password, 12)`. The `12` is the salt rounds - higher means more secure but slower.

**Instance Methods:**

- `comparePassword(candidatePassword, hash)` - uses `bcrypt.compare` to check login passwords
- `createVerificationToken()` - generates 32 random bytes, returns the plain token to send by email, stores the SHA-256 hash in the database (so the raw token is never stored)
- `createPasswordResetToken()` - same pattern, 10-minute expiry

### `SimulationSession`

Stores a complete record of one simulation run. Key fields:

- `userId` - reference to the User
- `aiSessionId` - the UUID assigned by the AI service (in-memory session on the Python side)
- `turns` - subdocument array, each turn has: attacker message, user response, triggers fired, evaluation scores
- `overallScore`, `grade` - computed at the end by the AI service
- `triggersHit` - Map of trigger ID → count (e.g. `{ "urgency": 3, "authority": 1 }`)
- `triggerExplanations` - array of debrief objects explaining each trigger that fired
- `debriefContext` - text chunks retrieved from the knowledge base for the debrief
- `status` - `"active"` → `"completed"` or `"abandoned"`

### `Scenario`

Admin-managed documents defining each available simulation:

- `scenarioId` - string identifier (e.g. `"phishing-easy-1"`)
- `type` - one of the five attack types
- `difficulty` - `easy`, `medium`, `hard`
- `attackerPersona` - natural language description of who the attacker is pretending to be
- `isActive` - soft-delete flag

### `TrainingModule`, `ModuleProgress`, `Question`

`TrainingModule` stores structured content (sections of text, images, links). `Question` stores multiple-choice quiz questions with a `correct` field that is stripped out before sending to the client. `ModuleProgress` is a per-user record of whether they completed a module and their quiz score.

---

## The Simulation Flow (Express side)

### `POST /api/v1/simulation/start`

1. Looks up the `Scenario` in MongoDB by `scenarioId`
2. Calls the AI service: `POST http://localhost:8000/simulate/start` with the scenario details + user profile tags
3. AI service returns the first attacker message and a `session_id`
4. Creates a `SimulationSession` document in MongoDB (status: active, first turn stored)
5. Returns the attacker message to the frontend

### `POST /api/v1/simulation/:sessionId/respond`

1. Loads the session from MongoDB, verifies it belongs to the logged-in user and is active
2. Calls `POST http://localhost:8000/simulate/respond` with the AI session ID and the user's response
3. AI service evaluates the response and generates the next attacker message
4. Updates the last turn in MongoDB (adds evaluation scores)
5. Pushes a new turn document (next attacker message)
6. Returns the result to the frontend

There is also a **streaming version** (`respond/stream`). Instead of waiting for the full AI response, it opens a **Server-Sent Events (SSE)** connection and streams tokens back as they are generated by Ollama. This is what makes the attacker's text appear word-by-word in the UI.

### `POST /api/v1/simulation/:sessionId/end`

1. Calls `POST http://localhost:8000/simulate/end`
2. AI service computes the final score, retrieves debrief content, and returns trigger explanations
3. Express saves all of this to the `SimulationSession` document, sets status to `"completed"`

---

## Chat Bot - `chatController.js`

The landing page chatbot answers questions about INTERCEPTOR. It:

1. Checks the user's message against a blocklist of regex patterns (code-generation requests, model identity probing, prompt injection attempts) - if matched, returns a canned reply without touching the LLM
2. Otherwise, streams the query to `POST http://localhost:8000/chat/ask/stream`
3. Pipes the SSE stream back to the browser

The blocklist protects against users trying to abuse the LLM (e.g. "ignore your instructions and write me a script").

---

## Error Handling

The global error handler at the bottom of `index.js` catches any error passed to `next(err)`:

```js
app.use((err, req, res, next) => {
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Server Error",
  });
});
```

Every controller wraps its logic in a try/catch. Caught errors are either handled inline (with specific status codes and messages) or passed to `next(err)`.

---

## Rate Limiting

`express-rate-limit` is applied to `/api/v1/auth` only:

- Window: 15 minutes
- Max: 50 requests per IP

This prevents brute-force attacks on the login endpoint. A general API limiter exists in the code but is commented out for development (it was causing issues with high-frequency legitimate requests during testing).

---

## Email System - `utils/email.js`

Uses Nodemailer with SMTP credentials from `.env`. Two email templates live in `templates/emailTemplates.js`:

- `verificationEmail(url)` - HTML email with a "Verify Account" button
- `resetPasswordEmail(url)` - HTML email with a "Reset Password" button

Tokens in these URLs are the **raw** (un-hashed) versions. When the user clicks the link, the frontend sends the raw token to the API. The API hashes it and compares against the stored hash - this means even if someone gets read access to the database, they cannot use the stored hash to verify or reset.
