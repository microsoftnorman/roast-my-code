# Implementation Plan Template

## Plan Metadata

| Field | Value |
|-------|-------|
| Project | [Name] |
| Generated | [Date] |
| Based On | [spec.md path] |
| Total Steps | [N] |
| Estimated Time | [X hours/days] |

---

## Project Context Summary

### Discovered Conventions

**Architecture:**
- Directory structure: [pattern]
- Module organization: [by feature / by type]
- Key abstractions: [services, controllers, etc.]

**Testing:**
- Framework: [vitest / jest / pytest]
- Pattern: [describe/it / test / etc.]
- Location: [src/__tests__ / tests/ / etc.]

**Code Style:**
- Linter: [eslint / etc.]
- Formatter: [prettier / etc.]
- Types: [strict / relaxed]

### Instruction Files Applied
- `.github/copilot-instructions.md`: [key rules]
- `CONTRIBUTING.md`: [key rules]

### Reference Files (use as templates)
1. [path/to/example-service.ts]
2. [path/to/example-route.ts]
3. [path/to/example-test.ts]

---

## Phase Overview

| Phase | Steps | Description |
|-------|-------|-------------|
| 1. Foundation | 1.1-1.2 | Setup, config |
| 2. Data Layer | 2.1-2.3 | Models, schemas |
| 3. Core Logic | 3.1-3.N | Services |
| 4. Interface | 4.1-4.N | Routes/UI |
| 5. Integration | 5.1-5.2 | Wiring, docs |

---

## Phase 1: Foundation

### Step 1.1: [Name]

**Context:**
[What this step does and why it comes first]

**Dependencies:** None (first step)

**Conventions to follow:**
- [Convention 1]
- [Convention 2]

**Instructions:**

1. [Specific action with file path]
   ```typescript
   // Code example
   ```

2. [Next action]

3. [Continue...]

**Files Created/Modified:**
- `path/to/file.ts` - [purpose]
- `path/to/other.ts` - [purpose]

**Tests:**
- [ ] [Test case]
- [ ] [Test case]

**Acceptance Criteria:**
- [ ] [Criterion]
- [ ] [Criterion]

**Verification:**
```bash
npm run build
npm test -- path/to/test
```

---

### Step 1.2: [Name]

[Same structure...]

---

### ✓ Checkpoint: Foundation Complete

**Verify before proceeding:**
```bash
npm run build    # No errors
npm run lint     # No warnings  
npm test         # All pass
```

**Manual checks:**
- [ ] Project runs with `npm run dev`
- [ ] Expected files exist
- [ ] Configuration correct

**Git checkpoint:**
```bash
git add -A
git commit -m "Phase 1: Foundation complete"
```

---

## Phase 2: Data Layer

### Step 2.1: [Name]

[Same structure as Phase 1 steps...]

---

### ✓ Checkpoint: Data Layer Complete

[Same structure as Phase 1 checkpoint...]

---

## Phase 3: Core Logic

[Continue pattern...]

---

## Phase 4: Interface

[Continue pattern...]

---

## Phase 5: Integration

### Step 5.1: End-to-End Wiring

**Context:**
Wire all components together. After this step, the application should work end-to-end.

[Instructions...]

### Step 5.2: Documentation & Cleanup

**Context:**
Final documentation, cleanup console.logs, ensure README is accurate.

[Instructions...]

---

### ✓ Checkpoint: Integration Complete (FINAL)

**Full verification suite:**
```bash
npm run build
npm run lint
npm test
npm run dev  # Manual E2E testing
```

**E2E Test Cases:**
1. [ ] [Full workflow test 1]
2. [ ] [Full workflow test 2]
3. [ ] [Edge case test]

---

## Final Verification Checklist

### From Spec: Functional Requirements
| Requirement | Implemented In | Verified By |
|-------------|----------------|-------------|
| [Requirement 1] | Step X.X | [Test name / Manual check] |
| [Requirement 2] | Step X.X | [Test name / Manual check] |

### From Spec: Non-Functional Requirements
| Requirement | Target | Verification |
|-------------|--------|--------------|
| [Performance] | [metric] | [how to test] |
| [Security] | [requirement] | [how to verify] |

### From Spec: Success Criteria
- [ ] [Criterion 1]
- [ ] [Criterion 2]
- [ ] [Criterion 3]

---

## Rollback Points

| If Failed At | Rollback To | Command |
|--------------|-------------|---------|
| Phase 2 | Phase 1 | `git checkout phase-1-complete` |
| Phase 3 | Phase 2 | `git checkout phase-2-complete` |
| Phase 4 | Phase 3 | `git checkout phase-3-complete` |

---

## Agent Notes

### Execution Rules
1. Execute steps **sequentially** unless marked parallel
2. Run **verification commands** after each step
3. **Do not proceed** if verification fails
4. **Commit** at each checkpoint
5. If stuck, provide **full error output**

### Context References
When implementing, refer to:
- Spec: [path/to/spec.md]
- This plan: [path/to/implementation-plan.md]
- Project conventions: [See Project Context Summary above]

### Getting Unstuck
If a step fails:
1. Read error message carefully
2. Check if previous steps actually passed
3. Verify file paths are correct
4. Check import statements
5. Share full error with context for debugging
