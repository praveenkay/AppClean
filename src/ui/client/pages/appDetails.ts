/**
 * App Details Page - Show artifacts, analysis, and removal options
 */

import { apiClient } from '../api/client.js';
import { appStore } from '../state/appStore.js';
import { dashboardStore } from '../state/dashboardStore.js';
import { uiStore } from '../state/uiStore.js';
import { formatBytes, formatInstallMethod, getMethodBadgeColor } from '../utils/formatting.js';

export interface AppAnalysis {
  app: any;
  artifacts: any[];
  totalSize: number;
  breakdown: Record<string, number>;
}

/**
 * Render App Details Page
 */
export async function renderAppDetails(appName: string): Promise<void> {
  const container = document.getElementById('page-container');
  if (!container) return;

  // Show loading state
  container.innerHTML = `
    <div class="loading-state" style="text-align: center; padding: 60px 20px;">
      <div class="spinner-lg spinner"></div>
      <p class="text-center text-muted mt-4">Analyzing ${escapeHtml(appName)}...</p>
    </div>
  `;

  try {
    const analysis = await apiClient.get<AppAnalysis>(`/api/apps/${encodeURIComponent(appName)}/analysis`);
    renderAppDetailsContent(container, analysis, appName);
  } catch (error) {
    container.innerHTML = `
      <div class="alert alert-danger">
        <span>Failed to load app details: ${escapeHtml((error as Error).message)}</span>
      </div>
      <button class="btn btn-secondary mt-4" onclick="window.location.hash = '#/apps'">
        ← Back to Apps
      </button>
    `;
  }
}

/**
 * Render app details content
 */
function renderAppDetailsContent(
  container: HTMLElement,
  analysis: AppAnalysis,
  appName: string
): void {
  const { app, artifacts, totalSize, breakdown } = analysis;

  container.innerHTML = `
    <div class="app-details-page">
      <!-- Header -->
      <div class="flex-between items-start mb-8">
        <div class="flex-1">
          <button class="btn btn-ghost mb-4" onclick="window.location.hash = '#/apps'">
            ← Back to Apps
          </button>
          <h1 class="text-3xl font-bold">${escapeHtml(app.name)}</h1>
          <div class="flex gap-2 items-center mt-3">
            <span class="badge ${getMethodBadgeColor(app.installMethod)}">
              ${formatInstallMethod(app.installMethod)}
            </span>
            <span class="text-muted">v${escapeHtml(app.version || 'unknown')}</span>
          </div>
        </div>
      </div>

      <!-- Stats -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        ${renderStatCard('Total Size', formatBytes(totalSize))}
        ${renderStatCard('Files & Dirs', artifacts.length.toString())}
        ${renderStatCard('Install Method', formatInstallMethod(app.installMethod))}
      </div>

      <!-- Size Breakdown -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div class="card">
          <div class="card-header">
            <h2 class="text-lg font-bold">📊 Size Breakdown</h2>
          </div>
          <div class="card-body">
            ${renderBreakdownChart(breakdown)}
          </div>
        </div>

        <div class="card">
          <div class="card-header">
            <h2 class="text-lg font-bold">📈 By Category</h2>
          </div>
          <div class="card-body">
            ${renderBreakdownTable(breakdown)}
          </div>
        </div>
      </div>

      <!-- Artifacts Table -->
      <div class="card mb-8">
        <div class="card-header">
          <h2 class="text-lg font-bold">📂 Artifacts (${artifacts.length})</h2>
        </div>
        <div class="card-body overflow-x-auto">
          ${renderArtifactsTable(artifacts)}
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="flex gap-3">
        <button class="btn btn-primary btn-lg flex-1" id="preview-btn">
          👁️ Preview Removal
        </button>
        <button class="btn btn-danger btn-lg flex-1" id="remove-btn">
          🗑️ Remove App
        </button>
        <button class="btn btn-secondary btn-lg" onclick="window.location.hash = '#/apps'">
          Cancel
        </button>
      </div>

      <!-- Preview Section (hidden) -->
      <div id="preview-section" style="display: none; margin-top: 30px;">
        <div class="alert alert-warning mb-4">
          <span>This is a preview. No files will be deleted.</span>
        </div>
        <div class="card">
          <div class="card-header">
            <h3 class="text-lg font-bold">Files to Remove</h3>
          </div>
          <div class="card-body overflow-x-auto" id="preview-content">
          </div>
        </div>
      </div>
    </div>
  `;

  // Setup event listeners
  setupAppDetailsListeners(appName, totalSize, artifacts);

  // Scroll to top
  window.scrollTo(0, 0);
}

/**
 * Render stat card
 */
function renderStatCard(label: string, value: string): string {
  return `
    <div class="card">
      <div class="card-body text-center">
        <p class="text-muted text-sm mb-1">${escapeHtml(label)}</p>
        <p class="text-2xl font-bold">${escapeHtml(value)}</p>
      </div>
    </div>
  `;
}

/**
 * Render size breakdown chart (simplified pie)
 */
