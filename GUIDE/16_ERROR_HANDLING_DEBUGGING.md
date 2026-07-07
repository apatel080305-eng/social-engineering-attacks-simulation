# Error Handling & Debugging - When Things Break

## What Is An Error?

An **error** happens when something goes wrong in your application. Instead of crashing silently, proper error handling helps you:

- Understand what went wrong
- Debug the issue faster
- Show helpful messages to users
- Prevent the app from crashing

---

## Types of Errors

### 1. Syntax Errors (Code Mistakes)

You wrote code that doesn't follow the language rules:

```javascript
// ❌ Syntax Error: Missing closing parenthesis
console.log("Hello world"

// ✅ Fixed
console.log("Hello world");
```

```javascript
// ❌ Syntax Error: Wrong quote type in JSON
const obj = {name: 'John'}; // Single quote in JavaScript object

// ✅ Fixed
const obj = { name: "John" };
```

### 2. Runtime Errors (Code Breaks During Execution)

The code runs but crashes when it hits a problem:

```javascript
// ❌ Runtime Error: Property doesn't exist
const user = { name: "John" };
console.log(user.email.length);  // email is undefined!

// ✅ Fixed - Check if property exists
const user = { name: "John" };
if (user.email) {
  console.log(user.email.length);
} else {
  console.log("Email not defined");
}
```

```javascript
// ❌ Runtime Error: Array out of bounds
const arr = [1, 2, 3];
console.log(arr[10]);  // Returns undefined, then .length crashes

// ✅ Fixed
const arr = [1, 2, 3];
if (arr[10] !== undefined) {
  console.log(arr[10].length);
}
```

### 3. Logic Errors (Code Runs But Does Wrong Thing)

No error is thrown, but the logic is wrong:

```javascript
// ❌ Logic Error: Always returns true
function isAdult(age) {
  if (age >= 18) {
    return true;
  }
  return true;  // Oops! Should be false
}

// ✅ Fixed
function isAdult(age) {
  if (age >= 18) {
    return true;
  }
  return false;
}
```

### 4. Network Errors (API/Server Issues)

Your code is fine, but the network request failed:

```javascript
// ❌ No error handling
const response = await fetch('/api/users');
const data = await response.json();

// ✅ Fixed - Handle errors
try {
  const response = await fetch('/api/users');
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const data = await response.json();
} catch (error) {
  console.error("Network error:", error);
}
```

### 5. Database Errors

Database is down, query is wrong, etc:

```javascript
// ❌ No error handling
const user = await User.findById(userId);

// ✅ Fixed - Handle errors
try {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error("User not found");
  }
} catch (error) {
  console.error("Database error:", error);
}
```

---

## Try-Catch Blocks (Error Handling)

### Basic Structure

```javascript
try {
  // Code that might cause an error
  riskyOperation();
} catch (error) {
  // What to do if error happens
  console.error("Something went wrong:", error);
}
```

### Real Example

```javascript
try {
  // Try to parse JSON
  const jsonString = '{"name": "John"';  // Missing closing brace
  const obj = JSON.parse(jsonString);
  console.log(obj);
} catch (error) {
  // Catch the error
  console.error("Invalid JSON:", error.message);
}

// Output: Invalid JSON: Unexpected end of JSON input
// App doesn't crash!
```

### Try-Catch-Finally

```javascript
try {
  // Risky code
  const file = fs.readFileSync('data.txt');
} catch (error) {
  // Handle error
  console.error("Error reading file:", error);
} finally {
  // Always runs (success or error)
  console.log("Cleanup done");
}
```

---

## Error Objects

When an error occurs, you get an **Error object** with useful information:

```javascript
try {
  undefined.method();  // This will error
} catch (error) {
  console.log(error.name);      // "TypeError"
  console.log(error.message);   // "undefined.method is not a function"
  console.log(error.stack);     // Full stack trace
}
```

### Common Error Types

```javascript
// TypeError - Wrong type
const num = 5;
num.toUpperCase();  // TypeError: toUpperCase is not a function

// ReferenceError - Variable doesn't exist
console.log(undefinedVariable);  // ReferenceError

// SyntaxError - Wrong syntax
eval("this is not valid code");  // SyntaxError

// RangeError - Value out of valid range
const arr = new Array(-1);  // RangeError
```

---

## Throwing Custom Errors

You can create and throw your own errors:

```javascript
function validateAge(age) {
  if (age < 0) {
    throw new Error("Age cannot be negative");
  }
  if (age > 150) {
    throw new Error("Age seems unrealistic");
  }
  return true;
}

try {
  validateAge(-5);
} catch (error) {
  console.error("Validation failed:", error.message);
}
```

### Custom Error Types

```javascript
class InvalidUserError extends Error {
  constructor(message) {
    super(message);
    this.name = "InvalidUserError";
  }
}

try {
  if (!userName) {
    throw new InvalidUserError("Username is required");
  }
} catch (error) {
  if (error instanceof InvalidUserError) {
    console.error("User validation failed:", error.message);
  }
}
```

