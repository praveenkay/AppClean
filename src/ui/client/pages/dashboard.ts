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
    const error = state.error;

    if (error) {
      container.innerHTML = `
        <div class="alert alert-danger" style="margin: 20px;">
          <h3 style="margin-top: 0;">⚠️ Error Loading Dashboard</h3>
          <p>${escapeHtml(error)}</p>
          <button class="btn btn-primary btn-sm" onclick="window.location.reload()">Retry</button>
        </div>
      `;
      return;
    }

    if (!stats) {
      container.innerHTML = `
        <div class="alert alert-warning" style="margin: 20px;">
          <h3 style="margin-top: 0;">⏳ Initializing</h3>
          <p>Dashboard is loading. Please wait...</p>
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
  }).catch((error) => {
    console.error('Dashboard error:', error);
    container.innerHTML = `
      <div class="alert alert-danger" style="margin: 20px;">
        <h3 style="margin-top: 0;">❌ Failed to Load Dashboard</h3>
        <p>An unexpected error occurred. Please check the console for details.</p>
        <button class="btn btn-primary btn-sm" onclick="window.location.reload()">Reload Page</button>
      </div>
    `;
  });
}

/**
 * Render dashboard content
 */
function renderDashboardContent(container: HTMLElement, stats: DashboardStats): void {
  container.innerHTML = `
    <div class="dashboard-page">
      <!-- Header -->
      <div style="margin-bottom: 2rem;">
        <h1 class="page-title">📊 Dashboard</h1>
        <p class="page-subtitle">System overview and app management</p>
      </div>

      <!-- Stats Grid -->
      <div class="grid" style="margin-bottom: 2rem;">
        ${renderStatCard('📦 Installed Apps', stats.totalApps.toString(), 'Total applications detected')}
        ${renderStatCard('💾 Total Space Used', formatBytes(stats.totalSpaceUsed), 'Size of all app files')}
        ${renderStatCard('🗑️ Removed (Session)', stats.sessionAppsRemoved.toString(), 'Apps removed this session')}
        ${renderStatCard('📉 Space Freed', formatBytes(stats.sessionSpaceFreed), 'Total space recovered')}
      </div>

      <!-- System Health -->
      <div class="card" style="margin-bottom: 2rem;">
        <div class="card-header">
          <h2 style="font-size: 1.25rem; font-weight: 700; margin: 0;">💻 System Health</h2>
        </div>
        <div class="card-body">
          <div style="margin-bottom: 1rem;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
              <span style="font-size: 0.875rem; font-weight: 500;">Disk Usage</span>
              <span style="font-size: 0.875rem; font-weight: 700;">${formatPercent(stats.diskUsagePercent)}</span>
            </div>
            <div style="height: 8px; background: #e5e7eb; border-radius: 4px; overflow: hidden;">
              <div style="
                height: 100%;
                width: ${stats.diskUsagePercent}%;
                background: ${getDiskUsageColor(stats.diskUsagePercent)};
                transition: width 0.3s ease;
              "></div>
            </div>
          </div>
          <p style="font-size: 0.875rem; color: var(--text-muted); margin: 0;">
            ${stats.diskUsagePercent < 80
              ? '✅ Disk usage is healthy'
              : stats.diskUsagePercent < 90
              ? '⚠️ Disk usage is getting high'
              : '🔴 Disk usage is critical'}
          </p>
        </div>
      </div>

      <!-- Recent Activity -->
      <div class="card">
        <div class="card-header">
          <h2 style="font-size: 1.25rem; font-weight: 700; margin: 0;">📜 Recent Activity</h2>
        </div>
        <div class="card-body">
          ${
            stats.recentlyRemoved.length > 0
              ? `
            <div style="display: flex; flex-direction: column; gap: 1rem;">
              ${stats.recentlyRemoved
                .slice(0, 10)
                .map(
                  (removal) => `
                <div style="padding: 0.75rem 0; border-bottom: 1px solid var(--border-color); display: flex; justify-content: space-between; align-items: flex-start;">
                  <div>
                    <p style="font-size: 0.875rem; font-weight: 500; margin: 0;">${escapeHtml(removal.appName)}</p>
                    <p style="font-size: 0.75rem; color: var(--text-muted); margin: 0.25rem 0 0 0;">Removed ${formatRelativeTime(removal.timestamp)}</p>
                  </div>
                  <div style="text-align: right;">
                    <p style="font-size: 0.875rem; font-weight: 700; color: var(--color-success); margin: 0;">${formatBytes(removal.freedSpace)}</p>
                    <p style="font-size: 0.75rem; color: var(--text-muted); margin: 0.25rem 0 0 0;">${removal.filesRemoved} files</p>
                  </div>
                </div>
              `
                )
                .join('')}
            </div>
          `
              : `
            <p style="color: var(--text-muted); text-align: center; padding: 2rem 0; margin: 0;">
              No apps removed yet. Start by searching for apps to remove.
            </p>
          `
          }
        </div>
      </div>

      <!-- Quick Actions -->
      <div style="margin-top: 2rem; display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem;">
        <button class="btn btn-primary btn-lg btn-block" onclick="window.location.hash = '#/apps'" style="width: 100%; justify-content: center;">
          <span>🔍 Find & Remove Apps</span>
        </button>
        <button class="btn btn-secondary btn-lg btn-block" onclick="window.location.hash = '#/settings'" style="width: 100%; justify-content: center;">
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
    <div class="card" style="flex: 1;">
      <div class="card-body">
        <p style="color: var(--text-muted); font-size: 0.875rem; margin-bottom: 0.5rem;">${escapeHtml(label)}</p>
        <p style="font-size: 1.5rem; font-weight: 700; color: var(--color-primary); margin-bottom: 0.25rem;">${escapeHtml(value)}</p>
        <p style="font-size: 0.75rem; color: var(--text-muted);">${escapeHtml(description)}</p>
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
