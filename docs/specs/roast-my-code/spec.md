# Roast My Code

## Overview

"Roast My Code" is a VS Code extension that provides humorous, workplace-appropriate critiques of your code through GitHub Copilot's chat interface. Users can invoke the `@roast` chat participant to get their code roasted with adjustable intensity levels from 1 (gentle ribbing) to 11 (maximum burn - because these go to eleven). The extension uses the Language Model API to generate witty, constructive feedback that points out code smells, anti-patterns, and questionable decisions while keeping developers entertained.

**Contextual Roasting**: The extension intelligently detects what to roast based on context—from a selection, to a file, to your entire workspace. No code selected and no file open? It'll roast your whole project structure, dependencies, and overall architecture decisions.

## Problem Statement

Code reviews can be dry, boring, and sometimes demotivating. Developers often need feedback on their code but find traditional linting and review processes tedious. There's a gap in the market for a tool that:

- Makes code feedback entertaining and memorable
- Encourages developers to actually look at their code quality issues
- Provides a fun way to learn about best practices through humor
- Creates shareable, amusing moments in the development workflow

**Target Users:**
- Developers who want entertaining feedback on their code
- Teams looking for fun ways to discuss code quality
- Educators teaching code review and best practices
- Anyone who appreciates developer humor

## Goals

### Primary Goals
- Create a chat participant (`@roast`) that humorously critiques selected code or files
- Support adjustable roast intensity levels from 1-11
- Ensure all roasts are workplace-appropriate (no profanity, offensive content, or personal attacks)
- Provide genuinely useful feedback disguised as comedy
- Integrate seamlessly with VS Code's Copilot chat experience

### Secondary Goals
- Support inline chat for quick roasts
- Provide follow-up suggestions for "more roasting" or "how to fix"
- Remember roast level preference within a session
- Include themed roast styles (e.g., `/gordon` for Gordon Ramsay-style, `/shakespeare` for dramatic)

### Non-Goals (Out of Scope)
- Automatic code fixes (this is entertainment, not a linter replacement)
- Integration with CI/CD pipelines
- Team collaboration features
- Persistent storage of roast history
- Custom roast persona creation (v2 feature)

## Functional Requirements

### Core Features

#### 1. Chat Participant Registration
- **ID**: `roast-my-code.roast`
- **Name**: `roast` (invoked via `@roast`)
- **Full Name**: `Roast My Code`
- **Description**: `Get your code humorously roasted (1-11 intensity)`
- **Sticky**: `true` (persists in chat input after responding)

#### 2. Roast Level System (1-11)
| Level | Name | Style |
|-------|------|-------|
| 1 | Whisper | Extremely gentle, almost complimentary with tiny suggestions |
| 2 | Polite | British-level politeness with subtle hints |
| 3 | Friendly | Good-natured teasing, like a helpful colleague |
| 4 | Honest | Direct but kind feedback with humor |
| 5 | Sassy | Sarcastic observations, eye-roll worthy |
| 6 | Spicy | Pointed criticism wrapped in wit |
| 7 | Roasted | Classic roast comedy style |
| 8 | Scorched | No holding back, maximum sass |
| 9 | Inferno | Dramatic, theatrical disappointment |
| 10 | Nuclear | Over-the-top devastation (still workplace-safe) |
| 11 | "These Go to Eleven" | Maximum absurdist roasting, Spinal Tap reference |

#### 3. Slash Commands
| Command | Description |
|---------|-------------|
| `/roast` | Roast the current selection or file (default) |
| `/level` | Set roast intensity (1-11) |
| `/workspace` | Roast the entire workspace (project structure, deps, config) |
| `/socrates` | Socratic method - roast through endless philosophical questions |
| `/wilde` | Oscar Wilde-style devastating wit and epigrams |
| `/shakespeare` | Roast in Shakespearean dramatic style |
| `/haiku` | Deliver the roast as a haiku |
| `/explain` | Explain what's actually wrong (serious mode) |

