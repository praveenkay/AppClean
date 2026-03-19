import path from 'path';
import { execSync } from 'child_process';
import { getHomeDir } from '../utils/platform';
import {
  deleteFile,
  deleteDirectory,
  pathExists,
  getDirectorySize,
} from '../utils/filesystem';
import { ArtifactPath, RemovalOptions, RemovalResult } from '../types';
import { Logger, formatBytes } from '../utils/logger';
import { NpmManager } from '../managers/npmManager';
import { BrewManager } from '../managers/brewManager';
import { LinuxManager } from '../managers/linuxManager';

export class Remover {
  async previewRemoval(artifacts: ArtifactPath[]): Promise<void> {
    Logger.info('Files to be removed:');
    Logger.space();

    let totalSize = 0;

    for (const artifact of artifacts) {
      const size = artifact.size || 0;
      totalSize += size;

      console.log(`  ${artifact.type.padEnd(8)} ${formatBytes(size).padEnd(10)} ${artifact.path}`);
    }

    Logger.space();
    Logger.info(`Total space to be freed: ${formatBytes(totalSize)}`);
  }

  async createBackup(appName: string, artifacts: ArtifactPath[]): Promise<string> {
    const home = getHomeDir();
    const backupDir = path.join(home, '.appclean-backups');
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupPath = path.join(backupDir, `${appName}-${timestamp}.tar.gz`);

    try {
      // Create backup directory
      execSync(`mkdir -p "${backupDir}"`);

      // Create tar archive
      const filePaths = artifacts.map((a) => `"${a.path}"`).join(' ');
      execSync(`tar -czf "${backupPath}" ${filePaths} 2>/dev/null || true`);

      Logger.success(`Backup created: ${backupPath}`);
      return backupPath;
    } catch (error) {
      Logger.warn(`Failed to create backup: ${(error as Error).message}`);
      return '';
    }
  }

  async removeArtifacts(
    artifacts: ArtifactPath[],
    options: RemovalOptions
  ): Promise<{ success: number; failed: number; errors: string[] }> {
    const errors: string[] = [];
    let success = 0;
    let failed = 0;

    for (const artifact of artifacts) {
      try {
        if (!pathExists(artifact.path)) {
          continue;
        }

        // Check if it's a directory or file
        const isDirectory = this.isDirectory(artifact.path);

        if (isDirectory) {
          const deleted = deleteDirectory(artifact.path);
          if (deleted) {
            success++;
          } else {
            failed++;
            errors.push(`Failed to delete directory: ${artifact.path}`);
          }
        } else {
          const deleted = deleteFile(artifact.path);
          if (deleted) {
            success++;
          } else {
            failed++;
            errors.push(`Failed to delete file: ${artifact.path}`);
          }
        }
      } catch (error) {
        failed++;
        errors.push(`Error removing ${artifact.path}: ${(error as Error).message}`);
      }
    }

    return { success, failed, errors };
  }

  async removeApp(
    appName: string,
    installMethod: string,
    artifacts: ArtifactPath[],
    options: RemovalOptions = {}
  ): Promise<RemovalResult> {
    const result: RemovalResult = {
      success: false,
      appName,
      removedFiles: 0,
      freedSpace: 0,
      errors: [],
    };

    try {
      // Dry run
      if (options.dryRun) {
        await this.previewRemoval(artifacts);
        result.success = true;
        return result;
      }

      // Create backup if requested
      if (options.createBackup) {
        result.backupPath = await this.createBackup(appName, artifacts);
      }

      // Remove using package manager first
      const removed = await this.removeViaPackageManager(appName, installMethod);

      if (!removed) {
        Logger.warn(
          `Package manager removal failed, attempting manual file removal...`
        );
      }

      // Manually remove remaining artifacts
      const removalResult = await this.removeArtifacts(artifacts, options);

      result.removedFiles = removalResult.success;
      result.errors = removalResult.errors;
      result.freedSpace = artifacts.reduce((total, a) => total + (a.size || 0), 0);

      if (removalResult.failed === 0) {
        result.success = true;
        Logger.success(`Successfully removed ${appName}`);
      } else {
        Logger.warn(`Removed ${appName} with ${removalResult.failed} errors`);
      }
    } catch (error) {
      result.success = false;
      result.errors?.push((error as Error).message);
      Logger.error(`Failed to remove ${appName}: ${(error as Error).message}`);
    }

    return result;
  }

  private async removeViaPackageManager(
    appName: string,
    installMethod: string
  ): Promise<boolean> {
    try {
      switch (installMethod) {
        case 'npm': {
          const npm = new NpmManager();
          return await npm.removePackage(appName);
        }

        case 'brew': {
          const brew = new BrewManager();
          return await brew.removePackage(appName);
        }

        case 'apt':
        case 'yum':
        case 'dnf': {
          const linux = new LinuxManager();
          return await linux.removePackage(appName);
        }

        default:
          return false;
      }
    } catch (error) {
      Logger.debug(`Package manager removal failed: ${(error as Error).message}`);
      return false;
    }
  }

  private isDirectory(filePath: string): boolean {
    try {
      const fs = require('fs');
      return fs.statSync(filePath).isDirectory();
    } catch {
      return false;
    }
  }

  async rollback(backupPath: string): Promise<boolean> {
    try {
      if (!pathExists(backupPath)) {
        Logger.error(`Backup file not found: ${backupPath}`);
        return false;
      }

      Logger.info('Restoring from backup...');
      execSync(`tar -xzf "${backupPath}" -C /`);
      Logger.success('Backup restored successfully');
      return true;
    } catch (error) {
      Logger.error(`Failed to restore backup: ${(error as Error).message}`);
      return false;
    }
  }
}
