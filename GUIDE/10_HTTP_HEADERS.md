# HTTP Headers & Request/Response Structure

## What Are HTTP Headers?

HTTP headers are **metadata** (data about data) that travels with every HTTP request and response. They provide extra information that helps both the client and server understand what's being sent and how to process it.

Think of headers like the envelope of a physical letter:
- The envelope contains addresses, postage, delivery notes
- The letter inside contains the actual message
- Both the envelope AND the letter are needed for successful delivery

---

## Anatomy of an HTTP Request

### Basic Structure
```
[METHOD] [URL] [VERSION]
[Header 1]: [Value]
[Header 2]: [Value]
[Blank Line]
[Request Body - optional]
```

### Real Example: Creating a User
```
POST /api/users HTTP/1.1
Host: api.example.com
Content-Type: application/json
Content-Length: 58
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...

{
  "name": "John Doe",
  "email": "john@example.com"
}
```

**Breaking it down:**
- **Line 1:** `POST /api/users HTTP/1.1` - The request line
  - `POST` = HTTP method
  - `/api/users` = URL path
  - `HTTP/1.1` = Protocol version
  
- **Lines 2-5:** Headers (metadata)
  - `Host:` - Which server to send to
  - `Content-Type:` - The format of the body
  - `Content-Length:` - Size of body in bytes
  - `Authorization:` - Authentication credentials
  
- **Line 6:** Blank line (separates headers from body)
  
- **Lines 7-10:** Request body (the actual data)

---

## Anatomy of an HTTP Response

### Basic Structure
```
[VERSION] [STATUS CODE] [STATUS TEXT]
[Header 1]: [Value]
[Header 2]: [Value]
[Blank Line]
[Response Body - optional]
```

### Real Example: Server Responds
```
HTTP/1.1 201 Created
Content-Type: application/json
Content-Length: 156
Server: Apache/2.4.41
Set-Cookie: session=abc123; Path=/

{
  "id": 456,
  "name": "John Doe",
  "email": "john@example.com",
  "createdAt": "2026-06-18T10:30:00Z"
}
```

**Breaking it down:**
- **Line 1:** `HTTP/1.1 201 Created` - The status line
  - `HTTP/1.1` = Protocol version
  - `201` = Status code
  - `Created` = Status text (human-readable)
  
- **Lines 2-5:** Response headers (metadata)
  - `Content-Type:` - Format of response body
  - `Content-Length:` - Size of response in bytes
  - `Server:` - What server software is running
  - `Set-Cookie:` - Instructions to store a cookie
  
- **Line 6:** Blank line
  
- **Lines 7-12:** Response body (the actual data)

---

## Common Request Headers

### **Host** (Required)
Tells the server which domain is being requested.

```
Host: api.example.com
```

### **Content-Type** (For POST/PUT/PATCH)
Tells the server what format the request body is in.

```
Content-Type: application/json

or

Content-Type: application/x-www-form-urlencoded

or

Content-Type: text/plain
```

### **Content-Length**
Specifies the size of the request body in bytes. Servers use this to know when they've received everything.

```
Content-Length: 284
```

### **Authorization**
Provides credentials for authentication (like a password).

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

or

Authorization: Basic dXNlcm5hbWU6cGFzc3dvcmQ=
```

### **Accept**
Tells the server what response format the client prefers.

```
Accept: application/json

or

Accept: application/xml
```

### **User-Agent**
Identifies what software is making the request.

```
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36
```

### **Cookie**
Sends saved cookies back to the server.

```
Cookie: session=abc123; preferences=dark_mode; user_id=456
```

### **Referer** (Note the misspelling!)
Tells the server which page linked to this request (for analytics).

```
Referer: https://example.com/blog/post-123
```

---

## Common Response Headers

### **Content-Type** (Required)
Tells the client what format the response body is in.

```
Content-Type: application/json

or

