import * as vscode from 'vscode';
import { createRoastParticipant } from './roastParticipant';
import { createStatusBarItem } from './ui/statusBar';

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
