import inquirer from 'inquirer';
import chalk from 'chalk';

export type MainMenuAction =
  | 'search'
  | 'browse'
  | 'list-all'
  | 'help'
  | 'exit';

export async function showMainMenu(): Promise<MainMenuAction> {
  const { action } = await inquirer.prompt([
    {
      type: 'list',
      name: 'action',
      message: 'What would you like to do?',
      choices: [
        { name: '🔍  Search for an app', value: 'search' },
        { name: '📋 List all installed apps', value: 'list-all' },
        { name: '❓ Help', value: 'help' },
        { name: '❌ Exit', value: 'exit' },
      ],
    },
  ]);

  return action;
}

export async function showAppMenu(): Promise<'remove' | 'details' | 'back'> {
  const { action } = await inquirer.prompt([
    {
      type: 'list',
      name: 'action',
      message: 'What would you like to do?',
      choices: [
        { name: '📊 View details and artifacts', value: 'details' },
        { name: '🗑️  Remove this app', value: 'remove' },
        { name: '⬅️  Back to search', value: 'back' },
      ],
    },
  ]);

  return action;
}

export function showHeader(): void {
  console.clear();
  console.log(
    chalk.cyan(`
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║            ${chalk.bold('AppClean - App Uninstaller')}                  ║
║          Remove apps and all their artifacts             ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
  `)
  );
}

export function showHelp(): void {
  console.log(
    chalk.cyan(`
${chalk.bold('AppClean - Help')}

${chalk.bold('Features:')}
  • Search and find all installed applications
  • Identify installation method (npm, brew, apt, custom, etc)
  • Locate all related files, configs, and caches
  • Safely remove apps with dry-run preview
  • Create backups before deletion
  • Cross-platform support (macOS, Linux, Windows)

${chalk.bold('Commands:')}
  appclean                    Start interactive mode
  appclean search <name>      Search for an app
  appclean remove <name>      Remove an app
  appclean list               List all apps
  appclean analyze <name>     Show app artifacts

${chalk.bold('Options:')}
  --dry-run                   Preview without deleting
  --backup                    Create backup before removal
  --help                      Show this help message
  --version                   Show version

${chalk.bold('Examples:')}
  appclean search nodejs      Search for nodejs
  appclean remove myapp --dry-run    Preview removal
  appclean list | grep npm    Find npm-installed apps

${chalk.bold('Safety:')}
  • Always previews what will be deleted
  • Use --dry-run first to see what will happen
  • Use --backup to create backups before deletion
  • Double confirmation before actual removal

${chalk.bold('Website:')} https://github.com/YOUR_USERNAME/appclean
  `)
  );
}
