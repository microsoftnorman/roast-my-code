# Implementation Plan: Roast My Code

**Generated**: February 3, 2026  
**Based on**: [../../specs/roast-my-code/spec.md](../../specs/roast-my-code/spec.md)  
**Target**: VS Code Extension with Chat Participant API

---

## Project Context Summary

### Project Type
- **Greenfield**: New VS Code extension project
- **Language**: TypeScript (strict mode)
- **Extension Type**: Chat Participant (Copilot extension)

### Key APIs Used
- VS Code Extension API
- Chat Participant API (`vscode.chat.createChatParticipant`)
- Language Model API (`request.model`)
- Workspace API (`vscode.workspace`)
- ChatResponseStream for streaming responses

### Key Conventions
- Follow VS Code extension patterns from official samples
- Use TypeScript strict mode
- Follow VS Code chat participant naming conventions
- All roasts must be workplace-appropriate

---

## Implementation Overview

| Phase | Steps | Estimated Complexity |
|-------|-------|---------------------|
| 1. Foundation | 2 | Low |
| 2. Core Prompts | 2 | Medium |
| 3. Chat Participant | 3 | Medium |
| 4. Workspace Roasting | 2 | Medium |
| 5. Commands & Features | 2 | Medium |
| 6. Polish & Testing | 2 | Low |
| **Total** | **13** | |

### Dependency Graph

```
F1 → F2 → P1 → P2 → C1 → C2 → C3 → W1 → W2 → CF1 → CF2 → T1 → T2
         ↘___________↗
```

---

## Phase 1: Foundation

### Step 1.1: Project Scaffolding

#### Context
Initialize the VS Code extension project using Yeoman generator. This creates the foundational project structure that all subsequent steps build upon.

#### Implementation Instructions

1. **Create the extension using Yeoman**:

```bash
npx --package yo --package generator-code -- yo code
```

2. **Answer the prompts**:
```
? What type of extension do you want to create? New Extension (TypeScript)
? What's the name of your extension? Roast My Code
? What's the identifier of your extension? roast-my-code
? What's the description of your extension? Get your code humorously roasted by AI (1-11 intensity)
? Initialize a git repository? Yes
? Which bundler to use? esbuild
? Which package manager to use? npm
```

3. **Verify the generated structure**:
```
roast-my-code/
├── .vscode/
│   ├── extensions.json
│   ├── launch.json
│   ├── settings.json
│   └── tasks.json
├── src/
│   └── extension.ts
├── .gitignore
├── .vscodeignore
├── CHANGELOG.md
├── eslint.config.mjs
├── package.json
├── README.md
└── tsconfig.json
```

4. **Update `tsconfig.json`** to enable strict mode:

```json
{
  "compilerOptions": {
    "module": "Node16",
    "target": "ES2022",
    "lib": ["ES2022"],
    "sourceMap": true,
    "rootDir": "src",
    "outDir": "out",
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true
  }
}
```

#### Acceptance Criteria
- [ ] Project scaffolded with TypeScript template
- [ ] `npm install` completes without errors
- [ ] `npm run compile` succeeds
- [ ] Extension runs in Extension Development Host (F5)
- [ ] "Hello World" command works in debug instance

#### Verification Commands
```bash
npm install
npm run compile
# Press F5 in VS Code to launch Extension Development Host
# Run "Hello World" command from Command Palette
```

---

### Step 1.2: Package.json Configuration for Chat Participant

#### Context
Configure the extension manifest to register the chat participant and its commands. This is required before implementing the handler code.

#### Implementation Instructions

1. **Update `package.json`** with chat participant contribution:

```json
{
  "name": "roast-my-code",
  "displayName": "Roast My Code",
  "description": "Get your code humorously roasted by AI (1-11 intensity)",
  "version": "0.0.1",
  "publisher": "your-publisher-id",
  "engines": {
    "vscode": "^1.96.0"
  },
  "categories": [
    "Chat"
  ],
  "keywords": [
    "copilot",
    "chat",
    "roast",
    "code review",
    "humor"
  ],
  "activationEvents": [],
  "main": "./out/extension.js",
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
            "name": "workspace",
            "description": "Roast the entire workspace (structure, deps, config)"
          },
          {
            "name": "gordon",
            "description": "Gordon Ramsay-style kitchen nightmares roasting"
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
              "Critique this like Gordon Ramsay",
              "Roast my project",
              "Roast this workspace"
            ]
          }
        ]
      }
    ]
  },
  "scripts": {
    "vscode:prepublish": "npm run compile",
    "compile": "tsc -p ./",
    "watch": "tsc -watch -p ./",
    "lint": "eslint src"
  },
  "devDependencies": {
    "@types/vscode": "^1.96.0",
    "@types/node": "20.x",
    "typescript": "^5.7.2",
    "eslint": "^9.16.0",
    "@typescript-eslint/eslint-plugin": "^8.18.0",
    "@typescript-eslint/parser": "^8.18.0"
  }
}
```

2. **Add extension icon** (optional but recommended):
   - Create or download a roast/fire themed icon (128x128 PNG)
   - Add to `package.json`: `"icon": "images/icon.png"`

#### Acceptance Criteria
- [ ] `package.json` has chatParticipants contribution
- [ ] All 6 slash commands registered (level, workspace, gordon, shakespeare, haiku, explain)
- [ ] Disambiguation examples include workspace roasting
- [ ] `npm run compile` still succeeds
- [ ] No errors in Extension Development Host

#### Verification Commands
```bash
npm run compile
# F5 to launch, open Chat, type @roast - should appear in suggestions
```

---

## Checkpoint: Foundation Complete

Before proceeding to Phase 2, verify:

- [ ] Project compiles without errors
- [ ] Extension loads in Extension Development Host
- [ ] `@roast` appears in chat participant suggestions
- [ ] Slash commands appear when typing `/` after `@roast`

**Commands**:
```bash
npm run compile
npm run lint
# F5 → Open Chat → Type "@roast" → Verify appears in dropdown
```

---

## Phase 2: Core Prompts

### Step 2.1: Roast Level Definitions

#### Context
Define the roast level system (1-11) with specific prompting instructions for each level. These will be used to modify the LLM's behavior based on selected intensity.

#### Implementation Instructions

1. **Create directory structure**:
```bash
mkdir -p src/prompts
```

2. **Create `src/prompts/roastLevels.ts`**:

```typescript
export interface RoastLevel {
  level: number;
  name: string;
  emoji: string;
  description: string;
  promptModifier: string;
}

export const ROAST_LEVELS: RoastLevel[] = [
  {
    level: 1,
    name: "Whisper",
    emoji: "🌸",
    description: "Extremely gentle, almost complimentary",
    promptModifier: `You are being EXTREMELY gentle and supportive. Find something nice to say first, 
then offer the tiniest, most polite suggestion possible. Use phrases like "perhaps consider", 
"one tiny thought", "this is lovely, but maybe". Be almost apologetic about giving feedback.
Keep criticism to an absolute minimum - this code is precious and we must protect its feelings.`
  },
  {
    level: 2,
    name: "Polite",
    emoji: "🫖",
    description: "British-level politeness with subtle hints",
    promptModifier: `Channel your inner British politeness. Be exceedingly courteous while hinting at issues.
