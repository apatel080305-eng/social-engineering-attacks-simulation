# Postman & API Testing - Testing APIs Easily

## What Is Postman?

**Postman** is a tool for **testing and debugging APIs** without writing code.

Think of it like:
```
Browser = For viewing websites
Postman = For testing APIs
```

Instead of writing fetch code, you can:
- Send HTTP requests visually
- Save requests for later
- Test endpoints
- Check responses
- Debug issues

---

## Installing Postman

1. Go to [getpostman.com](https://www.postman.com/downloads/)
2. Download for Windows, Mac, or Linux
3. Install it
4. Create free account
5. Start using!

---

## The Postman Interface

```
┌─────────────────────────────────────────────────────────────┐
│ Postman                                                     │
├─────────────────────────────────────────────────────────────┤
│ [Collections] [Environments] [Globals] [History]            │
├─────────────────────────────────────────────────────────────┤
│ Method: [GET ▼] URL: [http://localhost:5000/api/users]   │
│                  [Send]                                    │
├─────────────────────────────────────────────────────────────┤
│ Tabs: [Params] [Auth] [Headers] [Body] [Tests]             │
│                                                             │
│ Headers:                                                    │
│ ┌──────────────────────────────────────────────────────────┤
│ │ Key                 │ Value                              │
│ ├──────────────────────────────────────────────────────────┤
│ │ Content-Type        │ application/json                   │
│ │ Authorization       │ Bearer token123                    │
│ └──────────────────────────────────────────────────────────┘
│                                                             │
│ Body (raw JSON):                                           │
│ ┌──────────────────────────────────────────────────────────┤
│ │ {                                                        │
│ │   "name": "John Doe",                                    │
│ │   "email": "john@example.com"                            │
│ │ }                                                        │
│ └──────────────────────────────────────────────────────────┘
├─────────────────────────────────────────────────────────────┤
│ RESPONSE:                                                   │
│                                                             │
│ Status: 200 OK (123ms)                                     │
│                                                             │
│ {                                                           │
│   "id": 456,                                               │
│   "name": "John Doe",                                      │
│   "email": "john@example.com",                             │
│   "created_at": "2024-01-15T10:30:45Z"                     │
│ }                                                           │
└─────────────────────────────────────────────────────────────┘
```

---

## Basic Workflow: Testing an API

### Step 1: Create a Request

1. Click **"New"** → **"Request"**
2. Give it a name: "Get All Users"
3. Select collection or create new

### Step 2: Set Method and URL

```
Method: GET (or POST, PUT, DELETE, etc.)
URL: http://localhost:5000/api/users
```

### Step 3: Add Headers (if needed)

```
Content-Type: application/json
Authorization: Bearer your_token_here
```

### Step 4: Add Body (for POST/PUT)

```json
{
  "name": "Jane Smith",
  "email": "jane@example.com"
}
```

### Step 5: Send Request

Click **Send** button → See response below

### Step 6: Check Response

```
Status: 200 OK
Time: 156ms

Response Body:
{
  "id": 123,
  "name": "Jane Smith",
  "email": "jane@example.com"
}
```

---

## Common HTTP Methods in Postman

### GET Request (Retrieve Data)

```
Method: GET
URL: http://localhost:5000/api/users/123
Body: (empty)

Response:
{
  "id": 123,
  "name": "John Doe",
  "email": "john@example.com"
}
```

### POST Request (Create Data)

```
Method: POST
URL: http://localhost:5000/api/users
Headers:
  Content-Type: application/json

Body (raw):
{
  "name": "Jane Smith",
  "email": "jane@example.com"
}

Response:
{
  "id": 456,
  "name": "Jane Smith",
  "email": "jane@example.com",
  "created_at": "2024-01-15T10:30:45Z"
}
```

### PUT Request (Update Data)

```
Method: PUT
URL: http://localhost:5000/api/users/123
Headers:
  Content-Type: application/json

Body (raw):
{
  "name": "John Updated",
  "email": "john.updated@example.com"
}

Response:
{
  "id": 123,
  "name": "John Updated",
  "email": "john.updated@example.com"
}
```

### DELETE Request (Remove Data)

```
Method: DELETE
URL: http://localhost:5000/api/users/123

Response (204 No Content):
(empty - just confirms deletion)
```

---

## Using Query Parameters

Query parameters go in the URL after `?`:

### In Postman:

```
URL: http://localhost:5000/api/users

Params Tab:
Key           Value
age           30
city          New York
status        active

Postman generates:
http://localhost:5000/api/users?age=30&city=New York&status=active
```

### Backend receives:
```javascript
app.get('/api/users', (req, res) => {
  const age = req.query.age;        // "30"
  const city = req.query.city;      // "New York"
  const status = req.query.status;  // "active"
});
```

---

## Authentication in Postman

### Basic Auth

1. Click **Auth** tab
2. Select **Basic Auth** from dropdown
3. Enter username and password

Postman adds header:
```
Authorization: Basic dXNlcjpwYXNz  (base64 encoded)
```

### Bearer Token

1. Click **Auth** tab
2. Select **Bearer Token** from dropdown
3. Enter your token

Postman adds header:
```
Authorization: Bearer your_token_here
```

### Custom Headers

1. Click **Headers** tab
2. Add custom header:
```
Key: X-API-Key
Value: your_api_key_here
```

---

## Collections - Organize Multiple Requests

Collections let you group related requests:

```
Postman Collection Structure:

Users API Collection
├── GET /users              (get all users)
├── GET /users/:id          (get specific user)
├── POST /users             (create user)
├── PUT /users/:id          (update user)
└── DELETE /users/:id       (delete user)

Blog API Collection
├── GET /posts              (get all posts)
├── POST /posts             (create post)
├── GET /posts/:id/comments (get comments)
└── POST /posts/:id/like    (like post)
```

### Creating a Collection

1. Click **"New"** → **"Collection"**
2. Name it: "Users API"
3. Add requests to it
4. Save and organize

---

## Variables & Environments

### Using Variables

Set values once, use in multiple places:

```
Environments:
│
├─ Development
│   BASE_URL: http://localhost:5000
│   AUTH_TOKEN: dev_token_123
│
├─ Production
│   BASE_URL: https://api.example.com
│   AUTH_TOKEN: prod_token_xyz
│
└─ Testing
    BASE_URL: http://test.example.com
    AUTH_TOKEN: test_token_abc
```

### In Requests

Instead of hardcoding URL:
```
❌ http://localhost:5000/api/users
✅ {{BASE_URL}}/api/users

❌ Authorization: Bearer prod_token_xyz
✅ Authorization: Bearer {{AUTH_TOKEN}}
```

Switch environment = All requests use new values!

---

## Pre-Requests & Tests

### Pre-Request Script

Run code **before** sending request:

```javascript
// Automatically set timestamp header
pm.request.headers.add({
  key: 'X-Timestamp',
  value: new Date().toISOString()
});

// Set a variable
pm.environment.set("timestamp", Date.now());
```

### Test Script

Run code **after** getting response:

```javascript
// Check status code
pm.test("Status code is 200", function() {
  pm.response.to.have.status(200);
});

// Check response structure
pm.test("Response has user data", function() {
  var jsonData = pm.response.json();
  pm.expect(jsonData.id).to.exist;
  pm.expect(jsonData.name).to.be.a('string');
});

// Check specific values
pm.test("User email is correct", function() {
  var jsonData = pm.response.json();
  pm.expect(jsonData.email).to.equal('john@example.com');
});

// Save value for next request
pm.environment.set("user_id", pm.response.json().id);
```

---

## Real-World Example: API Testing Workflow

### Scenario: Testing User Registration Flow

**Request 1: Register User**
```
POST http://{{BASE_URL}}/api/auth/register
Body:
{
  "email": "newuser@example.com",
  "password": "SecurePass123!"
}

Test:
pm.test("User registered successfully", function() {
  pm.response.to.have.status(201);
  var data = pm.response.json();
  pm.expect(data.id).to.exist;
  pm.environment.set("user_id", data.id);
  pm.environment.set("auth_token", data.token);
});
```

**Request 2: Get User Profile (using token from previous)**
```
GET http://{{BASE_URL}}/api/users/{{user_id}}
Headers:
  Authorization: Bearer {{auth_token}}

Test:
pm.test("User profile retrieved", function() {
  pm.response.to.have.status(200);
  var data = pm.response.json();
  pm.expect(data.email).to.equal('newuser@example.com');
});
```

**Request 3: Update User Profile**
```
PUT http://{{BASE_URL}}/api/users/{{user_id}}
Headers:
  Authorization: Bearer {{auth_token}}
Body:
{
  "firstName": "John",
  "lastName": "Doe"
}

Test:
pm.test("Profile updated", function() {
  pm.response.to.have.status(200);
});
```

---

## Common Errors & Solutions

### ❌ "Cannot GET /api/users"

**Problem:** Wrong URL
**Solution:** Check backend is running on correct port

```
❌ http://localhost:3000/api/users  (if backend on 5000)
✅ http://localhost:5000/api/users
```

### ❌ "401 Unauthorized"

**Problem:** Missing authentication token
**Solution:** Add Auth header

```
Headers:
Authorization: Bearer your_actual_token
```

### ❌ "400 Bad Request"

**Problem:** Invalid data format
**Solution:** Check body is valid JSON

```
❌ { name: John }           (single quotes)
✅ { "name": "John" }       (double quotes)
```

### ❌ "405 Method Not Allowed"

**Problem:** Wrong HTTP method
**Solution:** Check request method

```
❌ POST /api/users/123      (if endpoint expects GET)
✅ GET /api/users/123
```

---

## Tips & Tricks

### 1. Duplicate Request

Right-click request → **Duplicate** (to avoid re-typing)

### 2. Run Collections Sequentially

Use "Collection Runner" to run multiple requests in order

### 3. Share Collections

Export → Share via JSON file with team

### 4. Monitor APIs

Set up monitors to check API health regularly

### 5. Mock Servers

Create mock server to test frontend before backend is ready

### 6. Documentation

Postman auto-generates API docs from your collection

---

## Postman vs Manual Testing

| Aspect | Manual (curl) | Postman |
|--------|---------------|---------|
| Learning curve | Steep | Easy |
| Visual interface | No | Yes ✅ |
| Save requests | No | Yes ✅ |
| Environment switching | Complex | Easy ✅ |
| Authentication | Manual | Built-in ✅ |
| Run collections | Script needed | Built-in ✅ |
| Team collaboration | Git | Cloud sync ✅ |

---

## Summary

```
Postman = Visual HTTP client
Send requests without code
Test APIs quickly
Save and organize requests
Switch environments easily
Automate with tests and scripts
```

You now understand the full API development journey!

Next: Review **REST API Design** principles one more time!
