# JSON Basics - Data Format for APIs

## What Is JSON?

**JSON** = JavaScript Object Notation

JSON is a **format for organizing data** so that computers can easily read and understand it. Think of it like writing a sentence in a way that both humans and computers can parse.

### Why JSON?

- Easy to read (humans can understand it)
- Easy for computers to parse
- Lightweight (doesn't take much space)
- Works in almost every programming language
- The standard format for APIs and web services

---

## JSON vs Plain Text

### ❌ WITHOUT JSON (hard to parse):
```
John Doe is 30 years old and lives in New York and works as a Software Engineer
```

**Problems:**
- Hard for a computer to extract: Which part is the name? Which is the age?
- Ambiguous and unstructured

### ✅ WITH JSON (easy to parse):
```json
{
  "name": "John Doe",
  "age": 30,
  "city": "New York",
  "job": "Software Engineer"
}
```

**Benefits:**
- Computer knows exactly: This is the name, this is the age, etc.
- Structured and clear
- Easy to extract specific pieces

---

## JSON Building Blocks

JSON has only a few basic types:

### 1. String (Text)

Text wrapped in **double quotes**:

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "job": "Developer"
}
```

### 2. Number (Integer or Decimal)

Numbers **without quotes**:

```json
{
  "age": 30,
  "height": 5.9,
  "salary": 100000,
  "temperature": -5.5
}
```

### 3. Boolean (True or False)

Only **true** or **false** (lowercase, no quotes):

```json
{
  "is_active": true,
  "is_deleted": false,
  "is_premium_user": true
}
```

### 4. Null (Nothing)

**null** means "no value" or "empty":

```json
{
  "middle_name": null,
  "phone": null,
  "address": "123 Main St"
}
```

### 5. Array (List)

Multiple items in **square brackets `[]`**:

```json
{
  "hobbies": ["reading", "gaming", "coding"],
  "scores": [95, 87, 92, 88],
  "tags": ["important", "urgent"]
}
```

### 6. Object (Collection of key-value pairs)

Data inside **curly braces `{}`**:

```json
{
  "person": {
    "name": "John Doe",
    "age": 30,
    "address": {
      "street": "123 Main St",
      "city": "New York",
      "zip": "10001"
    }
  }
}
```

---

## JSON Structure Rules

### Rule 1: Keys MUST be strings (in double quotes)

```json
✅ Correct
{
  "name": "John",
  "age": 30
}

❌ Wrong
{
  name: "John",
  age: 30
}
```

### Rule 2: Strings MUST be in double quotes (not single)

```json
✅ Correct
{
  "name": "John"
}

❌ Wrong
{
  "name": 'John'
}
```

### Rule 3: Numbers don't have quotes

```json
✅ Correct
{
  "age": 30
}

❌ Wrong
{
  "age": "30"
}
```

### Rule 4: Booleans and null don't have quotes

```json
✅ Correct
{
  "is_active": true,
  "address": null
}

❌ Wrong
{
  "is_active": "true",
  "address": "null"
}
```

### Rule 5: Arrays use square brackets

```json
✅ Correct
{
  "hobbies": ["reading", "gaming"]
}

❌ Wrong
{
  "hobbies": ("reading", "gaming")
}
```

### Rule 6: No trailing commas

```json
✅ Correct
{
  "name": "John",
  "age": 30
}