Use phrases like "I wonder if perhaps", "one might consider", "it's not my place to say, but".
Apologize before and after any criticism. Make suggestions sound like humble observations.
The code is quite good, really, there are just a few small matters worth mentioning.`
  },
  {
    level: 3,
    name: "Friendly",
    emoji: "😊",
    description: "Good-natured teasing, like a helpful colleague",
    promptModifier: `Be like a friendly coworker giving feedback. Use light humor and gentle teasing.
Mix genuine compliments with playful observations. Use phrases like "I see what you did there",
"classic move", "we've all been there". Keep it supportive but point out real issues with a smile.`
  },
  {
    level: 4,
    name: "Honest",
    emoji: "🎯",
    description: "Direct but kind feedback with humor",
    promptModifier: `Be direct and honest, but still kind. Point out issues clearly while maintaining a friendly tone.
Use humor to soften critiques. Acknowledge the positives, then address the problems straightforwardly.
No sugarcoating, but no harshness either. "Let's talk about this function" energy.`
  },
  {
    level: 5,
    name: "Sassy",
    emoji: "💅",
    description: "Sarcastic observations, eye-roll worthy",
    promptModifier: `Bring the sass. Use sarcasm and wit to point out issues. Channel your inner sassy friend 
who tells it like it is. Eye-roll at questionable decisions. Use phrases like "Oh honey", 
"Interesting choice", "That's certainly... a decision". Be sassy but still professional.`
  },
  {
    level: 6,
    name: "Spicy",
    emoji: "🌶️",
    description: "Pointed criticism wrapped in wit",
    promptModifier: `Turn up the heat. Make pointed observations with biting wit. Call out anti-patterns directly 
but cleverly. Use metaphors and analogies to highlight issues. "This code is like..." comparisons welcome.
Be clever in your criticism - make people laugh while they learn what's wrong.`
  },
  {
    level: 7,
    name: "Roasted",
    emoji: "🔥",
    description: "Classic roast comedy style",
    promptModifier: `Full roast mode. Channel comedy roast energy - savage but funny. No holding back on the jokes.
Point out every questionable decision with theatrical disappointment. Use hyperbole effectively.
"I've seen spaghetti code before, but this..." Make it memorable. This is the comedy central roast of code.`
  },
  {
    level: 8,
    name: "Scorched",
    emoji: "☀️",
    description: "No holding back, maximum sass",
    promptModifier: `Maximum intensity sass. Every issue gets called out with dramatic flair. Use dramatic reactions.
Channel disappointment energy. "Who hurt you?" vibes when looking at inheritance chains.
Make the developer question their life choices (humorously). Pull no punches but keep it clever.`
  },
  {
    level: 9,
    name: "Inferno",
    emoji: "🌋",
    description: "Dramatic, theatrical disappointment",
    promptModifier: `Theatrical devastation mode. React to bad code like it personally offended you. Use dramatic language.
Channel a disappointed mentor who has seen it all. "In all my years..." opening statements.
Make Shakespearean tragedy references. The code has wounded you. Be dramatically, theatrically disappointed.`
  },
  {
    level: 10,
    name: "Nuclear",
    emoji: "☢️",
    description: "Over-the-top devastation (workplace-safe)",
    promptModifier: `NUCLEAR ROAST MODE. Complete over-the-top devastation that's still workplace appropriate.
Every line is a disaster that must be addressed. Use apocalyptic metaphors. Compare to famous disasters.
Channel "what fresh hell is this" energy at maximum volume. Be absolutely unhinged but never offensive.
This code has ruined your day, your week, your faith in humanity.`
  },
  {
    level: 11,
    name: "These Go to Eleven",
    emoji: "🎸",
    description: "Maximum absurdist roasting - Spinal Tap reference",
    promptModifier: `THIS ONE GOES TO ELEVEN. Channel the absurdist energy of Spinal Tap. Maximum possible roasting.
Be completely over-the-top in the most ridiculous ways. Use increasingly absurd comparisons.
Reference that the roast level goes to 11 because 10 wasn't enough. Make up fictional code disasters 
this code rivals. Be so exaggerated it becomes surreal comedy. Invent dramatic consequences.
"This code doesn't just have technical debt - it owes money to three different mafias."
Workplace safe but absolutely unhinged energy. Pure comedic chaos.`
  }
];

export const DEFAULT_ROAST_LEVEL = 5;

export function getRoastLevel(level: number): RoastLevel {
  const clampedLevel = Math.max(1, Math.min(11, Math.round(level)));
  return ROAST_LEVELS[clampedLevel - 1];
}

export function parseRoastLevel(input: string): number | null {
  const parsed = parseInt(input.trim(), 10);
  if (isNaN(parsed) || parsed < 1 || parsed > 11) {
    return null;
  }
  return parsed;
}
```

#### Acceptance Criteria
- [ ] File created at `src/prompts/roastLevels.ts`
- [ ] All 11 levels defined with distinct personalities
- [ ] `getRoastLevel()` function works correctly
- [ ] `parseRoastLevel()` handles edge cases
- [ ] `npm run compile` succeeds

#### Verification Commands
```bash
npm run compile
npm run lint
```

---

### Step 2.2: System Prompts and Style Modifiers

#### Context
Create the base system prompt and style modifiers for special commands (Gordon Ramsay, Shakespeare, Haiku). These will be composed with roast levels to create the final LLM prompt.

#### Implementation Instructions

1. **Create `src/prompts/systemPrompts.ts`**:

```typescript
export const BASE_SYSTEM_PROMPT = `You are "Roast My Code", a witty code reviewer who delivers humorous but workplace-appropriate critiques of code.

## Your Core Principles:
1. ROAST THE CODE, NEVER THE CODER - critique decisions and patterns, not the person
2. Be genuinely funny - use wit, wordplay, metaphors, and comedic timing
3. Stay workplace-appropriate - NO profanity, slurs, offensive content, or personal attacks
4. Include real insights - every roast should point out actual issues (bugs, anti-patterns, code smells)
5. Be entertaining AND educational - the best roasts teach something

## What to Look For:
- Poor naming (variables like x, temp, data2)
- Code smells (god functions, deep nesting, magic numbers)
- Anti-patterns (callback hell, copy-paste programming)
- Missing error handling
- Questionable architecture decisions
- Over-engineering or under-engineering
- Commented-out code graveyards
- TODO comments from years ago
- Inconsistent formatting
- Security issues
- Performance problems

## Response Format:
- Start with an attention-grabbing opener
- Organize critiques from most to least egregious
- Use code references and line-specific callouts when possible
- End with a memorable closer
- Keep responses focused - don't pad with filler`;

export const WORKSPACE_SYSTEM_PROMPT = `You are "Roast My Code", a witty code reviewer who delivers humorous but workplace-appropriate critiques of entire projects and codebases.

## Your Core Principles:
1. ROAST THE PROJECT, NEVER THE DEVELOPERS - critique decisions and patterns, not people
2. Be genuinely funny - use wit, wordplay, metaphors, and comedic timing
3. Stay workplace-appropriate - NO profanity, slurs, offensive content, or personal attacks
4. Include real insights - every roast should point out actual issues
5. Be entertaining AND educational - the best roasts teach something

## What to Look For in Workspace Roasts:
- Project structure and folder organization (or lack thereof)
- Dependency choices and package.json/requirements.txt bloat
- Configuration file quality and consistency
- README quality (or the classic "TODO: write documentation")
- Naming conventions across the project
- Overall architecture decisions visible from structure
- Build configuration complexity
- Test coverage (folder existence, naming patterns)
- Environment setup complexity
- Any obvious anti-patterns in project setup
- Files that don't belong (node_modules committed, .env files, etc.)
- Inconsistent tooling choices

## Response Format:
- Start with a dramatic opener about the project
- Organize by category (Structure, Dependencies, Config, Documentation, etc.)
- Use specific examples from what you see
- End with a memorable summary
- Be thorough but not exhaustive`;

