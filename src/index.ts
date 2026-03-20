#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import { Detector } from './core/detector';
import { Remover } from './core/remover';
import { GUIServer } from './ui/guiServer';
import {
  showMainMenu,
  showAppMenu,
  showHeader,
  showHelp,
} from './ui/menu';
import {
  promptSearchQuery,
  promptSelectApp,
  promptConfirmRemoval,
  promptRemovalOptions,
  promptInstallMethodFilter,
  promptSortBy,
  displayAppDetails,
  promptFinalConfirmation,
} from './ui/prompts';
import { Logger, formatBytes } from './utils/logger';
import { UpgradeManager } from './utils/upgrade';
import { InstalledApp } from './types';

const VERSION = '1.9.0';

async function interactiveMode(): Promise<void> {
  showHeader();

  const detector = new Detector();

  let running = true;

  while (running) {
    const action = await showMainMenu();

    switch (action) {
      case 'search': {
        await handleSearch(detector);
        break;
      }

      case 'list-all': {
        await handleListAll(detector);
        break;
      }

      case 'help': {
        showHelp();
        await new Promise((resolve) =>
          setTimeout(resolve, 3000)
        );
        break;
      }

      case 'exit': {
        running = false;
        Logger.space();
        Logger.info('Goodbye!');
        break;
      }
    }
  }
}

async function handleSearch(detector: Detector): Promise<void> {
  Logger.space();
  const query = await promptSearchQuery();

  if (!query.trim()) {
    Logger.warn('Please enter a search query');
    return;
  }

  const spinner = ora('Searching for apps...').start();

  try {
    const results = await detector.searchApps({ query });

    spinner.succeed(`Found ${results.length} app(s)`);
    Logger.space();

    if (results.length === 0) {
      Logger.warn('No apps found matching your query');
      return;
    }

    const selectedApp = await promptSelectApp(results);

    if (!selectedApp) {
      return;
    }

    await handleAppSelected(selectedApp, detector);
  } catch (error) {
    spinner.fail((error as Error).message);
  }
}

async function handleListAll(detector: Detector): Promise<void> {
  Logger.space();

  const filterMethod = await promptInstallMethodFilter();
  const sortBy = await promptSortBy();

  const spinner = ora('Scanning installed apps...').start();

  try {
    const apps = await detector.searchApps({
      installMethod: (filterMethod as any) || undefined,
      sortBy,
    });

    spinner.succeed(`Found ${apps.length} app(s)`);
    Logger.space();

    if (apps.length === 0) {
      Logger.warn('No apps found');
      return;
    }

    // Display apps in a table format
    const table = apps.map((app) => ({
      Name: app.name,
      Version: app.version,
      Method: app.installMethod,
      Size: app.size ? formatBytes(app.size) : 'N/A',
    }));

    Logger.table(table);
    Logger.space();

    const selectedApp = await promptSelectApp(apps);

    if (!selectedApp) {
      return;
    }

    await handleAppSelected(selectedApp, detector);
  } catch (error) {
    spinner.fail((error as Error).message);
  }
}

async function handleAppSelected(
  app: InstalledApp,
  detector: Detector
): Promise<void> {
  Logger.space();

  const action = await showAppMenu();

  switch (action) {
    case 'details': {
      const spinner = ora('Analyzing artifacts...').start();

      try {
        const artifacts = await detector.findArtifacts(
          app.name,
          app.installMethod
        );

        spinner.succeed('Analysis complete');

        displayAppDetails(app, artifacts);

        Logger.space();
      } catch (error) {
        spinner.fail((error as Error).message);
      }

      break;
    }

    case 'remove': {
      await handleRemoveApp(app, detector);
      break;
    }

    case 'back':
    default:
      break;
  }
}

