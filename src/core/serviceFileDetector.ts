import path from 'path';
import { isMacOS, isLinux, getHomeDir } from '../utils/platform';
import { pathExists, readFile, listDirectory } from '../utils/filesystem';
import { ArtifactPath } from '../types';

export interface ServiceFile {
  path: string;
  type: 'launchagent' | 'launchdaemon' | 'systemd' | 'service';
  appName: string;
  requiresManualCleanup: boolean;
  dependencies?: string[];
  manualCleanupInstructions: string;
}

export class ServiceFileDetector {
  /**
   * Find all service files related to an app
   */
  async findServiceFiles(appName: string): Promise<ServiceFile[]> {
    const serviceFiles: ServiceFile[] = [];

    if (isMacOS()) {
      serviceFiles.push(...(await this.findMacOSServiceFiles(appName)));
    }

    if (isLinux()) {
      serviceFiles.push(...(await this.findLinuxServiceFiles(appName)));
    }

    return serviceFiles;
  }

  /**
   * Find macOS LaunchAgent and LaunchDaemon files
   */
  private async findMacOSServiceFiles(appName: string): Promise<ServiceFile[]> {
    const home = getHomeDir();
    const serviceFiles: ServiceFile[] = [];

    // LaunchAgents
    const launchAgentsPath = path.join(home, 'Library', 'LaunchAgents');
    if (pathExists(launchAgentsPath)) {
      const agents = listDirectory(launchAgentsPath);
      for (const agent of agents) {
        if (agent.toLowerCase().includes(appName.toLowerCase())) {
          const fullPath = path.join(launchAgentsPath, agent);
          serviceFiles.push({
            path: fullPath,
            type: 'launchagent',
            appName,
            requiresManualCleanup: this.checkDependencies(fullPath, appName),
            manualCleanupInstructions: `To manually remove: rm "${fullPath}"`,
          });
        }
      }
    }

    // LaunchDaemons
    const launchDaemonsPath = path.join(home, 'Library', 'LaunchDaemons');
    if (pathExists(launchDaemonsPath)) {
      const daemons = listDirectory(launchDaemonsPath);
      for (const daemon of daemons) {
        if (daemon.toLowerCase().includes(appName.toLowerCase())) {
          const fullPath = path.join(launchDaemonsPath, daemon);
          serviceFiles.push({
            path: fullPath,
            type: 'launchdaemon',
            appName,
            requiresManualCleanup: true, // Daemons usually need manual removal
            manualCleanupInstructions: `To manually remove: sudo rm "${fullPath}" && sudo launchctl unload "${fullPath}"`,
          });
        }
      }
    }

    return serviceFiles;
  }

  /**
   * Find Linux systemd service files
   */
  private async findLinuxServiceFiles(appName: string): Promise<ServiceFile[]> {
    const home = getHomeDir();
    const serviceFiles: ServiceFile[] = [];

    // User systemd services
    const userSystemdPath = path.join(home, '.config', 'systemd', 'user');
    if (pathExists(userSystemdPath)) {
      const services = listDirectory(userSystemdPath);
      for (const service of services) {
        if (service.includes(appName)) {
          const fullPath = path.join(userSystemdPath, service);
          serviceFiles.push({
            path: fullPath,
            type: 'systemd',
            appName,
            requiresManualCleanup: this.checkDependencies(fullPath, appName),
            manualCleanupInstructions: `To manually remove: systemctl --user stop ${service} && rm "${fullPath}" && systemctl --user daemon-reload`,
          });
        }
      }
    }

    // System-wide services (requires elevation)
    const systemServicePath = '/etc/systemd/system';
    if (pathExists(systemServicePath)) {
      try {
        const services = listDirectory(systemServicePath);
        for (const service of services) {
          if (service.includes(appName)) {
            const fullPath = path.join(systemServicePath, service);
            serviceFiles.push({
              path: fullPath,
              type: 'service',
              appName,
              requiresManualCleanup: true,
              manualCleanupInstructions: `To manually remove: sudo systemctl stop ${service} && sudo rm "${fullPath}" && sudo systemctl daemon-reload`,
            });
          }
        }
      } catch {
        // Permission denied, skip system services
      }
    }

    return serviceFiles;
  }

  /**
   * Check if service has dependencies
   */
  private checkDependencies(filePath: string, appName: string): boolean {
    try {
      const content = readFile(filePath);
      if (!content) return false;

      // Check for KeepAlive, RunAtLoad, or other critical properties
      return (
        content.includes('KeepAlive') ||
        content.includes('RunAtLoad') ||
        content.includes('StartCalendarInterval')
      );
    } catch {
      return false;
    }
  }

  /**
   * Convert service files to artifact paths for UI display
   */
  convertToArtifacts(serviceFiles: ServiceFile[]): ArtifactPath[] {
    return serviceFiles.map((file) => ({
      path: file.path,
      type: 'service',
      size: 0,
      description: `${file.type} service file (requires manual cleanup)`,
    }));
  }

  /**
   * Get manual cleanup instructions
   */
  getManualCleanupInstructions(serviceFiles: ServiceFile[]): string {
    if (serviceFiles.length === 0) {
      return '';
    }

    let instructions = '\n⚠️  Manual Cleanup Required:\n\n';
    instructions += 'The following service files require manual cleanup:\n\n';

    serviceFiles.forEach((file, index) => {
      instructions += `${index + 1}. ${file.type.toUpperCase()}\n`;
      instructions += `   Path: ${file.path}\n`;
      instructions += `   Command: ${file.manualCleanupInstructions}\n\n`;
    });

    instructions += 'Run these commands in your terminal to complete the cleanup.\n';

    return instructions;
  }
}
