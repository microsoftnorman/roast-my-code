import * as vscode from 'vscode';

export interface ExtractedCode {
  code: string;
  language: string;
  source: 'selection' | 'file' | 'variable' | 'none';
  fileName?: string;
}

export async function extractCodeFromContext(
  request: vscode.ChatRequest
): Promise<ExtractedCode> {
  // 1. Check for #selection or #file variables in the request
  for (const ref of request.references) {
    if (ref.id === 'vscode.selection') {
      const value = ref.value;
      if (typeof value === 'object' && value !== null && 'text' in value) {
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
  if (!uri) {
    return 'plaintext';
  }
  
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
  if (code.length <= maxLength) {
    return code;
  }
  
  return code.substring(0, maxLength) + '\n\n// ... [Code truncated for roasting - you have a LOT of code to roast!]';
}