export const SAFETY_REMINDER = `
## CRITICAL SAFETY RULES (NEVER VIOLATE):
- Never use profanity or offensive language
- Never make personal attacks on the developer
- Never reference protected characteristics
- Never be mean-spirited - be funny, not cruel
- If you can't be funny AND appropriate, just be appropriate`;
```

2. **Create `src/prompts/stylePrompts.ts`**:

```typescript
export interface RoastStyle {
  name: string;
  command: string;
  promptModifier: string;
}

export const ROAST_STYLES: Record<string, RoastStyle> = {
  gordon: {
    name: "Gordon Ramsay",
    command: "gordon",
    promptModifier: `Channel Gordon Ramsay from Kitchen Nightmares reviewing this code.

Style guidelines:
- Use his signature phrases: "IT'S RAW!", "BLOODY HELL!", "THIS IS A DISASTER!"
- Express passionate disappointment at code quality
- Reference cooking/kitchen metaphors ("This code is undercooked", "You've burnt this function")
- Use dramatic rhetorical questions ("What IS this?!", "Do you actually READ documentation?!")
- Show moments of exasperation followed by trying to explain properly
- Include at least one "SHUT IT DOWN" reference if code is very bad
- End with either grudging respect OR dramatic demands for improvement

Remember: Gordon is tough but ultimately wants the restaurant (code) to succeed.
Keep it TV-appropriate - no actual profanity, use his TV-censored style.`
  },

  shakespeare: {
    name: "Shakespeare",
    command: "shakespeare",
    promptModifier: `Deliver this code review as a Shakespearean dramatic monologue.

Style guidelines:
- Write in iambic pentameter where possible
- Use "thee", "thou", "doth", "wherefore", "'tis", etc.
- Reference Shakespearean tragedies ("Alas, poor function, I knew it well")
- Include dramatic asides to the audience (in parentheses)
- Use extended metaphors comparing code to tragic heroes, doomed romances
- Reference famous lines adapted to code: "To refactor, or not to refactor"
- Include at least one "EXIT, pursued by a bear" style stage direction for bad code
- End with a dramatic couplet summarizing the state of the code

Structure as a soliloquy with act/scene notation if reviewing multiple issues.`
  },

  haiku: {
    name: "Haiku Master",
    command: "haiku",
    promptModifier: `Deliver this code review as a series of haikus (5-7-5 syllable structure).

Style guidelines:
- Each code issue gets its own haiku
- Maintain strict 5-7-5 syllable count
- Use nature imagery to describe code problems
- Be contemplative and zen, but still pointed
- Follow traditional haiku aesthetics:
  * Present tense
  * Seasonal/nature reference when possible
  * A moment of insight or revelation
- After all haikus, include a brief translation of what's actually wrong

Example format:
"Null check forgotten
Production will remember
Update resume"

(Translation: You're not checking for null on line 15, and this WILL crash in production.)`
  },

  explain: {
    name: "Serious Mode",
    command: "explain",
    promptModifier: `Switch to serious, helpful code review mode. Still be friendly, but focus on actionable feedback.

Style guidelines:
- Drop the roasting persona
- Provide clear, constructive feedback
- Explain WHY something is problematic, not just that it is
- Offer specific suggestions for improvement
- Include code examples where helpful
- Organize by priority (critical issues first)
- Be encouraging while being honest
- This is "helpful senior developer" mode, not "comedy roast" mode`
  }
};

export function getStylePrompt(command: string): RoastStyle | undefined {
  return ROAST_STYLES[command.toLowerCase()];
}
```

#### Acceptance Criteria
- [ ] `src/prompts/systemPrompts.ts` created with base prompt AND workspace prompt
- [ ] `src/prompts/stylePrompts.ts` created with all 4 styles
- [ ] All styles have distinct, well-defined personalities
- [ ] `getStylePrompt()` function works
- [ ] `npm run compile` succeeds

#### Verification Commands
```bash
npm run compile
npm run lint
```

---

## Checkpoint: Core Prompts Complete

Before proceeding to Phase 3, verify:

- [ ] All 11 roast levels defined with distinct personalities
- [ ] All 4 style modifiers defined (gordon, shakespeare, haiku, explain)
- [ ] Base system prompt includes safety guidelines
- [ ] Workspace system prompt created for project roasting
- [ ] Project compiles without errors

**Commands**:
```bash
npm run compile
npm run lint
```

---

## Phase 3: Chat Participant Implementation

### Step 3.1: Code Extraction Utility

#### Context
Create a utility to extract code from the chat context (selection, file, or chat variables). This handles the various ways users might provide code to roast.

#### Implementation Instructions

1. **Create `src/utils/codeExtractor.ts`**:

```typescript
import * as vscode from 'vscode';

export interface ExtractedCode {
  code: string;
  language: string;
  source: 'selection' | 'file' | 'variable' | 'workspace' | 'none';
  fileName?: string;
}

export async function extractCodeFromContext(
  request: vscode.ChatRequest
): Promise<ExtractedCode> {
  // 1. Check for #selection or #file variables in the request
  for (const ref of request.references) {
    if (ref.id === 'vscode.selection') {
      const value = ref.value;
      if (typeof value === 'object' && 'text' in value) {
        const textValue = value as { text: string; uri?: vscode.Uri };
        return {
          code: textValue.text,
          language: getLanguageFromUri(textValue.uri),
          source: 'variable',
          fileName: textValue.uri?.fsPath?.split(/[/\\]/).pop()
        };
      }
    }
    if (ref.id === 'vscode.file') {
      const value = ref.value;
      if (value instanceof vscode.Uri) {
        const document = await vscode.workspace.openTextDocument(value);
        return {
          code: document.getText(),
          language: document.languageId,
          source: 'variable',
          fileName: value.fsPath.split(/[/\\]/).pop()
        };
      }
    }
  }

  // 2. Check for active editor selection
  const editor = vscode.window.activeTextEditor;
  if (editor) {
    const selection = editor.selection;
    if (!selection.isEmpty) {
      return {
        code: editor.document.getText(selection),
        language: editor.document.languageId,
        source: 'selection',
        fileName: editor.document.fileName.split(/[/\\]/).pop()
      };
    }

    // 3. Fall back to entire file if no selection
    const fullText = editor.document.getText();
    if (fullText.trim().length > 0) {
      return {
        code: fullText,
        language: editor.document.languageId,
        source: 'file',
        fileName: editor.document.fileName.split(/[/\\]/).pop()
      };
    }
  }

  // 4. No code found
  return {
    code: '',
    language: 'plaintext',
    source: 'none'
  };
}

