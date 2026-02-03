# TaskFlow Implementation Plan

## Overview
This plan implements the TaskFlow API in iterative steps, with each step building on the previous. Follow prompts sequentially, verifying each step before proceeding.

## Prerequisites
- [ ] Node.js 20+ installed
- [ ] npm or pnpm available
- [ ] Code editor ready

---

## Step 1: Project Setup

### Context
Initialize the project structure with TypeScript, Express, and essential tooling. This creates the foundation for all subsequent steps.

### Prompt
```text
Create a new Node.js project for a REST API called "taskflow" with:

1. Initialize with package.json (type: module)
2. Install dependencies:
   - express (web framework)
   - zod (validation)
   - prisma and @prisma/client (ORM)
   - uuid (ID generation)
   
3. Install dev dependencies:
   - typescript
   - @types/node, @types/express
   - vitest (testing)
   - tsx (TypeScript execution)
   - prisma (CLI)

4. Create tsconfig.json with strict mode, ES2022 target, NodeNext module resolution

5. Create this folder structure:
   src/
   ├── index.ts (entry point, just console.log for now)
   ├── routes/
   ├── services/
   ├── middleware/
   └── schemas/

6. Add npm scripts:
   - "dev": "tsx watch src/index.ts"
   - "build": "tsc"
   - "test": "vitest"
   - "db:generate": "prisma generate"
   - "db:push": "prisma db push"

Verify the setup works by running npm run dev.
```

### Expected Outcomes
- Project initializes without errors
- `npm run dev` outputs to console
- All dependencies installed

### Verification
```bash
npm run dev
# Should see console.log output
```

---

## Step 2: Database Schema

### Context
Define the Prisma schema for our data models. This sets up the database structure that all features will use.

### Prompt
```text
Create the Prisma schema for TaskFlow with SQLite database.

File: prisma/schema.prisma

Models needed:

1. Task:
   - id: String (UUID, primary key)
   - title: String (required)
   - description: String (optional)
   - status: Enum (PENDING, IN_PROGRESS, COMPLETED)
   - priority: Enum (LOW, MEDIUM, HIGH, URGENT)
   - dueDate: DateTime (optional)
   - completedAt: DateTime (optional)
   - projectId: String (optional, relation to Project)
   - createdAt: DateTime (default now)
   - updatedAt: DateTime (auto-update)
   - deletedAt: DateTime (optional, for soft delete)

2. Project:
   - id: String (UUID, primary key)
   - name: String (required)
   - description: String (optional)
   - createdAt: DateTime
   - updatedAt: DateTime
   - tasks: Relation to Task[]

3. Tag:
   - id: String (UUID, primary key)
   - name: String (required, unique)
   - color: String (required, hex color)
   - createdAt: DateTime

4. TaskTag (junction table):
   - taskId: String
   - tagId: String
   - Primary key on [taskId, tagId]

After creating the schema, run:
- npx prisma generate
- npx prisma db push

Create a src/lib/prisma.ts file that exports a singleton Prisma client instance.
```

### Expected Outcomes
- Schema created at prisma/schema.prisma
- Database file created at prisma/dev.db
- Prisma client generated

### Verification
```bash
npm run db:push
# Should complete without errors
```

---

## Step 3: Validation Schemas

### Context
Create Zod schemas for input validation. These will be shared across routes and services.

### Prompt
```text
Create Zod validation schemas for TaskFlow.

File: src/schemas/task.schema.ts
- createTaskSchema: title (required, 1-200 chars), description (optional, max 2000), 
  dueDate (optional, ISO string), priority (enum), projectId (optional UUID), 
  tagIds (optional array of UUIDs)
- updateTaskSchema: all fields optional, plus status (enum)
- taskQuerySchema: status, priority, projectId, tagIds (comma-separated string), 
  dueBefore, dueAfter, page (default 1), limit (default 20, max 100)

File: src/schemas/project.schema.ts
- createProjectSchema: name (required, 1-100 chars), description (optional, max 500)
- updateProjectSchema: all fields optional

File: src/schemas/tag.schema.ts
- createTagSchema: name (required, 1-50 chars), color (required, hex format #RRGGBB)

Export TypeScript types inferred from each schema using z.infer<>.
```

