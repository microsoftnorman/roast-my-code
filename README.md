# 🔥 Roast My Code

Get your code humorously roasted by AI! A VS Code extension that delivers workplace-appropriate, constructive code critiques with adjustable intensity levels from 1-11.

---

## 📚 Spec-Driven Development Example

**This project demonstrates spec-driven development in action.** Rather than writing code first, we started with a comprehensive specification, then generated an implementation plan, and finally implemented the code—all guided by AI.

### What is Spec-Driven Development?

Spec-driven development is an approach where you write detailed specifications *before* writing code. The spec acts as a contract between the idea and the implementation, ensuring:

- **Clarity of intent** - Forces you to think through requirements before coding
- **AI-friendly context** - Provides rich context for AI coding assistants to work with
- **Traceable decisions** - Documents why things were built a certain way
- **Reduced rework** - Catches issues in the design phase, not production

### Frameworks and Tools

There are multiple frameworks for spec-driven development:

| Approach | Description |
|----------|-------------|
| **Simply Spec** | Lightweight markdown-based specs for AI-assisted development |
| **OpenAPI/Swagger** | API-first design for REST services |
| **TDD/BDD** | Test-first development with executable specifications |
| **Design Docs** | Traditional software design documents |
| **ADRs** | Architecture Decision Records for capturing choices |

This project uses **[Simply Spec](https://github.com/microsoftnorman/simply-spec)** - a simple, flexible approach optimized for AI coding agents like GitHub Copilot.

### Install Simply Spec

**Option 1: One-liner (PowerShell)**
```powershell
irm https://raw.githubusercontent.com/microsoftnorman/simply-spec/main/install.ps1 | iex
```

**Option 2: One-liner (Bash/Zsh)**
```bash
curl -fsSL https://raw.githubusercontent.com/microsoftnorman/simply-spec/main/install.sh | bash
```

### How This Project Was Built

1. **Spec** → Wrote `docs/specs/roast-my-code.md` with all features, levels, and behaviors
2. **Plan** → Generated `docs/plans/roast-my-code/implementation-plan.md` from the spec
3. **Implement** → AI implemented each phase following the plan
4. **Iterate** → Updated spec → regenerated plan → implemented new features

Check out the [`docs/`](docs/) folder to see the actual specs and plans used to build this extension.

> 💡 **Want to try it?** Fork this repo, modify the spec, and let AI regenerate the implementation!

---

## Features

### 🎚️ Adjustable Roast Levels (1-11)

| Level | Name | Style |
|-------|------|-------|
| 1 | 🌸 Whisper | Extremely gentle, almost complimentary |
| 2 | 🫖 Polite | British-level politeness |
| 3 | 😊 Friendly | Good-natured teasing |
| 4 | 🎯 Honest | Direct but kind |
| 5 | 💅 Sassy | Sarcastic observations |
| 6 | 🌶️ Spicy | Pointed criticism |
| 7 | 🔥 Roasted | Classic roast style |
| 8 | ☀️ Scorched | Maximum sass |
| 9 | 🌋 Inferno | Theatrical disappointment |
| 10 | ☢️ Nuclear | Over-the-top devastation |
| 11 | 🎸 These Go to Eleven | Maximum absurdist roasting |

### 🎭 Special Roast Styles

- `/workspace` - Roast the entire workspace (structure, deps, config)
- `/gordon` - Gordon Ramsay-style kitchen nightmares roasting
- `/shakespeare` - Dramatic Shakespearean critique
- `/haiku` - Roasts delivered as haikus
- `/explain` - Serious mode with actual fixes

### 🏗️ Workspace Roasting

No file open? No problem! `@roast` will analyze your entire project:
- Project structure and organization
- Dependency choices and bloat
- Configuration file quality
- README and documentation
- Overall architecture decisions

Use `@roast /workspace` to explicitly roast the whole project.

## Usage

### Chat Mode
1. Open the Chat panel (`Ctrl+Alt+I` / `Cmd+Alt+I`)
2. Type `@roast` followed by your request
3. Select code in the editor or use `#selection`

### Roast Your Workspace
1. Close all files (or just type the command)
2. Type `@roast` or `@roast /workspace`
3. Watch your entire project get roasted

### Context Menu
1. Select code in the editor
2. Right-click → "🔥 Roast This Code"

### Change Roast Level
- **In chat**: `@roast /level 7`
- **Status bar**: Click the roast level icon and select

## Examples

**Level 5 (Sassy):**
> "Oh, nested ternaries? Bold choice. I too enjoy making my future self cry while debugging at 2am."

**Level 11 (These Go to Eleven):**
> "This code doesn't just have technical debt—it's declared bankruptcy in three countries."

**Workspace Roast:**
> "Your package.json has 127 dependencies. At this point, just `npm install internet`."

**Gordon Ramsay Style:**
> "THIS CODE IS RAW! RAAAAW! Where's the error handling?! IT'S MISSING!"

**Shakespeare Style:**
> "What light through yonder IDE breaks? 'Tis not clean code, but chaos makes!"

**Haiku Style:**
> "Null check forgotten / Production will remember / Update resume"

## Commands

| Command | Description |
|---------|-------------|
| `@roast` | Roast selection, file, or workspace (in that priority) |
| `@roast /level N` | Set roast intensity (1-11) |
| `@roast /workspace` | Roast the entire project |
| `@roast /gordon` | Gordon Ramsay-style roasting |
| `@roast /shakespeare` | Shakespearean dramatic roast |
| `@roast /haiku` | Roast as haikus |
| `@roast /explain` | Serious mode - explain what's wrong |

## Requirements

- VS Code 1.96.0 or higher
- GitHub Copilot extension

## Installation

1. Open VS Code
2. Go to Extensions (`Ctrl+Shift+X`)
3. Search for "Roast My Code"
4. Click Install

## Known Issues

- Roast level resets between VS Code sessions (persistence coming in v2)

## Release Notes

### 0.0.1

Initial release with:
- 11 roast levels (1-11, because these go to eleven)
- Workspace roasting (when no file is open)
- 5 special styles (workspace, gordon, shakespeare, haiku, explain)
- Context menu integration ("🔥 Roast This Code")
- Status bar level indicator
- Follow-up suggestions after roasts

## Philosophy

**We roast the code, not the coder.**

Every roast, no matter how savage, is aimed at the code itself—never the person who wrote it. The goal is to make code review fun AND educational. Even at level 11, roasts should be:

- ✅ Workplace appropriate
- ✅ Genuinely funny
- ✅ Actually insightful about code quality
- ✅ Free of profanity and offensive content
- ❌ Never personal attacks

## Contributing

Found a bug? Want to add a new roast style? PRs welcome!

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-roast`)
3. Commit your changes (`git commit -m 'Add some amazing roast'`)
4. Push to the branch (`git push origin feature/amazing-roast`)
5. Open a Pull Request

## License

MIT

---

*Stay crispy!* 🔥