❌ Wrong
{
  "name": "John",
  "age": 30,
}
```

---

## Real-World Examples

### Example 1: Simple User Object

```json
{
  "id": 123,
  "username": "john_doe",
  "email": "john@example.com",
  "age": 30,
  "is_active": true,
  "created_at": "2024-01-15"
}
```

### Example 2: Complex User with Nested Data

```json
{
  "id": 123,
  "username": "john_doe",
  "profile": {
    "first_name": "John",
    "last_name": "Doe",
    "bio": "Software developer",
    "avatar": "https://example.com/avatar.jpg"
  },
  "contact": {
    "email": "john@example.com",
    "phone": "+1-555-0123",
    "address": {
      "street": "123 Main St",
      "city": "New York",
      "state": "NY",
      "zip": "10001"
    }
  },
  "preferences": {
    "theme": "dark",
    "language": "en",
    "notifications_enabled": true
  },
  "is_active": true,
  "created_at": "2024-01-15"
}
```

### Example 3: Array of Objects

```json
{
  "users": [
    {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com"
    },
    {
      "id": 2,
      "name": "Jane Smith",
      "email": "jane@example.com"
    },
    {
      "id": 3,
      "name": "Bob Johnson",
      "email": "bob@example.com"
    }
  ]
}
```

### Example 4: API Response with Status

```json
{
  "success": true,
  "status_code": 200,
  "message": "User created successfully",
  "data": {
    "id": 456,
    "name": "Jane Smith",
    "email": "jane@example.com",
    "created_at": "2024-01-15T10:30:45Z"
  }
}
```

### Example 5: Error Response

```json
{
  "success": false,
  "status_code": 404,
  "error": "User not found",
  "message": "No user with ID 999 exists"
}
```

---

## Accessing JSON Data (JavaScript Example)

### In JavaScript, once you have JSON, you can access it like:

```javascript
// The JSON
const user = {
  "name": "John Doe",
  "age": 30,
  "email": "john@example.com",
  "hobbies": ["reading", "gaming", "coding"],
  "address": {
    "city": "New York",
    "zip": "10001"
  }
};

// Accessing data
console.log(user.name);              // "John Doe"
console.log(user.age);               // 30
console.log(user.hobbies[0]);        // "reading"
console.log(user.address.city);      // "New York"
```

---

## Converting Between String and JSON

### String → JSON (Parsing)

```javascript
// String version (what you get from server)
const jsonString = '{"name": "John", "age": 30}';

// Convert to JavaScript object
const user = JSON.parse(jsonString);
console.log(user.name);  // "John"
```

### JSON → String (Stringifying)

```javascript
// JavaScript object
const user = {
  "name": "John",
  "age": 30
};

// Convert to string
const jsonString = JSON.stringify(user);
console.log(jsonString);  // '{"name":"John","age":30}'
```

---

## Common JSON Mistakes

### ❌ Mistake 1: Single quotes instead of double quotes

```json
{"name": 'John'}  ❌ Wrong
{"name": "John"}  ✅ Correct
```

### ❌ Mistake 2: Quotes around numbers

```json
{"age": "30"}  ❌ Wrong (this is a string, not a number)
{"age": 30}    ✅ Correct
```

### ❌ Mistake 3: Quotes around booleans

```json
{"is_active": "true"}  ❌ Wrong (this is a string)
{"is_active": true}    ✅ Correct
```

### ❌ Mistake 4: Trailing comma

```json
{"name": "John", "age": 30,}  ❌ Wrong
{"name": "John", "age": 30}   ✅ Correct
```

### ❌ Mistake 5: Using undefined or functions

```javascript
// This will NOT work in JSON
{
  "name": "John",
  "age": undefined,           ❌ Wrong
  "callback": function() {}   ❌ Wrong
}

// Only use: strings, numbers, booleans, null, arrays, objects
```

---

## Validating JSON

To check if JSON is valid, use:

1. **Online tools:** [jsonlint.com](https://www.jsonlint.com/)
2. **In JavaScript:**
   ```javascript
   try {
     JSON.parse('{"name": "John"}');
     console.log("Valid JSON!");
   } catch (error) {
     console.log("Invalid JSON!", error);
   }
   ```
3. **Browser DevTools:** Paste JSON, it will highlight errors

---

## Summary

```
JSON = A standard format for organizing data
Uses: { } for objects, [ ] for arrays
Types: String, Number, Boolean, Null, Array, Object
Rules: Keys in quotes, strings in double quotes, no trailing commas
```

Now that you understand JSON, you can understand what APIs send and receive!

Next: Learn **Git & Version Control** - How developers track code changes!
