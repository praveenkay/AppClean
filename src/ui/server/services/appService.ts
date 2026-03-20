/**
 * AppService - Wraps Detector to provide app listing, searching, and analysis
 */

import { Detector } from '../../../core/detector.js';
import { InstalledApp } from '../../../types/index.js';

export interface SearchQuery {
  q?: string;
  method?: string;
  sort?: 'name' | 'size' | 'date';
  limit?: number;
  offset?: number;
}

export interface AppAnalysis {
  app: InstalledApp;
  artifacts: any[];
  totalSize: number;
  breakdown: {
    binaries: number;
    configs: number;
    caches: number;
    data: number;
    logs: number;
    other: number;
  };
}

export class AppService {
  private detector: Detector;

  constructor() {
    this.detector = new Detector();
  }

  /**
   * Get paginated list of all apps
   */
  async listApps(limit = 50, offset = 0): Promise<{
    apps: InstalledApp[];
    total: number;
    page: number;
    pageSize: number;
  }> {
    try {
      const allApps = await this.detector.searchApps({ sortBy: 'name' });
      const page = Math.floor(offset / limit) + 1;
      const paginatedApps = allApps.slice(offset, offset + limit);

      return {
        apps: paginatedApps,
        total: allApps.length,
        page,
        pageSize: limit,
      };
    } catch (error) {
      throw new Error(`Failed to list apps: ${(error as Error).message}`);
    }
  }

  /**
   * Search, filter, and sort apps
   */
  async searchApps(query: SearchQuery): Promise<{
    apps: InstalledApp[];
    count: number;
  }> {
    try {
      const searchOptions: any = {
        query: query.q || '',
        sortBy: query.sort || 'name',
      };

      if (query.method) {
        searchOptions.installMethod = query.method;
      }

      const apps = await this.detector.searchApps(searchOptions);
      const limit = query.limit || 50;
      const offset = query.offset || 0;
      const paginatedApps = apps.slice(offset, offset + limit);

      return {
        apps: paginatedApps,
        count: apps.length,
      };
    } catch (error) {
      throw new Error(`Failed to search apps: ${(error as Error).message}`);
    }
  }

  /**
   * Analyze an app and get all artifacts
   */
  async analyzeApp(appName: string): Promise<AppAnalysis> {
    try {
      // Find the app first
      const allApps = await this.detector.searchApps({ query: appName });
      const app = allApps.find((a) => a.name.toLowerCase() === appName.toLowerCase());

      if (!app) {
        throw new Error(`App "${appName}" not found`);
      }

      // Find all artifacts
      const artifacts = await this.detector.findArtifacts(app.name, app.installMethod);

      // Calculate breakdown
      const breakdown = this.calculateBreakdown(artifacts);
      const totalSize = artifacts.reduce((sum, a) => sum + (a.size || 0), 0);

      return {
        app,
        artifacts,
        totalSize,
        breakdown,
      };
    } catch (error) {
      throw new Error(`Failed to analyze app: ${(error as Error).message}`);
    }
  }

  /**
   * Get preview of what will be removed (dry-run)
   */
  async previewRemoval(appName: string): Promise<{
    appName: string;
    totalSize: number;
    filesCount: number;
    artifacts: any[];
  }> {
    try {
      const analysis = await this.analyzeApp(appName);

      return {
        appName: analysis.app.name,
        totalSize: analysis.totalSize,
        filesCount: analysis.artifacts.length,
        artifacts: analysis.artifacts,
      };
    } catch (error) {
      throw new Error(`Failed to preview removal: ${(error as Error).message}`);
    }
  }

  /**
   * Calculate artifact breakdown by category
   */
  private calculateBreakdown(artifacts: any[]): AppAnalysis['breakdown'] {
    const breakdown: AppAnalysis['breakdown'] = {
      binaries: 0,
      configs: 0,
      caches: 0,
      data: 0,
      logs: 0,
      other: 0,
    };

    artifacts.forEach((artifact) => {
      const path = artifact.path.toLowerCase();
      const size = artifact.size || 0;

      if (path.includes('bin') || path.includes('/usr/')) {
        breakdown.binaries += size;
      } else if (path.includes('config') || path.includes('.config')) {
        breakdown.configs += size;
      } else if (path.includes('cache') || path.includes('.cache')) {
        breakdown.caches += size;
      } else if (path.includes('log')) {
        breakdown.logs += size;
      } else if (path.includes('data') || path.includes('share')) {
        breakdown.data += size;
      } else {
        breakdown.other += size;
      }
    });

    return breakdown;
  }
}

// Export singleton
export const appService = new AppService();
