import { execSync } from 'child_process';
import { isMacOS, isLinux, isWindows } from '../utils/platform';
import { Logger } from '../utils/logger';

export class PermissionHandler {
  /**
   * Check if current process has elevated privileges
   */
  static isElevated(): boolean {
    try {
      if (isMacOS() || isLinux()) {
        // Check if running as root
        const uid = execSync('id -u').toString().trim();
        return uid === '0';
      }

      if (isWindows()) {
        // Check if running with admin privileges
        const output = execSync('net session').toString().trim();
        return output.length > 0;
      }

      return false;
    } catch {
      return false;
    }
  }

  /**
   * Request elevated permissions using sudo or UAC
   */
  static async requestElevatedPermissions(): Promise<boolean> {
    try {
      if (isMacOS() || isLinux()) {
        Logger.warn('This operation requires elevated permissions');
        Logger.info('You may be prompted for your password (sudo)');
        return true;
      }

      if (isWindows()) {
        Logger.warn('This operation requires administrator privileges');
        Logger.info('Please run AppClean as Administrator');
        return false;
      }

      return false;
    } catch (error) {
      Logger.error(`Permission request failed: ${(error as Error).message}`);
      return false;
    }
  }

  /**
   * Check if path requires elevated access
   */
  static pathRequiresElevation(path: string): boolean {
    const systemPaths = [
      '/etc',
      '/sys',
      '/var',
      '/usr/bin',
      '/usr/local/bin',
      '/Library',
      'C:\\Program Files',
      'C:\\Windows',
      'C:\\ProgramData',
    ];

    return systemPaths.some((sysPath) => path.startsWith(sysPath));
  }

  /**
   * Check if app installation requires elevated permissions for removal
   */
  static installationRequiresElevation(installMethod: string, paths: string[]): boolean {
    if (installMethod === 'brew' || installMethod === 'apt' || installMethod === 'yum' || installMethod === 'dnf') {
      return true;
    }

    // Check if any path requires elevation
    return paths.some((path) => this.pathRequiresElevation(path));
  }

  /**
   * Get the appropriate sudo command based on platform
   */
  static getSudoCommand(): string {
    if (isMacOS() || isLinux()) {
      return 'sudo';
    }

    if (isWindows()) {
      return 'runas /user:Administrator';
    }

    return '';
  }

  /**
   * Execute command with elevated permissions
   */
  static executeWithElevation(command: string): string {
    try {
      if (isMacOS() || isLinux()) {
        // For sudo, we need to use -S to read password from stdin
        // This is more complex in practice, so we'll ask user to run with sudo
        return '';
      }

      if (isWindows()) {
        // Windows requires special handling with runas
        return execSync(`runas /noprofile /user:Administrator "${command}"`).toString();
      }

      return '';
    } catch (error) {
      Logger.error(`Elevated execution failed: ${(error as Error).message}`);
      return '';
    }
  }
}
