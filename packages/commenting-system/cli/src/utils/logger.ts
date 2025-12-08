import chalk from 'chalk';

export function printWelcome() {
  console.log(chalk.bold.cyan('\n🚀 Hale Commenting System - Local Setup\n'));
  console.log(chalk.dim('Setting up a localStorage-based commenting system for your app.\n'));
}

export function printWarning(message: string) {
  console.log(chalk.yellow(`⚠️  ${message}`));
}
