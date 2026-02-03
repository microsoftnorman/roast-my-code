---
name: spec-driven-development
description: Expert guide for creating comprehensive project specifications optimized for AI-assisted development with Opus 4.5. Use this when asked to create specs, plan projects, write PRDs, or prepare requirements for AI coding agents.
license: MIT
---

# Spec-Driven Development for AI Agents

This skill teaches how to write comprehensive, developer-ready specifications that maximize the effectiveness of AI coding agents like Claude Opus 4.5.

## When to Use This Skill

- Creating specifications for new projects (greenfield)
- Writing PRDs (Product Requirements Documents)
- Planning features before implementation
- Preparing context for AI-assisted development
- Breaking down complex projects into executable prompts
- Creating technical design documents

## Why Spec-Driven Development Matters

AI coding agents work best when given:
1. **Clear context**: What problem are we solving?
2. **Explicit requirements**: What must the solution do?
3. **Defined constraints**: What are the boundaries?
4. **Success criteria**: How do we know when we're done?
5. **Incremental steps**: What's the implementation order?

Without a spec, AI agents make assumptions. With a great spec, they build exactly what you need.

## The Three-Phase Workflow

### Phase 1: Idea Honing → `spec.md`
### Phase 2: Planning → `prompt_plan.md` + `todo.md`
### Phase 3: Execution → Iterative implementation

---

## Phase 1: Idea Honing

Transform a vague idea into a comprehensive specification.

### The Brainstorming Prompt

Use this prompt with a conversational LLM to develop your idea:

```
Ask me one question at a time so we can develop a thorough, step-by-step spec 
for this idea. Each question should build on my previous answers, and our end 
goal is to have a detailed specification I can hand off to a developer. 
Let's do this iteratively and dig into every relevant detail. 
Remember, only one question at a time.

Here's the idea:

<IDEA>
[Your idea here]
</IDEA>
```

### The Compilation Prompt

After brainstorming reaches a natural conclusion (typically 10-20 questions):

```
Now that we've wrapped up the brainstorming process, compile our findings into 
a comprehensive, developer-ready specification. Include all relevant:
- Requirements (functional and non-functional)
- Architecture choices
- Data models and handling details
- Error handling strategies
- Security considerations
- Testing plan
- Success criteria

Format it so a developer can immediately begin implementation.
```

### Spec Document Structure

Save the output as `spec.md` with these sections:

```markdown
# Project Name

## Overview
[1-2 paragraph summary of the project]

## Problem Statement
[What problem does this solve? Who has this problem?]

## Goals
- Primary goal
- Secondary goals
- Non-goals (explicitly out of scope)

## Functional Requirements
### Core Features
1. [Feature 1]: [Description]
2. [Feature 2]: [Description]

### User Stories
- As a [user type], I want [action] so that [benefit]

## Non-Functional Requirements
- Performance: [specific metrics]
- Security: [requirements]
- Scalability: [expectations]
- Accessibility: [standards]

## Technical Architecture
### Tech Stack
- Language: [choice and rationale]
- Framework: [choice and rationale]
- Database: [choice and rationale]
- Infrastructure: [choice and rationale]

### System Design
[Architecture diagram or description]

### Data Models
[Key entities and relationships]

## API Design (if applicable)
### Endpoints
- `POST /api/resource`: [description]
- `GET /api/resource/:id`: [description]

## Error Handling
- [Error scenario]: [Handling strategy]

## Security Considerations
- Authentication: [approach]
- Authorization: [approach]
- Data protection: [approach]

## Testing Strategy
- Unit tests: [coverage targets]
- Integration tests: [key scenarios]
- E2E tests: [critical paths]

## Success Criteria
- [ ] [Measurable outcome 1]
- [ ] [Measurable outcome 2]

## Open Questions
- [Question that needs resolution]

## Future Considerations
- [Potential future enhancement]
```

---

## Phase 2: Planning

Transform the spec into an executable prompt plan.

### The Planning Prompt (Test-Driven)

```
Draft a detailed, step-by-step blueprint for building this project. Then, once 
you have a solid plan, break it down into small, iterative chunks that build 
on each other. Look at these chunks and then go another round to break it into 
small steps. Review the results and make sure that the steps are small enough 
to be implemented safely with strong testing, but big enough to move the 
project forward. Iterate until you feel that the steps are right sized for 
this project.

From here you should have the foundation to provide a series of prompts for a 
code-generation LLM that will implement each step in a test-driven manner. 
Prioritize best practices, incremental progress, and early testing, ensuring 
no big jumps in complexity at any stage. Make sure that each prompt builds on 
the previous prompts, and ends with wiring things together. There should be no 
hanging or orphaned code that isn't integrated into a previous step.

Make sure and separate each prompt section. Use markdown. Each prompt should 
be tagged as text using code tags. The goal is to output prompts, but context, 
etc is important as well.

<SPEC>
[Paste your spec.md here]
</SPEC>
```