#### 4. Context Handling (Priority Order)
1. **Selection**: Use currently selected code in editor as roast target
2. **Active File**: Fall back to entire active file if no selection
3. **Workspace**: If no file is open, roast the entire workspace (project structure, package.json/dependencies, folder organization, README quality, etc.)
4. **Chat Variables**: Support `#file` and `#selection` chat variables to override defaults
- Access to Language Model via `request.model`

#### 5. Workspace Roasting
When no code context is available, the extension analyzes and roasts:
- Project structure and folder organization
- Dependency choices (package.json, requirements.txt, etc.)
- Configuration file quality
- README and documentation presence
- Naming conventions across the project
- Overall architecture decisions visible from structure
- Any obvious anti-patterns in project setup

### User Stories

1. **As a developer**, I want to get my code roasted at a mild level so I can get feedback without feeling attacked.

2. **As a developer**, I want to crank the roast level to 11 so I can share hilarious feedback with my team.

3. **As a developer**, I want to use `/socrates` command so I can get my code questioned by ancient philosophical methods.

4. **As a developer**, I want follow-up options to see actual fixes after being roasted.

5. **As a team lead**, I want to use this tool during code reviews to make the process more engaging.

6. **As a developer**, I want to roast my entire workspace so I can get feedback on my project structure and dependency choices.

7. **As a new team member**, I want to roast an unfamiliar codebase to quickly understand its quirks and potential issues in an entertaining way.

## Non-Functional Requirements

### Performance
- Response generation should begin streaming within 2 seconds
- Full roast response should complete within 10 seconds
- Extension should not impact VS Code startup time significantly

### Content Safety
- All generated content must be workplace-appropriate
- No profanity, slurs, or offensive language
- No personal attacks—roast the code, not the coder
- System prompts must enforce content guidelines
- Humor should be inclusive and not target protected groups

### Accessibility
- All responses should be screen-reader compatible
- No reliance on color alone for information
- Follow VS Code accessibility guidelines

### Reliability
- Graceful fallback if Language Model API is unavailable
- Clear error messages if no code is selected
- Handle cancellation tokens properly

## Technical Architecture

### Tech Stack
- **Language**: TypeScript (strict mode)
- **Runtime**: VS Code Extension Host
- **APIs**: 
  - VS Code Chat Participant API
  - VS Code Language Model API
  - VS Code Extension API
- **Dependencies**:
  - `@vscode/chat-extension-utils` (optional, for tool calling)
  - Standard VS Code extension dependencies

### Extension Structure
```
roast-my-code/
├── .vscode/
│   ├── launch.json
│   └── tasks.json
├── src/
│   ├── extension.ts          # Extension entry point
│   ├── roastParticipant.ts   # Chat participant handler
│   ├── roastLevels.ts        # Roast level definitions
│   ├── prompts/
│   │   ├── systemPrompts.ts  # Base system prompts
│   │   ├── levelPrompts.ts   # Level-specific prompts
│   │   └── stylePrompts.ts   # Style/command prompts
│   └── utils/
│       ├── codeExtractor.ts  # Extract code from context
│       └── contentFilter.ts  # Safety checks
├── package.json
├── tsconfig.json
├── README.md
└── CHANGELOG.md
```

### System Prompt Design

The extension will construct prompts with the following structure:

```
[BASE SYSTEM PROMPT]
You are "Roast My Code", a witty code reviewer who delivers humorous but 
workplace-appropriate critiques. Your roasts should:
- Point out actual code issues (bugs, anti-patterns, style problems)
- Be genuinely funny without being mean-spirited
- Never use profanity or offensive language
- Roast the CODE, never the coder personally
- Include at least one actionable insight per roast

[LEVEL MODIFIER]
Current roast level: {level}/11
{level-specific instructions}

[STYLE MODIFIER - if applicable]
{style-specific instructions for /gordon, /shakespeare, etc.}

[CODE CONTEXT]
Here is the code to roast:
```{language}
{code}
```
```