---

## Debugging Techniques

### 1. Console.log Debugging

```javascript
function calculateTotal(items) {
  console.log("Items:", items);  // ← Print to see what's happening
  
  let total = 0;
  for (let i = 0; i < items.length; i++) {
    console.log(`Adding item ${i}:`, items[i]);  // ← Track progress
    total += items[i].price;
  }
  
  console.log("Final total:", total);  // ← Check result
  return total;
}
```

### 2. Debugger Breakpoints (Browser DevTools)

```javascript
function processUser(user) {
  debugger;  // ← Execution pauses here in DevTools
  console.log("Processing:", user);
  return user.name.toUpperCase();
}
```

Steps:
1. Open browser DevTools (F12)
2. Go to Sources tab
3. Click line number to add breakpoint
4. Run code
5. Step through execution
6. Inspect variables

### 3. Browser DevTools Console

```javascript
// In browser console
user = { name: "John", age: 30 }
user.name                    // "John"
typeof user.age              // "number"
user.age > 18                // true
Object.keys(user)            // ["name", "age"]
```

### 4. Error Logging

```javascript
// Create a logging function
function logError(errorMessage, error) {
  const timestamp = new Date().toISOString();
  console.error(`[${timestamp}] ${errorMessage}`, error);
  
  // In production, send to error tracking service
  if (process.env.NODE_ENV === 'production') {
    sendToErrorTracker({
      message: errorMessage,
      error: error,
      url: window.location.href,
      userAgent: navigator.userAgent
    });
  }
}

try {
  riskyOperation();
} catch (error) {
  logError("Operation failed", error);
}
```

---

## Common Error Scenarios & Solutions

### Scenario 1: API Returns Error Status

```javascript
// ❌ Doesn't check status
const response = await fetch('/api/users');
const data = await response.json();  // May fail if 404!

// ✅ Properly handles errors
const response = await fetch('/api/users');
if (!response.ok) {
  throw new Error(`API Error: ${response.status} ${response.statusText}`);
}
const data = await response.json();
```

### Scenario 2: Undefined Property Access

```javascript
// ❌ Crashes if user doesn't have email
const emailLength = user.email.length;

// ✅ Safe access
const emailLength = user.email ? user.email.length : 0;

// Or using optional chaining (modern JS)
const emailLength = user?.email?.length ?? 0;
```

### Scenario 3: Array Out of Bounds

```javascript
// ❌ Returns undefined
const item = items[100];
console.log(item.name);  // Crash!

// ✅ Safe access
const item = items[100];
if (item) {
  console.log(item.name);
} else {
  console.log("Item not found");
}
```

### Scenario 4: Database Connection Fails

```javascript
// ❌ No error handling
const users = await User.find();

// ✅ Proper error handling
try {
  const users = await User.find();
  res.json(users);
} catch (error) {
  console.error("Database error:", error);
  res.status(500).json({ error: "Failed to fetch users" });
}
```

---

## Error Handling in APIs (Express)

### Simple Error Handler

```javascript
app.get('/users/:id', (req, res) => {
  try {
    const userId = req.params.id;
    
    // Validate input
    if (!userId) {
      return res.status(400).json({ error: "User ID required" });
    }
    
    // Get user (might fail)
    const user = User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    
    res.json(user);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Server error" });
  }
});
```

### Global Error Handler

```javascript
// At the END of your Express app
app.use((error, req, res, next) => {
  console.error("Uncaught error:", error);
  
  res.status(error.statusCode || 500).json({
    error: error.message || "Internal server error",
    timestamp: new Date().toISOString()
  });
});
```

---

## Best Practices

### ✅ DO:
- Use try-catch for risky operations
- Log errors with context (what were you doing?)
- Show user-friendly error messages
- Test error paths (not just happy paths)
- Handle network errors
- Validate input before using it
- Use error tracking in production
- Include error codes in API responses

### ❌ DON'T:
- Ignore errors silently
- Show raw error messages to users
- Log passwords/secrets
- Catch all errors the same way
- Throw too generic errors
- Leave unhandled promise rejections
- Continue with bad data

---

## Debugging Workflow

```
1. Read the Error Message
   └─ What does it say went wrong?
   
2. Find the Stack Trace
   └─ Which line of code caused it?
   
3. Read the Code
   └─ What was that code trying to do?
   
4. Add Logging
   └─ Print values to understand what's happening
   
5. Use Debugger
   └─ Set breakpoints and step through
   
6. Check Assumptions
   └─ Is this variable what I think it is?
   
7. Test Your Fix
   └─ Does the error go away?
   
8. Test Edge Cases
   └─ What if input is empty/null/weird?
```

---

## Summary

```
Errors are NORMAL and expected
Proper error handling makes debugging easy
Try-catch blocks prevent crashes
Good error messages help users
Logging helps you debug problems
```

Next: Learn **Testing** - How to find bugs before users do!
