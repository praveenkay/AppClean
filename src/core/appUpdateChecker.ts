/**
 * App Update Checker
 * Checks for available updates for installed applications
 * v1.7.0 Feature
 */

import { execSync } from 'child_process';
import { Logger } from '../utils/logger.js';
import { InstalledApp } from '../types';

export interface UpdateInfo {
  appName: string;
  currentVersion: string;
  latestVersion: string;
  hasUpdate: boolean;
  releaseDate?: Date;
  changelog?: string;
  installCommand?: string;
}

export class AppUpdateChecker {
  /**
   * Check for updates for a specific app
   */
  async checkForUpdate(app: InstalledApp): Promise<UpdateInfo> {
    Logger.info(`Checking for updates: ${app.name}...`);

    const info: UpdateInfo = {
      appName: app.name,
      currentVersion: app.version,
      latestVersion: app.version,
      hasUpdate: false,
    };

    try {
      switch (app.installMethod) {
        case 'npm':
          await this.checkNpmUpdate(info);
          break;
        case 'yarn':
          await this.checkYarnUpdate(info);
          break;
        case 'pnpm':
          await this.checkPnpmUpdate(info);
          break;
        case 'brew':
          await this.checkBrewUpdate(info);
          break;
        case 'apt':
          await this.checkAptUpdate(info);
          break;
        case 'yum':
        case 'dnf':
          await this.checkYumUpdate(info);
          break;
        default:
          Logger.warn(`No update checker available for ${app.installMethod}`);
      }
    } catch (error) {
      Logger.debug(`Update check failed for ${app.name}: ${(error as Error).message}`);
    }

    return info;
  }

  /**
   * Check for updates for multiple apps
   */
  async checkForUpdates(apps: InstalledApp[]): Promise<UpdateInfo[]> {
    const updates: UpdateInfo[] = [];

    for (const app of apps) {
      const update = await this.checkForUpdate(app);
      updates.push(update);
    }

    return updates;
  }

  /**
   * Check npm registry for updates
   */
  private async checkNpmUpdate(info: UpdateInfo): Promise<void> {
    try {
      const output = execSync(`npm view ${info.appName} version 2>/dev/null`).toString().trim();
      if (output) {
        info.latestVersion = output;
        info.hasUpdate = this.compareVersions(info.currentVersion, output) < 0;
        info.installCommand = `npm install -g ${info.appName}@latest`;
      }
    } catch {
      // Package not found or network error
    }
  }

  /**
   * Check yarn registry for updates
   */
  private async checkYarnUpdate(info: UpdateInfo): Promise<void> {
    try {
      const output = execSync(`yarn info ${info.appName} version 2>/dev/null`).toString().trim();
      if (output) {
        info.latestVersion = output;
        info.hasUpdate = this.compareVersions(info.currentVersion, output) < 0;
        info.installCommand = `yarn global upgrade ${info.appName}`;
      }
    } catch {
      // Package not found or network error
    }
  }

  /**
   * Check pnpm registry for updates
   */
  private async checkPnpmUpdate(info: UpdateInfo): Promise<void> {
    try {
      const output = execSync(`pnpm view ${info.appName} version 2>/dev/null`).toString().trim();
      if (output) {
        info.latestVersion = output;
        info.hasUpdate = this.compareVersions(info.currentVersion, output) < 0;
        info.installCommand = `pnpm add -g ${info.appName}@latest`;
      }
    } catch {
      // Package not found or network error
    }
  }

  /**
   * Check homebrew for updates
   */
  private async checkBrewUpdate(info: UpdateInfo): Promise<void> {
    try {
      const output = execSync(`brew info ${info.appName} 2>/dev/null | grep "stable"`).toString();
      const match = output.match(/(\d+\.\d+\.\d+)/);
      if (match) {
        info.latestVersion = match[1];
        info.hasUpdate = this.compareVersions(info.currentVersion, match[1]) < 0;
        info.installCommand = `brew upgrade ${info.appName}`;
      }
    } catch {
      // Package not found or network error
    }
  }

  /**
   * Check apt for updates
   */
  private async checkAptUpdate(info: UpdateInfo): Promise<void> {
    try {
      const output = execSync(`apt-cache policy ${info.appName} 2>/dev/null`).toString();
      const match = output.match(/Candidate: (\S+)/);
      if (match) {
        info.latestVersion = match[1];
        info.hasUpdate = this.compareVersions(info.currentVersion, match[1]) < 0;
        info.installCommand = `sudo apt update && sudo apt upgrade ${info.appName}`;
      }
    } catch {
      // Package not found or network error
    }
  }

  /**
   * Check yum/dnf for updates
   */
  private async checkYumUpdate(info: UpdateInfo): Promise<void> {
    try {
      const output = execSync(`yum info ${info.appName} 2>/dev/null`).toString();
      const match = output.match(/Version\s+:\s+(\S+)/);
      if (match) {
        info.latestVersion = match[1];
        info.hasUpdate = this.compareVersions(info.currentVersion, match[1]) < 0;
        info.installCommand = `sudo yum update ${info.appName}`;
      }
    } catch {
      // Package not found or network error
    }
  }

  /**
   * Compare semantic versions
   * Returns: -1 if v1 < v2, 0 if v1 == v2, 1 if v1 > v2
   */
  private compareVersions(v1: string, v2: string): number {
    const parts1 = v1.split('.').map((p) => parseInt(p, 10));
    const parts2 = v2.split('.').map((p) => parseInt(p, 10));

    for (let i = 0; i < Math.max(parts1.length, parts2.length); i++) {
      const p1 = parts1[i] || 0;
      const p2 = parts2[i] || 0;

      if (p1 < p2) return -1;
      if (p1 > p2) return 1;
    }

    return 0;
  }

  /**
   * Get formatted update summary
   */
  getUpdateSummary(updates: UpdateInfo[]): string {
    const available = updates.filter((u) => u.hasUpdate);

    if (available.length === 0) {
      return 'All applications are up to date!';
    }

    let summary = `Found ${available.length} update(s) available:\n\n`;
    available.forEach((update) => {
      summary += `📦 ${update.appName}\n`;
      summary += `   Current: ${update.currentVersion} → Latest: ${update.latestVersion}\n`;
      if (update.installCommand) {
        summary += `   Install: ${update.installCommand}\n`;
      }
      summary += '\n';
    });

    return summary;
  }
}
