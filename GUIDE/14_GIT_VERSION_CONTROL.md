# Git & Version Control - Managing Code Changes

## What Is Version Control?

**Version Control** is like a **time machine for your code**. It lets you:

- Track every change you make to files
- See who made what changes and when
- Go back to previous versions if something breaks
- Work with other developers without overwriting each other's work
- Understand why a change was made (through commit messages)

---

## Real-World Analogy

### Without Version Control:
```
main.js
main_v2.js
main_v3.js
main_FINAL.js
main_FINAL_REAL.js
main_FINAL_ACTUAL.js
main_FINAL_ACTUAL_v2.js
```

**Problem:** Which version is the real one? Who changed what? When did it break?

### With Version Control (Git):
```
commit history:
- 2024-01-15 10:30 - John: Added user login
- 2024-01-15 10:15 - Jane: Fixed database bug
- 2024-01-15 09:45 - Bob: Added authentication
- 2024-01-15 09:00 - John: Initial setup
```

**Benefit:** Clear history. Can rollback if needed. Know exactly what changed.

---

## Git Basics

### What Is Git?

Git is the most popular **version control system**. It's a tool that tracks changes to your code.

### Key Concepts

#### 1. Repository (Repo)

A repository is a **folder** that Git tracks. It contains:
- Your project files
- A hidden `.git` folder (where Git stores history)

```
my-project/
  .git/           ← Git stores history here
  src/
  index.js
  package.json
```

#### 2. Commit

A **commit** is a "snapshot" of your code at a specific moment.

Think of it like saving a game:
```
Save Point 1: "Added login feature"
Save Point 2: "Fixed bug in registration"
Save Point 3: "Added email verification"
```

Each commit has:
- A unique ID (hash)
- Author name
- Commit message (what changed)
- Timestamp
- All the code at that moment

#### 3. Branch

A **branch** is an independent line of development.

Think of it like alternate timelines:
```
main branch:    Production code (live on website)
                ├─ User login feature
                ├─ Payment system
                └─ Reports

feature branch: New feature being developed
                ├─ Email notifications (being built)

bugfix branch:  Someone fixing a bug
                ├─ Fix user profile bug
```

#### 4. Staging Area

The **staging area** is where you select which files to save:

```
Your Files          Staging Area        Repository
(Working)           (Selected)          (Committed)

file1.js     ──→    file1.js       ──→  ✅ Saved
file2.js     ──→    file2.js
file3.js                                (file3 not saved yet)
```

---

## The Basic Git Workflow

### Step 1: Make Changes

Edit your code files:
```
index.js - changed
server.js - changed
```

### Step 2: Check Status

```bash
git status
```

Output:
```
On branch main

Modified files:
  index.js
  server.js

Untracked files:
  newfile.js
```

### Step 3: Stage Changes (Add)

Select which files to save:

```bash
# Add specific file
git add index.js

# Add all changed files
git add .

# Check what's staged
git status
```

### Step 4: Commit

Create a snapshot with a message:

```bash
git commit -m "Fixed user authentication bug"
```

Output:
```
[main 5a3f2e1] Fixed user authentication bug
 2 files changed, 15 insertions(+), 5 deletions(-)
```

### Step 5: View History

```bash
git log
```

Output:
```
commit 5a3f2e1... (HEAD -> main)
Author: John Doe <john@example.com>
Date:   Mon Jan 15 10:30:00 2024 +0000

    Fixed user authentication bug

commit 7b8f4a2...
Author: Jane Smith <jane@example.com>
Date:   Mon Jan 15 09:45:00 2024 +0000

    Added email verification

commit 9c1d6e3...
Author: Bob Johnson <bob@example.com>
Date:   Mon Jan 15 08:00:00 2024 +0000

    Initial project setup
```

---

## Branches Explained

### Why Branches?

Imagine you're working on a new feature but the main code needs to stay stable:

```
BEFORE (no branches):
main: [v1.0] → [v1.0+feature] → [v1.0+feature+bug]
                                     ↑ Oops, broke it!

AFTER (with branches):
main:     [v1.0] ──────────────────────→ [v1.0] (stable)
            ↓
feature:  [new feature being built] ──→ (ready when done)
```

### Creating a Branch

```bash
# Create a new branch
git branch feature/user-authentication

# Switch to that branch
git checkout feature/user-authentication

# Or do both at once
git checkout -b feature/user-authentication
```

### Your Branches

```
main           ← Main production code
feature/login  ← New login feature you're building
bugfix/password ← Fixing a password reset bug
```

### Merging Branches

When your feature is ready, merge it into main:

```bash
# Switch to main
git checkout main

# Merge the feature
git merge feature/user-authentication
```

This brings all changes from `feature/user-authentication` into `main`.