### The Planning Prompt (Non-TDD)

```
Draft a detailed, step-by-step blueprint for building this project. Then, once 
you have a solid plan, break it down into small, iterative chunks that build 
on each other. Look at these chunks and then go another round to break it into 
small steps. Review the results and make sure that the steps are small enough 
to be implemented safely, but big enough to move the project forward. Iterate 
until you feel that the steps are right sized for this project.

From here you should have the foundation to provide a series of prompts for a 
code-generation LLM that will implement each step. Prioritize best practices 
and incremental progress, ensuring no big jumps in complexity at any stage. 
Make sure that each prompt builds on the previous prompts, and ends with 
wiring things together. There should be no hanging or orphaned code that 
isn't integrated into a previous step.

Make sure and separate each prompt section. Use markdown. Each prompt should 
be tagged as text using code tags. The goal is to output prompts, but context, 
etc is important as well.

<SPEC>
[Paste your spec.md here]
</SPEC>
```

### Prompt Plan Structure

Save as `prompt_plan.md`:

```markdown
# Project Implementation Plan

## Overview
[Summary of what this plan accomplishes]

## Prerequisites
- [ ] Development environment set up
- [ ] Required accounts/APIs configured
- [ ] Dependencies identified

---

## Step 1: [Foundation/Setup]

### Context
[Why this step comes first, what it enables]

### Prompt
```text
[The actual prompt to give the AI agent]
```

### Expected Outcomes
- [File created / feature implemented]
- [Tests passing]

### Verification
[How to verify this step succeeded]

---

## Step 2: [Core Data Layer]

### Context
[Building on Step 1...]

### Prompt
```text
[The prompt]
```

### Expected Outcomes
- [Outcomes]

### Verification
[Verification steps]

---

[Continue for all steps...]

---

## Final Integration

### Context
[Bringing everything together]

### Prompt
```text
[Integration prompt]
```

### Verification
- [ ] All tests pass
- [ ] Application runs end-to-end
- [ ] Success criteria from spec met
```

### Generate the Checklist

After getting the prompt plan:

```
Create a todo.md checklist based on this implementation plan. 
Include:
- Setup tasks
- Implementation tasks (one per prompt)
- Verification checkpoints
- Integration tasks
- Final review items

Format as markdown checkboxes that can be checked off as progress is made.
```

Save as `todo.md`:

```markdown
# Implementation Checklist

## Setup
- [ ] Initialize repository
- [ ] Set up development environment
- [ ] Configure CI/CD (if applicable)

## Implementation
- [ ] Step 1: [Description]
- [ ] Step 2: [Description]
- [ ] Step 3: [Description]

## Verification
- [ ] All unit tests passing
- [ ] Integration tests passing
- [ ] Manual testing complete

## Documentation
- [ ] README updated
- [ ] API documentation (if applicable)
- [ ] Deployment instructions

## Final Review
- [ ] Code review complete
- [ ] Performance acceptable
- [ ] Security review (if applicable)
- [ ] Success criteria met
```

---

## Phase 3: Execution

Execute prompts systematically with your AI coding agent.

### Execution Workflow

1. **Initialize project**: Set up boilerplate, tooling, and initial structure
2. **Execute prompts sequentially**: One prompt at a time from `prompt_plan.md`
3. **Verify each step**: Run tests, check functionality before proceeding
4. **Update checklist**: Mark items complete in `todo.md`
5. **Handle issues**: When stuck, provide full context to debug

### When Things Go Wrong

If a step fails:

1. **Provide context**: Share the full error message
2. **Share relevant code**: Use a tool like `repomix` to bundle relevant files
3. **Be specific**: "Tests fail with X error" not "it doesn't work"
4. **Iterate**: Let the agent debug before moving forward

### Context Management for Large Projects

When context becomes too large:

```
Here is the current state of the project:

<CODEBASE>
[Relevant source files]
</CODEBASE>

<CURRENT_TASK>
[The specific task from prompt_plan.md]
</CURRENT_TASK>

<ERROR_IF_ANY>
[Any errors encountered]
</ERROR_IF_ANY>
```

---

## Writing Specs Optimized for Opus 4.5

### Be Explicit, Not Implicit

**Good:**
```markdown
Create a REST API endpoint `POST /api/users` that:
- Accepts JSON body with email (required, valid email format) and name (required, 2-100 chars)
- Returns 201 with created user object on success
- Returns 400 with validation errors if input invalid
- Returns 409 if email already exists
```

