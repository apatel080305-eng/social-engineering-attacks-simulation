# Testing - Finding Bugs Before Users Do

## What Is Testing?

**Testing** means **automatically checking** that your code works correctly instead of relying on manual verification.

### Why Test?

```
Without Testing:
1. You code something
2. You manually click buttons to check
3. You miss edge cases
4. Users find bugs 💥
5. You spend days debugging

With Testing:
1. You code something
2. Tests automatically verify it works
3. Edge cases are caught
4. Users get stable software ✅
5. You can refactor with confidence
```

---

## Types of Testing

### 1. Unit Testing (Testing Functions)

Test a **single function** in isolation:

```javascript
// Function to test
function add(a, b) {
  return a + b;
}

// Unit test
test('add function works correctly', () => {
  expect(add(2, 3)).toBe(5);
  expect(add(-1, 1)).toBe(0);
  expect(add(0, 0)).toBe(0);
});
```

**What to test:**
- Normal inputs
- Edge cases (0, negative numbers)
- Invalid inputs (null, undefined)

### 2. Integration Testing (Testing How Parts Work Together)

Test multiple functions/modules working together:

```javascript
// User registration flow
test('user registration flow', async () => {
  // 1. Create user
  const user = await User.create({ email: 'test@example.com' });
  
  // 2. Send verification email
  const sent = await mailer.sendVerificationEmail(user);
  expect(sent).toBe(true);
  
  // 3. Verify email
  const verified = await user.verify();
  expect(verified).toBe(true);
  
  // 4. User should be marked as verified
  const freshUser = await User.findById(user.id);
  expect(freshUser.verified).toBe(true);
});
```

### 3. End-to-End Testing (E2E - Testing Full User Journey)

Test complete workflows from frontend to backend:

```javascript
// E2E test using Cypress
describe('User Login Flow', () => {
  it('user can login and view dashboard', () => {
    // 1. Navigate to login page
    cy.visit('http://localhost:3000/login');
    
    // 2. Fill in credentials
    cy.get('input[name=email]').type('user@example.com');
    cy.get('input[name=password]').type('password123');
    
    // 3. Click login
    cy.get('button[type=submit]').click();
    
    // 4. Verify redirected to dashboard
    cy.url().should('include', '/dashboard');
    
    // 5. Verify user name displayed
    cy.get('h1').should('contain', 'Welcome, John');
  });
});
```

### 4. Load Testing (Testing Performance)

Test how app performs under load:

```javascript
// Simulate 1000 concurrent requests
test('API handles 1000 concurrent requests', async () => {
  const requests = [];
  for (let i = 0; i < 1000; i++) {
    requests.push(fetch('/api/users'));
  }
  
  const startTime = Date.now();
  const results = await Promise.all(requests);
  const duration = Date.now() - startTime;
  
  // Should complete in less than 5 seconds
  expect(duration).toBeLessThan(5000);
  
  // All should succeed
  results.forEach(result => {
    expect(result.status).toBe(200);
  });
});
```

---

## Testing Tools

### JavaScript/Node.js

```javascript
// Test runners
npm install --save-dev jest          // Popular test framework
npm install --save-dev mocha         // Another test framework

// BDD framework
npm install --save-dev jasmine

// E2E testing
npm install --save-dev cypress       // Browser automation
npm install --save-dev playwright    // Browser automation

// Assertion libraries
npm install --save-dev chai          // Assertion library
```

### Basic Jest Example

```javascript
// calculator.js
function multiply(a, b) {
  return a * b;
}

module.exports = { multiply };

// calculator.test.js
const { multiply } = require('./calculator');

describe('Calculator Functions', () => {
  test('multiply 2 by 3 equals 6', () => {
    expect(multiply(2, 3)).toBe(6);
  });

  test('multiply by 0 equals 0', () => {
    expect(multiply(5, 0)).toBe(0);
  });

  test('multiply negative numbers', () => {
    expect(multiply(-2, -3)).toBe(6);
  });
});
```

Run tests:
```bash
npm test
```

Output:
```
PASS  calculator.test.js
  Calculator Functions
    ✓ multiply 2 by 3 equals 6 (5ms)
    ✓ multiply by 0 equals 0 (2ms)
    ✓ multiply negative numbers (3ms)

Test Suites: 1 passed, 1 total
Tests:       3 passed, 3 total
```

---

## Testing API Endpoints

### Testing Express Endpoints

```javascript
// server.js
const express = require('express');
const app = express();

app.get('/api/users/:id', (req, res) => {
  const user = { id: req.params.id, name: 'John' };
  res.json(user);
});

module.exports = app;

// server.test.js
const request = require('supertest');
const app = require('./server');

describe('GET /api/users/:id', () => {
  test('returns user data', async () => {
    const response = await request(app)
      .get('/api/users/123')
      .expect(200);
    
    expect(response.body).toEqual({
      id: '123',
      name: 'John'
    });
  });

  test('returns error for invalid id', async () => {
    const response = await request(app)
      .get('/api/users/invalid')
      .expect(400);
  });
});
```

---

## Mocking (Simulating Dependencies)

Sometimes you need to **mock** external services (databases, APIs, etc.):

```javascript
// Function that calls external API
async function getWeather(city) {
  const response = await fetch(`https://api.weather.com/city/${city}`);
  return response.json();
}

// Test with mock
jest.mock('node-fetch');

