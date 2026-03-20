import inquirer from 'inquirer';
import { InstalledApp, ArtifactPath } from '../types';
import { Logger, formatBytes } from '../utils/logger.js';
import chalk from 'chalk';

export async function promptSearchQuery(): Promise<string> {
  const { query } = await inquirer.prompt([
    {
      type: 'input',
      name: 'query',
      message: 'Search for an app (partial name):',
      default: '',
    },
  ]);
  return query;
}

export async function promptSelectApp(apps: InstalledApp[]): Promise<InstalledApp | null> {
  if (apps.length === 0) {
    Logger.warn('No apps found');
    return null;
  }

  const choices = apps.map((app) => ({
    name: `${app.name} (${app.installMethod}) - v${app.version}`,
    value: app,
  }));

  const { app } = await inquirer.prompt([
    {
      type: 'list',
      name: 'app',
      message: 'Select an app to remove:',
      choices: [
        ...choices,
        new inquirer.Separator(),
        { name: 'Cancel', value: null },
      ],
      pageSize: 10,
    },
  ]);

  return app;
}

export async function promptConfirmRemoval(appName: string): Promise<boolean> {
  const { confirmed } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'confirmed',
      message: chalk.yellow(`Are you sure you want to remove ${appName}?`),
      default: false,
    },
  ]);
  return confirmed;
}

export async function promptRemovalOptions(): Promise<{
  dryRun: boolean;
  createBackup: boolean;
}> {
  const { options } = await inquirer.prompt([
    {
      type: 'checkbox',
      name: 'options',
      message: 'Removal options:',
      choices: [
        {
          name: 'Dry run (preview without removing)',
          value: 'dryRun',
          checked: true,
        },
        {
          name: 'Create backup before removal',
          value: 'backup',
          checked: false,
        },
      ],
    },
  ]);

  return {
    dryRun: options.includes('dryRun'),
    createBackup: options.includes('backup'),
  };
}

export async function promptInstallMethodFilter(): Promise<string | null> {
  const { method } = await inquirer.prompt([
    {
      type: 'list',
      name: 'method',
      message: 'Filter by installation method:',
      choices: [
        { name: 'All', value: null },
        { name: 'npm', value: 'npm' },
        { name: 'yarn', value: 'yarn' },
        { name: 'pnpm', value: 'pnpm' },
        { name: 'Homebrew', value: 'brew' },
        { name: 'apt', value: 'apt' },
        { name: 'yum', value: 'yum' },
        { name: 'dnf', value: 'dnf' },
        { name: 'Custom', value: 'custom' },
      ],
    },
  ]);

  return method;
}

export async function promptSortBy(): Promise<'name' | 'date' | 'size'> {
  const { sortBy } = await inquirer.prompt([
    {
      type: 'list',
      name: 'sortBy',
      message: 'Sort results by:',
      choices: [
        { name: 'Name', value: 'name' },
        { name: 'Installation Date', value: 'date' },
        { name: 'Size', value: 'size' },
      ],
    },
  ]);

  return sortBy;
}

export function displayAppDetails(app: InstalledApp, artifacts: ArtifactPath[]): void {
  Logger.space();
  Logger.info(`App: ${chalk.cyan(app.name)}`);
  Logger.info(`Method: ${chalk.yellow(app.installMethod)}`);
  Logger.info(`Version: ${app.version}`);
  Logger.info(`Location: ${app.mainPath}`);
  Logger.space();

  Logger.info('Associated files and directories:');
  Logger.space();

  let totalSize = 0;

  for (const artifact of artifacts) {
    const size = artifact.size || 0;
    totalSize += size;

    const icon =
      artifact.type === 'binary'
        ? '⚙️'
        : artifact.type === 'config'
          ? '⚙️'
          : artifact.type === 'cache'
            ? '📦'
            : '📁';

    console.log(
      `  ${icon} [${artifact.type.padEnd(7)}] ${formatBytes(size).padEnd(10)} ${artifact.path}`
    );
  }

  Logger.space();
  Logger.info(`Total space to be freed: ${chalk.green(formatBytes(totalSize))}`);
  Logger.space();
}

export async function promptFinalConfirmation(appName: string): Promise<boolean> {
  const { confirmed } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'confirmed',
      message: chalk.red(
        `This action cannot be undone. Remove ${appName} and all its files?`
      ),
      default: false,
    },
  ]);

  return confirmed;
}
