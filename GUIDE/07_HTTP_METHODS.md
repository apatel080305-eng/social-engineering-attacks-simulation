# HTTP Methods - Complete Guide

## What Are HTTP Methods?

HTTP (HyperText Transfer Protocol) is the language of the web. When your browser talks to a server, it uses **HTTP methods** to describe what action it wants to perform. Think of them like verbs for actions - just like you might say "Get me a coffee" or "Delete this file", HTTP methods tell the server what to do.

---

## The Main HTTP Methods

### 1. **GET** - Retrieve Data (Read-Only)
**Use case:** Get data from the server without modifying anything.

- **Safe:** Yes - doesn't change anything on the server
- **Idempotent:** Yes - calling it multiple times gives the same result
- **Has Body:** No - you don't send data in the request body
- **Real-world analogy:** Reading a page in a book

**Example:**
```
GET /users/123
```
This retrieves user with ID 123 from the server.

**What you get back:**
```json
{
  "id": 123,
  "name": "John Doe",
  "email": "john@example.com"
}
```

---

### 2. **POST** - Create New Data
**Use case:** Send data to the server to create something new.

- **Safe:** No - it creates new data
- **Idempotent:** No - calling it multiple times creates multiple things
- **Has Body:** Yes - you send data in the request body
- **Real-world analogy:** Filling out a form and submitting it

**Example:**
```
POST /users
Content-Type: application/json

{
  "name": "Jane Smith",
  "email": "jane@example.com",
  "password": "securepassword123"
}
```

**What you get back:**
```json
{
  "id": 456,
  "name": "Jane Smith",
  "email": "jane@example.com",
  "createdAt": "2026-06-18T10:30:00Z"
}
```

---

### 3. **PUT** - Replace Complete Data
**Use case:** Replace an entire resource with new data.

- **Safe:** No - it modifies data
- **Idempotent:** Yes - calling it multiple times with same data gives same result
- **Has Body:** Yes - you send the complete updated data
- **Real-world analogy:** Rewriting an entire page in a document

**Example:**
```
PUT /users/123
Content-Type: application/json

{
  "name": "John Updated",
  "email": "john.new@example.com",
  "role": "admin"
}
```

**Important:** With PUT, you typically send the *entire* object, not just the changed parts.

---

### 4. **PATCH** - Partial Update
**Use case:** Update only specific fields of a resource (not the whole thing).

- **Safe:** No - it modifies data
- **Idempotent:** Yes - calling it multiple times with same data gives same result
- **Has Body:** Yes - you send only the fields you want to change
- **Real-world analogy:** Using a correction pen to fix typos in a document

**Example:**
```
PATCH /users/123
Content-Type: application/json

{
  "email": "john.new@example.com"
}
```

Only the email changes; the name stays the same.

---

### 5. **DELETE** - Remove Data
**Use case:** Delete a resource from the server.

- **Safe:** No - it removes data
- **Idempotent:** Yes - deleting something that doesn't exist still gives the same "not found" result
- **Has Body:** Usually no
- **Real-world analogy:** Shredding a document

**Example:**
```
DELETE /users/123
```

After this, user 123 is removed from the database.

---

## Quick Reference Table

| Method | Purpose | Modifies Data? | Multiple Calls Safe? | Has Body? |
|--------|---------|---|---|---|
| **GET** | Retrieve | ❌ No | ✅ Yes | ❌ No |
| **POST** | Create | ✅ Yes | ❌ No | ✅ Yes |
| **PUT** | Replace All | ✅ Yes | ✅ Yes | ✅ Yes |
| **PATCH** | Update Some | ✅ Yes | ✅ Yes | ✅ Yes |
| **DELETE** | Remove | ✅ Yes | ✅ Yes | ❌ No |

---

## The Difference: PUT vs PATCH (Common Confusion)

### PUT - Send Everything
```
Current user:
{ "id": 1, "name": "John", "email": "john@example.com", "role": "user" }

PUT /users/1
{
  "name": "Jane",
  "email": "jane@example.com",
  "role": "admin"
}

Result: ENTIRE user object replaced
```

### PATCH - Send Only Changes
```
Current user:
{ "id": 1, "name": "John", "email": "john@example.com", "role": "user" }

PATCH /users/1
{
  "email": "jane@example.com"
}

Result: Only email changes, name and role stay the same
```

---

## Less Common Methods

### **HEAD** - Like GET but no response body
```
HEAD /users/123
```
Returns headers only, no actual data. Useful for checking if something exists without downloading the full response.

### **OPTIONS** - Describe communication options
```
OPTIONS /users
```
Returns what HTTP methods are allowed for this resource. Rarely used directly but important for browser security (CORS).

---

## Real Example: Building a Blog API

Imagine you're building a blog platform. Here's how you'd use HTTP methods:

**Get all blog posts:**
```
GET /api/posts
```

**Get a specific post:**
```
GET /api/posts/42
```

**Create a new post:**
```
POST /api/posts
{
  "title": "My First Post",
  "content": "Hello world!",
  "author": "John"
}
```

**Update the entire post:**
```
PUT /api/posts/42
{
  "title": "Updated Title",
  "content": "Updated content",
  "author": "John"
}
```

**Update just the title:**
```
PATCH /api/posts/42
{
  "title": "New Title Only"
}
```

**Delete the post:**
```
DELETE /api/posts/42
```

---

## Key Takeaways

1. **GET** = Read (safe, doesn't change anything)
2. **POST** = Create new (sends data in body)
3. **PUT** = Replace entire object (send full replacement)
4. **PATCH** = Update specific fields (send only changes)
5. **DELETE** = Remove (permanent deletion)

**Remember:** These are just conventions. The server *technically* could use GET to delete data, but that would be breaking standard practices and confusing everyone. Always follow HTTP standards!
