# Roast My Code - Implementation Checklist

## Phase 1: Foundation

### Step 1.1: Project Scaffolding
- [ ] Run Yeoman generator
- [ ] Verify project structure created
- [ ] Enable TypeScript strict mode
- [ ] Run `npm install`
- [ ] Run `npm run compile`
- [ ] Test "Hello World" in Extension Development Host

### Step 1.2: Package.json Configuration
- [ ] Add chatParticipants contribution
- [ ] Register all 6 slash commands (level, workspace, gordon, shakespeare, haiku, explain)
- [ ] Add disambiguation examples including workspace roasting
- [ ] Verify @roast appears in chat suggestions

### ✅ Checkpoint: Foundation Complete
- [ ] Project compiles without errors
- [ ] Extension loads in Extension Development Host
- [ ] @roast appears in chat participant dropdown
- [ ] Slash commands appear when typing /

---

## Phase 2: Core Prompts

### Step 2.1: Roast Level Definitions
- [ ] Create `src/prompts/` directory
- [ ] Create `roastLevels.ts` with all 11 levels
- [ ] Implement `getRoastLevel()` function
- [ ] Implement `parseRoastLevel()` function
- [ ] Verify compile succeeds

### Step 2.2: System Prompts and Style Modifiers
- [ ] Create `systemPrompts.ts` with base prompt AND workspace prompt
- [ ] Create `stylePrompts.ts` with all 4 styles
- [ ] Implement `getStylePrompt()` function
- [ ] Verify compile succeeds

### ✅ Checkpoint: Core Prompts Complete
- [ ] All 11 roast levels defined
- [ ] All 4 style modifiers defined
- [ ] Base system prompt includes safety guidelines
- [ ] Workspace system prompt created

---

## Phase 3: Chat Participant Implementation

### Step 3.1: Code Extraction Utility
- [ ] Create `src/utils/` directory
- [ ] Create `codeExtractor.ts`
- [ ] Handle chat variables (#selection, #file)
- [ ] Handle editor selection
- [ ] Handle entire file fallback
- [ ] Return 'none' source when no code (triggers workspace roast)
- [ ] Implement language detection
- [ ] Implement code truncation
- [ ] Verify compile succeeds

### Step 3.2: Chat Participant Handler
- [ ] Create `roastParticipant.ts`
- [ ] Implement request handler
- [ ] Handle /level command
- [ ] Handle /workspace command (placeholder for Phase 4)
- [ ] Handle all style commands
- [ ] Fall back to workspace roast when no code found
- [ ] Build composite prompt
- [ ] Stream LLM response
- [ ] Implement error handling
- [ ] Add follow-up provider with workspace option
- [ ] Verify compile succeeds

### Step 3.3: Extension Entry Point
- [ ] Update `extension.ts` to register participant
- [ ] Add "Open Roast Chat" command
- [ ] Update package.json with new command
- [ ] Verify extension activates

### ✅ Checkpoint: Chat Participant Complete
- [ ] @roast responds in chat
- [ ] Code extraction works (selection, file, variables)
- [ ] Different roast levels work
- [ ] /level command changes level
- [ ] Follow-up suggestions appear (including workspace option)
- [ ] All slash commands work
- [ ] No code shows workspace placeholder message

---

## Phase 4: Workspace Roasting

### Step 4.1: Workspace Analyzer Utility
- [ ] Create `src/utils/workspaceAnalyzer.ts`
- [ ] Implement `analyzeStructure()` - files, folders, nesting
- [ ] Implement `analyzeDependencies()` - npm, pip, cargo, go detection
- [ ] Implement `analyzeConfigFiles()` - common config files
- [ ] Implement `analyzeDocumentation()` - README, LICENSE, etc.
- [ ] Implement `analyzeCodeStats()` - languages, tests
- [ ] Detect suspicious items (committed node_modules, .env files)
- [ ] Implement `formatWorkspaceAnalysis()` for LLM prompt
- [ ] Verify compile succeeds

### Step 4.2: Implement Workspace Roast Handler
- [ ] Replace `handleWorkspaceRoast` placeholder with full implementation
- [ ] Import and use workspace analyzer
- [ ] Use WORKSPACE_SYSTEM_PROMPT for workspace roasts
- [ ] Build workspace-specific prompt with analysis
- [ ] Support roast levels for workspace roasts
- [ ] Support style modifiers for workspace roasts
- [ ] Handle empty workspace gracefully
- [ ] Verify compile succeeds

### ✅ Checkpoint: Workspace Roasting Complete
- [ ] @roast with no file open roasts workspace
- [ ] @roast /workspace explicitly roasts workspace
- [ ] Workspace analysis detects project structure
- [ ] Workspace analysis finds dependencies
- [ ] Workspace analysis checks documentation
- [ ] Roast levels work for workspace roasts
- [ ] Style modifiers work for workspace roasts

---

## Phase 5: Commands & Features

### Step 5.1: Context Menu Integration
- [ ] Add menu contribution to package.json
- [ ] Register roastSelection command
- [ ] Opens chat with @roast #selection
- [ ] Verify appears on right-click

### Step 5.2: Status Bar Integration
- [ ] Create `src/ui/` directory
- [ ] Create `statusBar.ts`
- [ ] Show current roast level
- [ ] Implement level picker QuickPick
- [ ] Register selectLevel command
- [ ] Wire up in extension.ts
- [ ] Update package.json with command

### ✅ Checkpoint: Features Complete
- [ ] Context menu works
- [ ] Status bar shows level
- [ ] Level picker works

---

## Phase 6: Polish & Testing

### Step 6.1: README and Documentation
- [ ] Update README.md with full documentation
- [ ] Document workspace roasting feature
- [ ] Add feature descriptions
- [ ] Add usage examples
- [ ] Add requirements
- [ ] Add release notes

### Step 6.2: Final Testing & Package
- [ ] Run full manual test checklist
- [ ] Test all roast levels
- [ ] Test all styles
- [ ] Test workspace roasting
- [ ] Test content safety (20+ level 11 roasts)
- [ ] Test workspace roast safety
- [ ] Package with `vsce package`
- [ ] Install and test packaged extension

### ✅ Checkpoint: Ready for Release
- [ ] All tests pass
- [ ] Extension packaged
- [ ] Documentation complete

---

## Final Success Criteria

- [ ] Chat participant @roast is registered and invocable
- [ ] Roast levels 1-11 produce noticeably different intensity
- [ ] All slash commands work (level, workspace, gordon, shakespeare, haiku, explain)
- [ ] Workspace roasting works when no file/selection available
- [ ] Responses are genuinely funny
- [ ] All responses are workplace-appropriate
- [ ] Responses include actual code feedback
- [ ] Follow-up suggestions appear
- [ ] Response streaming is smooth
- [ ] Context menu works
- [ ] Status bar works

---

## Notes

- Commit after each ✅ Checkpoint
- Run `npm run compile` after every code change
- Test in Extension Development Host (F5) after each phase
- Workspace roasting is a key differentiator - test thoroughly
- Content safety validation requires manual review