async function handleRemoveApp(
  app: InstalledApp,
  detector: Detector
): Promise<void> {
  const confirmed = await promptConfirmRemoval(app.name);

  if (!confirmed) {
    Logger.info('Removal cancelled');
    return;
  }

  const options = await promptRemovalOptions();

  Logger.space();
  const spinner = ora('Analyzing artifacts...').start();

  try {
    const artifacts = await detector.findArtifacts(
      app.name,
      app.installMethod
    );

    spinner.succeed('Analysis complete');

    const remover = new Remover();

    if (options.dryRun) {
      Logger.info(`${chalk.bold('DRY RUN:')} Preview of files to be removed:`);
      Logger.space();
      await remover.previewRemoval(artifacts);
      Logger.space();
      Logger.warn('This is a preview only. No files were removed.');
    } else {
      const finalConfirm = await promptFinalConfirmation(app.name);

      if (!finalConfirm) {
        Logger.info('Removal cancelled');
        return;
      }

      const removeSpinner = ora('Removing app and artifacts...').start();

      try {
        const result = await remover.removeApp(app.name, app.installMethod, artifacts, {
          createBackup: options.createBackup,
        });

        if (result.success) {
          removeSpinner.succeed(
            `Successfully removed ${app.name} (freed ${formatBytes(result.freedSpace)})`
          );

          if (result.backupPath) {
            Logger.info(`Backup saved at: ${result.backupPath}`);
          }
        } else {
          removeSpinner.warn(`Removal completed with issues`);

          if (result.errors && result.errors.length > 0) {
            Logger.warn('Errors:');
            result.errors.forEach((error) => console.log(`  • ${error}`));
          }
        }
      } catch (error) {
        removeSpinner.fail((error as Error).message);
      }
    }
  } catch (error) {
    spinner.fail((error as Error).message);
  }

  Logger.space();
}

