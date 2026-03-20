import { execSync } from 'child_process';
import path from 'path';
import { getHomeDir } from '../utils/platform.js';
import { pathExists, listDirectory, readFile } from '../utils/filesystem.js';
import { InstalledApp, ArtifactPath } from '../types';
import { Logger } from '../utils/logger.js';

export class NpmManager {
  private globalNpmPath: string;

  constructor() {
    this.globalNpmPath = this.getNpmGlobalPath();
  }

  private getNpmGlobalPath(): string {
    try {
      return execSync('npm config get prefix').toString().trim();
    } catch {
      return path.join(getHomeDir(), '.npm-global');
    }
  }

  async getInstalledPackages(): Promise<InstalledApp[]> {
    const packages: InstalledApp[] = [];

    try {
      const output = execSync('npm list -g --json --depth=0').toString();
      const data = JSON.parse(output);
      const dependencies = data.dependencies || {};

      for (const [name, pkg] of Object.entries(dependencies)) {
        const typedPkg = pkg as any;
        packages.push({
          name,
          version: typedPkg.version || 'unknown',
          installMethod: 'npm',
          mainPath: path.join(this.globalNpmPath, 'lib', 'node_modules', name),
          installedDate: undefined,
        });
      }
    } catch (error) {
      Logger.debug('Failed to get npm packages: ' + (error as Error).message);
    }

    return packages;
  }

  async findArtifacts(appName: string): Promise<ArtifactPath[]> {
    const artifacts: ArtifactPath[] = [];
    const home = getHomeDir();

    // Main package directory
    const packagePath = path.join(
      this.globalNpmPath,
      'lib',
      'node_modules',
      appName
    );
    if (pathExists(packagePath)) {
      artifacts.push({
        path: packagePath,
        type: 'other',
        size: 0,
        description: 'Package directory',
      });
    }

    // Binaries in bin directory
    const binPath = path.join(this.globalNpmPath, 'bin', appName);
    if (pathExists(binPath)) {
      artifacts.push({
        path: binPath,
        type: 'binary',
        size: 0,
        description: 'Executable binary',
      });
    }

    // Config files
    const configPaths = [
      path.join(home, `.${appName}rc`),
      path.join(home, `.${appName}rc.json`),
      path.join(home, `.config`, appName),
    ];

    for (const configPath of configPaths) {
      if (pathExists(configPath)) {
        artifacts.push({
          path: configPath,
          type: 'config',
          size: 0,
          description: `${appName} configuration`,
        });
      }
    }

    // Cache directories
    const cachePaths = [
      path.join(home, `.cache`, appName),
      path.join(home, `Library`, `Caches`, appName),
    ];

    for (const cachePath of cachePaths) {
      if (pathExists(cachePath)) {
        artifacts.push({
          path: cachePath,
          type: 'cache',
          size: 0,
          description: `${appName} cache`,
        });
      }
    }

    // Data directories
    const dataPath = path.join(home, `.local`, `share`, appName);
    if (pathExists(dataPath)) {
      artifacts.push({
        path: dataPath,
        type: 'data',
        size: 0,
        description: `${appName} data files`,
      });
    }

    return artifacts;
  }

  async removePackage(appName: string): Promise<boolean> {
    try {
      execSync(`npm uninstall -g ${appName}`);
      return true;
    } catch (error) {
      Logger.debug('Failed to uninstall npm package: ' + (error as Error).message);
      return false;
    }
  }
}
