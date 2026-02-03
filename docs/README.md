# Project Documentation

This directory contains all project specifications, implementation plans, and related documentation.

## Structure

```
docs/
├── README.md              # This file
├── specs/                 # Project specifications
│   └── [project-name]/
│       └── spec.md
├── plans/                 # Implementation plans
│   └── [project-name]/
│       ├── implementation-plan.md
│       └── todo.md
└── context/               # Project context and discovery
    └── [project-name]/
        └── discovery.md
```

## Workflow

```
1. IDEATE          2. SPECIFY         3. DISCOVER        4. PLAN            5. EXECUTE
   ↓                  ↓                  ↓                  ↓                  ↓
   Brainstorm    →   spec.md       →   discovery.md  →   plan.md        →   Code
                     (docs/specs/)      (docs/context/)    (docs/plans/)
```

## Creating New Project Documentation

### 1. Create Spec
```bash
mkdir -p docs/specs/my-project
# Create docs/specs/my-project/spec.md using spec-driven-development skill
```

### 2. Discover Context (for existing codebases)
```bash
mkdir -p docs/context/my-project
# Create docs/context/my-project/discovery.md using spec-to-implementation-plan skill
```

### 3. Create Implementation Plan
```bash
mkdir -p docs/plans/my-project
# Create docs/plans/my-project/implementation-plan.md
# Create docs/plans/my-project/todo.md
```

## Keeping Documents Updated

### When to Update spec.md
- Requirements change
- Scope expands or contracts
- Technical decisions change
- After major implementation milestones (to reflect reality)

### When to Update implementation-plan.md
- Steps are completed (mark done)
- New steps are discovered
- Order of operations changes
- Blockers are identified

### When to Update todo.md
- After completing each step (check off)
- When adding new tasks
- When re-prioritizing

### Version Control
All documents should be committed to git:
```bash
git add docs/
git commit -m "docs: update [project] spec/plan"
```

## Document Templates

Templates are available in the skills:
- Spec template: `.github/skills/spec-driven-development/templates/spec-template.md`
- Plan template: `.github/skills/spec-to-implementation-plan/templates/implementation-plan-template.md`
- Discovery template: `.github/skills/spec-to-implementation-plan/templates/discovery-template.md`

## Quick Commands

```bash
# List all specs
ls docs/specs/

# List all plans
ls docs/plans/

# Check project status (todo.md)
cat docs/plans/[project]/todo.md | grep -E "^\s*-\s*\["
```

## Linking Documents

In your spec, reference the plan:
```markdown
## Related Documents
- Implementation Plan: [implementation-plan.md](../plans/project-name/implementation-plan.md)
- Progress: [todo.md](../plans/project-name/todo.md)
```

In your plan, reference the spec:
```markdown
## Source
- Specification: [spec.md](../../specs/project-name/spec.md)
```
