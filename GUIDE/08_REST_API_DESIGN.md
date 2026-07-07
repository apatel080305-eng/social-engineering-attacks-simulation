# REST API Design Fundamentals

## What is REST?

**REST** stands for **Representational State Transfer**. It's a way to design web APIs (Application Programming Interfaces) that are simple, predictable, and easy to understand.

Think of REST like a **library system**:
- Resources are like books (users, posts, comments)
- HTTP methods are like operations (check out, return, update catalog)
- URLs are like a filing system (where to find what)

---

## The Core Principles of REST

### 1. **Resources Are Everything**

In REST, everything is a **resource** with a unique identifier (usually a URL).

**Good REST Design:**
```
/api/users              # Resource: all users
/api/users/123          # Resource: specific user
/api/posts/42           # Resource: specific post
/api/users/123/posts    # Resource: posts by user 123
```

**Bad Design (not RESTful):**
```
/api/getUser?id=123            # Wrong - uses action in URL
/api/deleteUserAndPosts        # Wrong - tries to do multiple things
/api/userData                  # Vague - what is "data"?
```

### 2. **Use HTTP Methods Correctly**

| Method | What It Means | Example |
|--------|---|---|
| GET | Retrieve a resource | `GET /api/users/123` |
| POST | Create a new resource | `POST /api/users` |
| PUT | Replace a resource entirely | `PUT /api/users/123` |
| PATCH | Update part of a resource | `PATCH /api/users/123` |
| DELETE | Remove a resource | `DELETE /api/users/123` |

**Don't do this:**
```
GET /api/deleteUser?id=123           # ❌ Wrong! Should be DELETE
POST /api/createAndActivateUser      # ❌ Wrong! One operation per call
GET /api/user/update/email/new@...   # ❌ Wrong! Not readable or maintainable
```

### 3. **Stateless Communication**

Each request must contain all the information needed to understand it. The server shouldn't need to remember previous requests.

**Good (Stateless):**
```
GET /api/users/123
Authorization: Bearer token_abc123
Content-Type: application/json
```
The request includes everything needed (which user, authentication).

**Bad (Stateful):**
```
// First request
GET /api/login?user=123
// Server remembers this user is logged in

// Second request - server needs to remember who "this user" is
GET /api/profile
```

### 4. **Use Meaningful HTTP Status Codes**

The response code tells the client what happened:

| Code | Meaning | Example |
|------|---------|---------|
| **200** | OK - Success | User retrieved successfully |
| **201** | Created - Resource created | New user created |
| **400** | Bad Request - Client error | Missing required field |
| **401** | Unauthorized - Need to login | Invalid token |
| **403** | Forbidden - Authenticated but no permission | Not allowed to delete |
| **404** | Not Found - Resource doesn't exist | User ID 999 doesn't exist |
| **500** | Server Error - Backend problem | Database crashed |

---

## URL Structure (Naming Conventions)

### Resources Should Be Nouns, Not Verbs

**✅ Good:**
```
GET    /api/users              # Get all users
POST   /api/users              # Create a user
GET    /api/users/123          # Get user 123
PUT    /api/users/123          # Replace user 123
PATCH  /api/users/123          # Update user 123
DELETE /api/users/123          # Delete user 123
```

**❌ Bad:**
```
GET    /api/getUsers           # Verb in URL (redundant with GET)
POST   /api/createUser         # Verb in URL
GET    /api/userInfo/123       # Confusing naming
DELETE /api/removeUser/123     # Verb in URL
```

### Use Plurals for Collections

```
✅ /api/users              # Collection of users
✅ /api/users/123/posts    # User 123's posts
❌ /api/user               # Ambiguous - which user?
❌ /api/user/123/post      # Inconsistent naming
```

### Use Path Hierarchy for Relationships

```
/api/users/123           # User 123
/api/users/123/posts     # Posts by user 123
/api/users/123/posts/42  # Specific post by user 123
/api/posts/42/comments   # Comments on post 42
```

---

## Request/Response Format

### Request (What the Client Sends)

```
POST /api/users
Content-Type: application/json
Authorization: Bearer token_xyz

{
  "name": "John Doe",
  "email": "john@example.com"
}
```

### Response (What the Server Sends Back)

```
HTTP/1.1 201 Created
Content-Type: application/json

{
  "id": 123,
  "name": "John Doe",
  "email": "john@example.com",
  "createdAt": "2026-06-18T10:30:00Z"
}
```

---

## Common Mistakes in API Design

### ❌ Mistake 1: Mixing Resources and Actions
```
POST /api/deleteUser/123        # Wrong! URL has action ("delete")
POST /api/users/123/activate    # Wrong! This should be PATCH/PUT
GET  /api/generateReport        # Wrong! Not a resource
```

**Fix it:**
```
DELETE /api/users/123           # Clean - method says what happens
PATCH  /api/users/123           # Use method to describe action
GET    /api/reports             # Treat report as a resource
```

### ❌ Mistake 2: Inconsistent Response Format
Sometimes returning array, sometimes object:
```
GET /api/users/123
{ "id": 123, "name": "John" }   # Object

GET /api/users
[{ "id": 1, "name": "John" }]   # Array - consistent! ✓

GET /api/users/all
{ "users": [...] }              # Object - inconsistent! ✗
```

### ❌ Mistake 3: Not Using Query Parameters Correctly
```
GET /api/users/age/25/role/admin    # Wrong - too many path segments
GET /api/users?age=25&role=admin    # Right! - query parameters
```

---

## Real Example: Social Media API

Let's design a simple API for a social media platform:

### Create a post
```
POST /api/posts
{
  "title": "My First Post",
  "content": "Hello everyone!",
  "author_id": 123
}

Response (201 Created):
{
  "id": 1,
  "title": "My First Post",
  "content": "Hello everyone!",
  "author_id": 123,
  "created_at": "2026-06-18T10:00:00Z"
}
```

### Get all posts
```
GET /api/posts
GET /api/posts?limit=10&offset=0   # With pagination

Response (200 OK):
[
  { "id": 1, "title": "...", "author_id": 123 },
  { "id": 2, "title": "...", "author_id": 456 }
]
```

### Get specific post
```
GET /api/posts/1

Response (200 OK):
{
  "id": 1,
  "title": "My First Post",
  "author_id": 123,
  "comments": [...]
}
```

### Update post
```
PATCH /api/posts/1
{
  "title": "My Updated Post"
}

Response (200 OK):
{
  "id": 1,
  "title": "My Updated Post",
  "updated_at": "2026-06-18T11:00:00Z"
}
```

### Delete post
```
DELETE /api/posts/1

Response (204 No Content):
(empty body)
```

---

## Checklist: Is Your API RESTful?

- ✅ URLs represent **resources** (nouns), not actions (verbs)
- ✅ Uses **correct HTTP methods** (GET for read, POST for create, etc.)
- ✅ Uses **meaningful status codes** (200, 201, 400, 404, etc.)
- ✅ Each request is **stateless** (includes all needed info)
- ✅ Consistent **response format** (always JSON, always similar structure)
- ✅ Clear **URL hierarchy** for relationships
- ✅ **Plural names** for collections, **singular** for specific resources

---

## Key Takeaways

1. **REST = Resources + HTTP Methods + Status Codes**
2. **Resources are nouns** (users, posts, comments)
3. **HTTP methods describe actions** (GET, POST, PUT, DELETE)
4. **Each request is independent** (stateless)
5. **Status codes tell the client what happened**
6. **Consistency makes APIs easy to use**

A well-designed REST API is intuitive - developers can guess how to use it without reading docs!
