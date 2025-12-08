import fs from 'fs/promises';
import path from 'path';

export interface ProjectInfo {
  root: string;
  framework: string;
  buildTool: string;
  isReact: boolean;
  hasPatternFly: boolean;
  hasTypeScript: boolean;
  packageJson: any;
}

export async function detectProject(cwd: string): Promise<ProjectInfo> {
  const packageJsonPath = path.join(cwd, 'package.json');
  
  let packageJson: any = {};
  try {
    const content = await fs.readFile(packageJsonPath, 'utf-8');
    packageJson = JSON.parse(content);
  } catch (error) {
    throw new Error('No package.json found. Are you in a Node.js project?');
  }

  const deps = {
    ...packageJson.dependencies,
    ...packageJson.devDependencies
  };

  const buildTool = await detectBuildTool(cwd, deps);

  return {
    root: cwd,
    framework: detectFramework(deps),
    buildTool,
    isReact: !!deps['react'],
    hasPatternFly: !!deps['@patternfly/react-core'],
    hasTypeScript: !!deps['typescript'],
    packageJson
  };
}

function detectFramework(deps: any): string {
  if (deps['react']) return 'React';
  if (deps['vue']) return 'Vue';
  if (deps['@angular/core']) return 'Angular';
  return 'Unknown';
}

async function detectBuildTool(cwd: string, deps: any): Promise<string> {
  if (deps['vite']) return 'Vite';
  if (deps['webpack']) return 'Webpack';
  
  try {
    await fs.access(path.join(cwd, 'next.config.js'));
    return 'Next.js';
  } catch {
    // Next.js config not found
  }

  return 'Unknown';
}

export async function detectPlatform(cwd: string): Promise<string | null> {
  try {
    await fs.access(path.join(cwd, 'vercel.json'));
    return 'vercel';
  } catch {
    // Not Vercel
  }

  try {
    await fs.access(path.join(cwd, 'netlify.toml'));
    return 'netlify';
  } catch {
    // Not Netlify
  }

  return null;
}

