# Spec to Implementation Plan - Quick Reference

## Core Strategy: Use Subagents Aggressively

**Launch parallel subagents for independent research and analysis tasks.**

## The 5-Step Process

```
1. DISCOVER  →  2. DECOMPOSE  →  3. SEQUENCE  →  4. DETAIL  →  5. VERIFY
   (4 subagents)  (1 subagent)    (main)        (4 subagents) (1 subagent)
```

---

## Step 1: Discovery - LAUNCH 4 PARALLEL SUBAGENTS

Launch simultaneously:

| Subagent | Task |
|----------|------|
| **Instructions** | Read .github/copilot-instructions.md, CLAUDE.md, CONTRIBUTING.md |
| **Architecture** | Analyze src/ structure, naming, patterns |
| **Testing** | Analyze test framework, patterns, config |
| **Tooling** | Analyze package.json, scripts, linting |

**After all return:** Synthesize into Project Context Summary.

---

## Step 2: Decompose - LAUNCH 1 SUBAGENT

```
"Decompose this spec into chunks:
<SPEC>[content]</SPEC>

Categories: Foundation, Data Layer, Core Logic, Interface, Integration, Polish
For each: ID, description, dependencies, dependents, complexity"
```

---

## Step 3: Sequence - Dependency Rules (Main Agent)

1. Data before logic
2. Logic before interface
3. Foundation before features
4. Utilities before consumers
5. Tests alongside code

---

## Step 4: Detail - LAUNCH PARALLEL SUBAGENTS (per phase)

| Subagent | Writes Prompts For |
|----------|-------------------|
| **Foundation** | F1, F2... |
| **Data Layer** | D1, D2, D3... |
| **Core Logic** | C1, C2, C3... |
| **Interface** | I1, I2, I3... |

Each subagent writes complete prompts with: context, conventions, instructions, tests, verification.

---

## Step 5: Verify - LAUNCH 1 SUBAGENT

```
"Create verification criteria:
<SPEC>[with success criteria]</SPEC>
<STEPS>[all implementation steps]</STEPS>

Include: per-step verification, phase milestones, final checklist, rollback points"
```

---

## Prompt Structure (for subagent outputs)

```markdown
## Step N.N: [Name]

### Context
[Why this step, what it builds on]

### Conventions
[Project patterns to follow]

### Instructions
1. Create file: `path/to/file.ts`
   [Code example]
2. [Next specific action]

### Tests
- [ ] Test case 1
- [ ] Test case 2

### Acceptance Criteria
- [ ] [Verifiable criterion]

### Verification
```bash
[Commands to run]
```
```

---

## Master Workflow (Subagent-Orchestrated)

```
PHASE 1: Discovery (parallel)
├── Subagent 1: Instructions
├── Subagent 2: Architecture
├── Subagent 3: Testing
└── Subagent 4: Tooling
    ↓ wait for all

PHASE 2: Decomposition
└── Subagent: Analyze spec → chunks
    ↓ wait

PHASE 3: Sequencing (main agent)
└── Order chunks by dependencies
    ↓

PHASE 4: Detailing (parallel)
├── Subagent A: Foundation prompts
├── Subagent B: Data Layer prompts
├── Subagent C: Core Logic prompts
└── Subagent D: Interface prompts
    ↓ wait for all

PHASE 5: Verification
└── Subagent: Create checkpoints
    ↓

FINAL: Assemble
└── Combine outputs → implementation-plan.md + todo.md
```

---

## Anti-Patterns

| ❌ Don't | ✅ Do |
|---------|-------|
| Sequential research | Parallel subagents |
| "Implement the service" | Specific methods, files, patterns |
| Skip verification | Add commands for each step |
| Giant steps | Break into testable chunks |
| Ignore conventions | Do discovery first |

---

## Quality Checklist

- [ ] All spec requirements mapped to steps
- [ ] No step depends on a later step
- [ ] Each step has verification commands
- [ ] Project conventions documented
- [ ] Checkpoints after each phase
- [ ] Final checklist covers success criteria

---

## File Organization

```
docs/
├── specs/[project]/spec.md              # Input
├── plans/[project]/
│   ├── implementation-plan.md           # Output
│   └── todo.md                          # Progress
└── context/[project]/discovery.md       # Context
```
