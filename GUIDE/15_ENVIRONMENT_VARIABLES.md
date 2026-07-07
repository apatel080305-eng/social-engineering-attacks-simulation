# Environment Variables - Storing Secrets Safely

## What Are Environment Variables?

**Environment variables** are configuration values stored **outside** your code. They change based on your environment (development, production, etc.).

### Real-World Analogy

```
Your Code = Recipe
Environment Variables = Ingredients that change based on location

In your house:
  - Use honey from your local beekeeper
  - Use salt from your cabinet

At a restaurant:
  - Use honey from their supplier
  - Use salt from their pantry

Same recipe, different ingredients!
```

---

## Why Use Environment Variables?

### ❌ WITHOUT Environment Variables (Bad):

```javascript
// database.js - NEVER DO THIS!
const DB_HOST = 'production-database.com';
const DB_USER = 'admin';
const DB_PASSWORD = 'super_secret_password_123';  // ← Exposed!
const DB_PORT = 5432;

const connection = new Database({
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASSWORD,
  port: DB_PORT
});
```

**Problems:**
- Password visible in code ❌
- Everyone can see the real database URL ❌
- Can't change for different environments ❌
- Accidentally committed to Git 💥

### ✅ WITH Environment Variables (Good):

```javascript
// database.js - Use environment variables
const connection = new Database({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT
});
```

```bash
# .env file (NEVER commit this!)
DB_HOST=production-database.com
DB_USER=admin
DB_PASSWORD=super_secret_password_123
DB_PORT=5432
```

**Benefits:**
- Secrets not in code ✅
- Can use different values per environment ✅
- Easy to change without editing code ✅
- Safe to commit code to Git ✅

---

## Setting Environment Variables

### Method 1: .env File (Development)

Create a `.env` file in your project root:

```
# .env
DB_HOST=localhost
DB_USER=dev_user
DB_PASSWORD=dev_password
DB_PORT=5432

API_URL=http://localhost:3000
API_KEY=test_key_12345

NODE_ENV=development
```

### Method 2: Command Line (Temporary)

```bash
# Linux / Mac
export DB_HOST=localhost
export DB_PASSWORD=my_password

# Windows PowerShell
$env:DB_HOST = "localhost"
$env:DB_PASSWORD = "my_password"

# Windows CMD
set DB_HOST=localhost
set DB_PASSWORD=my_password
```

### Method 3: System Environment Variables (Permanent)

**Windows:**
1. Search "Environment Variables"
2. Click "Edit the system environment variables"
3. Click "Environment Variables"
4. Add new variable

**Mac/Linux:**
Edit `~/.bash_profile` or `~/.zshrc`:
```bash
export DB_HOST=localhost
export DB_PASSWORD=my_password
```

Then run:
```bash
source ~/.bash_profile
```

### Method 4: Docker (Containerized Apps)

```dockerfile
# Dockerfile
FROM node:18

ENV NODE_ENV=production
ENV DB_HOST=database.example.com
ENV API_KEY=your_api_key

WORKDIR /app
COPY . .
RUN npm install
CMD ["node", "server.js"]
```

### Method 5: Cloud Platforms (Deployment)

**AWS:**
- Systems Manager → Parameter Store
- Secrets Manager

**Heroku:**
```bash
heroku config:set DB_HOST=prod-database.com
heroku config:set DB_PASSWORD=secure_password
```

**Vercel (Next.js):**
- Project Settings → Environment Variables
- Add variables for production, preview, development

---

## Using Environment Variables in Code

### Node.js / Express

```javascript
// Access via process.env
const apiKey = process.env.API_KEY;
const dbHost = process.env.DB_HOST;
const nodeEnv = process.env.NODE_ENV;

console.log(`Connected to ${dbHost}`);
console.log(`Running in ${nodeEnv} mode`);
```

### Python

```python
import os

# Access via os.environ
api_key = os.environ.get('API_KEY')
db_host = os.environ.get('DB_HOST')

# With default value
node_env = os.environ.get('NODE_ENV', 'development')

print(f"Connected to {db_host}")
```

### Browser/React (Limited - NEVER put secrets here!)

```javascript
// Only use PUBLIC variables
const apiUrl = process.env.REACT_APP_API_URL;

// This is visible to everyone in browser:
// ✅ Frontend URL (okay to expose)
// ❌ API keys (NEVER expose)
// ❌ Passwords (NEVER expose)
```

