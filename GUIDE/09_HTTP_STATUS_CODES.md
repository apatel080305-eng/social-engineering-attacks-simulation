# HTTP Status Codes Explained

## What Are Status Codes?

An HTTP status code is a 3-digit number that the server sends back to tell the client what happened with the request. It's like a receipt after a transaction - it tells you if everything went well, if there was an error, or if something specific happened.

---

## Status Code Categories

Status codes are grouped into 5 categories based on the first digit:

| Code Range | Category | Meaning |
|---|---|---|
| **100-199** | Informational | Request received, waiting... |
| **200-299** | Success | Request succeeded! |
| **300-399** | Redirection | Go somewhere else |
| **400-499** | Client Error | You (the client) did something wrong |
| **500-599** | Server Error | We (the server) did something wrong |

---

## 2xx Success Codes (Everything's Good!)

### **200 OK** - The Request Succeeded
The most common success code. The server processed the request and returned the expected result.

**Example:**
```
GET /api/users/123

Response: 200 OK
{
  "id": 123,
  "name": "John Doe",
  "email": "john@example.com"
}
```

### **201 Created** - New Resource Created
Used after a successful POST request that creates a new resource. Returns the newly created object.

**Example:**
```
POST /api/users
{
  "name": "Jane Smith",
  "email": "jane@example.com"
}

Response: 201 Created
{
  "id": 456,
  "name": "Jane Smith",
  "email": "jane@example.com",
  "createdAt": "2026-06-18T10:30:00Z"
}
```

### **204 No Content** - Success, But No Data to Return
Used after DELETE or sometimes after PUT/PATCH. The operation succeeded but there's nothing to send back.

**Example:**
```
DELETE /api/users/123

Response: 204 No Content
(empty body - nothing to return)
```

---

## 3xx Redirection Codes (Go Somewhere Else)

### **301 Moved Permanently** - Resource Moved
The resource has permanently moved to a new location. The browser should update its bookmarks.

**Example:**
```
GET /api/v1/users        # Old API endpoint

Response: 301 Moved Permanently
Location: /api/v2/users  # Use this URL instead
```

### **302 Found** - Temporary Redirect
The resource is temporarily at a different location. Same request might work at the original URL later.

**Example:**
```
GET /users

Response: 302 Found
Location: /users/login   # Temporarily redirect here
```

### **304 Not Modified** - Use Cached Version
The resource hasn't changed since the client last downloaded it. The client can use its cached copy.

**Example (caching):**
```
GET /api/posts
If-None-Match: "abc123"  # "I have this version from before"

Response: 304 Not Modified
(no body - client uses cache)
```

---

## 4xx Client Error Codes (You Did Something Wrong)

### **400 Bad Request** - Invalid Request Format
The server doesn't understand the request because it's malformed.

**Example:**
```
POST /api/users
{
  "name": "John",
  "email": "not-an-email"   # Invalid email format
}

Response: 400 Bad Request
{
  "error": "Invalid email format"
}
```

### **401 Unauthorized** - Authentication Required
You haven't logged in or your credentials are invalid.

**Example:**
```
GET /api/admin/dashboard
(No authentication token provided)

Response: 401 Unauthorized
{
  "error": "Please log in first"
}
```

**Real-world:** Like trying to enter a member-only club without membership.

### **403 Forbidden** - Authenticated but No Permission
You're logged in, but you don't have permission to access this resource.

**Example:**
```
GET /api/admin/dashboard
Authorization: Bearer user_token_123  # You're logged in as regular user

Response: 403 Forbidden
{
  "error": "Only admins can access this"
}
```

**Real-world:** Like having a ticket to the concert but trying to go backstage.

### **404 Not Found** - Resource Doesn't Exist
The server can't find the requested resource.

**Example:**
```
GET /api/users/999999

Response: 404 Not Found
{
  "error": "User not found"
}
```

### **409 Conflict** - Request Conflicts with Current State
Usually happens when trying to create something that already exists.

**Example:**
```
POST /api/users
{
  "email": "john@example.com"  # Email already exists in database
}

Response: 409 Conflict
{
  "error": "Email already registered"
}
```

### **422 Unprocessable Entity** - Request Valid But Can't Process
The request format is correct, but the logic doesn't work.

