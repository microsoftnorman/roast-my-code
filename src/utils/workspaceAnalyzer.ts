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
  suspiciousItems: string[];
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

async function analyzeStructure(rootPath: string): Promise<FolderStructure> {
  const rootItems = await vscode.workspace.fs.readDirectory(vscode.Uri.file(rootPath));
  
  const rootFiles: string[] = [];
  const rootFolders: string[] = [];
  const suspiciousItems: string[] = [];
  
  for (const [name, type] of rootItems) {
    if (type === vscode.FileType.File) {
      rootFiles.push(name);
      if (name === '.env' || name === '.env.local' || name === '.env.production') {
        suspiciousItems.push(`${name} (environment file in repo!)`);
      }
    } else if (type === vscode.FileType.Directory) {
      rootFolders.push(name);
      if (name === 'node_modules') {
        suspiciousItems.push('node_modules/ committed to repo!');
      }
      if (name === '__pycache__') {
        suspiciousItems.push('__pycache__/ committed to repo!');
      }
      if (name === '.venv' || name === 'venv') {
        suspiciousItems.push(`${name}/ (virtual env in repo!)`);
      }
    }
  }

  let totalFiles = 0;
  let totalFolders = 0;
  let deepestNesting = 0;

  async function countItems(dirPath: string, depth: number): Promise<void> {
    if (depth > 10) {
      return;
    }
    deepestNesting = Math.max(deepestNesting, depth);
    
    try {
      const items = await vscode.workspace.fs.readDirectory(vscode.Uri.file(dirPath));
      for (const [name, type] of items) {
        if (name.startsWith('.') || name === 'node_modules' || name === '__pycache__' || name === 'venv' || name === '.venv' || name === 'dist' || name === 'build' || name === 'out') {
          continue;
        }
        if (type === vscode.FileType.File) {
          totalFiles++;
        } else if (type === vscode.FileType.Directory) {
          totalFolders++;
          if (totalFolders < 100) {
            await countItems(path.join(dirPath, name), depth + 1);
          }
        }
      }
    } catch {
      // Ignore permission errors
    }
  }

  await countItems(rootPath, 0);

  return {
    rootFiles,
    rootFolders,
    totalFiles,
    totalFolders,
    deepestNesting,
    suspiciousItems
  };
}

async function analyzeDependencies(rootPath: string): Promise<DependencyInfo> {
  const result: DependencyInfo = {
    packageManager: 'unknown',
    totalDependencies: 0,
    devDependencies: 0
  };

  // Check for package.json (npm/yarn/pnpm)
  try {
    const packageJsonPath = vscode.Uri.file(path.join(rootPath, 'package.json'));
    const content = await vscode.workspace.fs.readFile(packageJsonPath);
    const packageJson = JSON.parse(content.toString());
    
    result.packageManager = 'npm';
    result.packageJsonContent = content.toString();
    result.totalDependencies = Object.keys(packageJson.dependencies || {}).length;
    result.devDependencies = Object.keys(packageJson.devDependencies || {}).length;
    
    // Check for yarn.lock or pnpm-lock.yaml
    try {
      await vscode.workspace.fs.stat(vscode.Uri.file(path.join(rootPath, 'yarn.lock')));
      result.packageManager = 'yarn';
    } catch {
      try {
        await vscode.workspace.fs.stat(vscode.Uri.file(path.join(rootPath, 'pnpm-lock.yaml')));
        result.packageManager = 'pnpm';
      } catch {
        // Keep npm
      }
    }
  } catch {
    // No package.json
  }

  // Check for requirements.txt (Python)
  if (result.packageManager === 'unknown') {
    try {
      const reqPath = vscode.Uri.file(path.join(rootPath, 'requirements.txt'));
      const content = await vscode.workspace.fs.readFile(reqPath);
      result.packageManager = 'pip';
      result.requirementsTxt = content.toString();
      result.totalDependencies = content.toString().split('\n').filter(l => l.trim() && !l.startsWith('#')).length;
    } catch {
      // No requirements.txt
    }
  }

  // Check for Cargo.toml (Rust)
  if (result.packageManager === 'unknown') {
    try {
      const cargoPath = vscode.Uri.file(path.join(rootPath, 'Cargo.toml'));
      const content = await vscode.workspace.fs.readFile(cargoPath);
      result.packageManager = 'cargo';
      result.cargoToml = content.toString();
    } catch {
      // No Cargo.toml
    }
  }

  // Check for go.mod (Go)
  if (result.packageManager === 'unknown') {
    try {
      await vscode.workspace.fs.stat(vscode.Uri.file(path.join(rootPath, 'go.mod')));
      result.packageManager = 'go';
    } catch {
      // No go.mod
    }
  }

  return result;
}

