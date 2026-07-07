# Database Basics - Storing Data Permanently

## What Is A Database?

A **database** is an **organized collection of data** stored on a computer that you can:

- **Create** new data
- **Read** existing data
- **Update** data
- **Delete** data

### Real-World Analogy

```
Your Brain       = Variable (temporary, limited memory)
A Notebook      = File (permanent but disorganized)
A Library       = Database (permanent, organized, searchable)
```

---

## Why Databases?

### Without Database (Temporary Storage)

```javascript
// Store user in memory
let user = { name: "John", email: "john@example.com" };

// Problem 1: Data is lost when app restarts!
// Problem 2: Can only store one user in a variable
// Problem 3: Can't search through thousands of users
```

### With Database (Permanent Storage)

```
Save to database → Data persists forever
Can store millions of records
Can query/search easily
Multiple users can access simultaneously
```

---

## Types of Databases

### 1. Relational Databases (SQL)

Data organized in **tables** with **rows** and **columns**:

```
Table: users
┌───────┬──────────────┬──────────────────────────┐
│ id    │ name         │ email                    │
├───────┼──────────────┼──────────────────────────┤
│ 1     │ John Doe     │ john@example.com         │
│ 2     │ Jane Smith   │ jane@example.com         │
│ 3     │ Bob Johnson  │ bob@example.com          │
└───────┴──────────────┴──────────────────────────┘

Table: posts
┌───────┬──────────────┬────────────────┐
│ id    │ user_id      │ content        │
├───────┼──────────────┼────────────────┤
│ 101   │ 1            │ Hello world!   │
│ 102   │ 1            │ Nice weather   │
│ 103   │ 2            │ Coding rocks   │
└───────┴──────────────┴────────────────┘
```

**Examples:** MySQL, PostgreSQL, Oracle

### 2. NoSQL Databases (Document-Based)

Data organized as **documents** (like JSON):

```
Collection: users
[
  {
    "_id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "hobbies": ["reading", "gaming"],
    "address": {
      "city": "New York",
      "zip": "10001"
    }
  },
  {
    "_id": 2,
    "name": "Jane Smith",
    "email": "jane@example.com",
    "verified": true
  }
]
```

**Examples:** MongoDB, CouchDB, Firebase

### 3. Key-Value Databases

Simple **key → value** pairs:

```
database[
  "user:1:name" → "John Doe"
  "user:1:email" → "john@example.com"
  "posts:1:title" → "Hello World"
]
```

**Examples:** Redis, Memcached (usually for caching)

---

## Relational vs NoSQL

| Aspect | Relational (SQL) | NoSQL (Document) |
|--------|------------------|------------------|
| **Structure** | Tables with strict schema | Flexible documents |
| **Relationships** | Foreign keys | Embedded docs |
| **Scalability** | Vertical (bigger server) | Horizontal (more servers) |
| **Flexibility** | Rigid | Very flexible |
| **Learning Curve** | Moderate | Easy |
| **Best For** | Business apps, finance | Content, real-time |

---

## Database Concepts

### 1. Table/Collection

A **group of related data**:

```
SQL: Table named "users"
NoSQL: Collection named "users"

Both contain multiple user records
```

### 2. Row/Document

A **single record** with all its data:

```
SQL Row:
{ id: 1, name: "John", email: "john@example.com", age: 30 }

NoSQL Document:
{ _id: 1, name: "John", email: "john@example.com", age: 30 }
```

### 3. Column/Field

A **property** of the data:

```
Columns/Fields: id, name, email, age

user.name      ← Name field
user.email     ← Email field
```

### 4. Primary Key

A **unique identifier** for each row:

```
Table: users
┌───────┬──────────────┬──────────────────────────┐
│ id    │ name         │ email                    │  ← id is Primary Key (unique!)
├───────┼──────────────┼──────────────────────────┤
│ 1     │ John Doe     │ john@example.com         │
│ 2     │ Jane Smith   │ jane@example.com         │
└───────┴──────────────┴──────────────────────────┘

No two rows can have the same id!
```

### 5. Foreign Key

A **reference to another table**:

```
Table: posts
┌───────┬──────────────┬────────────────┐
│ id    │ user_id      │ content        │  ← user_id is Foreign Key
├───────┼──────────────┼────────────────┤      (references users.id)
│ 101   │ 1            │ Hello world!   │  ← This post belongs to user 1
│ 102   │ 1            │ Nice weather   │
│ 103   │ 2            │ Coding rocks   │  ← This post belongs to user 2
└───────┴──────────────┴────────────────┘
```

---

## CRUD Operations

**CRUD** = Create, Read, Update, Delete (basic operations)

### 1. CREATE - Add New Data

```sql
-- SQL
INSERT INTO users (name, email, age)
VALUES ('John Doe', 'john@example.com', 30);
```

```javascript
// JavaScript with MongoDB
db.users.insertOne({
  name: 'John Doe',
  email: 'john@example.com',
  age: 30
});
```