---

## Common Git Commands Cheat Sheet

```bash
# Setup (first time)
git init                      # Initialize a repository
git config user.name "John"   # Set your name
git config user.email "j@ex.com"  # Set your email

# Daily workflow
git status                    # See what changed
git add .                     # Stage all changes
git add filename.js           # Stage specific file
git commit -m "message"       # Create snapshot
git log                       # See history

# Branches
git branch                    # List branches
git branch feature/name       # Create branch
git checkout feature/name     # Switch branch
git checkout -b feature/name  # Create and switch
git merge feature/name        # Merge into current branch
git branch -d feature/name    # Delete branch

# Undo changes
git restore filename.js       # Undo changes in file (before commit)
git restore --staged file.js  # Unstage file
git revert commit_id          # Create new commit that undoes changes
git reset --hard commit_id    # Go back to specific commit (DANGEROUS)

# Remote (GitHub/GitLab)
git remote add origin url     # Connect to remote
git push                      # Send commits to remote
git pull                      # Get commits from remote
git clone url                 # Download a repository
```

---

## Real-World Example: Team Workflow

### Scenario: Two developers working on same project

```
Day 1 - John starts working on login feature:
  git checkout -b feature/login
  # Makes changes...
  git add .
  git commit -m "Added login form"

Day 1 - Jane starts working on registration feature:
  git checkout -b feature/registration
  # Makes changes...
  git add .
  git commit -m "Added registration form"

Day 2 - John finishes login feature:
  git checkout main
  git merge feature/login
  # ✅ Login feature now in main

Day 2 - Jane finishes registration:
  git checkout main
  git merge feature/registration
  # ✅ Registration feature now in main
  # Both features coexist without conflicts!
```

---

## Commit Messages - Best Practices

### ❌ Bad Commit Messages

```
git commit -m "fixed stuff"
git commit -m "update"
git commit -m "asdfghjkl"
git commit -m "it works now"
```

**Problem:** Future you won't know what changed or why.

### ✅ Good Commit Messages

```
git commit -m "Fixed user authentication bug in login form"
git commit -m "Added email verification to registration"
git commit -m "Refactored database connection logic"
git commit -m "Updated dependencies to latest versions"
git commit -m "Fixed typo in error message"
```

**Benefit:** Clear, searchable, understandable history.

### Commit Message Format

```
git commit -m "verb: short description"

Examples:
- "Add: user logout functionality"
- "Fix: database connection timeout"
- "Update: API response format"
- "Remove: unused imports"
- "Refactor: authentication middleware"
```

---

## .gitignore - What NOT to Track

Some files should **not** be committed (like passwords, node_modules):

Create a `.gitignore` file:

```
# Dependencies
node_modules/
venv/
.env

# Logs
*.log

# OS files
.DS_Store
Thumbs.db

# IDE
.vscode/
.idea/

# Database
*.db
*.sqlite

# Secrets
.env.local
secrets.json
```

---

## Important Rules

### Rule 1: Commit Often

```
❌ Bad
# Make 50 changes, commit once
git add .
git commit -m "lots of stuff"

✅ Good
# Commit after each feature
git commit -m "Added login"
git commit -m "Added password reset"
git commit -m "Fixed validation"
```

### Rule 2: Never Commit Secrets

```
❌ Never commit:
- Passwords
- API keys
- Secret tokens
- Database credentials

✅ Use .gitignore and environment variables
```

### Rule 3: Meaningful Commit Messages

```
❌ Bad
git commit -m "x"

✅ Good
git commit -m "Fixed password validation regex"
```

### Rule 4: Pull Before Push

```bash
# Always update before pushing
git pull          # Get latest changes
git push          # Send your changes
```

---

## Git Workflow Diagram

```
┌─────────────────────────────────────────────────────────┐
│ Your Computer (Local Repository)                        │
│                                                         │
│  1. Edit files                                          │
│     ↓                                                   │
│  2. git add .      (Stage changes)                      │
│     ↓                                                   │
│  3. git commit     (Create snapshot)                    │
│     ↓                                                   │
│  4. git push       (Send to GitHub/GitLab)             │
│                                                         │
└─────────────────────────────────────────────────────────┘
                         │
                    INTERNET
                         │
                         ▼
┌─────────────────────────────────────────────────────────┐
│ Remote Repository (GitHub/GitLab)                       │
│                                                         │
│ - Backup of your code                                   │
│ - Accessible by team                                    │
│ - Visible to world (if public)                          │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## Summary

```
Git = Version control system (time machine for code)
Repository = Folder that Git tracks
Commit = Snapshot with a message
Branch = Independent line of development
Stage → Commit → Push = Basic workflow
```

Next: Learn **Environment Variables** - How to store secrets safely!