test('get weather data', async () => {
  // Mock the API response
  fetch.mockResolvedValueOnce({
    json: async () => ({ city: 'New York', temp: 72 })
  });

  const weather = await getWeather('New York');
  
  expect(weather.city).toBe('New York');
  expect(weather.temp).toBe(72);
});
```

---

## Test Coverage

**Code coverage** shows how much of your code is tested:

```bash
npm test -- --coverage
```

Output:
```
Statements   : 85.5% ( 123/144 )
Branches     : 78.2% ( 43/55 )
Functions    : 92.1% ( 35/38 )
Lines        : 87.3% ( 126/144 )
```

### Coverage Goals

```
❌ 0% - No testing (dangerous!)
⚠️  50% - Some coverage
✅ 70% - Good coverage
🎯 85%+ - Excellent coverage
💯 100% - All code paths tested (rarely achieved)
```

---

## Test Pyramid

```
         △
        / \
       /E2E\       1-2 tests (slow, most realistic)
      /─────\
     /  ────  \
    / Integr. \   5-10 tests (medium speed/cost)
   /──────────  \
  / ──────────── \
 /    Unit Tests  \  50+ tests (fast, cheap)
/───────────────────\

More Unit Tests = Faster feedback
More E2E Tests = Better confidence
```

---

## Writing Testable Code

### ❌ Hard to Test Code

```javascript
function saveUser(user) {
  // Depends on external services (hard to mock)
  const response = fetch('/api/save', user);
  const db = new Database();  // Creates its own instance
  db.insert(user);
  sendEmail(user);  // Side effect
  return true;
}
```

### ✅ Easy to Test Code

```javascript
function saveUser(user, database, emailService) {
  // Dependencies injected (easy to mock)
  if (!user.email) throw new Error('Email required');
  
  database.insert(user);
  emailService.send(user);
  return { success: true, userId: user.id };
}

// In test
test('saveUser validates email', () => {
  const mockDb = { insert: jest.fn() };
  const mockEmail = { send: jest.fn() };
  
  expect(() => {
    saveUser({ name: 'John' }, mockDb, mockEmail);
  }).toThrow('Email required');
});
```

---

## Best Practices

### ✅ DO:
- Test important functionality
- Test edge cases (empty, null, negative)
- Test error scenarios
- Keep tests simple and focused
- Use descriptive test names
- Mock external services
- Aim for 70-85% coverage
- Run tests frequently (on every commit)
- Test business logic heavily
- Update tests when requirements change

### ❌ DON'T:
- Test implementation details (only behavior)
- Write too many E2E tests (slow, expensive)
- Test external libraries (assume they work)
- Skip error path testing
- Have tests that sometimes pass/fail (flaky tests)
- Test things that don't matter
- Copy-paste test code
- Test multiple things in one test
- Write tests after shipping (too late)

---

## Test Naming Convention

```javascript
// Good test names (describe what is tested)
test('email validation rejects invalid email format', () => {});
test('add function returns sum of two numbers', () => {});
test('login fails if password is wrong', () => {});
test('database connection retries on failure', () => {});

// Bad test names (unclear, vague)
test('test email', () => {});
test('it works', () => {});
test('check add', () => {});
test('login test', () => {});
```

---

## Common Testing Mistakes

### ❌ Mistake 1: Testing Implementation, Not Behavior

```javascript
// Bad - Tests how function works (implementation)
test('array is created', () => {
  const arr = [];
  expect(Array.isArray(arr)).toBe(true);
});

// Good - Tests what function does (behavior)
test('getUsers returns list of users', () => {
  const users = getUsers();
  expect(users.length).toBeGreaterThan(0);
});
```

### ❌ Mistake 2: Skipping Error Cases

```javascript
// Bad - Only tests happy path
test('user login', () => {
  const result = login('user@example.com', 'password');
  expect(result.success).toBe(true);
});

// Good - Tests all paths
test('login succeeds with correct password', () => {
  expect(login('user@example.com', 'correct')).toBe(true);
});

test('login fails with wrong password', () => {
  expect(login('user@example.com', 'wrong')).toBe(false);
});

test('login fails if user not found', () => {
  expect(login('notfound@example.com', 'password')).toBe(false);
});
```

### ❌ Mistake 3: Tests That Are Too Complex

```javascript
// Bad - Too much in one test
test('user registration', () => {
  const user = createUser('john@example.com');
  sendVerificationEmail(user);
  const token = extractTokenFromEmail();
  verifyUser(token);
  loginUser(user);
  updateProfile(user, { name: 'John' });
  // Multiple assertions, unclear what failed
});

// Good - One test per behavior
test('user can register', () => {
  const user = createUser('john@example.com');
  expect(user.id).toBeDefined();
});

test('verification email is sent', () => {
  const user = createUser('john@example.com');
  const sent = sendVerificationEmail(user);
  expect(sent).toBe(true);
});
```

---

## Running Tests in CI/CD

Tests should run automatically when you commit:

```yaml
# GitHub Actions workflow
name: Tests
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
      - run: npm install
      - run: npm test
      - run: npm run test:coverage
```

---

## Summary

```
Unit Tests = Fast, test functions
Integration Tests = Medium speed, test interactions
E2E Tests = Slow, test full workflows
Testing = Confidence that code works
Good tests = Find bugs early
```

Next: Learn **API Documentation** - Teaching others to use your API!