### 2. READ - Get Data

```sql
-- SQL - Get all users
SELECT * FROM users;

-- SQL - Get specific user
SELECT * FROM users WHERE id = 1;

-- SQL - Get with filter
SELECT * FROM users WHERE age > 18;
```

```javascript
// JavaScript with MongoDB
// Get all users
db.users.find({});

// Get specific user
db.users.findOne({ _id: 1 });

// Get with filter
db.users.find({ age: { $gt: 18 } });
```

### 3. UPDATE - Modify Data

```sql
-- SQL
UPDATE users SET age = 31 WHERE id = 1;
```

```javascript
// JavaScript with MongoDB
db.users.updateOne(
  { _id: 1 },
  { $set: { age: 31 } }
);
```

### 4. DELETE - Remove Data

```sql
-- SQL
DELETE FROM users WHERE id = 1;
```

```javascript
// JavaScript with MongoDB
db.users.deleteOne({ _id: 1 });
```

---

## Database Connections in Code

### Node.js + MongoDB Example

```javascript
// Connect to database
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/myapp', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Define schema (shape of data)
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  age: Number
});

// Create model
const User = mongoose.model('User', userSchema);

// CREATE
const newUser = await User.create({
  name: 'John Doe',
  email: 'john@example.com',
  age: 30
});

// READ
const user = await User.findById(1);
const allUsers = await User.find({});

// UPDATE
await User.findByIdAndUpdate(1, { age: 31 });

// DELETE
await User.findByIdAndDelete(1);
```

### Node.js + MySQL Example

```javascript
const mysql = require('mysql');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'myapp'
});

connection.connect();

// CREATE
connection.query(
  "INSERT INTO users (name, email, age) VALUES (?, ?, ?)",
  ['John Doe', 'john@example.com', 30],
  (error, results) => {
    if (error) throw error;
    console.log('User created');
  }
);

// READ
connection.query(
  "SELECT * FROM users WHERE id = ?",
  [1],
  (error, results) => {
    if (error) throw error;
    console.log(results);
  }
);

// UPDATE
connection.query(
  "UPDATE users SET age = ? WHERE id = ?",
  [31, 1],
  (error, results) => {
    if (error) throw error;
    console.log('User updated');
  }
);

// DELETE
connection.query(
  "DELETE FROM users WHERE id = ?",
  [1],
  (error, results) => {
    if (error) throw error;
    console.log('User deleted');
  }
);

connection.end();
```

---

## Indexing (Performance)

An **index** is like a **table of contents** - it helps find data faster:

```sql
-- Without index: Searches every row (SLOW)
SELECT * FROM users WHERE email = 'john@example.com';  -- 1,000,000 rows!

-- Create index on email column (FAST)
CREATE INDEX idx_email ON users(email);

-- Now search is much faster
SELECT * FROM users WHERE email = 'john@example.com';  -- Found in milliseconds!
```

---

## Relationships Between Tables

### One-to-Many (1:N)

One user can have many posts:

```
users:              posts:
┌──────┐           ┌──────────┐
│ id:1 │ ───────→  │ user_id:1│
│ John │ ────┐     │ post 1   │
└──────┘     │     └──────────┘
             │     
             │     ┌──────────┐
             └──→  │ user_id:1│
                   │ post 2   │
                   └──────────┘
```

### Many-to-Many (N:N)

Many students can take many courses:

```
students:          enrollments:       courses:
┌──────┐           ┌──────────┐       ┌──────┐
│ id:1 │──────────→│ stud:1   │──────→│id:A  │
│ John │           │ course:A │       │Math  │
└──────┘           └──────────┘       └──────┘
                   
┌──────┐           ┌──────────┐       
│ id:2 │──────────→│ stud:1   │──────→│id:B  │
│ Jane │           │ course:B │       │Eng   │
└──────┘           └──────────┘       └──────┘
```

---

## Common Mistakes

### ❌ Mistake 1: Storing Data in Files

```
❌ User data in JSON file:
users.json (vulnerable, slow, not scalable)

✅ User data in database:
MongoDB (secure, fast, scalable)
```

### ❌ Mistake 2: Not Indexing Important Columns

```
❌ Slow searches:
SELECT * FROM users WHERE email = '...';  (scans all rows)

✅ Fast with index:
CREATE INDEX on email column
```

### ❌ Mistake 3: Storing Passwords in Plain Text

```
❌ Dangerous:
{ user: 'john', password: 'mypassword' }

✅ Safe (hashed):
{ user: 'john', password: '$2b$10$N9qo8uLO...' }
```

### ❌ Mistake 4: No Backups

```
✅ Always backup your database!
- Regular automated backups
- Test restores
- Multiple backup locations
```

---

## Summary

```
Database = Organized data storage
Relational = Tables (SQL)
NoSQL = Flexible documents (MongoDB)
CRUD = Create, Read, Update, Delete
Index = Speed up searches
Keys = Link related data
```

Next: Learn **Testing** - Finding bugs before users do!