function getLanguageFromUri(uri?: vscode.Uri): string {
  if (!uri) return 'plaintext';
  
  const ext = uri.fsPath.split('.').pop()?.toLowerCase();
  const extensionMap: Record<string, string> = {
    'ts': 'typescript',
    'tsx': 'typescriptreact',
    'js': 'javascript',
    'jsx': 'javascriptreact',
    'py': 'python',
    'rb': 'ruby',
    'go': 'go',
    'rs': 'rust',
    'java': 'java',
    'cs': 'csharp',
    'cpp': 'cpp',
    'c': 'c',
    'php': 'php',
    'swift': 'swift',
    'kt': 'kotlin',
    'scala': 'scala',
    'html': 'html',
    'css': 'css',
    'scss': 'scss',
    'json': 'json',
    'yaml': 'yaml',
    'yml': 'yaml',
    'md': 'markdown',
    'sql': 'sql',
    'sh': 'shellscript',
    'bash': 'shellscript',
    'ps1': 'powershell'
  };
  
  return extensionMap[ext || ''] || 'plaintext';
}

export function truncateCode(code: string, maxLength: number = 10000): string {
  if (code.length <= maxLength) return code;
  
  return code.substring(0, maxLength) + '\n\n// ... [Code truncated for roasting - you have a LOT of code to roast!]';
}
```

#### Acceptance Criteria
- [ ] `src/utils/codeExtractor.ts` created
- [ ] Handles chat variables (#selection, #file)
- [ ] Falls back to editor selection
- [ ] Falls back to entire file
- [ ] Returns 'none' source when no code found (triggers workspace roast)
- [ ] Detects language from file extension
- [ ] Truncates extremely long code
- [ ] `npm run compile` succeeds

#### Verification Commands
```bash
npm run compile
npm run lint
```

---

### Step 3.2: Chat Participant Handler

#### Context
Implement the main chat participant request handler that orchestrates code extraction, prompt construction, and LLM interaction. This step implements basic code roasting; workspace roasting is added in Phase 4.

#### Implementation Instructions

1. **Create `src/roastParticipant.ts`**:

```typescript
import * as vscode from 'vscode';
import { extractCodeFromContext, truncateCode, ExtractedCode } from './utils/codeExtractor';
import { getRoastLevel, parseRoastLevel, DEFAULT_ROAST_LEVEL, RoastLevel } from './prompts/roastLevels';
import { getStylePrompt, RoastStyle } from './prompts/stylePrompts';
import { BASE_SYSTEM_PROMPT, SAFETY_REMINDER } from './prompts/systemPrompts';

const PARTICIPANT_ID = 'roast-my-code.roast';

interface RoastResult extends vscode.ChatResult {
  metadata: {
    command?: string;
    level: number;
    codeLanguage?: string;
    roastType: 'code' | 'workspace';
  };
}

// Session state - persists roast level within the session
let sessionRoastLevel = DEFAULT_ROAST_LEVEL;

export function getSessionRoastLevel(): number {
  return sessionRoastLevel;
}

export function setSessionRoastLevel(level: number): void {
  sessionRoastLevel = level;
}

export function createRoastParticipant(context: vscode.ExtensionContext): vscode.ChatParticipant {
  const handler: vscode.ChatRequestHandler = async (
    request: vscode.ChatRequest,
    chatContext: vscode.ChatContext,
    stream: vscode.ChatResponseStream,
    token: vscode.CancellationToken
  ): Promise<RoastResult> => {
    
    // Handle /level command
    if (request.command === 'level') {
      return handleLevelCommand(request, stream);
    }

    // Handle /workspace command - force workspace roast
    if (request.command === 'workspace') {
      return handleWorkspaceRoast(request, stream, token);
    }

    // Extract code from context
    const extracted = await extractCodeFromContext(request);
    
    // If no code found, fall back to workspace roast
    if (extracted.source === 'none' || extracted.code.trim().length === 0) {
      return handleWorkspaceRoast(request, stream, token);
    }

    // Determine style and level
    const style = request.command ? getStylePrompt(request.command) : undefined;
    const level = getRoastLevel(sessionRoastLevel);

    // Build and send the prompt
    const prompt = buildPrompt(extracted, level, style, request.prompt);
    
    stream.progress(`🔥 Preparing ${level.emoji} ${level.name} level roast...`);

    try {
      // Send to language model
      const messages = [
        vscode.LanguageModelChatMessage.User(prompt)
      ];

      const response = await request.model.sendRequest(messages, {}, token);

      // Stream the response
      for await (const chunk of response.text) {
        if (token.isCancellationRequested) {
          break;
        }
        stream.markdown(chunk);
      }

    } catch (error) {
      handleError(error, stream);
    }

    return {
      metadata: {
        command: request.command,
        level: sessionRoastLevel,
        codeLanguage: extracted.language,
        roastType: 'code'
      }
    };
  };

  // Create the participant
  const participant = vscode.chat.createChatParticipant(PARTICIPANT_ID, handler);
  participant.iconPath = new vscode.ThemeIcon('flame');
  
  // Add follow-up provider
  participant.followupProvider = {
    provideFollowups(result: RoastResult, _context: vscode.ChatContext, _token: vscode.CancellationToken) {
      const followups: vscode.ChatFollowup[] = [];
      
      if (result.metadata.command !== 'explain') {
        followups.push({
          prompt: 'What\'s actually wrong with this code?',
          command: 'explain',
          label: '🎓 Explain seriously'
        });
      }
      
      if (result.metadata.level < 11) {
        followups.push({
          prompt: `Roast it harder at level ${Math.min(11, result.metadata.level + 2)}!`,
          label: '🔥 Turn up the heat!'
        });
      }
      
      if (result.metadata.roastType === 'code') {
        followups.push({
          prompt: 'Roast the whole project!',
          command: 'workspace',
          label: '🏗️ Roast entire workspace'
        });
      }
      
      followups.push({
        prompt: 'Roast this code!',
        command: 'gordon',
        label: '👨‍🍳 Gordon Ramsay style'
      });
      
      return followups;
    }
  };

  return participant;
}

function handleLevelCommand(
  request: vscode.ChatRequest,
  stream: vscode.ChatResponseStream
): RoastResult {
  const newLevel = parseRoastLevel(request.prompt);
  
  if (newLevel === null) {
    stream.markdown(`⚠️ Invalid roast level. Please specify a number from 1-11.\n\nExample: \`@roast /level 7\`\n\nCurrent level: **${sessionRoastLevel}** ${getRoastLevel(sessionRoastLevel).emoji}`);
    return { metadata: { command: 'level', level: sessionRoastLevel, roastType: 'code' } };
  }
  
  sessionRoastLevel = newLevel;
  const level = getRoastLevel(newLevel);
  
  stream.markdown(`🎚️ Roast level set to **${level.level} - ${level.name}** ${level.emoji}\n\n*${level.description}*\n\nNow select some code and ask me to roast it!`);
  
  return { metadata: { command: 'level', level: sessionRoastLevel, roastType: 'code' } };
}

// Placeholder - will be implemented in Phase 4
async function handleWorkspaceRoast(
  _request: vscode.ChatRequest,
  stream: vscode.ChatResponseStream,
  _token: vscode.CancellationToken
): Promise<RoastResult> {
  stream.markdown(`🏗️ **Workspace Roasting Coming Soon!**\n\nFor now, please select some code or open a file to roast.`);
  return { metadata: { command: 'workspace', level: sessionRoastLevel, roastType: 'workspace' } };
}

