import { Command } from 'commander';
import chalk from 'chalk';
import { initCommand } from './commands/init.js';

const program = new Command();

program
  .name('hale-commenting-system')
  .description('Hale Commenting System CLI - Local setup wizard')
  .version('2.0.0');

program
  .command('init')
  .description('Initialize Hale Commenting System in your project')
  .option('-y, --yes', 'Skip prompts and use defaults')
  .action(async (options) => {
    try {
      await initCommand(options);
    } catch (error: any) {
      console.error(chalk.red('\n✗ Error:'), error.message);
      process.exit(1);
    }
  });

// Show help if no command provided
if (!process.argv.slice(2).length) {
  program.help();
}

program.parse();
