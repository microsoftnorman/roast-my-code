---
name: agent-skill-creator
description: Expert guide for creating high-quality GitHub Copilot agent skills. Use this when asked to create, improve, or review agent skills.
license: MIT
---

# Agent Skill Creator

This skill helps you create well-structured, effective agent skills for GitHub Copilot.

## When to Use This Skill

- Creating new agent skills
- Improving existing skills
- Reviewing skills for best practices
- Teaching others how to write skills

## Skill Structure Requirements

Every skill must follow this structure:

```
.github/skills/<skill-name>/
├── SKILL.md          # Required: Main instruction file
├── examples/         # Optional: Example files
├── scripts/          # Optional: Helper scripts
└── resources/        # Optional: Additional resources
```

### Naming Conventions

- **Directory name**: lowercase, hyphens for spaces (e.g., `webapp-testing`)
- **Name in frontmatter**: must match directory name exactly
- **Be specific**: `react-component-testing` is better than `testing`

## Writing the SKILL.md File

### Required YAML Frontmatter

```yaml
---
name: your-skill-name
description: Clear description of what the skill does AND when to use it.
license: MIT  # Optional but recommended
---
```

### Description Best Practices

The description is **critical**—Copilot uses it to decide when to load your skill.

**Good descriptions:**
- "Guide for debugging failing GitHub Actions workflows. Use this when asked to debug failing GitHub Actions workflows."
- "Expert guide for writing React unit tests with Testing Library. Use when creating or improving React component tests."

**Bad descriptions:**
- "Testing stuff" (too vague)
- "A skill" (not descriptive)
- "Helps with code" (doesn't explain when to use)

**Formula**: `[What it does]. Use this when [specific trigger conditions].`

### Markdown Body Structure

Structure your skill's body with clear sections:

1. **Overview**: Brief explanation of the skill's purpose
2. **When to Use**: Explicit conditions that trigger this skill
3. **Step-by-Step Process**: Numbered steps for the agent to follow
4. **Tools & Commands**: Specific tools, commands, or APIs to use
5. **Examples**: Concrete examples of inputs and outputs
6. **Common Pitfalls**: Mistakes to avoid
7. **Success Criteria**: How to verify the task is complete

## Writing Effective Instructions

### Be Explicit and Actionable

**Good:**
```markdown
1. Run `npm test -- --coverage` to execute tests with coverage
2. Check if coverage is below 80% in the output
3. If coverage is low, identify uncovered lines in the coverage report
```

**Bad:**
```markdown
1. Test the code
2. Check coverage
3. Fix if needed
```

### Reference Specific Tools

When your skill uses MCP tools or CLI commands, be explicit:

```markdown
Use these GitHub MCP Server tools:
- `list_workflow_runs`: Get recent workflow runs for the PR
- `summarize_job_log_failures`: Get AI summary of failed job logs
- `get_job_logs`: Get full detailed logs when needed
```

### Include Decision Trees

Help the agent handle variations:

```markdown
## Handling Different Scenarios

**If the build fails due to missing dependencies:**
1. Check `package.json` for the missing package
2. Run `npm install <package-name>`
3. Re-run the build

**If the build fails due to syntax errors:**
1. Read the error message to identify the file and line
2. Open the file and fix the syntax error
3. Re-run the build
```

### Provide Examples

Include concrete examples in the `examples/` directory or inline:

```markdown
## Example: Creating a React Component Test

**Input**: Component file `Button.tsx`
**Output**: Test file `Button.test.tsx`

Example test structure:
\`\`\`typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from './Button';

describe('Button', () => {
  it('renders with correct text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button')).toHaveTextContent('Click me');
  });
});
\`\`\`
```

## Quality Checklist

Before finalizing a skill, verify:

- [ ] **Name**: Lowercase, hyphenated, descriptive
- [ ] **Description**: Explains what AND when
- [ ] **Instructions**: Step-by-step, actionable
- [ ] **Tools**: Specific tools/commands referenced
- [ ] **Examples**: At least one concrete example
- [ ] **Edge Cases**: Common variations handled
- [ ] **Verification**: Success criteria defined

## Skill Categories and Patterns

### Debugging Skills
- Focus on diagnostic steps
- Include log analysis instructions
- Provide reproduction steps
- Define escalation paths

### Code Generation Skills
- Include style guidelines
- Reference coding standards
- Provide templates
- Define validation steps

### Testing Skills
- Specify test frameworks
- Include coverage targets
- Define test patterns
- Provide assertion examples

### Workflow Skills
- List required tools
- Define approval processes
- Include rollback procedures
- Specify success metrics

## Advanced Techniques

### Composing Multiple Skills

Reference other skills when appropriate:
```markdown
After generating the component, use the `react-component-testing` skill 
to create comprehensive tests.
```

### Including Scripts

Add helper scripts for complex operations:

```
scripts/
├── validate-output.sh
├── generate-template.py
└── format-results.js
```

Reference them in SKILL.md:
```markdown
Run the validation script to verify output:
\`\`\`bash
./scripts/validate-output.sh <output-file>
\`\`\`
```

### Version-Specific Instructions

Handle different versions or environments:
```markdown
**For Node.js 18+:**
Use the built-in test runner: `node --test`

**For Node.js 16:**
Use Jest: `npx jest`
```

## Creating a New Skill - Step by Step

1. **Identify the task**: What specific, repeatable task should this skill handle?
2. **Choose the location**: 
   - Project skill: `.github/skills/<name>/` or `.claude/skills/<name>/`
   - Personal skill: `~/.copilot/skills/<name>/` or `~/.claude/skills/<name>/`
3. **Create the directory**: `mkdir -p .github/skills/your-skill-name`
4. **Write SKILL.md**: Start with frontmatter, then structured instructions
5. **Add examples**: Create `examples/` with concrete samples
6. **Add scripts**: Create `scripts/` for automation helpers
7. **Test the skill**: Ask Copilot to perform the task and verify it uses the skill
8. **Iterate**: Refine based on how Copilot interprets your instructions

## Anti-Patterns to Avoid

❌ **Don't be vague**: "Do the thing properly" gives no guidance
❌ **Don't assume context**: Explain acronyms, reference docs
❌ **Don't skip steps**: Every action should be explicit
❌ **Don't mix concerns**: One skill = one focused task
❌ **Don't forget triggers**: Always specify when to use the skill
❌ **Don't omit verification**: Define how to know when done

## Template for New Skills

```markdown
---
name: your-skill-name
description: [What it does]. Use this when [trigger conditions].
license: MIT
---

# [Skill Name]

[Brief overview of what this skill accomplishes]

## When to Use

- [Condition 1]
- [Condition 2]

## Prerequisites

- [Required tool/access 1]
- [Required tool/access 2]

## Process

1. [First step with specific command/action]
2. [Second step]
3. [Continue as needed]

## Tools Used

- `tool-name`: [What it does]

## Examples

### Example 1: [Scenario]

**Input**: [Description]
**Output**: [Description]

[Code or detailed example]

## Troubleshooting

**Problem**: [Common issue]
**Solution**: [How to fix]

## Success Criteria

- [ ] [Verification step 1]
- [ ] [Verification step 2]
```

---

Remember: A great skill is like a great recipe—specific ingredients, clear steps, expected results, and tips for when things go wrong.
