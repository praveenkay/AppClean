/**
 * Scheduled Cleanup Automation
 * Automates regular cleanup of applications and artifacts
 * v1.6.0 Feature
 */

import { getHomeDir } from '../utils/platform.js';
import path from 'path';
import fs from 'fs';
import { Logger } from '../utils/logger.js';

export type CleanupFrequency = 'daily' | 'weekly' | 'monthly' | 'custom';

export interface CleanupSchedule {
  id: string;
  appName: string;
  frequency: CleanupFrequency;
  enabled: boolean;
  lastRun?: Date;
  nextRun?: Date;
  customCron?: string;
  dryRun: boolean;
  createBackup: boolean;
}

export interface CleanupResult {
  scheduleId: string;
  appName: string;
  timestamp: Date;
  success: boolean;
  filesRemoved: number;
  spaceFreed: number;
  errors: string[];
}

export class ScheduledCleanup {
  private schedules: Map<string, CleanupSchedule> = new Map();
  private schedulesFile: string;

  constructor() {
    const home = getHomeDir();
    this.schedulesFile = path.join(home, '.appclean-schedules.json');
    this.loadSchedules();
  }

  /**
   * Create a new cleanup schedule
   */
  createSchedule(
    appName: string,
    frequency: CleanupFrequency,
    options?: Partial<CleanupSchedule>
  ): CleanupSchedule {
    const id = `schedule-${Date.now()}`;
    const schedule: CleanupSchedule = {
      id,
      appName,
      frequency,
      enabled: true,
      dryRun: options?.dryRun ?? false,
      createBackup: options?.createBackup ?? true,
      ...options,
    };

    this.schedules.set(id, schedule);
    this.saveSchedules();

    Logger.info(`Cleanup schedule created: ${id} for ${appName} (${frequency})`);
    return schedule;
  }

  /**
   * Delete a cleanup schedule
   */
  deleteSchedule(scheduleId: string): boolean {
    const deleted = this.schedules.delete(scheduleId);
    if (deleted) {
      this.saveSchedules();
      Logger.info(`Cleanup schedule deleted: ${scheduleId}`);
    }
    return deleted;
  }

  /**
   * Get all cleanup schedules
   */
  getSchedules(): CleanupSchedule[] {
    return Array.from(this.schedules.values());
  }

  /**
   * Get schedule by ID
   */
  getSchedule(scheduleId: string): CleanupSchedule | null {
    return this.schedules.get(scheduleId) || null;
  }

  /**
   * Update cleanup schedule
   */
  updateSchedule(scheduleId: string, updates: Partial<CleanupSchedule>): boolean {
    const schedule = this.schedules.get(scheduleId);
    if (schedule) {
      Object.assign(schedule, updates);
      this.saveSchedules();
      Logger.info(`Cleanup schedule updated: ${scheduleId}`);
      return true;
    }
    return false;
  }

  /**
   * Enable/disable schedule
   */
  setScheduleEnabled(scheduleId: string, enabled: boolean): void {
    const schedule = this.schedules.get(scheduleId);
    if (schedule) {
      schedule.enabled = enabled;
      this.saveSchedules();
      Logger.info(`Cleanup schedule ${scheduleId} ${enabled ? 'enabled' : 'disabled'}`);
    }
  }

  /**
   * Calculate next run time
   */
  calculateNextRun(schedule: CleanupSchedule): Date {
    const now = new Date();

    switch (schedule.frequency) {
      case 'daily':
        return new Date(now.getTime() + 24 * 60 * 60 * 1000);
      case 'weekly':
        return new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
      case 'monthly':
        return new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
      case 'custom':
        // Would parse cron expression
        return new Date(now.getTime() + 24 * 60 * 60 * 1000);
      default:
        return now;
    }
  }

  /**
   * Get schedules due for cleanup
   */
  getSchedulesDue(): CleanupSchedule[] {
    const now = new Date();
    return this.getSchedules().filter((schedule) => {
      if (!schedule.enabled) return false;
      if (!schedule.nextRun) return true;
      return schedule.nextRun <= now;
    });
  }

  /**
   * Record cleanup result
   */
  recordResult(result: CleanupResult): void {
    const home = getHomeDir();
    const resultsDir = path.join(home, '.appclean-cleanup-results');

    if (!fs.existsSync(resultsDir)) {
      fs.mkdirSync(resultsDir, { recursive: true });
    }

    const filename = `${result.scheduleId}-${result.timestamp.getTime()}.json`;
    const filepath = path.join(resultsDir, filename);

    fs.writeFileSync(filepath, JSON.stringify(result, null, 2), 'utf-8');
    Logger.debug(`Cleanup result recorded: ${filepath}`);
  }

  /**
   * Load schedules from file
   */
  private loadSchedules(): void {
    try {
      if (fs.existsSync(this.schedulesFile)) {
        const content = fs.readFileSync(this.schedulesFile, 'utf-8');
        const data = JSON.parse(content);

        for (const schedule of data) {
          this.schedules.set(schedule.id, schedule);
        }
      }
    } catch (error) {
      Logger.debug(`Failed to load schedules: ${(error as Error).message}`);
    }
  }

  /**
   * Save schedules to file
   */
  private saveSchedules(): void {
    try {
      const data = Array.from(this.schedules.values());
      fs.writeFileSync(this.schedulesFile, JSON.stringify(data, null, 2), 'utf-8');
    } catch (error) {
      Logger.error(`Failed to save schedules: ${(error as Error).message}`);
    }
  }
}