function buildPrompt(
  extracted: ExtractedCode,
  level: RoastLevel,
  style: RoastStyle | undefined,
  userPrompt: string
): string {
  const truncatedCode = truncateCode(extracted.code);
  
  let prompt = BASE_SYSTEM_PROMPT;
  
  // Add level modifier
  prompt += `\n\n## Current Roast Level: ${level.level}/11 - ${level.name} ${level.emoji}\n${level.promptModifier}`;
  
  // Add style modifier if applicable
  if (style) {
    prompt += `\n\n## Special Style: ${style.name}\n${style.promptModifier}`;
  }
  
  // Add safety reminder
  prompt += SAFETY_REMINDER;
  
  // Add code context
  prompt += `\n\n## Code to Roast\n`;
  if (extracted.fileName) {
    prompt += `File: ${extracted.fileName}\n`;
  }
  prompt += `Language: ${extracted.language}\n`;
  prompt += `\`\`\`${extracted.language}\n${truncatedCode}\n\`\`\``;
  
  // Add user's additional prompt if any
  if (userPrompt.trim()) {
    prompt += `\n\n## Additional Context from User\n${userPrompt}`;
  }
  
  prompt += `\n\nNow roast this code at ${level.name} intensity! Remember: roast the code, not the coder.`;
  
  return prompt;
}

function handleError(error: unknown, stream: vscode.ChatResponseStream): void {
  console.error('Roast My Code error:', error);
  
  if (error instanceof vscode.LanguageModelError) {
    if (error.code === vscode.LanguageModelError.Blocked.name) {
      stream.markdown(`😅 Whoa there! The language model blocked that response. Even I have limits!\n\nTry selecting different code or lowering the roast level.`);
    } else if (error.code === vscode.LanguageModelError.NotFound.name) {
      stream.markdown(`❌ Couldn't find a language model to use. Make sure you have GitHub Copilot enabled!`);
    } else {
      stream.markdown(`❌ Something went wrong with the language model: ${error.message}`);
    }
  } else {
    stream.markdown(`❌ Oops! Something went wrong while preparing your roast. Please try again.`);
  }
}
```

#### Acceptance Criteria
- [ ] `src/roastParticipant.ts` created
- [ ] Handler processes all commands (level, workspace, gordon, shakespeare, haiku, explain)
- [ ] Extracts code from context correctly
- [ ] Falls back to workspace roast when no code found
- [ ] Builds prompt with level and style modifiers
- [ ] Streams response back to chat
- [ ] Follow-up provider offers relevant suggestions including workspace option
- [ ] Error handling for all LLM error types
- [ ] `npm run compile` succeeds

#### Verification Commands
```bash
npm run compile
npm run lint
```

---

### Step 3.3: Extension Entry Point

#### Context
Wire up the chat participant in the extension entry point. This is where everything comes together.

#### Implementation Instructions

1. **Update `src/extension.ts`**:

```typescript
import * as vscode from 'vscode';
import { createRoastParticipant } from './roastParticipant';

export function activate(context: vscode.ExtensionContext) {
  console.log('🔥 Roast My Code is now active!');

  // Create and register the chat participant
  const participant = createRoastParticipant(context);
  
  // Register for disposal
  context.subscriptions.push(participant);

  // Optional: Register a command to open chat with @roast
  const openRoastCommand = vscode.commands.registerCommand('roast-my-code.openRoast', async () => {
    // Open chat and pre-fill with @roast
    await vscode.commands.executeCommand('workbench.action.chat.open', {
      query: '@roast '
    });
  });
  
  context.subscriptions.push(openRoastCommand);
}

export function deactivate() {
  console.log('🔥 Roast My Code has been deactivated. Stay crispy!');
}
```

2. **Add the command to `package.json`** (in contributes section):

```json
"commands": [
  {
    "command": "roast-my-code.openRoast",
    "title": "Roast My Code: Open Roast Chat",
    "icon": "$(flame)"
  }
]
```

#### Acceptance Criteria
- [ ] `src/extension.ts` updated with participant registration
- [ ] Command registered to open roast chat
- [ ] Extension activates without errors
- [ ] Chat participant is functional in Extension Development Host
- [ ] `npm run compile` succeeds

#### Verification Commands
```bash
npm run compile
npm run lint
# F5 → Open Chat → @roast → Select code → Test roasting
```

---

## Checkpoint: Chat Participant Complete

Before proceeding to Phase 4, verify:

- [ ] Extension compiles without errors
- [ ] `@roast` participant responds in chat
- [ ] Code extraction works (selection, file, variables)
- [ ] Different roast levels produce different responses
- [ ] `/level` command changes the level
- [ ] Follow-up suggestions appear after roasts
- [ ] When no code is available, placeholder workspace message appears

**Manual Testing**:
1. F5 to launch Extension Development Host
2. Open a code file
3. Select some code
4. Open Chat, type `@roast`
5. Verify roast is generated
6. Try `/level 11` then roast again
7. Close all files, type `@roast` - should see workspace placeholder

---

## Phase 4: Workspace Roasting

### Step 4.1: Workspace Analyzer Utility

#### Context
Create a utility that analyzes the workspace structure, dependencies, configuration, and documentation to generate a comprehensive workspace summary for roasting.

#### Implementation Instructions

1. **Create `src/utils/workspaceAnalyzer.ts`**:

```typescript
import * as vscode from 'vscode';
import * as path from 'path';

export interface WorkspaceAnalysis {
  name: string;
  rootPath: string;
  structure: FolderStructure;
  dependencies: DependencyInfo;
  configFiles: ConfigFileInfo[];
  documentation: DocumentationInfo;
  codeStats: CodeStats;
}

export interface FolderStructure {
  rootFiles: string[];
  rootFolders: string[];
  totalFiles: number;
  totalFolders: number;
  deepestNesting: number;
  suspiciousItems: string[]; // node_modules committed, .env files, etc.
}

export interface DependencyInfo {
  packageManager: 'npm' | 'yarn' | 'pnpm' | 'pip' | 'cargo' | 'go' | 'unknown';
  totalDependencies: number;
  devDependencies: number;
  packageJsonContent?: string;
  requirementsTxt?: string;
  cargoToml?: string;
}

export interface ConfigFileInfo {
  name: string;
  exists: boolean;
  preview?: string;
}

export interface DocumentationInfo {
  hasReadme: boolean;
  readmeLength: number;
  readmePreview?: string;
  hasContributing: boolean;
  hasChangelog: boolean;
  hasLicense: boolean;
}

export interface CodeStats {
  languages: Record<string, number>;
  totalCodeFiles: number;
  hasTests: boolean;
  testFolderName?: string;
}

export async function analyzeWorkspace(): Promise<WorkspaceAnalysis | null> {
  const workspaceFolders = vscode.workspace.workspaceFolders;
  if (!workspaceFolders || workspaceFolders.length === 0) {
    return null;
  }

  const rootFolder = workspaceFolders[0];
  const rootPath = rootFolder.uri.fsPath;

  const [structure, dependencies, configFiles, documentation, codeStats] = await Promise.all([
    analyzeStructure(rootPath),
    analyzeDependencies(rootPath),
    analyzeConfigFiles(rootPath),
    analyzeDocumentation(rootPath),
    analyzeCodeStats(rootPath)
  ]);

  return {
    name: rootFolder.name,
    rootPath,
    structure,
    dependencies,
    configFiles,
    documentation,
    codeStats
  };
}

