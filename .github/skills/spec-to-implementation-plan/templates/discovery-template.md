# Project Context Discovery Template

Complete this template before generating an implementation plan.

---

## 1. Instruction Files

### Found Files
Check each file found and summarize key rules:

- [ ] `.github/copilot-instructions.md`
  - Key rules: 
  
- [ ] `.github/instructions/*.md`
  - Files found: 
  - Key rules:

- [ ] `CLAUDE.md` or `.claude/settings.json`
  - Key rules:

- [ ] `CONTRIBUTING.md`
  - Key rules:

- [ ] `README.md`
  - Setup instructions:
  - Key commands:

- [ ] Other instruction files:
  - Files:
  - Key rules:

### Consolidated Rules
List all rules that must be followed:
1. 
2. 
3. 

---

## 2. Architecture Patterns

### Directory Structure
```
[Paste tree output or describe structure]
```

### File Naming Conventions
| Type | Pattern | Example |
|------|---------|---------|
| Components | | |
| Services | | |
| Routes | | |
| Tests | | |
| Types | | |

### Module Organization
- [ ] By feature (src/users/, src/products/)
- [ ] By type (src/services/, src/routes/)
- [ ] Hybrid
- [ ] Other: 

### Key Abstractions
| Abstraction | Location | Example |
|-------------|----------|---------|
| Services | | |
| Controllers/Routes | | |
| Models | | |
| Repositories | | |
| Middleware | | |
| Utilities | | |

### Import Patterns
```typescript
// Example import structure from existing code:

```

### Export Patterns
- [ ] Named exports
- [ ] Default exports
- [ ] Barrel files (index.ts)
- Pattern notes:

---

## 3. Testing Patterns

### Test Framework
- Framework: 
- Version:
- Config file:

### Test File Structure
- Location: 
- Naming pattern: 
- Example: 

### Test Utilities
- Setup file: 
- Mock patterns:
- Fixtures location:

### Coverage Requirements
- Minimum coverage: 
- Coverage tool:
- Coverage command:

### Example Test Pattern
```typescript
// Copy an example test from the project:

```

---

## 4. Code Style

### Linting
- Linter: 
- Config file:
- Key rules:

### Formatting
- Formatter:
- Config file:
- Key settings:

### Type Checking
- TypeScript strict mode: Yes / No
- Key compiler options:

### Conventions
- Variable naming: camelCase / snake_case / other
- File naming: camelCase / kebab-case / PascalCase
- Import ordering:
- Comment style:

---

## 5. Build & Development

### Package Manager
- [ ] npm
- [ ] pnpm
- [ ] yarn
- [ ] bun
- [ ] other:

### Key Scripts
| Script | Command | Purpose |
|--------|---------|---------|
| dev | | |
| build | | |
| test | | |
| lint | | |
| format | | |

### Environment Variables
From `.env.example` or documentation:
| Variable | Purpose | Required |
|----------|---------|----------|
| | | |

### CI/CD
- CI platform:
- Key checks:
- Deployment process:

---

## 6. Dependencies

### Key Dependencies
| Package | Version | Purpose |
|---------|---------|---------|
| | | |

### Dev Dependencies
| Package | Version | Purpose |
|---------|---------|---------|
| | | |

---

## 7. Database (if applicable)

### Database Type
- [ ] PostgreSQL
- [ ] MySQL
- [ ] SQLite
- [ ] MongoDB
- [ ] Other:

### ORM/Query Builder
- Tool:
- Schema location:
- Migration command:

### Seed Data
- Location:
- Command:

---

## 8. API Patterns (if applicable)

### Response Format
```json
// Standard success response:

```

```json
// Standard error response:

```

### Authentication
- Method:
- Header/Cookie:
- Middleware:

### Validation
- Library:
- Schema location:
- Pattern:

---

## Summary

### Critical Conventions (must follow)
1. 
2. 
3. 

### Reference Files (use as templates)
1. 
2. 
3. 

### Commands to Run After Each Step
```bash

```

---

*Completed by: [Agent/Human]*
*Date: [Date]*
