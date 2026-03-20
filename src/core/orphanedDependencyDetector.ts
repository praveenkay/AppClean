/**
 * Orphaned Dependency Detector
 * Identifies npm packages that are no longer referenced by any project
 * v1.4.0 Feature
 */

import { execSync } from 'child_process';
import { getHomeDir } from '../utils/platform.js';
import path from 'path';
import fs from 'fs';
import { Logger } from '../utils/logger.js';

export interface OrphanedPackage {
  name: string;
  version: string;
  location: string;
  size: number;
  lastModified: Date;
  isOrphaned: boolean;
  dependedBy: string[];
}

export class OrphanedDependencyDetector {
  /**
   * Detect orphaned npm packages
   */
  async detectOrphanedPackages(): Promise<OrphanedPackage[]> {
    Logger.info('Scanning for orphaned dependencies...');

    try {
      const globalPackages = this.getGlobalPackages();
      const projectPackages = this.getProjectPackages();

      const orphaned: OrphanedPackage[] = [];

      for (const pkg of globalPackages) {
        const dependedBy = this.checkDependencies(pkg.name, projectPackages);

        if (dependedBy.length === 0) {
          orphaned.push({
            ...pkg,
            isOrphaned: true,
            dependedBy: [],
          });
        } else {
          orphaned.push({
            ...pkg,
            isOrphaned: false,
            dependedBy,
          });
        }
      }

      return orphaned.filter((p) => p.isOrphaned);
    } catch (error) {
      Logger.error(`Error detecting orphaned packages: ${(error as Error).message}`);
      return [];
    }
  }

  /**
   * Get globally installed packages
   */
  private getGlobalPackages(): OrphanedPackage[] {
    try {
      const output = execSync('npm list -g --json 2>/dev/null || echo "{}"').toString();
      const data = JSON.parse(output);

      const packages: OrphanedPackage[] = [];

      if (data.dependencies) {
        for (const [name, pkg] of Object.entries(data.dependencies)) {
          const location = this.findPackageLocation(name);
          if (location) {
            const stats = fs.statSync(location);
            packages.push({
              name,
              version: (pkg as any).version || 'unknown',
              location,
              size: this.getDirectorySize(location),
              lastModified: stats.mtime,
              isOrphaned: false,
              dependedBy: [],
            });
          }
        }
      }

      return packages;
    } catch {
      return [];
    }
  }

  /**
   * Get project packages from package.json files
   */
  private getProjectPackages(): Set<string> {
    const packages = new Set<string>();

    try {
      const home = getHomeDir();
      const searchPaths = [home, '/usr/local'];

      for (const searchPath of searchPaths) {
        this.findPackageJsonFiles(searchPath, packages);
      }
    } catch {
      // Ignore errors during project scanning
    }

    return packages;
  }

  /**
   * Find package.json files recursively
   */
  private findPackageJsonFiles(dir: string, packages: Set<string>, depth: number = 0): void {
    if (depth > 3) return; // Limit depth to avoid scanning too deep

    try {
      const entries = fs.readdirSync(dir);

      for (const entry of entries) {
        if (entry === 'package.json') {
          try {
            const content = fs.readFileSync(path.join(dir, entry), 'utf-8');
            const json = JSON.parse(content);

            if (json.dependencies) {
              Object.keys(json.dependencies).forEach((dep) => packages.add(dep));
            }
            if (json.devDependencies) {
              Object.keys(json.devDependencies).forEach((dep) => packages.add(dep));
            }
          } catch {
            // Skip invalid package.json
          }
        }

        const fullPath = path.join(dir, entry);
        if (fs.statSync(fullPath).isDirectory() && !entry.startsWith('.')) {
          this.findPackageJsonFiles(fullPath, packages, depth + 1);
        }
      }
    } catch {
      // Ignore read errors
    }
  }

  /**
   * Check if package is depended by any project
   */
  private checkDependencies(packageName: string, projectPackages: Set<string>): string[] {
    return Array.from(projectPackages).filter((p) => p === packageName);
  }

  /**
   * Find package location
   */
  private findPackageLocation(packageName: string): string | null {
    try {
      const result = execSync(`npm list -g ${packageName} --json 2>/dev/null || echo "{}"`).toString();
      const data = JSON.parse(result);
      return data.dependencies?.[packageName]?.resolved || null;
    } catch {
      return null;
    }
  }

  /**
   * Get directory size
   */
  private getDirectorySize(dir: string): number {
    try {
      let size = 0;
      const entries = fs.readdirSync(dir);

      for (const entry of entries) {
        const fullPath = path.join(dir, entry);
        const stats = fs.statSync(fullPath);

        if (stats.isDirectory()) {
          size += this.getDirectorySize(fullPath);
        } else {
          size += stats.size;
        }
      }

      return size;
    } catch {
      return 0;
    }
  }
}