### Data Flow

1. User invokes `@roast` with optional command and prompt
2. Handler extracts code from selection/file/variables
3. Handler determines roast level (from command, session, or default)
4. System prompt is constructed with level and style modifiers
5. Request sent to Language Model via `request.model`
6. Response streamed back via `stream.markdown()`
7. Follow-up options provided

## API Design

### Chat Participant Registration (package.json)

```json
{
  "contributes": {
    "chatParticipants": [
      {
        "id": "roast-my-code.roast",
        "name": "roast",
        "fullName": "Roast My Code",
        "description": "Get your code humorously roasted (1-11 intensity)",
        "isSticky": true,
        "commands": [
          {
            "name": "level",
            "description": "Set roast intensity (1-11). Example: /level 7"
          },
          {
            "name": "socrates",
            "description": "Socratic method - roast through endless philosophical questions"
          },
          {
            "name": "wilde",
            "description": "Oscar Wilde-style devastating wit and epigrams"
          },
          {
            "name": "shakespeare",
            "description": "Roast in dramatic Shakespearean style"
          },
          {
            "name": "haiku",
            "description": "Deliver the roast as a haiku"
          },
          {
            "name": "explain",
            "description": "Serious mode - explain what's actually wrong"
          }
        ],
        "disambiguation": [
          {
            "category": "code_roast",
            "description": "The user wants humorous, funny feedback or criticism about their code",
            "examples": [
              "Roast my code",
              "Make fun of this function",
              "Give me funny feedback on this",
              "What's wrong with this code but make it funny",
              "Question my code like Socrates"
            ]
          }
        ]
      }
    ]
  }
}
```

### Request Handler Interface

```typescript
interface RoastState {
  currentLevel: number;  // 1-11, default 5
  lastStyle?: string;    // Last used style command
}

interface RoastResult extends vscode.ChatResult {
  metadata: {
    command?: string;
    level: number;
    codeLanguage?: string;
  };
}
```

## Error Handling

| Scenario | Handling Strategy |
|----------|-------------------|
| No code selected/available | Fall back to workspace roasting - analyze project structure, dependencies, and configuration |
| Invalid roast level input | Default to level 5, inform user of valid range |
| LLM API unavailable | Display error with retry suggestion |
| LLM returns inappropriate content | Filter response, return generic safe roast |
| User cancellation | Respect cancellation token, stop streaming |
| Empty file | Return special "nothing to roast" joke response |

## Security Considerations

### Input Validation
- Sanitize roast level input (must be integer 1-11)
- No user input is executed as code
- Code context is passed as data, not executable