Content-Type: text/html; charset=utf-8
```

### **Content-Length**
Specifies the size of the response body in bytes.

```
Content-Length: 1024
```

### **Set-Cookie**
Instructs the client to save a cookie (like a session token).

```
Set-Cookie: session=xyz789; Path=/; HttpOnly; Secure; Max-Age=86400
```

Breaking this down:
- `session=xyz789` - Cookie name and value
- `Path=/` - Available to all URLs on this domain
- `HttpOnly` - Cannot be accessed by JavaScript (security)
- `Secure` - Only sent over HTTPS (security)
- `Max-Age=86400` - Cookie expires after 86400 seconds (1 day)

### **Server**
Identifies the web server software.

```
Server: Apache/2.4.41
```

### **Cache-Control**
Tells the client how long to cache this response.

```
Cache-Control: max-age=3600              # Cache for 1 hour
Cache-Control: no-cache                  # Don't cache
Cache-Control: public, max-age=86400     # Cache for 1 day, shareable
```

### **Location**
Used in redirect responses (3xx) to tell where to go next.

```
HTTP/1.1 301 Moved Permanently
Location: https://newapi.example.com/users
```

### **Access-Control-Allow-Origin** (CORS)
Tells the browser which domains are allowed to access this API.

```
Access-Control-Allow-Origin: https://frontend.example.com

or

Access-Control-Allow-Origin: *         # Allow all domains (risky!)
```

### **ETag** (Entity Tag)
A unique identifier for the current version of a resource. Used for caching.

```
ETag: "abc123def456"
```

The client can later send:
```
If-None-Match: "abc123def456"
```

And if unchanged, the server responds with `304 Not Modified`.

---

## Content-Type: What Format Is This?

**Content-Type** is one of the most important headers. It tells what format the data is in:

### **application/json** (Most Common)
Data is JSON (JavaScript Object Notation).

```
Content-Type: application/json

{
  "name": "John",
  "age": 30
}
```

### **application/x-www-form-urlencoded** (Form Data)
Data is URL-encoded key-value pairs.

```
Content-Type: application/x-www-form-urlencoded

name=John&age=30&email=john@example.com
```

### **multipart/form-data** (File Uploads)
Data includes files and/or form fields.

```
Content-Type: multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW

------WebKitFormBoundary7MA4YWxkTrZu0gW
Content-Disposition: form-data; name="file"; filename="photo.jpg"
Content-Type: image/jpeg

[Binary image data here]
```

### **text/plain** (Plain Text)
Data is simple text.

```
Content-Type: text/plain

Hello, this is just text!
```

### **text/html** (Web Page)
Data is HTML markup.

```
Content-Type: text/html

<html>
  <body>Hello World!</body>
</html>
```

---

## Real Example: Login Flow

### Step 1: Client Sends Login Request
```
POST /api/auth/login HTTP/1.1
Host: api.example.com
Content-Type: application/json
Content-Length: 58

{
  "email": "john@example.com",
  "password": "secret123"
}
```

### Step 2: Server Responds with Session Cookie
```
HTTP/1.1 200 OK
Content-Type: application/json
Set-Cookie: session=xyz789; HttpOnly; Secure; Max-Age=86400
Content-Length: 85

{
  "id": 123,
  "name": "John Doe",
  "email": "john@example.com",
  "role": "user"
}
```

The `Set-Cookie` header tells the browser to save `session=xyz789`.

### Step 3: Client Makes Next Request (Browser Automatically Includes Cookie)
```
GET /api/user/profile HTTP/1.1
Host: api.example.com
Cookie: session=xyz789

(no body for GET request)
```

The browser automatically includes the `Cookie` header!

### Step 4: Server Recognizes User from Cookie
```
HTTP/1.1 200 OK
Content-Type: application/json

{
  "id": 123,
  "name": "John Doe",
  "email": "john@example.com",
  "lastLogin": "2026-06-18T10:30:00Z"
}
```

Server knows who this is from the session cookie!

---

## Debugging Headers

### In Browser DevTools

1. Open DevTools (F12)
2. Go to **Network** tab
3. Click on any request
4. Look for **Headers** section - shows both request and response headers

### In Code (JavaScript)
```javascript
// Request headers
fetch('/api/users', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer token123'
  },
  body: JSON.stringify({ name: 'John' })
});

// Response headers
fetch('/api/users')
  .then(response => {
    console.log('Content-Type:', response.headers.get('Content-Type'));
    console.log('All headers:', response.headers);
  });
```

---

## Key Takeaways

1. **Headers are metadata** - Extra information about the request/response
2. **Content-Type is critical** - Tells what format the body is in
3. **Authorization header is security** - Contains login credentials
4. **Set-Cookie is how sessions work** - Server tells client to save data
5. **Headers are separate from body** - Headers describe, body contains actual data
6. **CORS headers control access** - Important for cross-domain APIs

Headers might seem boring, but they're essential for making HTTP work correctly!
