# [Project Name]

## Overview

[1-2 paragraph description of what this project does and why it exists]

## Problem Statement

### The Problem
[Describe the problem being solved]

### Who Has This Problem
[Target users/audience]

### Current Solutions (if any)
[How is this problem currently being solved? What are the limitations?]

## Goals

### Primary Goals
1. [Main objective]
2. [Secondary objective]

### Non-Goals (Explicitly Out of Scope)
- [What this project will NOT do]
- [Feature explicitly deferred to future]

## Functional Requirements

### Core Features

#### Feature 1: [Name]
**Description**: [What it does]
**Priority**: Must Have / Should Have / Nice to Have
**User Story**: As a [user], I want [action] so that [benefit]

**Acceptance Criteria**:
- [ ] [Criterion 1]
- [ ] [Criterion 2]
- [ ] [Criterion 3]

**Technical Notes**: [Any implementation specifics]

#### Feature 2: [Name]
[Same structure...]

### User Flows

#### Flow 1: [Name]
1. User does [action]
2. System responds with [response]
3. User sees [outcome]

```
[ASCII diagram or description of the flow]
```

## Non-Functional Requirements

### Performance
- Page load time: [target]
- API response time: [target]
- Concurrent users: [target]

### Security
- Authentication: [requirements]
- Authorization: [requirements]
- Data encryption: [requirements]

### Scalability
- Expected load: [metrics]
- Growth projections: [expectations]

### Reliability
- Uptime target: [percentage]
- Recovery time: [target]

### Accessibility
- Standards: [WCAG level]
- Requirements: [specific needs]

## Technical Architecture

### Tech Stack

| Component | Technology | Rationale |
|-----------|------------|-----------|
| Language | [choice] | [why] |
| Framework | [choice] | [why] |
| Database | [choice] | [why] |
| Cache | [choice] | [why] |
| Hosting | [choice] | [why] |

### System Architecture

```
[ASCII architecture diagram]

┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Client    │────▶│   Server    │────▶│  Database   │
└─────────────┘     └─────────────┘     └─────────────┘
```

### Data Models

#### Entity: [Name]
```typescript
interface EntityName {
  id: string;
  field1: string;
  field2: number;
  createdAt: Date;
  updatedAt: Date;
}
```

**Relationships**:
- Has many [OtherEntity]
- Belongs to [ParentEntity]

#### Entity: [Name]
[Same structure...]

### Database Schema

```sql
CREATE TABLE entity_name (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  field1 VARCHAR(255) NOT NULL,
  field2 INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

## API Design

### Base URL
`https://api.example.com/v1`

### Authentication
[Authentication method and flow]

### Endpoints

#### `POST /resource`
Create a new resource.

**Request Body**:
```json
{
  "field1": "value",
  "field2": 123
}
```

**Response (201 Created)**:
```json
{
  "id": "abc-123",
  "field1": "value",
  "field2": 123,
  "createdAt": "2024-01-15T10:00:00Z"
}
```

**Error Responses**:
- `400 Bad Request`: Invalid input
- `401 Unauthorized`: Missing or invalid authentication
- `409 Conflict`: Resource already exists

#### `GET /resource/:id`
[Same structure...]

### Error Response Format
```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable message",
    "details": {}
  }
}
```

## Error Handling Strategy

| Scenario | Response | User Message |
|----------|----------|--------------|
| Invalid input | 400 | "Please check your input" |
| Not found | 404 | "Resource not found" |
| Server error | 500 | "Something went wrong" |

### Retry Strategy
- [When to retry]
- [Backoff strategy]

### Logging
- [What to log]
- [Log format]

## Security Considerations

### Authentication
- Method: [JWT / Session / OAuth]
- Token expiry: [duration]
- Refresh strategy: [approach]

### Authorization
- Model: [RBAC / ABAC / etc]
- Roles: [list of roles]
- Permissions: [mapping]

### Data Protection
- Encryption at rest: [yes/no, method]
- Encryption in transit: [TLS version]
- Sensitive data handling: [approach]

### Input Validation
- [Validation approach]
- [Sanitization approach]

## Testing Strategy

### Unit Tests
- Coverage target: [percentage]
- Framework: [choice]
- Focus areas: [business logic, utilities, etc.]

### Integration Tests
- Focus: [API endpoints, database operations]
- Approach: [real DB vs mocks]

### End-to-End Tests
- Framework: [choice]
- Critical paths:
  - [ ] [Path 1]
  - [ ] [Path 2]

### Performance Tests
- Tool: [choice]
- Scenarios: [list]

## Deployment

### Environments
| Environment | Purpose | URL |
|------------|---------|-----|
| Development | Local development | localhost |
| Staging | Pre-production testing | staging.example.com |
| Production | Live environment | example.com |

### CI/CD Pipeline
1. [Step 1]
2. [Step 2]
3. [Step 3]

### Rollback Strategy
[How to rollback if deployment fails]

## Success Criteria

### Launch Criteria
- [ ] All core features implemented
- [ ] All tests passing
- [ ] Security review complete
- [ ] Performance targets met
- [ ] Documentation complete

### Success Metrics (Post-Launch)
- [ ] [Metric 1]: [target]
- [ ] [Metric 2]: [target]

## Timeline

| Phase | Duration | Deliverables |
|-------|----------|--------------|
| Phase 1: Foundation | [X weeks] | [deliverables] |
| Phase 2: Core Features | [X weeks] | [deliverables] |
| Phase 3: Polish | [X weeks] | [deliverables] |

## Open Questions

- [ ] [Question 1]: [context]
- [ ] [Question 2]: [context]

## Future Considerations

### Phase 2 Features
- [Feature idea]
- [Feature idea]

### Technical Debt to Address
- [Item]

## Appendix

### Glossary
- **Term**: Definition

### References
- [Link to relevant documentation]
- [Link to design files]

### Change Log
| Date | Change | Author |
|------|--------|--------|
| YYYY-MM-DD | Initial draft | [Name] |
