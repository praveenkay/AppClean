import { execSync } from 'child_process';
import path from 'path';
import { getHomeDir } from '../utils/platform';
import { pathExists, listDirectory } from '../utils/filesystem';
import { InstalledApp, ArtifactPath } from '../types';
import { Logger } from '../utils/logger';

export class LinuxManager {
  private packageManager: 'apt' | 'yum' | 'dnf' | 'unknown' = 'unknown';

  constructor() {
    this.packageManager = this.detectPackageManager();
  }

  private detectPackageManager(): 'apt' | 'yum' | 'dnf' | 'unknown' {
    try {
      execSync('which apt', { stdio: 'ignore' });
      return 'apt';
    } catch {}

    try {
      execSync('which dnf', { stdio: 'ignore' });
      return 'dnf';
    } catch {}

    try {
      execSync('which yum', { stdio: 'ignore' });
      return 'yum';
    } catch {}

    return 'unknown';
  }

  async getInstalledPackages(): Promise<InstalledApp[]> {
    const packages: InstalledApp[] = [];

    if (this.packageManager === 'unknown') {
      return packages;
    }

    try {
      let output: string;

      if (this.packageManager === 'apt') {
        output = execSync('apt list --installed 2>/dev/null').toString();
        const lines = output.split('\n').slice(1); // Skip header

        for (const line of lines) {
          if (!line.trim()) continue;
          const parts = line.split('/');
          if (parts[0]) {
            packages.push({
              name: parts[0].trim(),
              version: 'unknown',
              installMethod: 'apt',
              mainPath: '',
              installedDate: undefined,
            });
          }
        }
      } else {
        // yum or dnf
        try {
          output = execSync(`${this.packageManager} list installed`).toString();
          const lines = output.split('\n');

          for (const line of lines) {
            if (!line.trim()) continue;
            const parts = line.split(/\s+/);
            if (parts[0]) {
              packages.push({
                name: parts[0].split('.')[0],
                version: parts[1] || 'unknown',
                installMethod: this.packageManager as 'yum' | 'dnf',
                mainPath: '',
                installedDate: undefined,
              });
            }
          }
        } catch (error) {
          Logger.debug(`Failed to query ${this.packageManager}: ` + (error as Error).message);
        }
      }
    } catch (error) {
      Logger.debug('Failed to get system packages: ' + (error as Error).message);
    }

    return packages;
  }

  async findArtifacts(appName: string): Promise<ArtifactPath[]> {
    const artifacts: ArtifactPath[] = [];
    const home = getHomeDir();

    // Binaries
    const binPaths = [
      `/usr/bin/${appName}`,
      `/usr/local/bin/${appName}`,
      `${home}/.local/bin/${appName}`,
    ];

    for (const binPath of binPaths) {
      if (pathExists(binPath)) {
        artifacts.push({
          path: binPath,
          type: 'binary',
          size: 0,
          description: 'Binary executable',
        });
      }
    }

    // Config files
    const configPaths = [
      path.join(home, `.config`, appName),
      path.join(home, `.${appName}rc`),
      path.join(home, `.${appName}`),
      `/etc/${appName}`,
      `/etc/${appName}.conf`,
    ];

    for (const configPath of configPaths) {
      if (pathExists(configPath)) {
        artifacts.push({
          path: configPath,
          type: 'config',
          size: 0,
          description: 'Configuration directory/file',
        });
      }
    }

    // Cache files
    const cachePaths = [
      path.join(home, `.cache`, appName),
      path.join(home, `.${appName}_cache`),
    ];

    for (const cachePath of cachePaths) {
      if (pathExists(cachePath)) {
        artifacts.push({
          path: cachePath,
          type: 'cache',
          size: 0,
          description: 'Cache directory',
        });
      }
    }

    // Data files
    const dataPath = path.join(home, `.local`, `share`, appName);
    if (pathExists(dataPath)) {
      artifacts.push({
        path: dataPath,
        type: 'data',
        size: 0,
        description: 'Data directory',
      });
    }

    // Log files
    const logPaths = [
      `/var/log/${appName}`,
      `/var/log/${appName}.log`,
      path.join(home, `.local`, `share`, `log`, appName),
    ];

    for (const logPath of logPaths) {
      if (pathExists(logPath)) {
        artifacts.push({
          path: logPath,
          type: 'log',
          size: 0,
          description: 'Log file/directory',
        });
      }
    }

    // Systemd services
    const systemdPath = `/etc/systemd/system/${appName}.service`;
    if (pathExists(systemdPath)) {
      artifacts.push({
        path: systemdPath,
        type: 'service',
        size: 0,
        description: 'Systemd service file',
      });
    }

    return artifacts;
  }

  async removePackage(appName: string): Promise<boolean> {
    if (this.packageManager === 'unknown') {
      return false;
    }

    try {
      const command = this.packageManager === 'apt'
        ? `apt-get remove -y ${appName}`
        : `${this.packageManager} remove -y ${appName}`;

      execSync(command, { stdio: 'pipe' });
      return true;
    } catch (error) {
      Logger.debug(`Failed to uninstall ${appName}: ` + (error as Error).message);
      return false;
    }
  }
}