**Example:**
```
POST /api/accounts
{
  "email": "john@example.com",
  "age": -5   # Age can't be negative
}

Response: 422 Unprocessable Entity
{
  "error": "Age must be positive"
}
```

---

## 5xx Server Error Codes (We Did Something Wrong)

### **500 Internal Server Error** - Something Broke
Generic server error. Something unexpected happened on the backend.

**Example:**
```
GET /api/users/123

Response: 500 Internal Server Error
{
  "error": "An unexpected error occurred"
}
```

**Real-world:** Like calling a restaurant and their system crashes mid-order.

### **502 Bad Gateway** - Upstream Service Error
The server is trying to reach another service but it's not responding.

**Example:** Backend can't reach the AI service or database.

```
GET /api/simulation

Response: 502 Bad Gateway
{
  "error": "AI service is temporarily unavailable"
}
```

### **503 Service Unavailable** - Temporarily Down
The server is temporarily unable to handle requests (maintenance, overloaded, etc.).

**Example:**
```
GET /api/posts

Response: 503 Service Unavailable
{
  "error": "Server is under maintenance. Try again in 30 minutes."
}
```

---

## Quick Reference Table

| Code | Status | When to Use | Category |
|------|--------|---|---|
| **200** | OK | Request succeeded | ✅ Success |
| **201** | Created | New resource created | ✅ Success |
| **204** | No Content | Success, nothing to return | ✅ Success |
| **301** | Moved Permanently | Resource moved forever | 🔄 Redirect |
| **302** | Found | Temporary redirect | 🔄 Redirect |
| **304** | Not Modified | Use cache | 🔄 Redirect |
| **400** | Bad Request | Invalid request format | ❌ Client Error |
| **401** | Unauthorized | Need to authenticate | ❌ Client Error |
| **403** | Forbidden | No permission | ❌ Client Error |
| **404** | Not Found | Resource doesn't exist | ❌ Client Error |
| **409** | Conflict | Already exists | ❌ Client Error |
| **422** | Unprocessable Entity | Logic error | ❌ Client Error |
| **500** | Internal Server Error | Backend crashed | 💥 Server Error |
| **502** | Bad Gateway | Can't reach other service | 💥 Server Error |
| **503** | Unavailable | Server temporarily down | 💥 Server Error |

---

## Real Example: Creating a User Account

### Scenario 1: Happy Path (Success)
```
POST /api/users
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "secure123"
}

Response: 201 Created
{
  "id": 123,
  "name": "John Doe",
  "email": "john@example.com",
  "createdAt": "2026-06-18T10:30:00Z"
}
```
**Meaning:** Account created successfully!

### Scenario 2: Email Already Registered (Client Error)
```
POST /api/users
{
  "name": "John Doe",
  "email": "existing@example.com",  # Already exists
  "password": "secure123"
}

Response: 409 Conflict
{
  "error": "Email already registered"
}
```
**Meaning:** You did something wrong - this email is taken.

### Scenario 3: Invalid Email Format (Client Error)
```
POST /api/users
{
  "name": "John Doe",
  "email": "not-a-valid-email",  # Malformed
  "password": "secure123"
}

Response: 400 Bad Request
{
  "error": "Invalid email format"
}
```
**Meaning:** Your request format is wrong.

### Scenario 4: Database Crashed (Server Error)
```
POST /api/users
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "secure123"
}

Response: 500 Internal Server Error
{
  "error": "Database connection failed"
}
```
**Meaning:** Something went wrong on our end - not your fault.

---

## How to Debug Status Codes

### In Your Browser (Using Developer Tools)

1. Open DevTools (F12)
2. Go to **Network** tab
3. Make a request (refresh page or click a button)
4. Look at **Status** column - it shows the status code

### In Your Code (Using Console)
```javascript
fetch('/api/users/123')
  .then(response => {
    console.log('Status Code:', response.status);  // 200, 404, 500, etc.
    if (response.status === 404) {
      console.log('User not found');
    } else if (response.status === 200) {
      return response.json();
    }
  });
```

---

## Key Takeaways

- **2xx codes** = Success ✅
- **3xx codes** = Redirect (go elsewhere) 🔄
- **4xx codes** = Client error (your fault) ❌
- **5xx codes** = Server error (our fault) 💥
- **Status codes make debugging easier** - they tell you what went wrong!

Always check status codes when something unexpected happens!
