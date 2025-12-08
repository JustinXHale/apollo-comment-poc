import chalk from 'chalk';
import ora from 'ora';
import inquirer from 'inquirer';
import { detectProject } from '../utils/detect.js';
import { detectAppLayout } from '../utils/detectAppLayout.js';
import { printWelcome, printWarning } from '../utils/logger.js';
import { integrateProviders, showIntegrationDiff } from '../generators/code.js';
import { integrateIntoMasthead, showMastheadIntegrationDiff } from '../generators/masthead.js';

interface InitOptions {
  yes?: boolean;
}

export async function initCommand(options: InitOptions) {
  printWelcome();

  const spinner = ora('Detecting project...').start();

  // Step 1: Detect project type
  let project;
  try {
    project = await detectProject(process.cwd());
    spinner.succeed(`Detected: ${project.framework} with ${project.buildTool}`);
  } catch (error: any) {
    spinner.fail(error.message);
    process.exit(1);
  }

  if (!project.isReact) {
    spinner.fail('This package requires a React project');
    console.log(chalk.red('\n✗ Hale Commenting System requires React.\n'));
    process.exit(1);
  }

  if (!project.hasPatternFly) {
    printWarning('PatternFly not detected. This package is optimized for PatternFly projects.');
    if (!options.yes) {
      const { continueAnyway } = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'continueAnyway',
          message: 'Continue anyway?',
          default: false
        }
      ]);
      if (!continueAnyway) {
        console.log(chalk.dim('\nSetup cancelled.\n'));
        process.exit(0);
      }
    }
  }

  // Step 2: Detect if AppLayout exists (for Masthead integration)
  console.log(chalk.cyan('\n📦 Setting up local commenting system...\n'));
  
  spinner.start('Detecting project structure...');
  const appLayout = await detectAppLayout(project.root);
  
  if (appLayout.exists) {
    spinner.succeed('Detected AppLayout component - will integrate into Masthead');
    
    // Try Masthead integration
    spinner.start('Integrating into Masthead toolbar...');
    const mastheadResult = await integrateIntoMasthead(appLayout.path, project.root);
    
    if (mastheadResult.success) {
      spinner.succeed('Commenting system integrated into Masthead!');
      showMastheadIntegrationDiff(mastheadResult.filePath);
      console.log(chalk.green('\n✓ Setup complete! Your app is ready to use the commenting system.\n'));
      console.log(chalk.cyan('Next steps:'));
      console.log(chalk.white('1. Review the changes in your AppLayout file'));
      console.log(chalk.white('2. Start your dev server (e.g., npm run start:dev)'));
      console.log(chalk.white('3. Look for the CommentIcon button in your Masthead toolbar'));
      console.log(chalk.white('4. Click it to enable commenting, then click anywhere to add comments\n'));
      console.log(chalk.dim('💡 Tip: Comments persist across page refreshes and are stored locally in your browser.\n'));
    } else {
      spinner.warn('Could not integrate into Masthead automatically');
      console.log(chalk.yellow('\n⚠️  Falling back to manual integration.\n'));
      printManualInstructions();
    }
  } else {
    spinner.succeed('No AppLayout detected - using floating button integration');
    
    // Fall back to App.tsx integration with floating buttons
    spinner.start('Integrating commenting system into your app...');
    const result = await integrateProviders(project.root);
    
    if (result.success) {
      spinner.succeed('Commenting system integrated!');
      showIntegrationDiff(result.filePath);
      console.log(chalk.green('\n✓ Setup complete! Your app is ready to use the commenting system.\n'));
      console.log(chalk.cyan('Next steps:'));
      console.log(chalk.white('1. Review the changes in your App file'));
      console.log(chalk.white('2. Start your dev server (e.g., npm run start:dev)'));
      console.log(chalk.white('3. Look for floating buttons in the top-right corner'));
      console.log(chalk.white('4. Click "Enable Commenting" then click anywhere to add comments\n'));
      console.log(chalk.dim('💡 Tip: Comments persist across page refreshes and are stored locally in your browser.\n'));
    } else {
      spinner.warn(result.message);
      console.log(chalk.yellow('\n⚠️  Could not automatically integrate the commenting system.\n'));
      printManualInstructions();
    }
  }
}

function printManualInstructions() {
  console.log(chalk.white('Please manually add the following to your App component:\n'));
  console.log(chalk.dim(`import { CommentProvider, CommentOverlay, CommentDrawer, VersionProvider } from 'hale-commenting-system';
import { BrowserRouter as Router } from 'react-router-dom';
import React from 'react';

function App() {
  const [selectedThreadId, setSelectedThreadId] = React.useState<string | null>(null);

  return (
    <Router>
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
            {/* Your app content */}
          </CommentDrawer>
        </CommentProvider>
      </VersionProvider>
    </Router>
  );
}\n`));
}
