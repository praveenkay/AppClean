/**
 * Dashboard Page - Overview of system health and app statistics
 */

import { dashboardStore, DashboardStats } from '../state/dashboardStore.js';
import { uiStore } from '../state/uiStore.js';
import { formatBytes, formatPercent, formatRelativeTime } from '../utils/formatting.js';

/**
 * Render Dashboard Page
 */
export function renderDashboard(): void {
  const container = document.getElementById('page-container');
  if (!container) return;

  // Show loading state
  container.innerHTML = `
    <div class="loading-state" style="text-align: center; padding: 60px 20px;">
      <div class="spinner-lg spinner"></div>
      <p class="text-center text-muted mt-4">Loading dashboard...</p>
    </div>
  `;

  // Load stats
  dashboardStore.refreshStats(true).then(() => {
    const state = dashboardStore.getState();
    const stats = state.stats;

    if (!stats) {
      container.innerHTML = `
        <div class="alert alert-danger">
          <span>Failed to load dashboard stats</span>
        </div>
      `;
      return;
    }

    renderDashboardContent(container, stats);

    // Subscribe to updates
    dashboardStore.subscribe((newState) => {
      if (newState.stats) {
        renderDashboardContent(container, newState.stats);
      }
    });
  });
}

/**
 * Render dashboard content
 */
function renderDashboardContent(container: HTMLElement, stats: DashboardStats): void {
  container.innerHTML = `
    <div class="dashboard-page">
      <!-- Header -->
      <div class="page-header mb-8">
        <h1 class="text-3xl font-bold">📊 Dashboard</h1>
        <p class="text-secondary mt-2">System overview and app management</p>
      </div>

      <!-- Stats Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        ${renderStatCard('📦 Installed Apps', stats.totalApps.toString(), 'Total applications detected')}
        ${renderStatCard('💾 Total Space Used', formatBytes(stats.totalSpaceUsed), 'Size of all app files')}
        ${renderStatCard('🗑️ Removed (Session)', stats.sessionAppsRemoved.toString(), 'Apps removed this session')}
        ${renderStatCard('📉 Space Freed', formatBytes(stats.sessionSpaceFreed), 'Total space recovered')}
      </div>

      <!-- System Health -->
      <div class="card mb-8">
        <div class="card-header">
          <h2 class="text-xl font-bold">💻 System Health</h2>
        </div>
        <div class="card-body">
          <div class="health-gauge mb-4">
            <div class="flex-between mb-2">
              <span class="text-sm font-medium">Disk Usage</span>
              <span class="text-sm font-bold">${formatPercent(stats.diskUsagePercent)}</span>
            </div>
            <div class="progress-bar" style="height: 8px; background: #e5e7eb; border-radius: 4px; overflow: hidden;">
              <div style="
                height: 100%;
                width: ${stats.diskUsagePercent}%;
                background: ${getDiskUsageColor(stats.diskUsagePercent)};
                transition: width 0.3s ease;
              "></div>
            </div>
          </div>
          <p class="text-sm text-muted">
            ${stats.diskUsagePercent < 80
              ? '✓ Disk usage is healthy'
              : stats.diskUsagePercent < 90
              ? '⚠️ Disk usage is getting high'
              : '❌ Disk usage is critical'}
          </p>
        </div>
      </div>

      <!-- Recent Activity -->
      <div class="card">
        <div class="card-header">
          <h2 class="text-xl font-bold">📜 Recent Activity</h2>
        </div>
        <div class="card-body">
          ${
            stats.recentlyRemoved.length > 0
              ? `
            <div class="activity-list">
              ${stats.recentlyRemoved
                .slice(0, 10)
                .map(
                  (removal) => `
                <div class="activity-item flex-between p-3 border-b border-color last:border-0" style="padding: 12px 0;">
                  <div class="activity-info">
                    <p class="text-sm font-medium">${escapeHtml(removal.appName)}</p>
                    <p class="text-xs text-muted">Removed ${formatRelativeTime(removal.timestamp)}</p>
                  </div>
                  <div class="activity-stats text-right">
                    <p class="text-sm font-bold text-success">${formatBytes(removal.freedSpace)}</p>
                    <p class="text-xs text-muted">${removal.filesRemoved} files</p>
                  </div>
                </div>
              `
                )
                .join('')}
            </div>
          `
              : `
            <p class="text-muted text-center py-8">
              No apps removed yet. Start by searching for apps to remove.
            </p>
          `
          }
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
        <button class="btn btn-primary btn-lg w-full" onclick="window.location.hash = '#/apps'">
          <span>🔍 Find & Remove Apps</span>
        </button>
        <button class="btn btn-secondary btn-lg w-full" onclick="window.location.hash = '#/settings'">
          <span>⚙️ Settings</span>
        </button>
      </div>
    </div>
  `;

  // Scroll to top
  window.scrollTo(0, 0);
}

/**
 * Render stat card
 */
function renderStatCard(label: string, value: string, description: string): string {
  return `
    <div class="card">
      <div class="card-body">
        <p class="text-muted text-sm mb-2">${escapeHtml(label)}</p>
        <p class="text-2xl font-bold text-primary mb-1">${escapeHtml(value)}</p>
        <p class="text-xs text-muted">${escapeHtml(description)}</p>
      </div>
    </div>
  `;
}

/**
 * Get disk usage color
 */
function getDiskUsageColor(percent: number): string {
  if (percent < 50) return '#10b981'; // Green
  if (percent < 80) return '#f59e0b'; // Amber
  return '#ef4444'; // Red
}

/**
 * Escape HTML to prevent XSS
 */
function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}
