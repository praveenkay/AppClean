/**
 * RemovalService - Wraps Remover to provide safe app removal
 */

import { Remover } from '../../../core/remover.js';
import { Detector } from '../../../core/detector.js';
import { Logger } from '../../../utils/logger.js';

export interface RemovalOptions {
  dryRun?: boolean;
  createBackup?: boolean;
}

export interface RemovalResult {
  success: boolean;
  appName: string;
  removedFiles: number;
  freedSpace: number;
  backupPath?: string;
  errors?: string[];
}

export class RemovalService {
  private remover: Remover;
  private detector: Detector;
  private sessionRemovals: RemovalResult[] = [];

  constructor() {
    this.remover = new Remover();
    this.detector = new Detector();
  }

  /**
   * Execute app removal
   */
  async removeApp(appName: string, options: RemovalOptions = {}): Promise<RemovalResult> {
    try {
      // Find the app
      const allApps = await this.detector.searchApps({ query: appName });
      const app = allApps.find((a) => a.name.toLowerCase() === appName.toLowerCase());

      if (!app) {
        throw new Error(`App "${appName}" not found`);
      }

      // Find artifacts
      const artifacts = await this.detector.findArtifacts(app.name, app.installMethod);

      if (artifacts.length === 0) {
        return {
          success: true,
          appName: app.name,
          removedFiles: 0,
          freedSpace: 0,
        };
      }

      // Calculate freed space
      const freedSpace = artifacts.reduce((sum, a) => sum + (a.size || 0), 0);

      // Handle dry-run
      if (options.dryRun) {
        Logger.info(`[DRY RUN] Would remove ${artifacts.length} artifacts (${this.formatBytes(freedSpace)}) for ${appName}`);
        return {
          success: true,
          appName: app.name,
          removedFiles: artifacts.length,
          freedSpace,
        };
      }

      // Create backup if requested
      let backupPath: string | undefined;
      if (options.createBackup) {
        try {
          backupPath = await this.remover.createBackup(app.name, artifacts);
          Logger.info(`Created backup at: ${backupPath}`);
        } catch (error) {
          Logger.warn(`Failed to create backup: ${(error as Error).message}`);
        }
      }

      // Remove artifacts using Remover class
      const removalResult = await this.remover.removeArtifacts(artifacts, { dryRun: false });

      const result: RemovalResult = {
        success: removalResult.failed === 0,
        appName: app.name,
        removedFiles: removalResult.success,
        freedSpace,
      };

      if (backupPath) {
        result.backupPath = backupPath;
      }

      if (removalResult.errors.length > 0) {
        result.errors = removalResult.errors;
      }

      // Track removal for dashboard
      this.sessionRemovals.push(result);

      Logger.success(`Successfully removed ${app.name} (freed ${this.formatBytes(freedSpace)})`);
      return result;
    } catch (error) {
      throw new Error(`Removal failed: ${(error as Error).message}`);
    }
  }

  /**
   * Get session removals for dashboard
   */
  getSessionRemovals(): RemovalResult[] {
    return this.sessionRemovals;
  }

  /**
   * Clear session removals
   */
  clearSessionRemovals(): void {
    this.sessionRemovals = [];
  }

  /**
   * Format bytes to human readable
   */
  private formatBytes(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}

// Export singleton
export const removalService = new RemovalService();
