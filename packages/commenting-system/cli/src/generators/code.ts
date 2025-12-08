import path from 'path';
import chalk from 'chalk';
import { readFile, writeFile, fileExists } from '../utils/fs.js';

interface IntegrationResult {
  success: boolean;
  filePath: string;
  message: string;
}

export async function integrateProviders(projectRoot: string): Promise<IntegrationResult> {
  // Find the App entry point - try common locations
  const possiblePaths = [
    'src/app/index.tsx',
    'src/app/App.tsx',
    'src/App.tsx',
    'src/index.tsx'
  ];

  let appFilePath: string | null = null;
  
  for (const p of possiblePaths) {
    const fullPath = path.join(projectRoot, p);
    if (await fileExists(fullPath)) {
      appFilePath = fullPath;
      break;
    }
  }

  if (!appFilePath) {
    return {
      success: false,
      filePath: '',
      message: 'Could not find App entry point. Please integrate manually.'
    };
  }

  try {
    const content = await readFile(appFilePath);
    
    // Check if already integrated
    if (content.includes('hale-commenting-system') || content.includes('CommentProvider')) {
      return {
        success: false,
        filePath: appFilePath,
        message: 'Commenting system already integrated.'
      };
    }

    const modifiedContent = injectProviders(content);
    
    if (modifiedContent === content) {
      return {
        success: false,
        filePath: appFilePath,
        message: 'Could not automatically integrate. File structure not recognized.'
      };
    }

    await writeFile(appFilePath, modifiedContent);

    return {
      success: true,
      filePath: appFilePath,
      message: `Successfully integrated providers into ${path.relative(projectRoot, appFilePath)}`
    };
  } catch (error: any) {
    return {
      success: false,
      filePath: appFilePath,
      message: `Error: ${error.message}`
    };
  }
}

