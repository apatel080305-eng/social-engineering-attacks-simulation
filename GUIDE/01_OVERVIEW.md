# INTERCEPTOR - Project Overview

## What Is This Project?

INTERCEPTOR is a cybersecurity awareness training platform focused on **social engineering attacks**. Its goal is to teach everyday users to recognise and resist manipulation tactics used by real attackers - phishing emails, vishing (voice phishing), business email compromise (BEC), MFA fatigue attacks, and pretexting.

Instead of showing users a slideshow, INTERCEPTOR puts them *inside* a simulated attack. An AI plays the role of an attacker and sends realistic messages. The user responds, and the system scores how well they resisted. After the session they get a detailed debrief explaining which psychological tricks were used against them and how to counter them in real life.

---

## Services and Ports

The project is split into four independently running services:

| Service | Technology | Default Port | Purpose |
|---|---|---|---|
| **Frontend** | Next.js 14 (React) | 3000 | User-facing web app |
| **Admin Panel** | Next.js 14 (React) | 3001 | Admin dashboard |
| **Express Backend** | Node.js / Express | 5000 | REST API, auth, database logic |
| **AI Service** | Python / FastAPI | 8000 | Simulation engine, LLM, RAG |

There is also a fifth dependency that must be running locally:

- **Ollama** - a local LLM server (default port 11434). It serves the `gemma:7b` model which the AI service calls for generating attacker messages and evaluating user responses.

---

## High-Level Architecture

```
Browser (User)
    │
    ▼
Next.js Frontend (port 3000)
    │   REST calls (fetch / axios)
    ▼
Express Backend (port 5000)
    │   ├── MongoDB (Mongoose ODM) - stores users, sessions, results
    │   └── Axios HTTP calls
    ▼
FastAPI AI Service (port 8000)
    │   ├── Pinecone (vector database) - stores knowledge embeddings
    │   ├── BAAI/bge-large-en-v1.5 (sentence-transformer) - embeds queries
    │   ├── cross-encoder/ms-marco-MiniLM-L-6-v2 - reranks retrieved docs
    │   └── Ollama / gemma:7b - generates attacker text, evaluates responses
    ▼
Ollama (local, port 11434)
```

The Express backend is the *only* service the frontend talks to. It then talks to the AI service when a simulation is running. The frontend never calls the AI service directly.

---

## The Five Attack Scenarios

| Scenario ID | Full Name | What the attacker pretends to be |
|---|---|---|
| `phishing_email` | Phishing Email | Legitimate email sender (IT, bank, HR) |
| `vishing` | Voice Phishing | Caller from bank / tech support |
| `bec` | Business Email Compromise | CEO or manager requesting urgent action |
| `mfa_fatigue` | MFA Fatigue Attack | IT department pushing repeated auth requests |
| `pretexting` | Pretexting | Someone with a fabricated but believable story |

Each scenario has three difficulty levels: **easy**, **medium**, **hard**. The attacker persona and tactics escalate accordingly.

---

## Learning Modules

Separate from simulations, INTERCEPTOR has a structured learning section with training modules. Each module covers a topic (phishing, vishing, passwords, ransomware, safe browsing), contains reading sections, and ends with a short quiz. Progress and quiz scores are tracked per user in MongoDB.

---

## Phishing Labs

Users can also view realistic fake phishing emails and fake login pages and try to identify the red flags. These are static templates stored in the database (seeded from JSON files) and rendered in the frontend with intentional mistakes for the user to spot.

---

## Admin Panel

The admin panel is a completely separate Next.js app running on port 3001. It connects to the same Express backend API. Admins can:

- View all registered users and manage accounts
- Create, edit, or deactivate simulation scenarios
- See platform analytics (registrations, simulation completions, scores)
- Manage phishing templates and training modules
- Read contact form submissions and newsletter signups
- Send notifications to users

Role-based access control is enforced at the API level - routes protected by `authorize("admin")` middleware will reject any JWT that does not belong to a user with the `admin` role.

---

## Key Technologies Used

**Backend (Node.js)**
- `express` - HTTP routing framework
- `mongoose` - MongoDB ODM (Object Document Mapper)
- `jsonwebtoken` - JWT creation and verification
- `bcryptjs` - password hashing (cost factor 12)
- `speakeasy` - TOTP-based two-factor authentication
- `qrcode` - generates QR codes for 2FA setup
- `nodemailer` - sends transactional emails (verification, password reset)
- `helmet` - sets security-related HTTP headers
- `express-rate-limit` - rate limits the auth endpoints
- `cookie-parser` - reads HttpOnly cookie tokens
- `axios` - makes HTTP requests from Express to the AI service
- `cloudinary` - cloud image storage (avatars)

**AI Service (Python)**
- `fastapi` + `uvicorn` - async HTTP server
- `httpx` - async HTTP client for Ollama calls
- `pinecone` - vector database SDK
- `sentence-transformers` - loads BAAI/bge-large embedding model
- `pydantic` - request/response schema validation (FastAPI models)
- `python-dotenv` - loads `.env` config

**Database**
- `MongoDB` - document store for all persistent data
- `Pinecone` - vector store for AI knowledge chunks (separate from Mongo)

**Frontend**
- `Next.js 14` (App Router)
- `React` with client-side state
- `Tailwind CSS`
