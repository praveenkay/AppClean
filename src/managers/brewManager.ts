import { execSync } from 'child_process';
import path from 'path';
import { getHomeDir } from '../utils/platform';
import { pathExists, listDirectory } from '../utils/filesystem';
import { InstalledApp, ArtifactPath } from '../types';
import { Logger } from '../utils/logger';

export class BrewManager {
  private brewPrefix: string;

  constructor() {
    this.brewPrefix = this.getBrewPrefix();
  }

  private getBrewPrefix(): string {
    try {
      return execSync('brew --prefix').toString().trim();
    } catch {
      // Default based on architecture
      if (process.arch === 'arm64') {
        return '/opt/homebrew';
      }
      return '/usr/local';
    }
  }

  async getInstalledPackages(): Promise<InstalledApp[]> {
    const packages: InstalledApp[] = [];

    try {
      // Use 'brew list -1' which outputs one package per line
      const output = execSync('brew list -1').toString();
      const lines = output.split('\n').filter((line) => line.trim().length > 0);

      for (const pkg of lines) {
        const packageName = pkg.trim();
        const cellarPath = path.join(this.brewPrefix, 'Cellar', packageName);
        packages.push({
          name: packageName,
          version: 'unknown',
          installMethod: 'brew',
          mainPath: cellarPath,
          installedDate: undefined,
        });
      }
    } catch (error) {
      Logger.debug('Failed to get brew packages: ' + (error as Error).message);
    }

    return packages;
  }

  async findArtifacts(appName: string): Promise<ArtifactPath[]> {
    const artifacts: ArtifactPath[] = [];
    const home = getHomeDir();

    // Main Cellar directory
    const cellarPath = path.join(this.brewPrefix, 'Cellar', appName);
    if (pathExists(cellarPath)) {
      artifacts.push({
        path: cellarPath,
        type: 'other',
        size: 0,
        description: 'Cellar directory',
      });
    }

    // Binary links in bin
    const binPath = path.join(this.brewPrefix, 'bin', appName);
    if (pathExists(binPath)) {
      artifacts.push({
        path: binPath,
        type: 'binary',
        size: 0,
        description: 'Binary symlink',
      });
    }

    // Man pages
    const manPath = path.join(this.brewPrefix, 'share', 'man', 'man1', `${appName}.1`);
    if (pathExists(manPath)) {
      artifacts.push({
        path: manPath,
        type: 'data',
        size: 0,
        description: 'Man page',
      });
    }

    // Preferences (macOS)
    const prefPath = path.join(home, 'Library', 'Preferences', `com.${appName}*`);
    const prefDir = path.join(home, 'Library', 'Preferences');
    if (pathExists(prefDir)) {
      const files = listDirectory(prefDir);
      for (const file of files) {
        if (file.includes(appName)) {
          artifacts.push({
            path: path.join(prefDir, file),
            type: 'config',
            size: 0,
            description: 'Preference file',
          });
        }
      }
    }

    // Application Support (macOS)
    const appSupportPath = path.join(
      home,
      'Library',
      'Application Support',
      appName
    );
    if (pathExists(appSupportPath)) {
      artifacts.push({
        path: appSupportPath,
        type: 'config',
        size: 0,
        description: 'Application support directory',
      });
    }

    // Launch agents/daemons (macOS)
    const launchAgentsPath = path.join(home, 'Library', 'LaunchAgents');
    if (pathExists(launchAgentsPath)) {
      const files = listDirectory(launchAgentsPath);
      for (const file of files) {
        if (file.includes(appName)) {
          artifacts.push({
            path: path.join(launchAgentsPath, file),
            type: 'service',
            size: 0,
            description: 'Launch agent',
          });
        }
      }
    }

    return artifacts;
  }

  async removePackage(appName: string): Promise<boolean> {
    try {
      execSync(`brew uninstall ${appName}`);
      return true;
    } catch (error) {
      Logger.debug('Failed to uninstall brew package: ' + (error as Error).message);
      return false;
    }
  }
}
