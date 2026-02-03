# Implementation Plan: TaskFlow API

**Generated:** 2026-02-03  
**Based On:** spec.md (TaskFlow - Simple Task Management API)  
**Total Steps:** 14  
**Estimated Time:** 4-6 hours

---

## Project Context Summary

### Discovered Conventions

**This is a new project.** Establishing conventions:

**Architecture:**
- Directory: `src/` with subdirs for routes, services, middleware, schemas, lib, errors
- Module organization: By type
- Key abstractions: Services (business logic), Routes (HTTP), Schemas (validation)

**Testing:**
- Framework: Vitest
- Pattern: describe/it with setup/teardown
- Location: `src/**/__tests__/*.test.ts`

**Code Style:**
- TypeScript strict mode
- ES modules
- Named exports
- Zod for runtime validation

### Reference Patterns (to establish)

Service pattern:
```typescript
// src/services/example.service.ts
export class ExampleService {
  async create(data: CreateInput): Promise<Example> { }
  async findById(id: string): Promise<Example | null> { }
}
export const exampleService = new ExampleService();
```

Route pattern:
```typescript
// src/routes/example.routes.ts
import { Router } from 'express';
import { exampleService } from '../services/example.service';
import { validate } from '../middleware/validate';
import { createExampleSchema } from '../schemas/example.schema';

const router = Router();
router.post('/', validate(createExampleSchema), async (req, res, next) => {
  try {
    const result = await exampleService.create(req.body);
    res.status(201).json({ data: result });
  } catch (error) {
    next(error);
  }
});
export default router;
```

---

## Phase Overview

| Phase | Steps | Description | Complexity |
|-------|-------|-------------|------------|
| 1. Foundation | 1.1-1.2 | Project setup, Express app | Low |
| 2. Data Layer | 2.1-2.3 | Prisma schema, validation | Medium |
| 3. Core Logic | 3.1-3.3 | Task, Project, Tag services | High |
| 4. Interface | 4.1-4.3 | REST routes | Medium |
| 5. Integration | 5.1-5.2 | Wiring, documentation | Low |

---

## Phase 1: Foundation

### Step 1.1: Project Initialization

**Context:** Create the project foundation with TypeScript, Express, and all tooling. Everything else builds on this.

**Dependencies:** None

**Instructions:**

1. Create project directory and initialize:
   ```bash
   mkdir taskflow && cd taskflow
   npm init -y
   ```

2. Install dependencies:
   ```bash
   npm install express zod uuid
   npm install @prisma/client
   npm install -D typescript @types/node @types/express
   npm install -D vitest @types/uuid tsx prisma supertest @types/supertest
   ```

3. Create `tsconfig.json`:
   ```json
   {
     "compilerOptions": {
       "target": "ES2022",
       "module": "NodeNext",
       "moduleResolution": "NodeNext",
       "strict": true,
       "esModuleInterop": true,
       "skipLibCheck": true,
       "outDir": "dist",
       "rootDir": "src",
       "declaration": true
     },
     "include": ["src/**/*"],
     "exclude": ["node_modules", "dist"]
   }
   ```

4. Update `package.json`:
   ```json
   {
     "type": "module",
     "scripts": {
       "dev": "tsx watch src/index.ts",
       "build": "tsc",
       "test": "vitest",
       "lint": "tsc --noEmit",
       "db:generate": "prisma generate",
       "db:push": "prisma db push"
     }
   }
   ```

5. Create directory structure:
   ```
   src/
   ├── index.ts
   ├── routes/
   ├── services/
   ├── middleware/
   ├── schemas/
   ├── lib/
   └── errors/
   ```

6. Create `src/index.ts`:
   ```typescript
   console.log('TaskFlow API starting...');
   ```

**Files Created:**
- `package.json`
- `tsconfig.json`
- `src/index.ts`
- Directory structure

**Acceptance Criteria:**
- [ ] `npm run dev` outputs to console
- [ ] `npm run build` completes without errors
- [ ] All directories exist

**Verification:**
```bash
npm run dev   # Should see console output
npm run build # Should complete without errors
```

---

### Step 1.2: Express App Setup

**Context:** Set up Express with middleware for JSON, error handling, and health check. Establishes patterns for all routes.

**Dependencies:** Step 1.1

**Instructions:**

