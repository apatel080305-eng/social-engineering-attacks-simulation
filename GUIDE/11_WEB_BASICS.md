# Web Basics - Understanding the Internet

## What Is The Web?

The web is a system where computers communicate with each other over the internet. Think of it like a phone network:
- **Phone network:** You call someone, they answer, you talk, you hang up
- **Web:** Your browser (client) asks a server for information, the server responds, your browser displays it

---

## How Does The Web Work? (Simple Version)

### Step 1: You Type a URL
```
https://google.com
```

### Step 2: Browser Sends a Request
Your browser says: **"Hey Google's server, give me your home page"**

### Step 3: Server Processes the Request
Google's server receives the request and thinks: **"Ok, they want my home page, let me get it ready"**

### Step 4: Server Sends a Response
The server sends back: **"Here's your HTML, CSS, images, and JavaScript files"**

### Step 5: Browser Renders the Page
Your browser takes all those files and displays the Google homepage on your screen

---

## Client vs Server

### **Client (Client-Side)**
- The **device/browser** you're using right now
- Sends **requests** to the server
- **Displays** information to you
- Examples: Your laptop, phone, Google Chrome, Firefox

### **Server (Server-Side)**
- The **computer** that stores data and handles requests
- **Receives** requests from clients
- **Processes** those requests
- **Sends back** responses
- Examples: Google's computers, Facebook's computers, your backend

---

## Frontend vs Backend

### **Frontend (What You See)**
- What you see and interact with in your browser
- Written with: HTML, CSS, JavaScript
- Runs **on your computer** (client-side)
- Examples: 
  - Form fields you fill out
  - Buttons you click
  - Pages that load

### **Backend (Behind The Scenes)**
- All the logic and data that make things work
- Receives requests from frontend
- **Processes** data
- **Stores/retrieves** information from databases
- Sends back responses to frontend
- Written with: Node.js, Python, Java, C#, etc.
- Runs **on a server** (server-side)

---

## What Happens When You Interact With A Website

### Example: Creating a Social Media Post

**Step 1: Frontend**
```
User types: "Hello World!"
User clicks: Submit button
```

**Step 2: Frontend Sends Request**
```
POST /posts
{
  "content": "Hello World!"
}
```

**Step 3: Backend Receives & Processes**
```
Backend checks:
✓ Is this user logged in?
✓ Is the content too long?
✓ Does it contain spam?
```

**Step 4: Backend Saves to Database**
```
Database now contains:
user_id: 123
content: "Hello World!"
timestamp: 2024-01-15 10:30:45
```

**Step 5: Backend Sends Response**
```
{
  "success": true,
  "postId": 456,
  "message": "Post created!"
}
```

**Step 6: Frontend Receives & Updates Display**
```
Frontend shows:
✓ Green checkmark
✓ Post appears on user's timeline
✓ Like/Comment buttons appear
```

---

## URLs Explained

A URL breaks down like this:

```
https://www.example.com:8080/users/123/posts?sort=recent&limit=10#comments
```

| Part | Name | Meaning |
|------|------|---------|
| `https://` | Protocol | **How** to connect (https = secure) |
| `www.` | Subdomain | Not always needed |
| `example.com` | Domain | The **address** of the server |
| `:8080` | Port | Which **door** on the server (optional) |
| `/users/123/posts` | Path | **What** you're requesting |
| `?sort=recent&limit=10` | Query String | **Filters/options** |
| `#comments` | Fragment | **Jump to** a section on the page |

---

## The Request-Response Cycle

```
┌─────────────────────────────────────────────────────────┐
│              CLIENT (Your Browser)                      │
│                                                         │
│  User clicks button                                    │
│  Browser creates REQUEST                              │
└────────────────────────┬────────────────────────────────┘
                         │
                    REQUEST SENT
                    (what data?)
                    (which method?)
                         │
                         ▼
┌─────────────────────────────────────────────────────────┐
│              SERVER (Backend)                           │
│                                                         │
│  Receives request                                      │
│  Reads what's needed                                   │
│  Processes the data                                    │
│  Queries database                                      │
│  Creates RESPONSE                                      │
└────────────────────────┬────────────────────────────────┘
                         │
                    RESPONSE SENT
                    (status: 200 OK)
                    (data back)
                         │
                         ▼
┌─────────────────────────────────────────────────────────┐
│              CLIENT (Your Browser)                      │
│                                                         │
│  Receives response                                     │
│  Updates the page                                      │
│  Shows new data to user                                │
└─────────────────────────────────────────────────────────┘
```

---

## Common Ports

When you connect to a server, you need:
1. **Server address** (domain name or IP)
2. **Port number** (which door to use)

| Port | Service | Default? |
|------|---------|----------|
| 80 | HTTP (insecure) | Yes for HTTP |
| 443 | HTTPS (secure) | Yes for HTTPS |
| 3000 | Development (React, Next.js) | Common |
| 5000 | Development (Flask, Express) | Common |
| 3306 | MySQL Database | Database |
| 5432 | PostgreSQL Database | Database |
| 27017 | MongoDB Database | Database |

---

## Key Takeaway

```
Internet = Roads connecting computers
Web = Language those computers use to talk
Browser = Your vehicle on the internet
Server = The destination/library of information
Frontend = What you see and touch
Backend = What makes things work
```

Next, learn: **Request/Response Cycle** to understand what's traveling back and forth!