### Expected Outcomes
- Three schema files created
- All schemas export both schema and inferred type

### Verification
```bash
npm run build
# TypeScript compilation should succeed
```

---

## Step 4: Express App Setup

### Context
Set up the Express application with middleware for JSON parsing, error handling, and API key authentication.

### Prompt
```text
Set up the Express application with proper middleware.

File: src/index.ts
- Create Express app
- Add JSON middleware
- Add a simple health check route: GET /health returns { status: 'ok' }
- Add placeholder route groups: /api/v1/tasks, /api/v1/projects, /api/v1/tags
- Add error handling middleware at the end
- Listen on PORT from env (default 3000)

File: src/middleware/auth.ts
- Create apiKeyAuth middleware
- Check X-API-Key header against API_KEY env variable
- If no API_KEY env is set, skip authentication (development mode)
- Return 401 with error JSON if key doesn't match

File: src/middleware/errorHandler.ts
- Create global error handler middleware
- Handle Zod validation errors (return 400)
- Handle Prisma errors (return appropriate status)
- Handle unknown errors (return 500, log error)
- Always return JSON in format: { error: { code, message, details? } }

File: src/middleware/validate.ts
- Create validate(schema) middleware factory
- Validates req.body against provided Zod schema
- Attaches validated data to req.validatedBody

After setup, test: GET http://localhost:3000/health
```

### Expected Outcomes
- Server starts on port 3000
- /health returns JSON response
- Error handling middleware catches errors

### Verification
```bash
npm run dev
curl http://localhost:3000/health
# Should return: {"status":"ok"}
```

---

## Step 5: Task Service

### Context
Implement the business logic layer for tasks, separate from routes for testability.

### Prompt
```text
Create the Task service with all business logic.

File: src/services/task.service.ts

Implement these functions:

1. createTask(data: CreateTaskInput): Promise<Task>
   - Generate UUID for id
   - Create task with provided data
   - Connect tags if tagIds provided
   - Return created task with tags included

2. getTasks(query: TaskQuery): Promise<{ tasks: Task[], total: number, page: number, limit: number }>
   - Build Prisma where clause from query filters
   - Exclude soft-deleted tasks (deletedAt is null)
   - Include project and tags in response
   - Apply pagination
   - Return paginated results with total count

3. getTaskById(id: string): Promise<Task | null>
   - Find task by ID, include project and tags
   - Return null if not found or soft-deleted

4. updateTask(id: string, data: UpdateTaskInput): Promise<Task>
   - If status changes to COMPLETED, set completedAt
   - If status changes from COMPLETED, clear completedAt
   - Handle tag updates (disconnect old, connect new)
   - Return updated task

5. deleteTask(id: string): Promise<void>
   - Soft delete by setting deletedAt timestamp
   - Throw if task not found

6. restoreTask(id: string): Promise<Task>
   - Clear deletedAt timestamp
   - Throw if task not found

Include proper error classes for NotFoundError.
```

### Expected Outcomes
- Task service with all CRUD operations
- Soft delete implementation
- Tag relationship handling

### Verification
Write a simple test in the next step.

---

## Step 6: Task Routes

### Context
Create the REST routes for tasks, connecting to the task service.

### Prompt
```text
Create Task API routes.

File: src/routes/task.routes.ts

Implement these endpoints:

POST /api/v1/tasks
- Validate body with createTaskSchema
- Call taskService.createTask
- Return 201 with { data: task }

GET /api/v1/tasks
- Validate query with taskQuerySchema  
- Call taskService.getTasks
- Return 200 with { data: tasks, pagination: { page, limit, total, totalPages } }

GET /api/v1/tasks/:id
- Call taskService.getTaskById
- Return 404 if not found
- Return 200 with { data: task }

PATCH /api/v1/tasks/:id
- Validate body with updateTaskSchema
- Call taskService.updateTask
- Return 200 with { data: task }

DELETE /api/v1/tasks/:id
- Call taskService.deleteTask
- Return 204 No Content

POST /api/v1/tasks/:id/restore
- Call taskService.restoreTask
- Return 200 with { data: task }

Register routes in src/index.ts under /api/v1/tasks path.
```

