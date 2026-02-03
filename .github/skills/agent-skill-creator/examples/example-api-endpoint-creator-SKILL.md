---
name: api-endpoint-creator
description: Guide for creating RESTful API endpoints with proper validation, error handling, and documentation. Use this when asked to create new API endpoints or routes.
license: MIT
---

# API Endpoint Creator

Creates well-structured REST API endpoints following best practices for validation, error handling, documentation, and testing.

## When to Use

Use this skill when:
- Creating new API endpoints
- Adding routes to an existing API
- Implementing CRUD operations
- Building webhook handlers

## Prerequisites

- [ ] API framework identified (Express, Fastify, NestJS, etc.)
- [ ] Database/data layer accessible
- [ ] Authentication middleware configured (if needed)

## Process

### Step 1: Define the Endpoint Contract

Before writing code, define:
- HTTP method (GET, POST, PUT, PATCH, DELETE)
- URL path with parameters
- Request body schema (for POST/PUT/PATCH)
- Response schema
- Possible error responses

### Step 2: Create Request Validation

Use a validation library appropriate for your framework:

```typescript
// Using Zod for validation
import { z } from 'zod';

const createUserSchema = z.object({
  email: z.string().email(),
  name: z.string().min(2).max(100),
  role: z.enum(['admin', 'user', 'guest']).default('user'),
});

type CreateUserInput = z.infer<typeof createUserSchema>;
```

### Step 3: Implement the Handler

```typescript
async function createUser(req: Request, res: Response) {
  // 1. Validate input
  const result = createUserSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({
      error: 'Validation failed',
      details: result.error.flatten(),
    });
  }

  // 2. Business logic
  try {
    const user = await userService.create(result.data);
    
    // 3. Return success response
    return res.status(201).json({
      data: user,
      message: 'User created successfully',
    });
  } catch (error) {
    // 4. Handle errors
    if (error instanceof DuplicateEmailError) {
      return res.status(409).json({
        error: 'Email already exists',
      });
    }
    throw error; // Let error middleware handle unexpected errors
  }
}
```

### Step 4: Add Error Handling

Implement consistent error responses:

```typescript
// Standard error response format
interface ErrorResponse {
  error: string;
  code?: string;
  details?: unknown;
}

// Common HTTP status codes
// 400 - Bad Request (validation errors)
// 401 - Unauthorized (missing/invalid auth)
// 403 - Forbidden (insufficient permissions)
// 404 - Not Found
// 409 - Conflict (duplicate resource)
// 422 - Unprocessable Entity
// 500 - Internal Server Error
```

### Step 5: Document the Endpoint

Add OpenAPI/Swagger documentation:

```typescript
/**
 * @openapi
 * /api/users:
 *   post:
 *     summary: Create a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateUser'
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Validation error
 *       409:
 *         description: Email already exists
 */
```

### Step 6: Write Tests

```typescript
describe('POST /api/users', () => {
  it('creates a user with valid input', async () => {
    const response = await request(app)
      .post('/api/users')
      .send({ email: 'test@example.com', name: 'Test User' });
    
    expect(response.status).toBe(201);
    expect(response.body.data).toHaveProperty('id');
  });

  it('returns 400 for invalid email', async () => {
    const response = await request(app)
      .post('/api/users')
      .send({ email: 'invalid', name: 'Test' });
    
    expect(response.status).toBe(400);
  });
});
```

## Success Criteria

- [ ] Endpoint accepts valid requests and returns correct responses
- [ ] Invalid input returns 400 with clear error messages
- [ ] All error cases return appropriate status codes
- [ ] OpenAPI documentation is accurate
- [ ] Tests cover success and error paths