async function main(): Promise<void> {
  const program = new Command();

  program
    .name('appclean')
    .description(
      'Intelligently find and remove applications with all their artifacts'
    )
    .version(VERSION);

  program
    .command('search [query]')
    .description('Search for installed applications')
    .action(async (query) => {
      const detector = new Detector();

      const searchQuery = query || (await promptSearchQuery());

      const spinner = ora('Searching for apps...').start();

      try {
        const results = await detector.searchApps({ query: searchQuery });

        spinner.succeed(`Found ${results.length} app(s)`);

        if (results.length === 0) {
          Logger.warn('No apps found');
          return;
        }

        Logger.space();
        const selectedApp = await promptSelectApp(results);

        if (selectedApp) {
          await handleAppSelected(selectedApp, detector);
        }
      } catch (error) {
        spinner.fail((error as Error).message);
      }
    });

  program
    .command('list')
    .description('List all installed applications')
    .action(async () => {
      const detector = new Detector();
      const spinner = ora('Scanning installed apps...').start();

      try {
        const apps = await detector.searchApps({ sortBy: 'name' });

        spinner.succeed(`Found ${apps.length} app(s)`);

        if (apps.length === 0) {
          Logger.warn('No apps found');
          return;
        }

        Logger.space();

        const table = apps.map((app) => ({
          Name: app.name,
          Version: app.version,
          Method: app.installMethod,
        }));

        Logger.table(table);
      } catch (error) {
        spinner.fail((error as Error).message);
      }
    });

  program
    .command('analyze <appName>')
    .description('Analyze an application and show its artifacts')
    .action(async (appName) => {
      const detector = new Detector();
      const spinner = ora('Analyzing app...').start();

      try {
        const apps = await detector.searchApps({ query: appName });

        if (apps.length === 0) {
          spinner.fail('App not found');
          return;
        }

        const app = apps[0];
        const artifacts = await detector.findArtifacts(app.name, app.installMethod);

        spinner.succeed('Analysis complete');

        displayAppDetails(app, artifacts);
      } catch (error) {
        spinner.fail((error as Error).message);
      }
    });

  program
    .command('remove <appName>')
    .description('Remove an application')
    .option('--dry-run', 'Preview without removing')
    .option('--backup', 'Create backup before removal')
    .option('--force', 'Skip confirmation prompts')
    .action(async (appName, options) => {
      const detector = new Detector();
      const spinner = ora('Searching for app...').start();

      try {
        const apps = await detector.searchApps({ query: appName });

        if (apps.length === 0) {
          spinner.fail('App not found');
          return;
        }

        const app = apps[0];

        spinner.text = 'Analyzing artifacts...';
        const artifacts = await detector.findArtifacts(app.name, app.installMethod);

        spinner.succeed('Analysis complete');

        const remover = new Remover();

        Logger.space();
        Logger.info(`App: ${chalk.cyan(app.name)}`);
        Logger.info(`Method: ${chalk.yellow(app.installMethod)}`);
        Logger.space();

        if (options.dryRun) {
          Logger.info('DRY RUN - Preview of files to be removed:');
          Logger.space();
          await remover.previewRemoval(artifacts);
        } else {
          if (!options.force) {
            const confirmed = await promptFinalConfirmation(app.name);
            if (!confirmed) {
              Logger.info('Removal cancelled');
              return;
            }
          }

          const removeSpinner = ora('Removing app...').start();

          const result = await remover.removeApp(
            app.name,
            app.installMethod,
            artifacts,
            { createBackup: options.backup }
          );

          if (result.success) {
            removeSpinner.succeed(
              `Removed ${app.name} (freed ${formatBytes(result.freedSpace)})`
            );
          } else {
            removeSpinner.warn('Removal completed with errors');
          }
        }
      } catch (error) {
        spinner.fail((error as Error).message);
      }
    });

  program
    .command('gui')
    .description('Launch AppClean GUI server (opens at http://localhost:3000)')
    .option('--port <number>', 'Port to run GUI server on', '3000')
    .action(async (options) => {
      const port = parseInt(options.port, 10);

      if (isNaN(port) || port < 1 || port > 65535) {
        Logger.error('Invalid port number. Please use a port between 1 and 65535.');
        process.exit(1);
      }

      const guiServer = new GUIServer(port);

      try {
        await guiServer.start();
        Logger.info(`AppClean GUI is running at ${chalk.cyan(`http://localhost:${port}`)}`);
        Logger.info('Press Ctrl+C to stop the server');

        // Keep the server running - handle graceful shutdown
        process.on('SIGINT', async () => {
          Logger.info('Shutting down...');
          await guiServer.stop();
          process.exit(0);
        });
      } catch (error) {
        Logger.error(`Failed to start GUI server: ${(error as Error).message}`);
        process.exit(1);
      }
    });

  program
    .command('upgrade')
    .description('Upgrade AppClean to the latest version')
    .action(async () => {
      const upgradeManager = new UpgradeManager();

      Logger.space();

      try {
        const result = await upgradeManager.upgrade();

        if (result.success) {
          Logger.success(result.message);
        } else {
          Logger.warn(result.message);
        }
      } catch (error) {
        Logger.error(`Upgrade failed: ${(error as Error).message}`);
        process.exit(1);
      }

      Logger.space();
    });

  program
    .command('check-update')
    .description('Check if a new version of AppClean is available')
    .action(async () => {
      const upgradeManager = new UpgradeManager();

      Logger.space();

      try {
        const versionInfo = await upgradeManager.checkForUpdates();

        Logger.info(`Current version: ${chalk.cyan(`v${versionInfo.current}`)}`);
        Logger.info(`Latest version:  ${chalk.cyan(`v${versionInfo.latest}`)}`);

        if (versionInfo.isUpdateAvailable) {
          Logger.warn(
            `A new version is available! Run ${chalk.bold('appclean upgrade')} to update.`
          );
        } else {
          Logger.success('AppClean is up to date!');
        }
      } catch (error) {
        Logger.error(
          `Failed to check for updates: ${(error as Error).message}`
        );
        process.exit(1);
      }

      Logger.space();
    });

  program
    .command('uninstall')
    .description('Uninstall AppClean from your system')
    .option('--force', 'Skip confirmation prompt')
    .action(async (options) => {
      Logger.space();
      Logger.warn('⚠️  This will uninstall AppClean from your system.');

      // Show confirmation if not using --force
      if (!options.force) {
        const { promptConfirmRemoval } = await import('./ui/prompts');
        const confirmed = await promptConfirmRemoval('AppClean');

        if (!confirmed) {
          Logger.info('Uninstall cancelled');
          Logger.space();
          return;
        }
      }

      const upgradeManager = new UpgradeManager();

      try {
        const result = await upgradeManager.uninstall();

        if (result.success) {
          Logger.success(result.message);
          Logger.info('Thank you for using AppClean!');
        } else {
          Logger.warn(result.message);
        }
      } catch (error) {
        Logger.error(`Uninstall failed: ${(error as Error).message}`);
        process.exit(1);
      }

      Logger.space();
    });

  program.on('command:*', () => {
    if (process.argv.length < 3) {
      interactiveMode().catch((error) => {
        Logger.error((error as Error).message);
        process.exit(1);
      });
    }
  });

  program.parse(process.argv);

  if (process.argv.length < 3) {
    interactiveMode().catch((error) => {
      Logger.error((error as Error).message);
      process.exit(1);
    });
  }
}

main().catch((error) => {
  Logger.error((error as Error).message);
  process.exit(1);
});