// Implementation details for each analyze function...
// (Full implementation with analyzeStructure, analyzeDependencies, 
//  analyzeConfigFiles, analyzeDocumentation, analyzeCodeStats, 
//  and formatWorkspaceAnalysis)

export function formatWorkspaceAnalysis(analysis: WorkspaceAnalysis): string {
  // Returns formatted markdown summary for LLM consumption
  // Including structure, dependencies, config files, documentation, code stats
}
```

The full implementation should include:
- `analyzeStructure()` - counts files/folders, detects suspicious items
- `analyzeDependencies()` - reads package.json, requirements.txt, Cargo.toml
- `analyzeConfigFiles()` - checks for common config files
- `analyzeDocumentation()` - checks README, CONTRIBUTING, CHANGELOG, LICENSE
- `analyzeCodeStats()` - detects languages, test folders
- `formatWorkspaceAnalysis()` - formats for LLM prompt

#### Acceptance Criteria
- [ ] `src/utils/workspaceAnalyzer.ts` created
- [ ] Analyzes project structure (files, folders, nesting)
- [ ] Detects dependencies (npm, pip, cargo, go)
- [ ] Checks for configuration files
- [ ] Analyzes documentation (README, LICENSE, etc.)
- [ ] Detects languages and test setup
- [ ] Spots suspicious items (committed node_modules, .env files)
- [ ] Generates formatted summary for LLM
- [ ] `npm run compile` succeeds

#### Verification Commands
```bash
npm run compile
npm run lint
```

---

### Step 4.2: Implement Workspace Roast Handler

#### Context
Update the roast participant to actually perform workspace roasting using the analyzer.

#### Implementation Instructions

1. **Update `src/roastParticipant.ts`** - replace the `handleWorkspaceRoast` placeholder:

```typescript
// Add import at top of file
import { analyzeWorkspace, formatWorkspaceAnalysis } from './utils/workspaceAnalyzer';
import { WORKSPACE_SYSTEM_PROMPT } from './prompts/systemPrompts';

// Replace the handleWorkspaceRoast function:
async function handleWorkspaceRoast(
  request: vscode.ChatRequest,
  stream: vscode.ChatResponseStream,
  token: vscode.CancellationToken
): Promise<RoastResult> {
  const level = getRoastLevel(sessionRoastLevel);
  const style = request.command && request.command !== 'workspace' 
    ? getStylePrompt(request.command) 
    : undefined;

  stream.progress(`🏗️ Analyzing your workspace for maximum roast potential...`);
  
  const analysis = await analyzeWorkspace();
  
  if (!analysis) {
    stream.markdown(`## 🤷 No Workspace Found!\n\nI'd love to roast your project, but you don't seem to have a workspace open.\n\nOpen a folder in VS Code and try again!`);
    return { metadata: { command: 'workspace', level: sessionRoastLevel, roastType: 'workspace' } };
  }

  stream.progress(`🔥 Preparing ${level.emoji} ${level.name} level workspace roast...`);

  const workspaceSummary = formatWorkspaceAnalysis(analysis);
  const prompt = buildWorkspacePrompt(workspaceSummary, level, style, request.prompt);

  try {
    const messages = [
      vscode.LanguageModelChatMessage.User(prompt)
    ];

    const response = await request.model.sendRequest(messages, {}, token);

    for await (const chunk of response.text) {
      if (token.isCancellationRequested) {
        break;
      }
      stream.markdown(chunk);
    }

  } catch (error) {
    handleError(error, stream);
  }

  return {
    metadata: {
      command: request.command,
      level: sessionRoastLevel,
      roastType: 'workspace'
    }
  };
}

function buildWorkspacePrompt(
  workspaceSummary: string,
  level: RoastLevel,
  style: RoastStyle | undefined,
  userPrompt: string
): string {
  let prompt = WORKSPACE_SYSTEM_PROMPT;
  
  // Add level modifier
  prompt += `\n\n## Current Roast Level: ${level.level}/11 - ${level.name} ${level.emoji}\n${level.promptModifier}`;
  
  // Add style modifier if applicable
  if (style) {
    prompt += `\n\n## Special Style: ${style.name}\n${style.promptModifier}`;
  }
  
  // Add safety reminder
  prompt += SAFETY_REMINDER;
  
  // Add workspace analysis
  prompt += `\n\n## Workspace to Roast\n${workspaceSummary}`;
  
  // Add user's additional prompt if any
  if (userPrompt.trim()) {
    prompt += `\n\n## Additional Context from User\n${userPrompt}`;
  }
  
  prompt += `\n\nNow roast this workspace at ${level.name} intensity! Focus on project structure, dependencies, configuration, and documentation. Remember: roast the project, not the developers.`;
  
  return prompt;
}
```

2. **Update the import** at the top of the file:

```typescript
import { BASE_SYSTEM_PROMPT, WORKSPACE_SYSTEM_PROMPT, SAFETY_REMINDER } from './prompts/systemPrompts';
```

#### Acceptance Criteria
- [ ] `handleWorkspaceRoast` function fully implemented
- [ ] Analyzes workspace and generates roast
- [ ] Works with `/workspace` command
- [ ] Falls back to workspace roast when no code selected
- [ ] Respects roast level for workspace roasts
- [ ] Supports style modifiers for workspace roasts
- [ ] `npm run compile` succeeds

#### Verification Commands
```bash
npm run compile
npm run lint
# F5 → Close all files → @roast → Should roast workspace
# F5 → @roast /workspace → Should roast workspace
```

---

## Checkpoint: Workspace Roasting Complete

Before proceeding to Phase 5, verify:

- [ ] `@roast` with no file open roasts the workspace
- [ ] `@roast /workspace` explicitly roasts the workspace
- [ ] Workspace analysis detects project structure
- [ ] Workspace analysis finds dependencies
- [ ] Workspace analysis checks documentation
- [ ] Roast levels work for workspace roasts
- [ ] Style modifiers work for workspace roasts

**Manual Testing**:
1. F5 to launch Extension Development Host
2. Close all editor tabs
3. Open Chat, type `@roast`
4. Verify workspace roast is generated
5. Try `@roast /workspace /level 11`
6. Try `@roast /workspace /gordon`

---

## Phase 5: Commands & Features

### Step 5.1: Context Menu Integration

#### Context
Add a right-click context menu option to quickly roast selected code without opening chat first.

#### Implementation Instructions

1. **Update `package.json`** contributes section:

```json
"menus": {
  "editor/context": [
    {
      "command": "roast-my-code.roastSelection",
      "when": "editorHasSelection",
      "group": "1_modification@100"
    }
  ]
},
"commands": [
  {
    "command": "roast-my-code.openRoast",
    "title": "Roast My Code: Open Roast Chat",
    "icon": "$(flame)"
  },
  {
    "command": "roast-my-code.roastSelection",
    "title": "🔥 Roast This Code",
    "icon": "$(flame)"
  }
]
```

2. **Update `src/extension.ts`** to register the command:

```typescript
import * as vscode from 'vscode';
import { createRoastParticipant } from './roastParticipant';

