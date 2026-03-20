import { execSync } from 'child_process';
import { Logger } from './logger.js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

export interface VersionInfo {
  current: string;
  latest: string;
  isUpdateAvailable: boolean;
}

export class UpgradeManager {
  private readonly packageName = 'appclean';
  private currentVersion: string;

  constructor() {
    // Dynamically read version from package.json
    try {
      const __filename = fileURLToPath(import.meta.url);
      const __dirname = dirname(__filename);
      const packagePath = join(__dirname, '../../package.json');
      const packageData = JSON.parse(readFileSync(packagePath, 'utf-8'));
      this.currentVersion = packageData.version || '2.0.0';
    } catch (error) {
      Logger.debug('Failed to read version from package.json, using fallback');
      this.currentVersion = '2.0.0';
    }
  }

  /**
   * Get version information from npm registry
   */
  async getVersionInfo(): Promise<VersionInfo> {
    try {
      // Fetch latest version from npm registry
      const output = execSync(
        `npm view ${this.packageName} version --json`,
        { encoding: 'utf-8', stdio: ['pipe', 'pipe', 'pipe'] }
      ).trim();

      const latestVersion = output.replace(/"/g, '');
      const isUpdateAvailable = this.compareVersions(
        this.currentVersion,
        latestVersion
      );

      return {
        current: this.currentVersion,
        latest: latestVersion,
        isUpdateAvailable,
      };
    } catch (error) {
      Logger.debug(
        'Failed to check npm registry: ' + (error as Error).message
      );
      return {
        current: this.currentVersion,
        latest: this.currentVersion,
        isUpdateAvailable: false,
      };
    }
  }

  /**
   * Compare two semantic versions
   * Returns true if currentVersion < latestVersion
   */
  private compareVersions(current: string, latest: string): boolean {
    const currentParts = current.split('.').map(Number);
    const latestParts = latest.split('.').map(Number);

    for (let i = 0; i < 3; i++) {
      const curr = currentParts[i] || 0;
      const lat = latestParts[i] || 0;

      if (lat > curr) return true;
      if (lat < curr) return false;
    }

    return false;
  }

  /**
   * Perform upgrade to latest version
   */
  async upgrade(): Promise<{ success: boolean; message: string }> {
    try {
      Logger.info('Checking for updates...');

      const versionInfo = await this.getVersionInfo();

      if (!versionInfo.isUpdateAvailable) {
        return {
          success: true,
          message: `AppClean is already up to date (v${versionInfo.current})`,
        };
      }

      Logger.info(
        `Upgrading from v${versionInfo.current} to v${versionInfo.latest}...`
      );

      // Install latest version globally
      execSync(`npm install -g ${this.packageName}@latest`, {
        stdio: 'inherit',
      });

      return {
        success: true,
        message: `Successfully upgraded to v${versionInfo.latest}`,
      };
    } catch (error) {
      const errorMsg = (error as Error).message;
      return {
        success: false,
        message: `Upgrade failed: ${errorMsg}`,
      };
    }
  }

  /**
   * Get current version
   */
  getCurrentVersion(): string {
    return this.currentVersion;
  }

  /**
   * Check if update is available without upgrading
   */
  async checkForUpdates(): Promise<VersionInfo> {
    return this.getVersionInfo();
  }

  /**
   * Uninstall AppClean from the system
   */
  async uninstall(): Promise<{ success: boolean; message: string }> {
    try {
      Logger.info('Uninstalling AppClean...');

      // Uninstall global npm package
      execSync(`npm uninstall -g ${this.packageName}`, {
        stdio: 'inherit',
      });

      return {
        success: true,
        message: `AppClean has been successfully uninstalled from your system.`,
      };
    } catch (error) {
      const errorMsg = (error as Error).message;
      return {
        success: false,
        message: `Uninstall failed: ${errorMsg}`,
      };
    }
  }
}