async function analyzeConfigFiles(rootPath: string): Promise<ConfigFileInfo[]> {
  const configFiles = [
    'tsconfig.json',
    'eslint.config.js',
    'eslint.config.mjs',
    '.eslintrc.json',
    '.prettierrc',
    'prettier.config.js',
    'jest.config.js',
    'vitest.config.ts',
    'webpack.config.js',
    'vite.config.ts',
    '.gitignore',
    'Dockerfile',
    'docker-compose.yml'
  ];

  const results: ConfigFileInfo[] = [];

  for (const configFile of configFiles) {
    const filePath = path.join(rootPath, configFile);
    try {
      const stat = await vscode.workspace.fs.stat(vscode.Uri.file(filePath));
      let preview: string | undefined;
      
      if (stat.type === vscode.FileType.File) {
        const content = await vscode.workspace.fs.readFile(vscode.Uri.file(filePath));
        preview = content.toString().substring(0, 500);
      }
      
      results.push({ name: configFile, exists: true, preview });
    } catch {
      results.push({ name: configFile, exists: false });
    }
  }

  // Check for .github/workflows
  try {
    await vscode.workspace.fs.stat(vscode.Uri.file(path.join(rootPath, '.github', 'workflows')));
    results.push({ name: '.github/workflows', exists: true });
  } catch {
    results.push({ name: '.github/workflows', exists: false });
  }

  return results;
}

async function analyzeDocumentation(rootPath: string): Promise<DocumentationInfo> {
  const result: DocumentationInfo = {
    hasReadme: false,
    readmeLength: 0,
    hasContributing: false,
    hasChangelog: false,
    hasLicense: false
  };

  // Check README
  for (const readme of ['README.md', 'README.MD', 'readme.md', 'README', 'Readme.md']) {
    try {
      const content = await vscode.workspace.fs.readFile(vscode.Uri.file(path.join(rootPath, readme)));
      result.hasReadme = true;
      result.readmeLength = content.toString().length;
      result.readmePreview = content.toString().substring(0, 1000);
      break;
    } catch {
      // Try next
    }
  }

  // Check other docs
  try {
    await vscode.workspace.fs.stat(vscode.Uri.file(path.join(rootPath, 'CONTRIBUTING.md')));
    result.hasContributing = true;
  } catch {
    // Not found
  }

  try {
    await vscode.workspace.fs.stat(vscode.Uri.file(path.join(rootPath, 'CHANGELOG.md')));
    result.hasChangelog = true;
  } catch {
    // Not found
  }

  try {
    await vscode.workspace.fs.stat(vscode.Uri.file(path.join(rootPath, 'LICENSE')));
    result.hasLicense = true;
  } catch {
    try {
      await vscode.workspace.fs.stat(vscode.Uri.file(path.join(rootPath, 'LICENSE.md')));
      result.hasLicense = true;
    } catch {
      // Not found
    }
  }

  return result;
}

async function analyzeCodeStats(rootPath: string): Promise<CodeStats> {
  const languages: Record<string, number> = {};
  let totalCodeFiles = 0;
  let hasTests = false;
  let testFolderName: string | undefined;

  const codeExtensions: Record<string, string> = {
    '.ts': 'TypeScript',
    '.tsx': 'TypeScript React',
    '.js': 'JavaScript',
    '.jsx': 'JavaScript React',
    '.py': 'Python',
    '.rs': 'Rust',
    '.go': 'Go',
    '.java': 'Java',
    '.cs': 'C#',
    '.cpp': 'C++',
    '.c': 'C',
    '.rb': 'Ruby',
    '.php': 'PHP',
    '.swift': 'Swift',
    '.kt': 'Kotlin'
  };

  // Check for test folders
  for (const testFolder of ['test', 'tests', '__tests__', 'spec', 'specs']) {
    try {
      await vscode.workspace.fs.stat(vscode.Uri.file(path.join(rootPath, testFolder)));
      hasTests = true;
      testFolderName = testFolder;
      break;
    } catch {
      // Try next
    }
  }

  // Quick language detection from root and src
  async function scanFolder(folderPath: string): Promise<void> {
    try {
      const items = await vscode.workspace.fs.readDirectory(vscode.Uri.file(folderPath));
      for (const [name, type] of items) {
        if (type === vscode.FileType.File) {
          const ext = path.extname(name).toLowerCase();
          if (codeExtensions[ext]) {
            languages[codeExtensions[ext]] = (languages[codeExtensions[ext]] || 0) + 1;
            totalCodeFiles++;
          }
        }
      }
    } catch {
      // Ignore errors
    }
  }

  await scanFolder(rootPath);
  await scanFolder(path.join(rootPath, 'src'));
  await scanFolder(path.join(rootPath, 'lib'));
  await scanFolder(path.join(rootPath, 'app'));

  return {
    languages,
    totalCodeFiles,
    hasTests,
    testFolderName
  };
}

