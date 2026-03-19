/**
 * Performance Optimizer
 * Optimizes scanning performance for large systems
 * v1.8.0 Feature
 */

import { Logger } from '../utils/logger';

export interface ScanMetrics {
  startTime: Date;
  endTime?: Date;
  filesScanned: number;
  directoriesScanned: number;
  totalSize: number;
  duration?: number; // milliseconds
  averageFileSize: number;
  scanSpeed: number; // files per second
}

export interface OptimizationSettings {
  parallelScanThreads: number;
  cacheResults: boolean;
  skipSymlinks: boolean;
  maxDirectoryDepth: number;
  excludePatterns: string[];
  indexSystemDirectories: boolean;
}

export class PerformanceOptimizer {
  private metrics: Map<string, ScanMetrics> = new Map();
  private cache: Map<string, any> = new Map();
  private settings: OptimizationSettings;

  constructor(settings?: Partial<OptimizationSettings>) {
    this.settings = {
      parallelScanThreads: 4,
      cacheResults: true,
      skipSymlinks: true,
      maxDirectoryDepth: 10,
      excludePatterns: ['.git', 'node_modules', '.cache'],
      indexSystemDirectories: true,
      ...settings,
    };
  }

  /**
   * Start performance metrics tracking
   */
  startMetrics(scanId: string): ScanMetrics {
    const metrics: ScanMetrics = {
      startTime: new Date(),
      filesScanned: 0,
      directoriesScanned: 0,
      totalSize: 0,
      averageFileSize: 0,
      scanSpeed: 0,
    };

    this.metrics.set(scanId, metrics);
    Logger.debug(`Performance metrics started: ${scanId}`);
    return metrics;
  }

  /**
   * End performance metrics tracking
   */
  endMetrics(scanId: string): ScanMetrics | null {
    const metrics = this.metrics.get(scanId);
    if (metrics) {
      metrics.endTime = new Date();
      metrics.duration = metrics.endTime.getTime() - metrics.startTime.getTime();
      metrics.averageFileSize = metrics.filesScanned > 0 ? metrics.totalSize / metrics.filesScanned : 0;
      metrics.scanSpeed = metrics.duration > 0 ? (metrics.filesScanned / metrics.duration) * 1000 : 0;

      Logger.info(`
Performance Report: ${scanId}
  Duration: ${(metrics.duration / 1000).toFixed(2)}s
  Files scanned: ${metrics.filesScanned}
  Directories scanned: ${metrics.directoriesScanned}
  Total size: ${this.formatBytes(metrics.totalSize)}
  Scan speed: ${metrics.scanSpeed.toFixed(2)} files/sec
      `);

      return metrics;
    }
    return null;
  }

  /**
   * Get metrics for a scan
   */
  getMetrics(scanId: string): ScanMetrics | null {
    return this.metrics.get(scanId) || null;
  }

  /**
   * Update metrics during scan
   */
  updateMetrics(scanId: string, data: Partial<ScanMetrics>): void {
    const metrics = this.metrics.get(scanId);
    if (metrics) {
      Object.assign(metrics, data);
    }
  }

  /**
   * Cache scan result
   */
  cacheResult(key: string, value: any, ttl?: number): void {
    if (this.settings.cacheResults) {
      this.cache.set(key, {
        value,
        timestamp: Date.now(),
        ttl: ttl || 3600000, // 1 hour default
      });
    }
  }

  /**
   * Get cached result
   */
  getCachedResult(key: string): any | null {
    const cached = this.cache.get(key);
    if (cached) {
      const age = Date.now() - cached.timestamp;
      if (age < cached.ttl) {
        return cached.value;
      }
      // Expired, delete it
      this.cache.delete(key);
    }
    return null;
  }

  /**
   * Clear cache
   */
  clearCache(): void {
    this.cache.clear();
    Logger.debug('Performance cache cleared');
  }

  /**
   * Update optimization settings
   */
  updateSettings(settings: Partial<OptimizationSettings>): void {
    Object.assign(this.settings, settings);
    Logger.debug('Performance optimization settings updated');
  }

  /**
   * Get optimization settings
   */
  getSettings(): OptimizationSettings {
    return { ...this.settings };
  }

  /**
   * Check if path should be scanned
   */
  shouldScanPath(path: string, depth: number): boolean {
    // Check max depth
    if (depth > this.settings.maxDirectoryDepth) {
      return false;
    }

    // Check exclusions
    for (const pattern of this.settings.excludePatterns) {
      if (path.includes(pattern)) {
        return false;
      }
    }

    return true;
  }

  /**
   * Get optimization recommendations
   */
  getRecommendations(metrics: ScanMetrics): string[] {
    const recommendations: string[] = [];

    if (!metrics.duration || metrics.duration > 30000) {
      recommendations.push('Consider increasing parallel scan threads for faster scans');
    }

    if (metrics.averageFileSize > 10000000) {
      recommendations.push('Large average file size detected, consider excluding large files');
    }

    if (metrics.filesScanned > 100000) {
      recommendations.push('Large scan detected, consider using caching to speed up subsequent scans');
    }

    if (metrics.directoriesScanned > 1000 && this.settings.maxDirectoryDepth > 8) {
      recommendations.push('Consider reducing max directory depth to improve performance');
    }

    return recommendations;
  }

  private formatBytes(bytes: number): string {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  }
}