1. Create `src/errors/index.ts`:
   ```typescript
   export class AppError extends Error {
     constructor(
       public statusCode: number,
       public code: string,
       message: string
     ) {
       super(message);
       this.name = 'AppError';
     }
   }

   export class NotFoundError extends AppError {
     constructor(resource: string) {
       super(404, 'NOT_FOUND', `${resource} not found`);
     }
   }

   export class ValidationError extends AppError {
     constructor(public details: Record<string, string>) {
       super(400, 'VALIDATION_ERROR', 'Validation failed');
     }
   }

   export class ConflictError extends AppError {
     constructor(message: string) {
       super(409, 'CONFLICT', message);
     }
   }
   ```

2. Create `src/middleware/errorHandler.ts`:
   ```typescript
   import { Request, Response, NextFunction } from 'express';
   import { ZodError } from 'zod';
   import { AppError } from '../errors/index.js';

   export function errorHandler(
     err: Error,
     req: Request,
     res: Response,
     next: NextFunction
   ) {
     console.error(err);

     if (err instanceof AppError) {
       return res.status(err.statusCode).json({
         error: {
           code: err.code,
           message: err.message,
           ...(err instanceof ValidationError && { details: err.details }),
         },
       });
     }

     if (err instanceof ZodError) {
       return res.status(400).json({
         error: {
           code: 'VALIDATION_ERROR',
           message: 'Validation failed',
           details: err.flatten().fieldErrors,
         },
       });
     }

     return res.status(500).json({
       error: {
         code: 'INTERNAL_ERROR',
         message: 'An unexpected error occurred',
       },
     });
   }
   ```

3. Create `src/middleware/validate.ts`:
   ```typescript
   import { Request, Response, NextFunction } from 'express';
   import { ZodSchema } from 'zod';

   export function validate(schema: ZodSchema) {
     return (req: Request, res: Response, next: NextFunction) => {
       const result = schema.safeParse(req.body);
       if (!result.success) {
         return res.status(400).json({
           error: {
             code: 'VALIDATION_ERROR',
             message: 'Validation failed',
             details: result.error.flatten().fieldErrors,
           },
         });
       }
       req.body = result.data;
       next();
     };
   }
   ```

4. Update `src/index.ts`:
   ```typescript
   import express from 'express';
   import { errorHandler } from './middleware/errorHandler.js';

   const app = express();
   const PORT = process.env.PORT || 3000;

   app.use(express.json());

   // Health check
   app.get('/health', (req, res) => {
     res.json({ status: 'ok', timestamp: new Date().toISOString() });
   });

   // Routes will be added here
   // app.use('/api/v1/tasks', taskRoutes);
   // app.use('/api/v1/projects', projectRoutes);
   // app.use('/api/v1/tags', tagRoutes);

   // Error handler (must be last)
   app.use(errorHandler);

   app.listen(PORT, () => {
     console.log(`TaskFlow API running on port ${PORT}`);
   });

   export { app };
   ```

**Files Created:**
- `src/errors/index.ts`
- `src/middleware/errorHandler.ts`
- `src/middleware/validate.ts`
- Updated `src/index.ts`

**Acceptance Criteria:**
- [ ] Server starts on port 3000
- [ ] GET /health returns JSON
- [ ] Error handler catches and formats errors

**Verification:**
```bash
npm run dev
curl http://localhost:3000/health
# Expected: {"status":"ok","timestamp":"..."}
```

---

### ✓ Checkpoint: Foundation Complete

**Run all verifications:**
```bash
npm run build          # No errors
curl localhost:3000/health  # Returns OK
```

**Git checkpoint:**
```bash
git init
git add -A
git commit -m "Phase 1: Foundation complete"
```

---

## Phase 2: Data Layer

### Step 2.1: Prisma Schema

**Context:** Define database models for Task, Project, Tag. SQLite for simplicity. All future steps depend on these models.

**Dependencies:** Step 1.2

**Instructions:**

1. Initialize Prisma:
   ```bash
   npx prisma init --datasource-provider sqlite
   ```

2. Update `prisma/schema.prisma`:
   ```prisma
   generator client {
     provider = "prisma-client-js"
   }

   datasource db {
     provider = "sqlite"
     url      = env("DATABASE_URL")
   }

   enum TaskStatus {
     PENDING
     IN_PROGRESS
     COMPLETED
   }

   enum TaskPriority {
     LOW
     MEDIUM
     HIGH
     URGENT
   }

   model Task {
     id          String       @id @default(uuid())
     title       String
     description String?
     status      TaskStatus   @default(PENDING)
     priority    TaskPriority @default(MEDIUM)
     dueDate     DateTime?
     completedAt DateTime?
     projectId   String?
     project     Project?     @relation(fields: [projectId], references: [id])
     tags        TaskTag[]
     createdAt   DateTime     @default(now())
     updatedAt   DateTime     @updatedAt
     deletedAt   DateTime?
   }

   model Project {
     id          String   @id @default(uuid())
     name        String
     description String?
     tasks       Task[]
     createdAt   DateTime @default(now())
     updatedAt   DateTime @updatedAt
   }

   model Tag {
     id        String    @id @default(uuid())
     name      String    @unique
     color     String
     tasks     TaskTag[]
     createdAt DateTime  @default(now())
   }

   model TaskTag {
     taskId String
     tagId  String
     task   Task   @relation(fields: [taskId], references: [id], onDelete: Cascade)
     tag    Tag    @relation(fields: [tagId], references: [id], onDelete: Cascade)

     @@id([taskId, tagId])
   }
   ```

