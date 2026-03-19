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
import { PermissionHandler } from './permissionHandler';
import { ServiceFileDetector } from './serviceFileDetector';
import { RemovalRecorder, RemovalRecord } from './removalRecorder';
import { ReportGenerator } from './reportGenerator';
import { VerificationModule } from './verificationModule';

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

    const recorder = new RemovalRecorder();
    const verificationModule = new VerificationModule();
    const serviceDetector = new ServiceFileDetector();
    const reportGenerator = new ReportGenerator();

    let removalRecord: RemovalRecord | null = null;
    const artifactPaths = artifacts.map((a) => a.path);

    try {
      // Step 1: Check if elevation is required
      const requiresElevation = PermissionHandler.installationRequiresElevation(installMethod, artifactPaths);
      if (requiresElevation && !PermissionHandler.isElevated()) {
        await PermissionHandler.requestElevatedPermissions();
        Logger.warn('Please run this command with sudo for complete removal of system packages');
      }

      // Step 2: Detect service files that need manual cleanup
      const serviceFiles = await serviceDetector.findServiceFiles(appName);
      if (serviceFiles.length > 0) {
        Logger.info('\n⚠️  Manual Cleanup Required:');
        Logger.info('The following service files require manual cleanup:');
        serviceFiles.forEach((file, index) => {
          console.log(`\n${index + 1}. ${file.type.toUpperCase()}`);
          console.log(`   Path: ${file.path}`);
          console.log(`   Command: ${file.manualCleanupInstructions}`);
        });
      }

      // Step 3: Dry run
      if (options.dryRun) {
        await this.previewRemoval(artifacts);
        result.success = true;
        return result;
      }

      // Step 4: Create removal record and record user consent
      removalRecord = recorder.createRecord(appName, installMethod, options.userConsent ?? true);

      // Step 5: Create backup if requested
      if (options.createBackup) {
        result.backupPath = await this.createBackup(appName, artifacts);
      }

      // Step 6: Remove using package manager first
      const removed = await this.removeViaPackageManager(appName, installMethod);

      if (!removed) {
        Logger.warn(`Package manager removal failed, attempting manual file removal...`);
      }

      // Step 7: Manually remove remaining artifacts
      const removalResult = await this.removeArtifacts(artifacts, options);

      // Step 8: Record deleted artifacts
      artifacts.forEach((artifact, index) => {
        const status = index < removalResult.success ? 'deleted' : 'failed';
        const errorMsg = removalResult.errors.find((e) => e.includes(artifact.path));
        recorder.addDeletedArtifact(removalRecord!, artifact, status as 'deleted' | 'failed' | 'skipped', errorMsg);
      });

      result.removedFiles = removalResult.success;
      result.errors = removalResult.errors;
      result.freedSpace = artifacts.reduce((total, a) => total + (a.size || 0), 0);

      // Step 9: Verify removal
      const verificationResult = await verificationModule.verifyRemoval(appName, artifactPaths);
      recorder.updateVerificationStatus(removalRecord!, verificationResult.status);
      Logger.info(`\n${verificationModule.getStatusMessage(verificationResult.status)}`);

      if (removalResult.failed === 0) {
        result.success = true;
        recorder.updateCompletionStatus(removalRecord!, 'success');
        Logger.success(`Successfully removed ${appName}`);
      } else {
        recorder.updateCompletionStatus(removalRecord!, removalResult.failed === removalResult.success + removalResult.failed ? 'partial' : 'failed');
        Logger.warn(`Removed ${appName} with ${removalResult.failed} errors`);
      }

      // Step 10: Save removal record
      if (removalRecord) {
        const recordPath = recorder.saveRecord(removalRecord);
        Logger.debug(`Removal record saved to: ${recordPath}`);

        // Step 11: Generate and save report
        const reportPath = ReportGenerator.saveReport(removalRecord, options.reportFormat ?? 'html');
        Logger.success(`Report generated: ${reportPath}`);

        // Display report summary
        ReportGenerator.displayReport(removalRecord);
      }
    } catch (error) {
      result.success = false;
      result.errors?.push((error as Error).message);
      Logger.error(`Failed to remove ${appName}: ${(error as Error).message}`);

      if (removalRecord) {
        recorder.updateCompletionStatus(removalRecord, 'failed');
        const recordPath = recorder.saveRecord(removalRecord);
        Logger.debug(`Failed removal record saved to: ${recordPath}`);
      }
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
