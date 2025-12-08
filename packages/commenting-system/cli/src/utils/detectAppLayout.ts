import path from 'path';
import { fileExists } from './fs.js';

export interface AppLayoutInfo {
  exists: boolean;
  path: string;
}

/**
 * Detects if the project has an AppLayout component
 * Common in PatternFly projects with custom Masthead/Page structure
 */
export async function detectAppLayout(projectRoot: string): Promise<AppLayoutInfo> {
  const possiblePaths = [
    'src/app/AppLayout/AppLayout.tsx',
    'src/app/AppLayout/index.tsx',
    'src/app/Layout/AppLayout.tsx',
    'src/app/Layout/index.tsx',
    'src/AppLayout/AppLayout.tsx',
    'src/AppLayout/index.tsx',
  ];

  for (const relativePath of possiblePaths) {
    const fullPath = path.join(projectRoot, relativePath);
    if (await fileExists(fullPath)) {
      return {
        exists: true,
        path: fullPath
      };
    }
  }

  return {
    exists: false,
    path: ''
  };
}