3. Create `src/lib/prisma.ts`:
   ```typescript
   import { PrismaClient } from '@prisma/client';

   export const prisma = new PrismaClient();
   ```

4. Run migrations:
   ```bash
   npm run db:push
   npm run db:generate
   ```

**Files Created:**
- `prisma/schema.prisma`
- `src/lib/prisma.ts`
- `prisma/dev.db` (generated)

**Acceptance Criteria:**
- [ ] Database schema created
- [ ] Prisma client generated
- [ ] Can import PrismaClient

**Verification:**
```bash
npm run db:push       # Should complete
npx prisma studio     # Should show tables (exit after checking)
npm run build         # Should compile
```

---

### Step 2.2: Validation Schemas

**Context:** Create Zod schemas for input validation. Used by routes to validate requests before calling services.

**Dependencies:** Step 2.1 (needs to match Prisma enums)

**Instructions:**

1. Create `src/schemas/task.schema.ts`:
   ```typescript
   import { z } from 'zod';

   export const taskStatusEnum = z.enum(['PENDING', 'IN_PROGRESS', 'COMPLETED']);
   export const taskPriorityEnum = z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']);

   export const createTaskSchema = z.object({
     title: z.string().min(1).max(200),
     description: z.string().max(2000).optional(),
     dueDate: z.string().datetime().optional(),
     priority: taskPriorityEnum.default('MEDIUM'),
     projectId: z.string().uuid().optional(),
     tagIds: z.array(z.string().uuid()).optional(),
   });

   export const updateTaskSchema = z.object({
     title: z.string().min(1).max(200).optional(),
     description: z.string().max(2000).nullable().optional(),
     dueDate: z.string().datetime().nullable().optional(),
     status: taskStatusEnum.optional(),
     priority: taskPriorityEnum.optional(),
     projectId: z.string().uuid().nullable().optional(),
     tagIds: z.array(z.string().uuid()).optional(),
   });

   export const taskQuerySchema = z.object({
     status: taskStatusEnum.optional(),
     priority: taskPriorityEnum.optional(),
     projectId: z.string().uuid().optional(),
     tagIds: z.string().optional(), // comma-separated
     dueBefore: z.string().datetime().optional(),
     dueAfter: z.string().datetime().optional(),
     page: z.coerce.number().int().positive().default(1),
     limit: z.coerce.number().int().positive().max(100).default(20),
   });

   export type CreateTaskInput = z.infer<typeof createTaskSchema>;
   export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
   export type TaskQuery = z.infer<typeof taskQuerySchema>;
   ```

2. Create `src/schemas/project.schema.ts`:
   ```typescript
   import { z } from 'zod';

   export const createProjectSchema = z.object({
     name: z.string().min(1).max(100),
     description: z.string().max(500).optional(),
   });

   export const updateProjectSchema = z.object({
     name: z.string().min(1).max(100).optional(),
     description: z.string().max(500).nullable().optional(),
   });

   export type CreateProjectInput = z.infer<typeof createProjectSchema>;
   export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;
   ```

3. Create `src/schemas/tag.schema.ts`:
   ```typescript
   import { z } from 'zod';

   const hexColorRegex = /^#[0-9A-Fa-f]{6}$/;

   export const createTagSchema = z.object({
     name: z.string().min(1).max(50),
     color: z.string().regex(hexColorRegex, 'Must be hex color (#RRGGBB)'),
   });

   export type CreateTagInput = z.infer<typeof createTagSchema>;
   ```

**Files Created:**
- `src/schemas/task.schema.ts`
- `src/schemas/project.schema.ts`
- `src/schemas/tag.schema.ts`

**Acceptance Criteria:**
- [ ] All schemas export validation + types
- [ ] TypeScript compiles without errors

**Verification:**
```bash
npm run build  # Should compile
```

---

### ✓ Checkpoint: Data Layer Complete

```bash
npm run build
npm run db:push
```

```bash
git add -A
git commit -m "Phase 2: Data layer complete"
```

