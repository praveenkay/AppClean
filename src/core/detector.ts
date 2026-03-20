import { NpmManager } from '../managers/npmManager.js';
import { BrewManager } from '../managers/brewManager.js';
import { LinuxManager } from '../managers/linuxManager.js';
import { CustomManager } from '../managers/customManager.js';
import { isMacOS, isLinux } from '../utils/platform.js';
import { InstalledApp, ArtifactPath, SearchOptions } from '../types';
import { getFileSize } from '../utils/filesystem.js';

export class Detector {
  private npmManager: NpmManager;
  private brewManager?: BrewManager;
  private linuxManager?: LinuxManager;
  private customManager: CustomManager;

  constructor() {
    this.npmManager = new NpmManager();
    this.customManager = new CustomManager();

    if (isMacOS()) {
      this.brewManager = new BrewManager();
    }

    if (isLinux()) {
      this.linuxManager = new LinuxManager();
    }
  }

  async detectAllApps(): Promise<InstalledApp[]> {
    const allApps: InstalledApp[] = [];

    // npm packages
    const npmApps = await this.npmManager.getInstalledPackages();
    allApps.push(...npmApps);

    // Homebrew packages (macOS only)
    if (this.brewManager) {
      const brewApps = await this.brewManager.getInstalledPackages();
      allApps.push(...brewApps);
    }

    // Linux packages
    if (this.linuxManager) {
      const linuxApps = await this.linuxManager.getInstalledPackages();
      allApps.push(...linuxApps);
    }

    // Custom binaries
    const customApps = await this.customManager.findCustomInstalledApps();
    allApps.push(...customApps);

    // Remove duplicates by name
    const seen = new Set<string>();
    return allApps.filter((app) => {
      if (seen.has(app.name)) return false;
      seen.add(app.name);
      return true;
    });
  }

  async searchApps(options: SearchOptions): Promise<InstalledApp[]> {
    const allApps = await this.detectAllApps();

    let filtered = allApps;

    // Filter by query
    if (options.query) {
      const query = options.query.toLowerCase();
      filtered = filtered.filter((app) =>
        app.name.toLowerCase().includes(query)
      );
    }

    // Filter by install method
    if (options.installMethod) {
      filtered = filtered.filter((app) => app.installMethod === options.installMethod);
    }

    // Sort
    switch (options.sortBy) {
      case 'name':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'date':
        filtered.sort(
          (a, b) =>
            (b.installedDate?.getTime() || 0) - (a.installedDate?.getTime() || 0)
        );
        break;
      case 'size':
        filtered.sort((a, b) => (b.size || 0) - (a.size || 0));
        break;
    }

    return filtered;
  }

  async findArtifacts(appName: string, installMethod: string): Promise<ArtifactPath[]> {
    const artifacts: ArtifactPath[] = [];

    switch (installMethod) {
      case 'npm':
        artifacts.push(...(await this.npmManager.findArtifacts(appName)));
        break;
      case 'brew':
        if (this.brewManager) {
          artifacts.push(...(await this.brewManager.findArtifacts(appName)));
        }
        break;
      case 'apt':
      case 'yum':
      case 'dnf':
        if (this.linuxManager) {
          artifacts.push(...(await this.linuxManager.findArtifacts(appName)));
        }
        break;
      case 'custom':
        artifacts.push(...(await this.customManager.findArtifacts(appName)));
        break;
    }

    // Calculate sizes
    for (const artifact of artifacts) {
      artifact.size = getFileSize(artifact.path);
    }

    return artifacts;
  }

  async estimateSpaceFreed(appName: string, installMethod: string): Promise<number> {
    const artifacts = await this.findArtifacts(appName, installMethod);
    return artifacts.reduce((total, artifact) => total + artifact.size, 0);
  }
}