function renderBreakdownChart(breakdown: Record<string, number>): string {
  const total = Object.values(breakdown).reduce((a, b) => a + b, 0);
  if (total === 0) return '<p class="text-muted">No size data available</p>';

  const colors: Record<string, string> = {
    binaries: '#3b82f6',
    configs: '#10b981',
    caches: '#f59e0b',
    data: '#8b5cf6',
    logs: '#ec4899',
    other: '#6b7280',
  };

  let percent = 0;
  const stops = Object.entries(breakdown)
    .filter(([_, size]) => size > 0)
    .map(([category, size]) => {
      const categoryPercent = (size / total) * 100;
      const start = percent;
      percent += categoryPercent;
      return `${colors[category] || '#666'} ${start}% ${percent}%`;
    })
    .join(',');

  return `
    <div style="
      width: 200px;
      height: 200px;
      border-radius: 50%;
      background: conic-gradient(${stops});
      margin: 0 auto;
    "></div>
  `;
}

/**
 * Render breakdown table
 */
function renderBreakdownTable(breakdown: Record<string, number>): string {
  const categories = [
    { key: 'binaries', label: 'Binaries' },
    { key: 'configs', label: 'Configs' },
    { key: 'caches', label: 'Caches' },
    { key: 'data', label: 'Data' },
    { key: 'logs', label: 'Logs' },
    { key: 'other', label: 'Other' },
  ];

  return `
    <table style="width: 100%; font-size: 14px;">
      <tbody>
        ${categories
          .map(
            ({ key, label }) => `
          <tr style="border-bottom: 1px solid var(--border-color); padding: 8px 0;">
            <td style="padding: 8px 0;">${label}</td>
            <td style="text-align: right; font-weight: 600;">${formatBytes(breakdown[key] || 0)}</td>
          </tr>
        `
          )
          .join('')}
      </tbody>
    </table>
  `;
}

/**
 * Render artifacts table
 */
function renderArtifactsTable(artifacts: any[]): string {
  if (artifacts.length === 0) {
    return '<p class="text-muted">No artifacts found</p>';
  }

  return `
    <table style="width: 100%; font-size: 13px;">
      <thead style="border-bottom: 2px solid var(--border-color);">
        <tr>
          <th style="text-align: left; padding: 8px; font-weight: 600;">Path</th>
          <th style="text-align: right; padding: 8px; font-weight: 600; width: 100px;">Size</th>
        </tr>
      </thead>
      <tbody>
        ${artifacts
          .slice(0, 20)
          .map(
            (artifact) => `
          <tr style="border-bottom: 1px solid var(--border-color); padding: 8px 0;">
            <td style="padding: 8px; word-break: break-all;">
              <code style="font-size: 12px; color: var(--text-muted);">
                ${escapeHtml(artifact.path)}
              </code>
            </td>
            <td style="text-align: right; padding: 8px; white-space: nowrap;">
              ${formatBytes(artifact.size || 0)}
            </td>
          </tr>
        `
          )
          .join('')}
      </tbody>
    </table>
    ${artifacts.length > 20 ? `<p class="text-muted text-sm mt-4">... and ${artifacts.length - 20} more files</p>` : ''}
  `;
}

/**
 * Setup event listeners
 */
function setupAppDetailsListeners(appName: string, totalSize: number, artifacts: any[]): void {
  const previewBtn = document.getElementById('preview-btn');
  const removeBtn = document.getElementById('remove-btn');
  const previewSection = document.getElementById('preview-section');
  const previewContent = document.getElementById('preview-content');

  if (previewBtn) {
    previewBtn.addEventListener('click', async () => {
      if (previewSection?.style.display === 'none') {
        previewSection.style.display = 'block';
        previewBtn.textContent = '👁️ Hide Preview';

        // Render preview
        if (previewContent) {
          previewContent.innerHTML = `
            <p class="text-sm text-muted mb-4">
              This will remove <strong>${artifacts.length} files and directories</strong>,
              freeing <strong>${formatBytes(totalSize)}</strong> of disk space.
            </p>
            ${renderArtifactsTable(artifacts)}
          `;
        }
      } else {
        previewSection!.style.display = 'none';
        previewBtn.textContent = '👁️ Preview Removal';
      }
    });
  }

  if (removeBtn) {
    removeBtn.addEventListener('click', async () => {
      const confirmed = confirm(
        `Are you sure you want to remove "${appName}"?\n\nThis will delete ${artifacts.length} files and free ${formatBytes(totalSize)}.`
      );

      if (!confirmed) return;

      uiStore.setProcessing(true);
      (removeBtn as HTMLButtonElement).disabled = true;

      try {
        const result = await apiClient.post(`/api/apps/${encodeURIComponent(appName)}/remove`, {
          dryRun: false,
          createBackup: true,
        });

        uiStore.showSuccess(`Successfully removed ${appName}!`);
        dashboardStore.addRemovalRecord({
          appName,
          timestamp: Date.now(),
          freedSpace: result.freedSpace,
          filesRemoved: result.removedFiles,
        });

        // Redirect to dashboard after 2 seconds
        setTimeout(() => {
          window.location.hash = '#/';
        }, 2000);
      } catch (error) {
        uiStore.showError(`Failed to remove app: ${(error as Error).message}`);
        (removeBtn as HTMLButtonElement).disabled = false;
      } finally {
        uiStore.setProcessing(false);
      }
    });
  }
}

/**
 * Escape HTML
 */
function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };
  return String(text).replace(/[&<>"']/g, (m) => map[m]);
}