### Expected Outcomes
- All task endpoints working
- Proper status codes
- Validation errors return 400

### Verification
```bash
# Create a task
curl -X POST http://localhost:3000/api/v1/tasks \
  -H "Content-Type: application/json" \
  -d '{"title": "Test task", "priority": "medium"}'

# List tasks
curl http://localhost:3000/api/v1/tasks
```

---

## Step 7: Project & Tag Services and Routes

### Context
Implement the remaining services and routes for projects and tags.

### Prompt
```text
Implement Project and Tag services and routes following the same pattern as Tasks.

File: src/services/project.service.ts
- createProject, getProjects, getProjectById, updateProject, deleteProject
- When deleting a project, set projectId to null on all related tasks

File: src/services/tag.service.ts
- createTag, getTags, deleteTag
- When deleting a tag, remove from all tasks (cascade in junction table)

File: src/routes/project.routes.ts
- POST /api/v1/projects (201)
- GET /api/v1/projects (200)
- GET /api/v1/projects/:id (200 or 404)
- PATCH /api/v1/projects/:id (200)
- DELETE /api/v1/projects/:id (204)

File: src/routes/tag.routes.ts
- POST /api/v1/tags (201)
- GET /api/v1/tags (200)
- DELETE /api/v1/tags/:id (204)

Register all routes in src/index.ts.
```

### Expected Outcomes
- Project and tag CRUD working
- Cascade behaviors correct

### Verification
```bash
# Create project
curl -X POST http://localhost:3000/api/v1/projects \
  -H "Content-Type: application/json" \
  -d '{"name": "Personal"}'

# Create tag
curl -X POST http://localhost:3000/api/v1/tags \
  -H "Content-Type: application/json" \
  -d '{"name": "urgent", "color": "#FF0000"}'
```

---

## Step 8: Tests

### Context
Add comprehensive tests for all services and routes.

### Prompt
```text
Create tests for TaskFlow using Vitest.

File: src/services/__tests__/task.service.test.ts
- Test createTask with valid data
- Test createTask with tags
- Test getTasks with filters
- Test getTasks pagination
- Test updateTask changes completedAt on status change
- Test deleteTask soft deletes
- Test restoreTask restores

File: src/routes/__tests__/task.routes.test.ts
- Test POST /tasks returns 201
- Test POST /tasks with invalid data returns 400
- Test GET /tasks returns paginated list
- Test GET /tasks/:id returns 404 for unknown id
- Test PATCH /tasks/:id updates task
- Test DELETE /tasks/:id returns 204

Create a test setup file that:
- Creates a fresh test database before each test
- Cleans up after tests

Use supertest for route tests.

Add similar test files for projects and tags.
```

### Expected Outcomes
- All tests passing
- Good coverage of happy and error paths

### Verification
```bash
npm test
# All tests should pass
```

---

## Step 9: Documentation & Polish

### Context
Final polish: README, API documentation, and cleanup.

### Prompt
```text
Create documentation and final polish.

File: README.md
- Project description
- Quick start instructions
- Environment variables (PORT, API_KEY, DATABASE_URL)
- API endpoint documentation
- Examples using curl

File: .env.example
- Template for required environment variables

Cleanup:
- Add .gitignore (node_modules, .env, prisma/dev.db)
- Ensure all console.logs removed except startup message
- Add startup message showing port and if auth is enabled

Final verification:
- npm run build (no errors)
- npm test (all pass)
- npm run dev (starts correctly)
```

### Expected Outcomes
- Complete README
- Project ready for use
- Clean build

### Verification
```bash
npm run build && npm test
# Both should succeed
```

---

## Final Integration Checklist

- [ ] All task CRUD operations work
- [ ] All project CRUD operations work  
- [ ] All tag operations work
- [ ] Task filtering by status, priority, project, tags works
- [ ] Pagination works correctly
- [ ] Soft delete and restore work
- [ ] All tests pass
- [ ] Documentation complete
- [ ] Project builds without errors
