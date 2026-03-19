import { execSync } from 'child_process';
import { isMacOS, isLinux, isWindows } from '../utils/platform';
import { pathExists } from '../utils/filesystem';

export type VerificationStatus = 'verified_removed' | 'still_exists' | 'partial_removal' | 'unknown';

export interface VerificationResult {
  status: VerificationStatus;
  remainingPaths: string[];
  commandOutput: string;
  timestamp: Date;
}

export class VerificationModule {
  /**
   * Verify if app is completely removed from the system
   */
  async verifyRemoval(
    appName: string,
    artifactPaths: string[]
  ): Promise<VerificationResult> {
    const result: VerificationResult = {
      status: 'unknown',
      remainingPaths: [],
      commandOutput: '',
      timestamp: new Date(),
    };

    try {
      // Check if artifacts still exist on filesystem
      const remainingPaths = artifactPaths.filter((path) => pathExists(path));
      result.remainingPaths = remainingPaths;

      // Verify via command line
      const commandStatus = await this.verifyViaCommand(appName);
      result.commandOutput = commandStatus;

      // Determine overall status
      if (remainingPaths.length === 0 && !commandStatus) {
        result.status = 'verified_removed';
      } else if (remainingPaths.length === 0 && commandStatus) {
        result.status = 'unknown'; // Found via command but not filesystem
      } else if (remainingPaths.length > 0 && remainingPaths.length < artifactPaths.length) {
        result.status = 'partial_removal';
      } else if (remainingPaths.length === artifactPaths.length) {
        result.status = 'still_exists';
      }
    } catch (error) {
      result.status = 'unknown';
      result.commandOutput = (error as Error).message;
    }

    return result;
  }

  /**
   * Verify via command line (which, where, etc.)
   */
  private async verifyViaCommand(appName: string): Promise<string> {
    try {
      if (isMacOS() || isLinux()) {
        // Try 'which' command to locate binary
        try {
          const output = execSync(`which ${appName} 2>/dev/null || true`).toString().trim();
          if (output) {
            return `Found at: ${output}`;
          }
        } catch {
          // which command failed or app not found
        }

        // Try to run the app to see if it's accessible
        try {
          execSync(`${appName} --version 2>/dev/null || true`).toString().trim();
          return `App still responds to --version`;
        } catch {
          // App not found or doesn't respond
        }

        return '';
      }

      if (isWindows()) {
        // Try 'where' command on Windows
        try {
          const output = execSync(`where ${appName} 2>nul || echo ""`).toString().trim();
          if (output && output !== '""') {
            return `Found at: ${output}`;
          }
        } catch {
          // where command failed or app not found
        }

        return '';
      }

      return '';
    } catch {
      return '';
    }
  }

  /**
   * Get human-readable status message
   */
  getStatusMessage(status: VerificationStatus): string {
    const messages: Record<VerificationStatus, string> = {
      verified_removed: '✓ Application successfully removed',
      still_exists: '✗ Application still exists on system',
      partial_removal: '⚠ Application partially removed (some files remain)',
      unknown: '? Verification status unknown',
    };

    return messages[status] || messages['unknown'];
  }

  /**
   * Get detailed verification report
   */
  getDetailedReport(result: VerificationResult): string {
    let report = `\n📋 Verification Report\n`;
    report += `${'─'.repeat(40)}\n`;
    report += `Status: ${this.getStatusMessage(result.status)}\n`;

    if (result.remainingPaths.length > 0) {
      report += `\nRemaining Files/Folders:\n`;
      result.remainingPaths.forEach((path) => {
        report += `  - ${path}\n`;
      });
    }

    if (result.commandOutput) {
      report += `\nCommand Output: ${result.commandOutput}\n`;
    }

    report += `Verified at: ${result.timestamp.toISOString()}\n`;

    return report;
  }
}