export function formatWorkspaceAnalysis(analysis: WorkspaceAnalysis): string {
  let summary = `## Workspace Analysis: ${analysis.name}\n\n`;

  // Structure
  summary += `### 📁 Project Structure\n`;
  summary += `- **Root files**: ${analysis.structure.rootFiles.slice(0, 10).join(', ')}${analysis.structure.rootFiles.length > 10 ? '...' : ''}\n`;
  summary += `- **Root folders**: ${analysis.structure.rootFolders.filter(f => !f.startsWith('.')).join(', ') || 'none'}\n`;
  summary += `- **Total files**: ~${analysis.structure.totalFiles} (excluding dependencies)\n`;
  summary += `- **Total folders**: ~${analysis.structure.totalFolders}\n`;
  summary += `- **Deepest nesting**: ${analysis.structure.deepestNesting} levels\n`;
  if (analysis.structure.suspiciousItems.length > 0) {
    summary += `- **⚠️ Suspicious**: ${analysis.structure.suspiciousItems.join(', ')}\n`;
  }
  summary += '\n';

  // Dependencies
  summary += `### 📦 Dependencies\n`;
  summary += `- **Package manager**: ${analysis.dependencies.packageManager}\n`;
  summary += `- **Total dependencies**: ${analysis.dependencies.totalDependencies}\n`;
  if (analysis.dependencies.devDependencies > 0) {
    summary += `- **Dev dependencies**: ${analysis.dependencies.devDependencies}\n`;
  }
  if (analysis.dependencies.packageJsonContent) {
    const truncated = analysis.dependencies.packageJsonContent.substring(0, 1500);
    summary += `\n**package.json**:\n\`\`\`json\n${truncated}${analysis.dependencies.packageJsonContent.length > 1500 ? '\n...' : ''}\n\`\`\`\n`;
  }
  if (analysis.dependencies.requirementsTxt) {
    const truncated = analysis.dependencies.requirementsTxt.substring(0, 500);
    summary += `\n**requirements.txt**:\n\`\`\`\n${truncated}${analysis.dependencies.requirementsTxt.length > 500 ? '\n...' : ''}\n\`\`\`\n`;
  }
  summary += '\n';

  // Config files
  const existingConfigs = analysis.configFiles.filter(c => c.exists).map(c => c.name);
  const missingConfigs = analysis.configFiles.filter(c => !c.exists).map(c => c.name);
  summary += `### ⚙️ Configuration\n`;
  summary += `- **Present**: ${existingConfigs.join(', ') || 'none'}\n`;
  summary += `- **Missing**: ${missingConfigs.slice(0, 5).join(', ') || 'none'}\n`;
  summary += '\n';

  // Documentation
  summary += `### 📚 Documentation\n`;
  summary += `- **README**: ${analysis.documentation.hasReadme ? `Yes (${analysis.documentation.readmeLength} chars)` : 'NO README!'}\n`;
  summary += `- **CONTRIBUTING**: ${analysis.documentation.hasContributing ? 'Yes' : 'No'}\n`;
  summary += `- **CHANGELOG**: ${analysis.documentation.hasChangelog ? 'Yes' : 'No'}\n`;
  summary += `- **LICENSE**: ${analysis.documentation.hasLicense ? 'Yes' : 'No'}\n`;
  if (analysis.documentation.readmePreview) {
    const preview = analysis.documentation.readmePreview.substring(0, 600);
    summary += `\n**README preview**:\n\`\`\`markdown\n${preview}${analysis.documentation.readmePreview.length > 600 ? '\n...' : ''}\n\`\`\`\n`;
  }
  summary += '\n';

  // Code stats
  summary += `### 💻 Code\n`;
  const langs = Object.entries(analysis.codeStats.languages).sort((a, b) => b[1] - a[1]);
  if (langs.length > 0) {
    summary += `- **Languages**: ${langs.map(([l, c]) => `${l} (${c})`).join(', ')}\n`;
  } else {
    summary += `- **Languages**: Unable to detect\n`;
  }
  summary += `- **Tests**: ${analysis.codeStats.hasTests ? `Yes (${analysis.codeStats.testFolderName}/)` : 'No test folder found'}\n`;

  return summary;
}