**Bad:**
```markdown
Create a user registration endpoint
```

### Use Structured Formats

Opus 4.5 excels at following structured instructions. Use:
- **Numbered lists** for sequential steps
- **Bullet points** for requirements
- **Tables** for comparisons or mappings
- **Code blocks** for examples
- **XML tags** for clear section boundaries

### Include Examples

```markdown
## Example Request
```json
{
  "email": "user@example.com",
  "name": "John Doe"
}
```

## Example Response (Success)
```json
{
  "id": "123",
  "email": "user@example.com",
  "name": "John Doe",
  "createdAt": "2024-01-15T10:30:00Z"
}
```

## Example Response (Validation Error)
```json
{
  "error": "Validation failed",
  "details": {
    "email": "Invalid email format"
  }
}
```
```

### Define Boundaries

Explicitly state what's in and out of scope:

```markdown
## In Scope
- User authentication via email/password
- Session management with JWT
- Password reset flow

## Out of Scope (for this phase)
- OAuth/social login
- Two-factor authentication
- Admin user management
```

### Specify Technology Choices

Don't let the AI choose when you have preferences:

```markdown
## Technology Decisions
- **Language**: TypeScript (strict mode)
- **Runtime**: Node.js 20+
- **Framework**: Express.js
- **Database**: PostgreSQL with Prisma ORM
- **Testing**: Vitest for unit tests, Supertest for API tests
- **Validation**: Zod schemas
```

---

## Quality Checklist for Specs

Before finalizing a spec, verify:

### Completeness
- [ ] Problem statement is clear
- [ ] All features are described
- [ ] Success criteria are measurable
- [ ] Edge cases are identified

### Clarity
- [ ] No ambiguous requirements
- [ ] Technical terms are defined
- [ ] Examples are provided
- [ ] Scope boundaries are explicit

### Implementability
- [ ] Steps are appropriately sized
- [ ] Dependencies are identified
- [ ] Technology choices are specified
- [ ] Testing strategy is defined

### Context
- [ ] Spec can stand alone
- [ ] Assumptions are stated
- [ ] Constraints are documented
- [ ] Open questions are listed

---

## Anti-Patterns to Avoid

❌ **Vague requirements**: "Make it fast" → "Response time under 200ms at p95"

❌ **Missing context**: Assuming the AI knows your codebase → Provide relevant existing code

❌ **Giant leaps**: "Build the entire authentication system" → Break into login, registration, password reset, etc.

❌ **No verification**: Finishing steps without testing → Verify each step before proceeding

❌ **Orphaned code**: Creating utilities that aren't integrated → Each step should connect to previous work

❌ **Implicit standards**: Assuming code style → Specify linting rules, naming conventions

---

## Templates

### Quick Spec Template

```markdown
# [Project Name]

## What
[One sentence description]

## Why
[Problem being solved]

## Requirements
1. [Must have]
2. [Must have]
3. [Nice to have]

## Tech Stack
- [Stack decisions]

## Success Criteria
- [ ] [Measurable outcome]
```

### Feature Spec Template

```markdown
# Feature: [Name]

## User Story
As a [user], I want [action] so that [benefit].

## Acceptance Criteria
- [ ] [Criterion 1]
- [ ] [Criterion 2]

## Technical Details
[Implementation specifics]

## Edge Cases
- [Edge case and how to handle]

## Testing
- [Test scenario]
```

---

## File Organization

All documentation lives in the `docs/` directory:

```
project/
├── docs/
│   ├── README.md                    # Documentation overview
│   ├── specs/
│   │   └── [project-name]/
│   │       └── spec.md              # Main specification
│   ├── plans/
│   │   └── [project-name]/
│   │       ├── implementation-plan.md
│   │       └── todo.md              # Progress checklist
│   └── context/
│       └── [project-name]/
│           └── discovery.md         # Project conventions
├── src/                             # Implementation
└── tests/                           # Test files
```

### Standard Paths

| Document | Path |
|----------|------|
| Spec | `docs/specs/[project]/spec.md` |
| Plan | `docs/plans/[project]/implementation-plan.md` |
| Todo | `docs/plans/[project]/todo.md` |
| Context | `docs/context/[project]/discovery.md` |

---

## Summary

1. **Hone your idea** through iterative questioning → `spec.md`
2. **Plan implementation** as discrete, testable prompts → `prompt_plan.md`
3. **Track progress** with a checklist → `todo.md`
4. **Execute incrementally**, verifying each step
5. **Maintain context** by sharing relevant code state

Great specs are the difference between AI assistants that guess and AI assistants that build exactly what you need.
