import fs from 'fs';
import path from 'path';
import { getHomeDir } from '../utils/platform.js';
import { ArtifactPath } from '../types';
import { formatDate, formatBytes } from '../utils/logger.js';

export interface RemovalRecord {
  timestamp: Date;
  appName: string;
  installMethod: string;
  userConsent: boolean;
  artifactsDeleted: DeletedArtifact[];
  verificationStatus: 'verified_removed' | 'still_exists' | 'partial_removal' | 'unknown';
  totalSpaceFreed: number;
  completionStatus: 'success' | 'partial' | 'failed';
  userNotes?: string;
}

export interface DeletedArtifact {
  path: string;
  type: string;
  size: number;
  status: 'deleted' | 'failed' | 'skipped';
  errorMessage?: string;
}

export class RemovalRecorder {
  private recordsDir: string;

  constructor() {
    const home = getHomeDir();
    this.recordsDir = path.join(home, '.appclean-records');

    // Create records directory if it doesn't exist
    if (!fs.existsSync(this.recordsDir)) {
      fs.mkdirSync(this.recordsDir, { recursive: true });
    }
  }

  /**
   * Create a new removal record
   */
  createRecord(appName: string, installMethod: string, userConsent: boolean): RemovalRecord {
    return {
      timestamp: new Date(),
      appName,
      installMethod,
      userConsent,
      artifactsDeleted: [],
      verificationStatus: 'unknown',
      totalSpaceFreed: 0,
      completionStatus: 'success',
    };
  }

  /**
   * Add deleted artifact to record
   */
  addDeletedArtifact(
    record: RemovalRecord,
    artifact: ArtifactPath,
    status: 'deleted' | 'failed' | 'skipped',
    error?: string
  ): void {
    record.artifactsDeleted.push({
      path: artifact.path,
      type: artifact.type,
      size: artifact.size,
      status,
      errorMessage: error,
    });

    if (status === 'deleted') {
      record.totalSpaceFreed += artifact.size;
    }
  }

  /**
   * Update verification status
   */
  updateVerificationStatus(
    record: RemovalRecord,
    status: 'verified_removed' | 'still_exists' | 'partial_removal' | 'unknown'
  ): void {
    record.verificationStatus = status;
  }

  /**
   * Update completion status
   */
  updateCompletionStatus(
    record: RemovalRecord,
    status: 'success' | 'partial' | 'failed'
  ): void {
    record.completionStatus = status;
  }

  /**
   * Save record to file
   */
  saveRecord(record: RemovalRecord): string {
    const filename = `${record.appName}-${record.timestamp.getTime()}.json`;
    const filepath = path.join(this.recordsDir, filename);

    fs.writeFileSync(filepath, JSON.stringify(record, null, 2), 'utf-8');

    return filepath;
  }

  /**
   * Get all removal records
   */
  getAllRecords(): RemovalRecord[] {
    const files = fs.readdirSync(this.recordsDir);
    const records: RemovalRecord[] = [];

    for (const file of files) {
      if (file.endsWith('.json')) {
        try {
          const content = fs.readFileSync(path.join(this.recordsDir, file), 'utf-8');
          const record = JSON.parse(content);
          record.timestamp = new Date(record.timestamp);
          records.push(record);
        } catch {
          // Skip invalid files
        }
      }
    }

    return records.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  /**
   * Get records for a specific app
   */
  getAppRecords(appName: string): RemovalRecord[] {
    return this.getAllRecords().filter((r) => r.appName === appName);
  }

  /**
   * Get records directory path
   */
  getRecordsDirectory(): string {
    return this.recordsDir;
  }
}
