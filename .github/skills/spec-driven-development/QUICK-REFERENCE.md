# Spec-Driven Development Quick Reference

## The Three-Phase Workflow

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│  1. IDEA HONE   │ →  │   2. PLAN       │ →  │   3. EXECUTE    │
│                 │    │                 │    │                 │
│  Brainstorm     │    │  Break down     │    │  Run prompts    │
│  iteratively    │    │  into prompts   │    │  sequentially   │
│                 │    │                 │    │                 │
│  Output:        │    │  Output:        │    │  Output:        │
│  spec.md        │    │  prompt_plan.md │    │  Working code   │
│                 │    │  todo.md        │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## Phase 1: Brainstorming Prompt

```
Ask me one question at a time so we can develop a thorough, step-by-step spec 
for this idea. Each question should build on my previous answers, and our end 
goal is to have a detailed specification I can hand off to a developer.
Let's do this iteratively and dig into every relevant detail.
Remember, only one question at a time.

Here's the idea:
<IDEA>
[Your idea]
</IDEA>
```

## Phase 1: Compilation Prompt

```
Compile our findings into a comprehensive, developer-ready specification.
Include: requirements, architecture, data models, error handling, security,
testing plan, and success criteria.
```

## Phase 2: Planning Prompt (TDD)

```
Draft a detailed blueprint for building this project. Break it down into 
small, iterative chunks. Make sure steps are small enough for safe testing
but big enough to make progress. Output a series of prompts for a code-gen
LLM that implements each step in a test-driven manner. Each prompt should
build on previous prompts. No orphaned code.

<SPEC>
[Your spec]
</SPEC>
```

## Phase 2: Todo Generation

```
Create a todo.md checklist based on this implementation plan.
Include setup, implementation tasks, verification checkpoints, 
and final review items. Format as markdown checkboxes.
```

## Spec Document Essentials

| Section | Content |
|---------|---------|
| **Overview** | 1-2 paragraph summary |
| **Problem Statement** | What problem, who has it |
| **Goals** | Primary goals + explicit non-goals |
| **Functional Requirements** | Features with acceptance criteria |
| **Non-Functional Requirements** | Performance, security, scalability |
| **Technical Architecture** | Stack, data models, system design |
| **API Design** | Endpoints, request/response formats |
| **Testing Strategy** | Unit, integration, E2E plans |
| **Success Criteria** | Measurable launch criteria |

## Writing Tips for AI Agents

### Do ✅
- Be explicit: "Return 400 with validation errors"
- Use structured formats: numbered lists, tables, code blocks
- Include examples: request/response JSON
- Define boundaries: in-scope vs out-of-scope
- Specify tech: "TypeScript with Zod validation"

### Don't ❌
- Be vague: "Make it fast" → "Response time <100ms at p95"
- Giant leaps: "Build auth system" → Break into steps
- Skip verification: Always test before proceeding
- Leave orphaned code: Each step integrates with previous

## File Organization

```
docs/
├── specs/[project]/spec.md           # Specification
├── plans/[project]/
│   ├── implementation-plan.md        # Detailed plan
│   └── todo.md                        # Progress tracking
└── context/[project]/discovery.md    # Project conventions
```

**Standard paths:**
- Spec: `docs/specs/[project]/spec.md`
- Plan: `docs/plans/[project]/implementation-plan.md`
- Todo: `docs/plans/[project]/todo.md`

## Context Chunk Template

When context is needed:

```
<CODEBASE>
[Relevant source files]
</CODEBASE>

<CURRENT_TASK>
[Task from prompt_plan.md]
</CURRENT_TASK>

<ERROR_IF_ANY>
[Error message]
</ERROR_IF_ANY>
```

## Debugging Template

```
I'm implementing [task] and encountering this error:

Error: [error message]

Relevant code:
[code snippet]

Expected behavior:
[what should happen]

Actual behavior:
[what's happening]
```

## Quality Checklist

Before executing:
- [ ] Problem clearly stated
- [ ] Success criteria measurable
- [ ] Steps appropriately sized
- [ ] Technology choices explicit
- [ ] Examples provided
- [ ] Edge cases identified
