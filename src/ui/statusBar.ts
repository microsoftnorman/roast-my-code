import * as vscode from 'vscode';
import { getRoastLevel, ROAST_LEVELS } from '../prompts/roastLevels';
import { getSessionRoastLevel, setSessionRoastLevel } from '../roastParticipant';

let statusBarItem: vscode.StatusBarItem;

export function createStatusBarItem(context: vscode.ExtensionContext): vscode.StatusBarItem {
  statusBarItem = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Right,
    100
  );
  
  updateStatusBar(getSessionRoastLevel());
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
      setSessionRoastLevel(selected.level);
      updateStatusBar(selected.level);
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