### .env File Example with dotenv package

```bash
# Install package
npm install dotenv
```

```javascript
// At the top of your app
require('dotenv').config();

// Now use process.env
const apiKey = process.env.API_KEY;
```

---

## Common Environment Variables

```bash
# Database
DB_HOST=localhost
DB_USER=postgres
DB_PASSWORD=mypassword
DB_PORT=5432
DB_NAME=myapp

# API
API_URL=https://api.example.com
API_KEY=your_api_key_here
API_VERSION=v1

# Server
PORT=3000
HOST=localhost
NODE_ENV=development

# Logging
LOG_LEVEL=debug
LOG_FILE=/var/log/app.log

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=noreply@example.com
SMTP_PASSWORD=app_password

# Third-party services
STRIPE_KEY=sk_test_...
TWILIO_ACCOUNT_SID=AC...
TWILIO_AUTH_TOKEN=...

# Security
JWT_SECRET=your_jwt_secret
ENCRYPTION_KEY=your_encryption_key
```

---

## .gitignore - Protect Your Secrets

**Create `.gitignore` in your project root:**

```
# Never commit these files!
.env
.env.local
.env.production
.env*.local

# Also ignore
node_modules/
*.log
.DS_Store
.vscode/
dist/
build/
```

**Verify it works:**

```bash
# This should show NO .env files
git status
```

---

## Development vs Production Environment Variables

### Development (.env)

```
DB_HOST=localhost
DB_PASSWORD=dev_pass_123
API_URL=http://localhost:3000
NODE_ENV=development
LOG_LEVEL=debug
```

**Characteristics:**
- Uses local database
- Less secure (just for development)
- Verbose logging
- Localhost URLs

### Production (.env.production)

```
DB_HOST=prod-db-cluster.example.com
DB_PASSWORD=ypJk9$mL2@vQwXzN    # Highly secure
API_URL=https://api.example.com
NODE_ENV=production
LOG_LEVEL=error
```

**Characteristics:**
- Uses real database
- Maximum security
- Minimal logging
- Real domain URLs

### Accessing Different Environments

```javascript
if (process.env.NODE_ENV === 'production') {
  // Use production settings
  console.log('Running in production');
} else {
  // Use development settings
  console.log('Running in development');
}
```

---

## Real-World Example: Email Service

### With Environment Variables

```javascript
// mailer.js
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SMTP_USER,      // From .env
    pass: process.env.SMTP_PASSWORD   // From .env
  }
});

module.exports = transporter;
```

```bash
# .env (development)
SMTP_USER=dev@gmail.com
SMTP_PASSWORD=dev_app_password

# .env.production (on server)
SMTP_USER=noreply@example.com
SMTP_PASSWORD=real_secure_password
```

### Usage

```javascript
// The code doesn't change!
// It just uses different values based on environment

const mailer = require('./mailer');

mailer.sendMail({
  to: 'user@example.com',
  subject: 'Welcome!',
  body: 'Hello!'
});

// Dev: Uses dev@gmail.com
// Prod: Uses noreply@example.com
```

---

## Secrets Management Best Practices

### ✅ DO:
- Store secrets in `.env` file locally
- Use `.gitignore` to prevent commits
- Rotate secrets regularly
- Use strong passwords
- Keep different secrets for dev/prod
- Version secrets separately from code
- Audit who has access to production secrets

### ❌ DON'T:
- Commit `.env` to Git
- Hardcode secrets in code
- Share secrets via email/Slack
- Use same secret for dev and prod
- Log sensitive values
- Store secrets in version control
- Use weak passwords

---

## Checking Your Application

```bash
# Make sure .env is in .gitignore
cat .gitignore
# Should contain: .env

# Verify no .env files are tracked
git status
# Should NOT show .env files

# Check for hardcoded secrets
grep -r "password" src/  # Don't hardcode!
grep -r "api_key" src/   # Don't hardcode!
```

---

## Summary

```
Environment Variables = Configuration outside code
Use for: Secrets, URLs, API keys, database credentials
Store in: .env file (development) or platform (production)
Access via: process.env.VARIABLE_NAME
Remember: NEVER commit .env to Git!
```

Next: Learn **Error Handling & Debugging** - What to do when things break!
