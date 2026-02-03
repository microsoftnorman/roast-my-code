# TaskFlow - Simple Task Management API

## Overview

TaskFlow is a RESTful API for managing personal tasks and to-do lists. It provides a simple, clean interface for creating, organizing, and tracking tasks with support for due dates, priorities, and tags.

## Problem Statement

### The Problem
Developers need a lightweight, self-hosted task management API for building custom productivity tools without vendor lock-in or complex setup.

### Who Has This Problem
- Developers building custom productivity apps
- Teams wanting a simple task API for internal tools
- Hobbyists building personal organization systems

### Current Solutions
Existing solutions like Todoist or Notion APIs require accounts, have rate limits, and may not allow self-hosting.

## Goals

### Primary Goals
1. Provide a simple REST API for CRUD operations on tasks
2. Support task organization via projects and tags
3. Enable self-hosted deployment with minimal configuration

### Non-Goals
- User collaboration features
- Real-time sync
- Mobile applications
- Rich text in task descriptions

## Functional Requirements

### Core Features

#### Feature 1: Task Management
**Description**: Create, read, update, and delete tasks
**Priority**: Must Have

**Acceptance Criteria**:
- [ ] Create task with title (required), description (optional), due date (optional)
- [ ] Update any task field
- [ ] Delete tasks (soft delete with restore capability)
- [ ] List tasks with filtering and pagination

#### Feature 2: Projects
**Description**: Organize tasks into projects
**Priority**: Must Have

**Acceptance Criteria**:
- [ ] Create projects with name and optional description
- [ ] Assign tasks to projects
- [ ] List tasks by project
- [ ] Delete projects (moves tasks to "Inbox")

#### Feature 3: Tags
**Description**: Label tasks with tags for cross-project organization
**Priority**: Should Have

**Acceptance Criteria**:
- [ ] Create tags with name and color
- [ ] Assign multiple tags to tasks
- [ ] Filter tasks by tags

#### Feature 4: Task Status & Priority
**Description**: Track task progress and importance
**Priority**: Must Have

**Acceptance Criteria**:
- [ ] Status: pending, in_progress, completed
- [ ] Priority: low, medium, high, urgent
- [ ] Track completed_at timestamp

## Non-Functional Requirements

### Performance
- API response time: < 100ms at p95
- Support 100 concurrent requests

### Security
- API key authentication
- Input validation on all endpoints
- SQL injection prevention

## Technical Architecture

### Tech Stack

| Component | Technology | Rationale |
|-----------|------------|-----------|
| Language | TypeScript | Type safety, good tooling |
| Runtime | Node.js 20+ | Wide support, fast startup |
| Framework | Express.js | Simple, well-documented |
| Database | SQLite | Zero-config, file-based |
| ORM | Prisma | Type-safe queries |
| Validation | Zod | Runtime type checking |
| Testing | Vitest | Fast, TypeScript-native |

### Data Models

#### Task
```typescript
interface Task {
  id: string;
  title: string;
  description: string | null;
  status: 'pending' | 'in_progress' | 'completed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  dueDate: Date | null;
  completedAt: Date | null;
  projectId: string | null;
  tags: Tag[];
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}
```

#### Project
```typescript
interface Project {
  id: string;
  name: string;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
}
```

#### Tag
```typescript
interface Tag {
  id: string;
  name: string;
  color: string; // hex color
  createdAt: Date;
}
```

## API Design

### Base URL
`http://localhost:3000/api/v1`

### Authentication
API key passed in `X-API-Key` header.

### Endpoints

#### Tasks

##### `POST /tasks`
Create a new task.

**Request**:
```json
{
  "title": "Buy groceries",
  "description": "Milk, bread, eggs",
  "dueDate": "2024-01-20T00:00:00Z",
  "priority": "medium",
  "projectId": "project-123",
  "tagIds": ["tag-1", "tag-2"]
}
```

**Response (201)**:
```json
{
  "data": {
    "id": "task-abc",
    "title": "Buy groceries",
    "description": "Milk, bread, eggs",
    "status": "pending",
    "priority": "medium",
    "dueDate": "2024-01-20T00:00:00Z",
    "completedAt": null,
    "projectId": "project-123",
    "tags": [
      {"id": "tag-1", "name": "Shopping", "color": "#FF5733"}
    ],
    "createdAt": "2024-01-15T10:00:00Z",
    "updatedAt": "2024-01-15T10:00:00Z"
  }
}
```

##### `GET /tasks`
List tasks with optional filters.

**Query Parameters**:
- `status`: Filter by status
- `priority`: Filter by priority
- `projectId`: Filter by project
- `tagIds`: Comma-separated tag IDs
- `dueBefore`: ISO date
- `dueAfter`: ISO date
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 20, max: 100)

##### `GET /tasks/:id`
Get a single task.

##### `PATCH /tasks/:id`
Update a task.

##### `DELETE /tasks/:id`
Soft delete a task.

##### `POST /tasks/:id/restore`
Restore a soft-deleted task.

#### Projects

##### `POST /projects`
##### `GET /projects`
##### `GET /projects/:id`
##### `PATCH /projects/:id`
##### `DELETE /projects/:id`

#### Tags

##### `POST /tags`
##### `GET /tags`
##### `DELETE /tags/:id`

### Error Response Format
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input",
    "details": {
      "title": "Title is required"
    }
  }
}
```

## Testing Strategy

### Unit Tests
- Validation schemas
- Business logic functions
- Coverage target: 80%

### Integration Tests
- All API endpoints
- Database operations
- Error scenarios

### Test Scenarios
- [ ] Create task with all fields
- [ ] Create task with minimum fields
- [ ] Update task status to completed sets completedAt
- [ ] Delete project moves tasks to null projectId
- [ ] Filter tasks by multiple criteria

## Success Criteria

- [ ] All CRUD operations for tasks, projects, tags
- [ ] Filtering and pagination working
- [ ] All tests passing
- [ ] Can be started with single command
- [ ] API documented in README

## Open Questions

- [ ] Should we support recurring tasks in v1?
- [ ] Max number of tags per task?

## Future Considerations

- User accounts and multi-tenancy
- Recurring tasks
- Task dependencies
- Webhook notifications
