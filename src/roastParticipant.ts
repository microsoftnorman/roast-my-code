import * as vscode from 'vscode';
import { extractCodeFromContext, truncateCode, ExtractedCode } from './utils/codeExtractor';
import { analyzeWorkspace, formatWorkspaceAnalysis } from './utils/workspaceAnalyzer';
import { getRoastLevel, parseRoastLevel, DEFAULT_ROAST_LEVEL, RoastLevel } from './prompts/roastLevels';
import { getStylePrompt, RoastStyle } from './prompts/stylePrompts';
import { BASE_SYSTEM_PROMPT, WORKSPACE_SYSTEM_PROMPT, SAFETY_REMINDER } from './prompts/systemPrompts';

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

export function createRoastParticipant(_context: vscode.ExtensionContext): vscode.ChatParticipant {
  const handler: vscode.ChatRequestHandler = async (
    request: vscode.ChatRequest,
    _chatContext: vscode.ChatContext,
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
        prompt: 'Question everything about this code!',
        command: 'socrates',
        label: '🏛️ Socratic questioning'
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