### Content Safety
- System prompts explicitly prohibit inappropriate content
- Extension does not store or transmit code externally (uses VS Code's LLM API)
- No telemetry collection of roasted code content

### API Security
- Uses VS Code's built-in Language Model API (secure by design)
- No external API keys or authentication required
- Follows VS Code extension security best practices

## Testing Strategy

### Unit Tests
- Roast level validation (boundary testing 0, 1, 11, 12)
- Prompt construction for each level and style
- Code extraction from various contexts
- Error handling scenarios

### Integration Tests
- Chat participant registration and invocation
- Command parsing (`/level 7`, `/gordon`, etc.)
- Response streaming
- Follow-up provider

### Manual Testing
- Test each roast level for appropriate humor intensity
- Verify workplace appropriateness across many generations
- Test with various programming languages
- Test edge cases (empty files, binary files, huge files)

### Test Coverage Targets
- Unit tests: 80% coverage
- Integration tests: Key user flows covered
- Manual testing: All roast levels and styles validated

## Success Criteria

- [ ] Chat participant `@roast` is registered and invocable
- [ ] Roast levels 1-11 produce noticeably different intensity responses
- [ ] All slash commands (`/level`, `/workspace`, `/socrates`, `/wilde`, `/shakespeare`, `/haiku`, `/explain`) work
- [ ] Workspace roasting works when no file/selection is available
- [ ] Responses are genuinely funny (subjective, validated via user testing)
- [ ] All responses are workplace-appropriate (validated via extensive testing)
- [ ] Responses include actual code feedback, not just jokes
- [ ] Follow-up suggestions appear after roasts
- [ ] Extension works in both Chat view and inline chat
- [ ] Response streaming provides smooth UX
- [ ] Extension published to VS Code Marketplace

## Open Questions

1. **Should we support custom personas in v1?** 
   - Leaning no, save for v2 to keep scope manageable

2. **How to handle multi-file roasts?**
   - Workspace roasting provides high-level multi-file feedback
   - Detailed multi-file analysis (specific code across files) is v2

3. **Should roast level persist across VS Code sessions?**
   - Current plan: Session-only, evaluate user feedback for persistence

4. **Integration with code actions?**
   - Possible "Roast This" in right-click menu, evaluate complexity

## Future Considerations

### Version 2 Features
- Custom persona creation
- "Roast Battle" mode (compare two code snippets)
- Team roast leaderboard
- Multi-file project roast
- Roast level persistence in settings
- Additional themed styles (`/pirate`, `/yoda`, `/noir`)
- Share roast to Slack/Teams integration

### Version 3 Features
- AI-generated roast images/memes
- Voice narration of roasts
- Roast severity based on git blame (longer-standing code = harsher)

## Appendix: Sample Roasts by Level

### Level 1 (Whisper)
> "This code is... actually pretty good! Though, if I'm being very gentle, that variable name `x` could perhaps be more descriptive? Just a thought! 🌸"

### Level 5 (Sassy)
> "Oh, nested ternaries? Bold choice. I too enjoy making my future self cry while debugging at 2am."

### Level 7 (Roasted)
> "This function is doing so many things, it should file for multiple personality disorder. Single Responsibility called—it's filing a restraining order."

### Level 11 (These Go to Eleven)
> "I've seen spaghetti code before, but this? This is a full Italian restaurant. There's lasagna in here. I found a calzone hiding in line 47. This code doesn't just have technical debt—it's declared bankruptcy in three countries. Socrates would question his entire existence. Oscar Wilde would be speechless, and that man was NEVER speechless."

### Socratic Style (`/socrates`)
> "But tell me, dear developer, what IS a variable? And if this variable is named `x`, does it truly capture the essence of what it represents? And when you say this function 'works', what do we mean by 'works'? Is functionality merely the absence of errors, or something more profound? And these seven nested loops—have you considered WHY seven? Would Pythagoras approve?"

### Oscar Wilde Style (`/wilde`)
> "I have nothing to declare except my disappointment in this function. To use one global variable may be regarded as a misfortune; to use twelve looks like carelessness. We are all in the gutter, but some of us are looking at the stack traces."

### Shakespeare Style (`/shakespeare`)
> "What light through yonder IDE breaks? 'Tis not clean code, but chaos makes! O variable, variable, wherefore art thou named `temp2`? A name by any other convention would smell less of desperation."

### Haiku Style (`/haiku`)
> "Null check forgotten \
> Production will remember \
> Update resume"

### Workspace Roast (no file context)
> "Ah, I see we're going big today - let me roast your entire project! 🔥
> 
> **Project Structure**: You've got 47 files in your root directory. I've seen cleaner desk drawers at a hoarder's estate sale. Ever heard of folders?
> 
> **Dependencies**: Your package.json has 127 dependencies. At this point, just `npm install internet`. I'm pretty sure half of these are abandoned packages with more CVEs than downloads.
> 
> **The README**: It says 'TODO: Add documentation'. That TODO is old enough to vote. 
> 
> **Naming**: You have folders named `src`, `source`, `code`, AND `app`. Pick a lane!
> 
> This workspace doesn't need a code review, it needs an intervention."
