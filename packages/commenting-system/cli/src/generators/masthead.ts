import path from 'path';
import chalk from 'chalk';
import { readFile, writeFile } from '../utils/fs.js';

interface MastheadIntegrationResult {
  success: boolean;
  filePath: string;
  message: string;
}

/**
 * Integrates commenting system into AppLayout's Masthead
 * This provides a native, integrated look instead of floating buttons
 */
export async function integrateIntoMasthead(
  appLayoutPath: string,
  projectRoot: string
): Promise<MastheadIntegrationResult> {
  try {
    const content = await readFile(appLayoutPath);

    // Check if already integrated
    if (content.includes('hale-commenting-system') || content.includes('useComments')) {
      return {
        success: false,
        filePath: appLayoutPath,
        message: 'Commenting system already integrated or imports found.'
      };
    }

    const modifiedContent = injectMastheadIntegration(content);

    if (modifiedContent === content) {
      return {
        success: false,
        filePath: appLayoutPath,
        message: 'Could not automatically integrate into Masthead. File structure not recognized.'
      };
    }

    await writeFile(appLayoutPath, modifiedContent);

    return {
      success: true,
      filePath: appLayoutPath,
      message: `Successfully integrated into Masthead: ${path.relative(projectRoot, appLayoutPath)}`
    };
  } catch (error: any) {
    return {
      success: false,
      filePath: appLayoutPath,
      message: `Error: ${error.message}`
    };
  }
}

function injectMastheadIntegration(content: string): string {
  // Step 1: Add imports
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
    return content; // Can't find imports
  }

  const lastImport = matches[matches.length - 1];
  const lastImportIndex = content.lastIndexOf(lastImport);
  const insertPosition = lastImportIndex + lastImport.length;
  content = content.slice(0, insertPosition) + '\n\n' + imports + content.slice(insertPosition);

  // Step 2: Add state and hooks at the beginning of the AppLayout component
  const componentMatch = content.match(/const\s+AppLayout:\s*React\.FunctionComponent<IAppLayout>\s*=\s*\(\{\s*children\s*\}\)\s*=>\s*\{/);
  
  if (!componentMatch) {
    return content; // Can't find component
  }

  const componentStart = componentMatch.index! + componentMatch[0].length;
  
  const stateAndHooks = `
  const [selectedThreadId, setSelectedThreadId] = React.useState<string | null>(null);
  const { showPins, enableCommenting, toggleShowPins, toggleEnableCommenting } = useComments();
`;

  content = content.slice(0, componentStart) + stateAndHooks + content.slice(componentStart);

  // Step 3: Find the Masthead section and add the commenting button
  // Look for patterns like: <Masthead> ... <MastheadContent>
  const mastheadContentMatch = content.match(/<MastheadContent>([\s\S]*?)<\/MastheadContent>/);
  
  if (mastheadContentMatch) {
    const mastheadContent = mastheadContentMatch[1];
    const mastheadContentStart = mastheadContentMatch.index! + '<MastheadContent>'.length;
    
    // Find where to insert the button (before the closing div or last element)
    // Look for a closing </div> or closing tag before </MastheadContent>
    const commentButton = `
          <Button
            variant="plain"
            onClick={() => {
              if (!enableCommenting && !showPins) {
                toggleShowPins();
              }
              if (enableCommenting && showPins) {
                toggleShowPins();
              }
              toggleEnableCommenting();
            }}
            aria-label={enableCommenting ? "Disable commenting" : "Enable commenting"}
          >
            <CommentIcon 
              style={{ 
                color: enableCommenting ? '#C9190B' : 'currentColor',
                fontSize: '1.25rem'
              }}
            />
          </Button>
`;

    // Try to find the closing div of the button container in Masthead
    // Usually it's right before </MastheadContent>
    const mastheadEndMatch = content.match(/<\/MastheadContent>/);
    if (mastheadEndMatch) {
      const insertPos = mastheadEndMatch.index!;
      content = content.slice(0, insertPos) + commentButton + content.slice(insertPos);
    }
  }

  // Step 4: Wrap the return with CommentProvider, VersionProvider, and CommentDrawer
  // Find the return statement
  const returnMatch = content.match(/return\s*\(/);
  
  if (!returnMatch) {
    return content;
  }

  const returnStart = returnMatch.index! + returnMatch[0].length;
  
  // Find the closing of the return (usually a closing parenthesis and semicolon)
  // We need to find the matching closing parenthesis
  let parenCount = 1;
  let returnEnd = returnStart;
  
  for (let i = returnStart; i < content.length; i++) {
    if (content[i] === '(') parenCount++;
    if (content[i] === ')') parenCount--;
    if (parenCount === 0) {
      returnEnd = i;
      break;
    }
  }

  const originalReturn = content.slice(returnStart, returnEnd).trim();

  const wrappedReturn = `
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

  content = content.slice(0, returnStart) + wrappedReturn + content.slice(returnEnd);

  return content;
}

export function showMastheadIntegrationDiff(filePath: string) {
  console.log(chalk.cyan('\n✨ Masthead Integration Complete!\n'));
  console.log(chalk.white('Changes made to your AppLayout:'));
  console.log(chalk.white('• Added commenting system imports'));
  console.log(chalk.white('• Added state and hooks for comment management'));
  console.log(chalk.white('• Integrated CommentIcon button into Masthead toolbar'));
  console.log(chalk.white('• Wrapped layout with CommentProvider and CommentDrawer\n'));
  console.log(chalk.dim(`Modified: ${filePath}\n`));
}