export function activate(context: vscode.ExtensionContext) {
  console.log('🔥 Roast My Code is now active!');

  // Create and register the chat participant
  const participant = createRoastParticipant(context);
  context.subscriptions.push(participant);

  // Command to open chat with @roast
  const openRoastCommand = vscode.commands.registerCommand('roast-my-code.openRoast', async () => {
    await vscode.commands.executeCommand('workbench.action.chat.open', {
      query: '@roast '
    });
  });
  context.subscriptions.push(openRoastCommand);

  // Command to roast current selection via context menu
  const roastSelectionCommand = vscode.commands.registerCommand('roast-my-code.roastSelection', async () => {
    const editor = vscode.window.activeTextEditor;
    if (!editor || editor.selection.isEmpty) {
      vscode.window.showWarningMessage('Please select some code to roast!');
      return;
    }

    // Open chat with @roast and trigger the roast
    await vscode.commands.executeCommand('workbench.action.chat.open', {
      query: '@roast #selection Roast this code!'
    });
  });
  context.subscriptions.push(roastSelectionCommand);
}

export function deactivate() {
  console.log('🔥 Roast My Code has been deactivated. Stay crispy!');
}
```

#### Acceptance Criteria
- [ ] "🔥 Roast This Code" appears in context menu when text is selected
- [ ] Clicking it opens chat with @roast
- [ ] Selection is included in the roast
- [ ] `npm run compile` succeeds

#### Verification Commands
```bash
npm run compile
# F5 → Select code → Right-click → "🔥 Roast This Code"
```

---

### Step 5.2: Status Bar Integration (Optional Enhancement)

#### Context
Add a status bar item showing current roast level that users can click to change it.

#### Implementation Instructions

1. **Create `src/ui/statusBar.ts`**:

```typescript
import * as vscode from 'vscode';
import { getRoastLevel, ROAST_LEVELS, DEFAULT_ROAST_LEVEL } from '../prompts/roastLevels';

let statusBarItem: vscode.StatusBarItem;
let currentLevel = DEFAULT_ROAST_LEVEL;

export function createStatusBarItem(context: vscode.ExtensionContext): vscode.StatusBarItem {
  statusBarItem = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Right,
    100
  );
  
  updateStatusBar(currentLevel);
  statusBarItem.command = 'roast-my-code.selectLevel';
  statusBarItem.show();
  
  // Register command to select level
  const selectLevelCommand = vscode.commands.registerCommand('roast-my-code.selectLevel', async () => {
    const items = ROAST_LEVELS.map(level => ({
      label: `${level.emoji} ${level.level} - ${level.name}`,
      description: level.description,
      level: level.level
    }));
    
    const selected = await vscode.window.showQuickPick(items, {
      placeHolder: 'Select roast intensity level (1-11)',
      title: '🔥 Roast Level'
    });
    
    if (selected) {
      currentLevel = selected.level;
      updateStatusBar(currentLevel);
      vscode.window.showInformationMessage(
        `Roast level set to ${selected.level} - ${getRoastLevel(selected.level).name} ${getRoastLevel(selected.level).emoji}`
      );
    }
  });
  
  context.subscriptions.push(statusBarItem, selectLevelCommand);
  return statusBarItem;
}

export function updateStatusBar(level: number): void {
  const roastLevel = getRoastLevel(level);
  statusBarItem.text = `${roastLevel.emoji} Roast: ${level}`;
  statusBarItem.tooltip = `Roast Level: ${roastLevel.name}\n${roastLevel.description}\nClick to change`;
}

export function getCurrentLevel(): number {
  return currentLevel;
}

export function setCurrentLevel(level: number): void {
  currentLevel = level;
  updateStatusBar(level);
}
```

2. **Create directory and update extension.ts**:

```bash
mkdir -p src/ui
```

3. **Update `src/extension.ts`**:

```typescript
import * as vscode from 'vscode';
import { createRoastParticipant } from './roastParticipant';
import { createStatusBarItem, getCurrentLevel, setCurrentLevel } from './ui/statusBar';

export function activate(context: vscode.ExtensionContext) {
  console.log('🔥 Roast My Code is now active!');

  // Create status bar item
  createStatusBarItem(context);

  // Create and register the chat participant
  const participant = createRoastParticipant(context);
  context.subscriptions.push(participant);

  // Command to open chat with @roast
  const openRoastCommand = vscode.commands.registerCommand('roast-my-code.openRoast', async () => {
    await vscode.commands.executeCommand('workbench.action.chat.open', {
      query: '@roast '
    });
  });
  context.subscriptions.push(openRoastCommand);

  // Command to roast current selection via context menu
  const roastSelectionCommand = vscode.commands.registerCommand('roast-my-code.roastSelection', async () => {
    const editor = vscode.window.activeTextEditor;
    if (!editor || editor.selection.isEmpty) {
      vscode.window.showWarningMessage('Please select some code to roast!');
      return;
    }

    await vscode.commands.executeCommand('workbench.action.chat.open', {
      query: '@roast #selection Roast this code!'
    });
  });
  context.subscriptions.push(roastSelectionCommand);
}

export function deactivate() {
  console.log('🔥 Roast My Code has been deactivated. Stay crispy!');
}
```

4. **Update `package.json`** commands:

```json
"commands": [
  {
    "command": "roast-my-code.openRoast",
    "title": "Roast My Code: Open Roast Chat",
    "icon": "$(flame)"
  },
  {
    "command": "roast-my-code.roastSelection",
    "title": "🔥 Roast This Code",
    "icon": "$(flame)"
  },
  {
    "command": "roast-my-code.selectLevel",
    "title": "Roast My Code: Select Roast Level"
  }
]
```

#### Acceptance Criteria
- [ ] Status bar shows current roast level with emoji
- [ ] Clicking status bar opens level picker
- [ ] Selecting a level updates the display
- [ ] Level persists within session
- [ ] `npm run compile` succeeds

#### Verification Commands
```bash
npm run compile
# F5 → Look at status bar (right side) → Click → Select level
```

---

## Checkpoint: Features Complete

Before proceeding to Phase 6, verify:

- [ ] Context menu "🔥 Roast This Code" works
- [ ] Status bar shows roast level
- [ ] Level picker updates level
- [ ] All commands registered and working

---

## Phase 6: Polish & Testing

### Step 6.1: README and Documentation

#### Context
Create comprehensive documentation for users and the VS Code Marketplace listing.

#### Implementation Instructions

1. **Update `README.md`**:

```markdown
# 🔥 Roast My Code

Get your code humorously roasted by AI! A VS Code extension that delivers workplace-appropriate, constructive code critiques with adjustable intensity levels from 1-11.

![Roast My Code Demo](images/demo.gif)

## Features

### 🎚️ Adjustable Roast Levels (1-11)

| Level | Name | Style |
|-------|------|-------|
| 1 | Whisper | Extremely gentle, almost complimentary |
| 2 | Polite | British-level politeness |
| 3 | Friendly | Good-natured teasing |
| 4 | Honest | Direct but kind |
| 5 | Sassy | Sarcastic observations |
| 6 | Spicy | Pointed criticism |
| 7 | Roasted | Classic roast style |
| 8 | Scorched | Maximum sass |
| 9 | Inferno | Theatrical disappointment |
| 10 | Nuclear | Over-the-top devastation |
| 11 | "These Go to Eleven" | Maximum absurdist roasting |