function injectProviders(content: string): string {
  // Add imports at the top (after existing imports)
  const imports = `import {
  CommentProvider,
  CommentOverlay,
  CommentDrawer,
  useComments,
  VersionProvider
} from 'hale-commenting-system';`;

  // Find the last import statement
  const importRegex = /import\s+.*?from\s+['"].*?['"];?/g;
  const matches = content.match(importRegex);
  
  if (!matches || matches.length === 0) {
    // No imports found, add at the beginning
    content = imports + '\n\n' + content;
  } else {
    const lastImport = matches[matches.length - 1];
    const lastImportIndex = content.lastIndexOf(lastImport);
    const insertPosition = lastImportIndex + lastImport.length;
    content = content.slice(0, insertPosition) + '\n\n' + imports + content.slice(insertPosition);
  }

  // Find the JSX in the component - handle both explicit return and implicit arrow return
  // Pattern 1: return ( <Router> or return <Router>
  // Pattern 2: => ( <Router> (implicit return)
  let returnMatch = content.match(/return\s*\(?[\s\n]*<(\w+)/);
  let isImplicitReturn = false;
  
  if (!returnMatch) {
    // Try to match implicit arrow function return: => ( <Component>
    returnMatch = content.match(/=>\s*\(?[\s\n]*<(\w+)/);
    isImplicitReturn = true;
  }
  
  if (!returnMatch) {
    return content; // Can't find return statement or JSX
  }

  const componentName = returnMatch[1]; // Router, Fragment, etc.
  
  // Find the closing tag
  const closingTag = `</${componentName}>`;
  const closingIndex = content.indexOf(closingTag);
  
  if (closingIndex === -1) {
    return content; // Can't find closing tag
  }

  // Convert implicit return to explicit return if needed
  if (isImplicitReturn) {
    // Find the arrow function: const App = () => (
    const arrowMatch = content.match(/(const\s+\w+.*?=.*?\(\).*?=>\s*)\(/);
    if (arrowMatch) {
      const beforeParen = arrowMatch[1];
      const arrowEndPos = arrowMatch.index! + arrowMatch[0].length - 1; // Position before the (
      
      // Find the closing paren + semicolon
      const closingParenPos = content.indexOf(');', closingIndex);
      if (closingParenPos !== -1) {
        // Convert: const App = () => (...) to const App = () => { return (...) }
        const jsxContent = content.slice(arrowEndPos + 1, closingParenPos);
        content = content.slice(0, arrowEndPos) + ' {\n  return' + jsxContent + '\n}' + content.slice(closingParenPos + 2);
      }
    }
  }

  // Add state hook before return
  const stateHook = `  const [selectedThreadId, setSelectedThreadId] = React.useState<string | null>(null);\n\n`;
  
  // Find the function body (after function declaration) - now guaranteed to have braces
  const functionMatch = content.match(/const\s+\w+.*?=.*?\(\).*?=>\s*\{/);
  if (functionMatch) {
    const insertPos = functionMatch.index! + functionMatch[0].length;
    content = content.slice(0, insertPos) + '\n' + stateHook + content.slice(insertPos);
  }

  // Wrap the return content with providers
  const returnStartMatch = content.match(/return\s*\(?[\s\n]*</);
  if (returnStartMatch) {
    const returnStart = returnStartMatch.index! + returnStartMatch[0].length - 1; // Position before <
    const returnEnd = content.indexOf(closingTag, returnStart) + closingTag.length;
    
    const originalReturn = content.slice(returnStart, returnEnd).trim();
    
    // Check if the original return starts with <Router> or <BrowserRouter>
    const isRouter = originalReturn.match(/^\s*<(Router|BrowserRouter)/);
    
    let wrappedReturn;
    if (isRouter) {
      // Extract Router content - need to find the inner content
      const routerMatch = originalReturn.match(/<(Router|BrowserRouter)[^>]*>([\s\S]*)<\/\1>/);
      if (routerMatch) {
        const routerType = routerMatch[1];
        const innerContent = routerMatch[2];
        
        // Put Router on outside, VersionProvider and CommentProvider inside
        wrappedReturn = `
    <${routerType}>
      <VersionProvider>
        <CommentProvider>
          <CommentDrawer 
            selectedThreadId={selectedThreadId} 
            onThreadSelect={setSelectedThreadId}
          >
            <CommentOverlay 
              selectedThreadId={selectedThreadId} 
              onThreadSelect={setSelectedThreadId}
            />
            ${innerContent.trim()}
          </CommentDrawer>
        </CommentProvider>
      </VersionProvider>
    </${routerType}>
  `;
      } else {
        // Fallback to wrapping everything
        wrappedReturn = `
    <VersionProvider>
      <CommentProvider>
        <CommentDrawer 
          selectedThreadId={selectedThreadId} 
          onThreadSelect={setSelectedThreadId}
        >
          <CommentOverlay 
            selectedThreadId={selectedThreadId} 
            onThreadSelect={setSelectedThreadId}
          />
          ${originalReturn}
        </CommentDrawer>
      </CommentProvider>
    </VersionProvider>
  `;
      }
    } else {
      // No router, wrap everything normally
      wrappedReturn = `
    <VersionProvider>
      <CommentProvider>
        <CommentDrawer 
          selectedThreadId={selectedThreadId} 
          onThreadSelect={setSelectedThreadId}
        >
          <CommentOverlay 
            selectedThreadId={selectedThreadId} 
            onThreadSelect={setSelectedThreadId}
          />
          ${originalReturn}
        </CommentDrawer>
      </CommentProvider>
    </VersionProvider>
  `;
    }
    
    content = content.slice(0, returnStart) + wrappedReturn + content.slice(returnEnd);
  }

  return content;
}

export function showIntegrationDiff(filePath: string) {
  console.log(chalk.cyan('\nChanges made to your App file:'));
  console.log(chalk.white('• Added commenting system imports'));
  console.log(chalk.white('• Added state hook for comment thread selection'));
  console.log(chalk.white('• Wrapped app with CommentProvider'));
  console.log(chalk.white('• Added CommentDrawer and CommentOverlay components\n'));
  console.log(chalk.dim(`Modified: ${filePath}\n`));
}
