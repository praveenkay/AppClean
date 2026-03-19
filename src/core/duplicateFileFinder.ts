/**
 * Duplicate File Finder
 * Scans system for duplicate files by hash and size
 * v1.3.0 Feature
 */

import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { Logger } from '../utils/logger';

export interface DuplicateFile {
  hash: string;
  size: number;
  paths: string[];
  potentialSavings: number;
}

export class DuplicateFileFinder {
  /**
   * Find duplicate files in specified directories
   */
  async findDuplicates(directories: string[]): Promise<DuplicateFile[]> {
    Logger.info('Scanning for duplicate files...');

    const fileHashes = new Map<string, { size: number; paths: string[] }>();

    for (const directory of directories) {
      await this.scanDirectory(directory, fileHashes);
    }

    // Filter duplicates
    const duplicates: DuplicateFile[] = [];
    for (const [hash, data] of fileHashes.entries()) {
      if (data.paths.length > 1) {
        duplicates.push({
          hash,
          size: data.size,
          paths: data.paths,
          potentialSavings: data.size * (data.paths.length - 1),
        });
      }
    }

    return duplicates.sort((a, b) => b.potentialSavings - a.potentialSavings);
  }

  /**
   * Calculate file hash
   */
  private async calculateHash(filePath: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const hash = crypto.createHash('sha256');
      const stream = fs.createReadStream(filePath);

      stream.on('data', (data) => hash.update(data));
      stream.on('end', () => resolve(hash.digest('hex')));
      stream.on('error', reject);
    });
  }

  /**
   * Recursively scan directory
   */
  private async scanDirectory(
    directory: string,
    fileHashes: Map<string, { size: number; paths: string[] }>
  ): Promise<void> {
    try {
      const entries = fs.readdirSync(directory);

      for (const entry of entries) {
        const fullPath = path.join(directory, entry);
        const stats = fs.statSync(fullPath);

        if (stats.isDirectory()) {
          await this.scanDirectory(fullPath, fileHashes);
        } else if (stats.isFile()) {
          const hash = await this.calculateHash(fullPath);

          if (!fileHashes.has(hash)) {
            fileHashes.set(hash, { size: stats.size, paths: [] });
          }

          fileHashes.get(hash)!.paths.push(fullPath);
        }
      }
    } catch (error) {
      Logger.debug(`Error scanning directory ${directory}: ${(error as Error).message}`);
    }
  }

  /**
   * Get duplicate summary
   */
  getSummary(duplicates: DuplicateFile[]): string {
    const totalSize = duplicates.reduce((sum, d) => sum + d.potentialSavings, 0);
    const totalFiles = duplicates.reduce((sum, d) => sum + (d.paths.length - 1), 0);

    return `
Found ${duplicates.length} duplicate groups with ${totalFiles} duplicate files
Potential space savings: ${this.formatBytes(totalSize)}
    `;
  }

  private formatBytes(bytes: number): string {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  }
}
