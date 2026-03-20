/**
 * DashboardStore - Manages dashboard statistics and session activity
 */

import { Store } from '../utils/events.js';

export interface RemovalRecord {
  appName: string;
  timestamp: number;
  freedSpace: number;
  filesRemoved: number;
}

export interface DashboardStats {
  totalApps: number;
  totalSpaceUsed: number;
  sessionAppsRemoved: number;
  sessionSpaceFreed: number;
  diskUsagePercent: number;
  recentlyRemoved: RemovalRecord[];
}

export interface DashboardStoreState {
  stats: DashboardStats | null;
  isLoading: boolean;
  error: string | null;
  lastUpdated: number | null;
}

const INITIAL_STATE: DashboardStoreState = {
  stats: null,
  isLoading: false,
  error: null,
  lastUpdated: null,
};

export class DashboardStore extends Store<DashboardStoreState> {
  constructor() {
    super(INITIAL_STATE);
  }

  // Load dashboard stats
  async loadStats(): Promise<void> {
    this.setState({ isLoading: true, error: null });
    try {
      const response = await fetch('/api/dashboard/stats');
      if (!response.ok) throw new Error('Failed to load dashboard stats');

      const stats = await response.json();
      this.setState({
        stats,
        isLoading: false,
        lastUpdated: Date.now(),
      });
    } catch (error) {
      this.setState({
        error: (error as Error).message,
        isLoading: false,
      });
    }
  }

  // Refresh stats (with caching - only refresh if older than 5 seconds)
  async refreshStats(force = false): Promise<void> {
    const now = Date.now();
    const lastUpdated = this.state.lastUpdated ?? 0;
    const timeSinceLastUpdate = now - lastUpdated;

    if (!force && timeSinceLastUpdate < 5000) {
      return; // Use cached stats if less than 5 seconds old
    }

    await this.loadStats();
  }

  // Record a removal (for UI feedback)
  addRemovalRecord(record: RemovalRecord): void {
    const stats = this.state.stats;
    if (!stats) return;

    const updatedStats = {
      ...stats,
      sessionAppsRemoved: stats.sessionAppsRemoved + 1,
      sessionSpaceFreed: stats.sessionSpaceFreed + record.freedSpace,
      recentlyRemoved: [record, ...stats.recentlyRemoved].slice(0, 10), // Keep last 10
    };

    this.setState({ stats: updatedStats });
  }

  // Reset session stats
  resetSessionStats(): void {
    const stats = this.state.stats;
    if (!stats) return;

    const resetStats = {
      ...stats,
      sessionAppsRemoved: 0,
      sessionSpaceFreed: 0,
      recentlyRemoved: [],
    };

    this.setState({ stats: resetStats });
  }

  // Clear error
  clearError(): void {
    this.setState({ error: null });
  }
}

// Export singleton instance
export const dashboardStore = new DashboardStore();
