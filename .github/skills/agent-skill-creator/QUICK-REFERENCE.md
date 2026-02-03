# Agent Skill Quick Reference

## File Structure
```
.github/skills/<skill-name>/
├── SKILL.md       # Required
├── examples/      # Optional
├── scripts/       # Optional
└── resources/     # Optional
```

## Frontmatter (Required)
```yaml
---
name: lowercase-hyphenated-name
description: What it does. Use this when [trigger].
license: MIT
---
```

## Good Description Formula
`[What the skill does]. Use this when [specific trigger conditions].`

## Essential Sections
1. **When to Use** - Trigger conditions
2. **Process** - Numbered steps
3. **Examples** - Concrete samples
4. **Success Criteria** - Completion checks

## Quality Checklist
- [ ] Name: lowercase, hyphenated
- [ ] Description: explains what AND when
- [ ] Steps: numbered, actionable
- [ ] Tools: explicitly referenced
- [ ] Examples: at least one
- [ ] Verification: success criteria defined

## Storage Locations
| Type | Location |
|------|----------|
| Project | `.github/skills/` or `.claude/skills/` |
| Personal | `~/.copilot/skills/` or `~/.claude/skills/` |

## Anti-Patterns
❌ Vague instructions ("do it properly")  
❌ Missing trigger conditions  
❌ No examples  
❌ Skipped steps  
❌ No verification criteria  