---

## Phase 3: Core Logic

### Step 3.1: Task Service

**Context:** Core business logic for tasks. Routes will call these methods. Includes soft delete logic.

**Dependencies:** Steps 2.1, 2.2

**Instructions:**

1. Create `src/services/task.service.ts`:
   ```typescript
   import { prisma } from '../lib/prisma.js';
   import { CreateTaskInput, UpdateTaskInput, TaskQuery } from '../schemas/task.schema.js';
   import { NotFoundError } from '../errors/index.js';

   export class TaskService {
     async create(data: CreateTaskInput) {
       const { tagIds, dueDate, ...rest } = data;
       
       return prisma.task.create({
         data: {
           ...rest,
           dueDate: dueDate ? new Date(dueDate) : null,
           tags: tagIds ? {
             create: tagIds.map(tagId => ({ tagId })),
           } : undefined,
         },
         include: { project: true, tags: { include: { tag: true } } },
       });
     }

     async findAll(query: TaskQuery) {
       const { page, limit, tagIds: tagIdsString, dueBefore, dueAfter, ...filters } = query;
       const tagIds = tagIdsString?.split(',').filter(Boolean);

       const where = {
         deletedAt: null,
         ...filters,
         ...(tagIds?.length && {
           tags: { some: { tagId: { in: tagIds } } },
         }),
         ...(dueBefore && { dueDate: { lte: new Date(dueBefore) } }),
         ...(dueAfter && { dueDate: { gte: new Date(dueAfter) } }),
       };

       const [tasks, total] = await Promise.all([
         prisma.task.findMany({
           where,
           include: { project: true, tags: { include: { tag: true } } },
           skip: (page - 1) * limit,
           take: limit,
           orderBy: { createdAt: 'desc' },
         }),
         prisma.task.count({ where }),
       ]);

       return { tasks, total, page, limit };
     }

     async findById(id: string) {
       const task = await prisma.task.findFirst({
         where: { id, deletedAt: null },
         include: { project: true, tags: { include: { tag: true } } },
       });
       return task;
     }

     async update(id: string, data: UpdateTaskInput) {
       const existing = await this.findById(id);
       if (!existing) throw new NotFoundError('Task');

       const { tagIds, dueDate, ...rest } = data;
       
       // Handle completedAt based on status change
       let completedAt = existing.completedAt;
       if (data.status === 'COMPLETED' && existing.status !== 'COMPLETED') {
         completedAt = new Date();
       } else if (data.status && data.status !== 'COMPLETED') {
         completedAt = null;
       }

       return prisma.task.update({
         where: { id },
         data: {
           ...rest,
           completedAt,
           dueDate: dueDate === null ? null : dueDate ? new Date(dueDate) : undefined,
           tags: tagIds ? {
             deleteMany: {},
             create: tagIds.map(tagId => ({ tagId })),
           } : undefined,
         },
         include: { project: true, tags: { include: { tag: true } } },
       });
     }

     async delete(id: string) {
       const existing = await this.findById(id);
       if (!existing) throw new NotFoundError('Task');

       await prisma.task.update({
         where: { id },
         data: { deletedAt: new Date() },
       });
     }

     async restore(id: string) {
       const task = await prisma.task.findUnique({ where: { id } });
       if (!task) throw new NotFoundError('Task');

       return prisma.task.update({
         where: { id },
         data: { deletedAt: null },
         include: { project: true, tags: { include: { tag: true } } },
       });
     }
   }

   export const taskService = new TaskService();
   ```