### 🎭 Special Roast Styles

- `/gordon` - Gordon Ramsay-style kitchen nightmares roasting
- `/shakespeare` - Dramatic Shakespearean critique
- `/haiku` - Roasts delivered as haikus
- `/explain` - Serious mode with actual fixes

## Usage

### Chat Mode
1. Open the Chat panel (Ctrl+Alt+I / Cmd+Alt+I)
2. Type `@roast` followed by your request
3. Select code in the editor or use `#selection`

### Context Menu
1. Select code in the editor
2. Right-click → "🔥 Roast This Code"

### Change Roast Level
- In chat: `@roast /level 7`
- Click the status bar icon and select

## Examples

**Level 5 (Sassy):**
> "Oh, nested ternaries? Bold choice. I too enjoy making my future self cry while debugging at 2am."

**Level 11 (These Go to Eleven):**
> "This code doesn't just have technical debt—it's declared bankruptcy in three countries."

**Gordon Ramsay Style:**
> "THIS CODE IS RAW! RAAAAW! Where's the error handling?! IT'S MISSING!"

## Requirements

- VS Code 1.96.0 or higher
- GitHub Copilot extension

## Extension Settings

This extension contributes no settings (yet!).

## Known Issues

- Roast level resets between sessions (persistence coming in v2)

## Release Notes

### 0.0.1

Initial release with:
- 11 roast levels
- 4 special styles (gordon, shakespeare, haiku, explain)
- Context menu integration
- Status bar level indicator

---

## Contributing

Found a bug? Want to add a new roast style? PRs welcome!

## License

MIT

---

*Remember: We roast the code, not the coder. Stay crispy!* 🔥
```

#### Acceptance Criteria
- [ ] README.md comprehensive and clear
- [ ] All features documented
- [ ] Examples included
- [ ] Requirements listed
- [ ] `npm run compile` succeeds

---

### Step 6.2: Final Testing & Package

#### Context
Final testing checklist and packaging for distribution.

#### Implementation Instructions

1. **Create test checklist** (run manually):

```markdown
## Manual Test Checklist

### Basic Functionality
- [ ] Extension activates without errors
- [ ] @roast appears in chat participant list
- [ ] Selecting code and asking for roast works
- [ ] Using #selection variable works
- [ ] Using #file variable works
- [ ] Opening file without selection roasts whole file

### Workspace Roasting
- [ ] @roast with no file open roasts workspace
- [ ] @roast /workspace explicitly roasts workspace
- [ ] Workspace roast shows project structure
- [ ] Workspace roast shows dependencies
- [ ] Workspace roast shows documentation status

### Roast Levels
- [ ] /level 1 produces gentle feedback
- [ ] /level 5 produces sassy feedback  
- [ ] /level 11 produces maximum absurdist feedback
- [ ] /level with invalid input shows error
- [ ] Level persists across multiple roasts

### Special Styles
- [ ] /gordon produces Gordon Ramsay style
- [ ] /shakespeare produces Shakespearean style
- [ ] /haiku produces haiku format
- [ ] /explain produces serious feedback
- [ ] Styles work with workspace roasting

### UI
- [ ] Status bar shows current level
- [ ] Clicking status bar opens level picker
- [ ] Context menu shows "🔥 Roast This Code"
- [ ] Context menu opens chat with selection

### Error Handling
- [ ] No selection shows workspace roast (not error)
- [ ] Empty workspace handled gracefully
- [ ] LLM errors show user-friendly messages
- [ ] Cancellation is respected

### Content Safety
- [ ] Run 20+ roasts at level 11 - verify all workplace appropriate
- [ ] Test workspace roast safety
- [ ] Test with controversial variable names - verify no offensive output
```

2. **Package the extension**:

```bash
# Install vsce if not already installed
npm install -g @vscode/vsce

# Package the extension
vsce package

# This creates roast-my-code-0.0.1.vsix
```

3. **Test the packaged extension**:

```bash
# Install the vsix in VS Code
code --install-extension roast-my-code-0.0.1.vsix
```

#### Acceptance Criteria
- [ ] All manual tests pass
- [ ] Extension packages without errors
- [ ] Packaged extension installs correctly
- [ ] Packaged extension works as expected

#### Verification Commands
```bash
npm run compile
npm run lint
vsce package
code --install-extension roast-my-code-0.0.1.vsix
```

---

## Final Verification Checklist

### Functional Requirements from Spec

| Requirement | Step | Verification |
|-------------|------|--------------|
| Chat participant @roast | 3.2, 3.3 | Type @roast in chat |
| Roast levels 1-11 | 2.1, 3.2 | /level command |
| /level command | 3.2 | @roast /level 7 |
| /workspace command | 4.1, 4.2 | @roast /workspace |
| /gordon command | 2.2, 3.2 | @roast /gordon |
| /shakespeare command | 2.2, 3.2 | @roast /shakespeare |
| /haiku command | 2.2, 3.2 | @roast /haiku |
| /explain command | 2.2, 3.2 | @roast /explain |
| Selection handling | 3.1, 3.2 | Select code, roast |
| File handling | 3.1, 3.2 | Open file, roast without selection |
| Workspace fallback | 4.1, 4.2 | Close files, roast |
| Follow-up suggestions | 3.2 | Check after roast |

### Success Criteria from Spec

- [ ] Chat participant `@roast` is registered and invocable
- [ ] Roast levels 1-11 produce noticeably different intensity responses
- [ ] All slash commands work (level, workspace, gordon, shakespeare, haiku, explain)
- [ ] Workspace roasting works when no file/selection is available
- [ ] Responses are genuinely funny (manual validation)
- [ ] All responses are workplace-appropriate (manual validation)
- [ ] Responses include actual code feedback
- [ ] Follow-up suggestions appear after roasts
- [ ] Extension works in Chat view
- [ ] Response streaming provides smooth UX

---

## Rollback Points

If implementation fails at any point:

| Failed At | Rollback To | How |
|-----------|-------------|-----|
| Phase 2 | Phase 1 complete | `git checkout [phase1-complete]` |
| Phase 3 | Phase 2 complete | `git checkout [phase2-complete]` |
| Phase 4 | Phase 3 complete | `git checkout [phase3-complete]` |
| Phase 5 | Phase 4 complete | `git checkout [phase4-complete]` |
| Phase 6 | Phase 5 complete | `git checkout [phase5-complete]` |

**Recommended commit points**:
- After Step 1.2 (Foundation complete)
- After Step 2.2 (Prompts complete)
- After Step 3.3 (Participant working)
- After Step 4.2 (Workspace roasting working)
- After Step 5.2 (Features complete)
- After Step 6.2 (Ready for release)

---

## Notes for AI Agent

1. **Execute steps sequentially** - each step builds on the previous
2. **Run `npm run compile`** after each step to verify no errors
3. **Test in Extension Development Host** (F5) after completing each phase
4. **Commit after each checkpoint** to preserve progress
5. **Workspace roasting is the key new feature** - ensure it works well
6. **The roast levels are crucial** - spend time getting the prompts right
7. **Test content safety** - run many roasts at high levels to verify appropriateness
8. **Don't skip the manual testing** - AI-generated content needs human validation
