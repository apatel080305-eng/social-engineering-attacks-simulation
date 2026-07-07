# Key Concepts to Know for Your Viva

This guide covers the "why" behind technical choices so you can answer examiner questions confidently.

---

## JWT - JSON Web Token

A JWT is a string in three parts separated by dots: `header.payload.signature`.

- **Header** - algorithm used (HS256 = HMAC-SHA256)
- **Payload** - the data you embed; in this project just `{ id: "<mongodb_user_id>", iat: <timestamp>, exp: <timestamp> }`
- **Signature** - `HMAC-SHA256(base64(header) + "." + base64(payload), JWT_SECRET_KEY)`

The server generates the token at login. On every subsequent request, the client sends the token back. The server **verifies** it by re-computing the signature and checking it matches - if someone tampered with the payload, the signature won't match.

**Why not sessions?** Sessions require the server to store state (a session table/cache) and check it on every request. JWTs are stateless - the server just verifies the signature, no database lookup needed for authentication itself. (We do one user lookup after verification to get fresh user data, but that's a design choice, not a JWT requirement.)

**Why 30-day expiry?** Short enough that a leaked token eventually becomes useless; long enough that users don't get logged out constantly.

---

## bcrypt - Password Hashing

`bcrypt.hash(password, 12)` does not encrypt - it **hashes**. A hash is one-way: you cannot reverse it to get the original password.

The `12` is the cost factor (salt rounds). bcrypt internally iterates the hash function `2^12 = 4096` times. This makes it slow on purpose - a GPU brute-forcing millions of attempts per second still takes years on bcrypt hashes. Increasing the cost factor makes it slower for attackers (and slightly slower for your login endpoint).

On login: `bcrypt.compare(candidate, hash)` runs the same slow hash on the candidate and compares - no reversal needed.

**Why not SHA-256 for passwords?** SHA-256 is extremely fast - billions of operations per second on a GPU. bcrypt's deliberate slowness is the security property.

---

## TOTP - Time-Based One-Time Password (2FA)

TOTP (RFC 6238) works as follows:

1. Server and user's authenticator app share a **secret** (base32 string)
2. Every 30 seconds, both compute: `HMAC-SHA1(secret, floor(unix_time / 30))`
3. The last 6 digits of the result become the one-time code
4. Both sides get the same number - the server verifies it matches

`speakeasy.totp.verify()` does this computation. The code is valid for one 30-second window (some implementations allow a one-window grace period for clock drift).

**Why is the QR code safe to scan?** The QR code encodes an `otpauth://` URL containing the secret. Scanning it just copies the secret into the authenticator app. The secret never leaves the user's device after that point.

---

## RAG - Retrieval-Augmented Generation

The LLM (Gemma 7B) was trained on general internet text. It knows *about* social engineering but not about our specific knowledge base. RAG solves this by:

1. Pre-indexing your knowledge into a vector database (Pinecone)
2. At query time, retrieving the most relevant chunks
3. Injecting them into the LLM prompt

This is like giving the LLM a "cheat sheet" relevant to the current question. The generated output is grounded in your specific knowledge rather than generic hallucinations.

**Vector search vs keyword search:** A keyword search for "urgent IT request" won't find a document that says "creating artificial time pressure". A vector search finds semantically similar content regardless of exact wording, because the embedding model places semantically similar texts near each other in vector space.

---

## Embeddings and Vector Space

An embedding model (here: BAAI/bge-large-en-v1.5) converts text into a list of 1024 floating-point numbers. Think of it as a coordinate in 1024-dimensional space. The model is trained so that texts with similar meaning end up at nearby coordinates.

`cosine similarity` measures the angle between two vectors - 1.0 means identical direction (very similar), 0 means perpendicular (unrelated), -1 means opposite.

Pinecone's ANN (Approximate Nearest Neighbour) search returns the stored vectors most similar to your query vector. "Approximate" means it uses indexing tricks (like HNSW graphs) to avoid comparing against every single stored vector - much faster, with minimal accuracy loss.

---

## Cross-Encoder Reranking

The bi-encoder (embedding model) encodes query and document separately and compares vectors. This is fast but less accurate because the model never sees the query and document together.

A cross-encoder takes both as input simultaneously and produces a single relevance score. It is much more accurate because it can model the relationship between query and document - but it is too slow to run on every document in the database.

The **two-stage pipeline** is the standard solution: fast bi-encoder shortlist → accurate cross-encoder rerank. This project uses `ms-marco-MiniLM-L-6-v2` for reranking, a model specifically trained on passage-retrieval tasks.

---

## Server-Sent Events (SSE)

SSE is a one-directional streaming protocol over HTTP. The server keeps the connection open and sends chunks of text in the format:

```
data: {"type":"token","token":"Hello"}\n\n
```

The browser's `EventSource` API or `fetch` with streaming body can consume these. SSE is used here for the typewriter effect - the browser renders each token as Ollama produces it.

**Why not WebSockets?** WebSockets are bidirectional and require a protocol upgrade handshake. SSE is simpler, uses standard HTTP, and is sufficient when you only need server-to-client streaming (client messages are sent as separate POST requests).

---

## Mongoose and MongoDB

MongoDB is a **document database** - data is stored as JSON-like documents (BSON), not rows and columns. Each document in a collection can have different fields.

Mongoose is an ODM (Object Document Mapper) - it puts a schema on top of MongoDB. You define a schema with field types, validators, and defaults, and Mongoose enforces it when you save documents.

Key Mongoose features used in this project:

- **Schema.pre("save")** - middleware that runs before a document is saved. Used for password hashing.
- **Instance methods** - functions added to the document prototype (like `comparePassword`, `createVerificationToken`)
- **Aggregation pipeline** - `Question.aggregate([{ $match: ... }, { $sample: { size: 10 } }])` - `$sample` randomly picks N documents, which is how quiz questions are randomised
- **upsert** - `findOneAndUpdate(..., { upsert: true })` creates a new document if none matches the filter, otherwise updates the existing one. Used in `ModuleProgress` so you don't need separate insert/update logic
- **populate** / **ref** - `userId: { type: ObjectId, ref: "User" }` creates a foreign-key-style reference. Mongoose can automatically replace the ID with the full user document on query

---

## Express Middleware Chain

When a request comes in, Express passes it through each `app.use(...)` in order. Each middleware either:
- Calls `next()` to pass to the next middleware/route
- Calls `next(err)` to skip to the error handler
- Sends a response (which ends the chain)

For a protected simulation route, the chain is:

```
express.json → cookieParser → helmet → cors → protect → authorize("user") → simulationController
```

If `protect` finds no token, it sends a 401 and the chain stops - `simulationController` is never called.

---

## Rate Limiting

`express-rate-limit` tracks requests per IP address in an in-memory store. When an IP exceeds `max` requests within `windowMs` milliseconds, subsequent requests get a 429 response.

Applied to `/api/v1/auth` only (login, register, etc.) because these are the endpoints most at risk from brute-force. The general API limiter is commented out in development to avoid interfering with rapid testing.

**Standard headers:** The `standardHeaders: true` option tells the middleware to send `RateLimit-Limit`, `RateLimit-Remaining`, and `RateLimit-Reset` headers so clients know their limit status.

---

## HttpOnly Cookies vs localStorage

Many tutorials store JWTs in `localStorage`. This is vulnerable to XSS: if an attacker injects any JavaScript into the page, they can read `localStorage` and steal the token.

An HttpOnly cookie cannot be read by JavaScript at all - only the browser's HTTP layer reads it and attaches it to requests automatically. If an attacker injects JS, they cannot access the token.

The tradeoff: you need `sameSite: Lax` or `sameSite: Strict` to prevent CSRF (cross-site request forgery), where a malicious site tricks the user's browser into making authenticated requests. `Lax` allows the cookie on top-level navigations but blocks it on cross-site `fetch`/`axios` calls.

---

## Docker

Each service has a `Dockerfile` that packages the service into a portable container. The multi-stage build pattern is used:

1. A "builder" stage installs dependencies (large, not needed at runtime)
2. A "runner" stage copies only the built output

This produces smaller final images. The `.dockerignore` files prevent `node_modules`, `.env`, and build artifacts from being copied into the image context unnecessarily.