2. Create `src/services/__tests__/task.service.test.ts`:
   ```typescript
   import { describe, it, expect, beforeEach } from 'vitest';
   import { taskService } from '../task.service.js';
   import { prisma } from '../../lib/prisma.js';

   describe('TaskService', () => {
     beforeEach(async () => {
       await prisma.taskTag.deleteMany();
       await prisma.task.deleteMany();
       await prisma.project.deleteMany();
       await prisma.tag.deleteMany();
     });

     describe('create', () => {
       it('creates task with required fields', async () => {
         const task = await taskService.create({ title: 'Test task' });
         expect(task.id).toBeDefined();
         expect(task.title).toBe('Test task');
         expect(task.status).toBe('PENDING');
       });

       it('creates task with tags', async () => {
         const tag = await prisma.tag.create({ 
           data: { name: 'urgent', color: '#FF0000' } 
         });
         const task = await taskService.create({ 
           title: 'Tagged task', 
           tagIds: [tag.id] 
         });
         expect(task.tags).toHaveLength(1);
       });
     });

     describe('findAll', () => {
       it('excludes soft-deleted tasks', async () => {
         await prisma.task.create({ 
           data: { title: 'Active' } 
         });
         await prisma.task.create({ 
           data: { title: 'Deleted', deletedAt: new Date() } 
         });
         
         const { tasks } = await taskService.findAll({ page: 1, limit: 10 });
         expect(tasks).toHaveLength(1);
         expect(tasks[0].title).toBe('Active');
       });

       it('filters by status', async () => {
         await prisma.task.create({ data: { title: 'Pending', status: 'PENDING' } });
         await prisma.task.create({ data: { title: 'Done', status: 'COMPLETED' } });
         
         const { tasks } = await taskService.findAll({ 
           status: 'COMPLETED', 
           page: 1, 
           limit: 10 
         });
         expect(tasks).toHaveLength(1);
         expect(tasks[0].title).toBe('Done');
       });
     });

     describe('update', () => {
       it('sets completedAt when status changes to COMPLETED', async () => {
         const task = await prisma.task.create({ data: { title: 'Test' } });
         const updated = await taskService.update(task.id, { status: 'COMPLETED' });
         expect(updated.completedAt).not.toBeNull();
       });

       it('clears completedAt when status changes from COMPLETED', async () => {
         const task = await prisma.task.create({ 
           data: { title: 'Test', status: 'COMPLETED', completedAt: new Date() } 
         });
         const updated = await taskService.update(task.id, { status: 'PENDING' });
         expect(updated.completedAt).toBeNull();
       });
     });

     describe('delete', () => {
       it('soft deletes task', async () => {
         const task = await prisma.task.create({ data: { title: 'Test' } });
         await taskService.delete(task.id);
         
         const found = await taskService.findById(task.id);
         expect(found).toBeNull();
         
         const raw = await prisma.task.findUnique({ where: { id: task.id } });
         expect(raw?.deletedAt).not.toBeNull();
       });
     });

     describe('restore', () => {
       it('restores soft-deleted task', async () => {
         const task = await prisma.task.create({ 
           data: { title: 'Test', deletedAt: new Date() } 
         });
         const restored = await taskService.restore(task.id);
         expect(restored.deletedAt).toBeNull();
       });
     });
   });
   ```

**Files Created:**
- `src/services/task.service.ts`
- `src/services/__tests__/task.service.test.ts`

**Acceptance Criteria:**
- [ ] TaskService class with all CRUD methods
- [ ] Soft delete implementation
- [ ] All 7 test cases pass

**Verification:**
```bash
npm test -- src/services/__tests__/task.service.test.ts
```

---

### Step 3.2: Project Service

[Similar detailed structure for ProjectService...]

### Step 3.3: Tag Service

[Similar detailed structure for TagService...]

---

### ✓ Checkpoint: Core Logic Complete

```bash
npm test              # All service tests pass
npm run build         # Compiles
```

```bash
git add -A
git commit -m "Phase 3: Core logic complete"
```

---

## Phase 4: Interface

### Step 4.1: Task Routes

[Detailed route implementation...]

### Step 4.2: Project Routes

[Detailed route implementation...]

### Step 4.3: Tag Routes

[Detailed route implementation...]

---

### ✓ Checkpoint: Interface Complete

```bash
npm test              # All tests pass
npm run dev           # Start server
# Test with curl commands
```

---

## Phase 5: Integration

### Step 5.1: Wire Everything Together

**Context:** Register all routes in the app, ensure middleware is correct, add startup logging.

### Step 5.2: Documentation

**Context:** Create README with setup instructions, API documentation, examples.

---

## Final Verification Checklist

### Functional Requirements

| Requirement | Step | Verified |
|-------------|------|----------|
| Create task with title, desc, due date, priority | 3.1, 4.1 | `npm test` |
| Update any task field | 3.1, 4.1 | `npm test` |
| Soft delete with restore | 3.1, 4.1 | `npm test` |
| Projects CRUD | 3.2, 4.2 | `npm test` |
| Tags CRUD | 3.3, 4.3 | `npm test` |
| Filtering and pagination | 3.1, 4.1 | `npm test` |

### Success Criteria from Spec

- [ ] All CRUD operations for tasks, projects, tags
- [ ] Filtering and pagination working
- [ ] All tests passing
- [ ] Can be started with single command
- [ ] API documented in README

---

## Git Tags for Rollback

```bash
git tag phase-1-complete  # After Step 1.2
git tag phase-2-complete  # After Step 2.2
git tag phase-3-complete  # After Step 3.3
git tag phase-4-complete  # After Step 4.3
git tag v1.0.0           # After Step 5.2
```
