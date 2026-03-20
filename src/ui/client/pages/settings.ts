/**
 * Settings Page - Version management, theme, and uninstall
 */

import { apiClient } from '../api/client.js';
import { uiStore } from '../state/uiStore.js';

export interface VersionInfo {
  current: string;
  latest: string;
  isUpdateAvailable: boolean;
}

/**
 * Render Settings Page
 */
export function renderSettings(): void {
  const container = document.getElementById('page-container');
  if (!container) return;

  // Show loading state
  container.innerHTML = `
    <div class="loading-state" style="text-align: center; padding: 60px 20px;">
      <div class="spinner-lg spinner"></div>
      <p class="text-center text-muted mt-4">Loading settings...</p>
    </div>
  `;

  // Load version info
  loadVersionInfo().then((versionInfo) => {
    renderSettingsContent(container, versionInfo);
  });
}

/**
 * Load version information
 */
async function loadVersionInfo(): Promise<VersionInfo> {
  try {
    return await apiClient.get<VersionInfo>('/api/version');
  } catch (error) {
    return {
      current: 'unknown',
      latest: 'unknown',
      isUpdateAvailable: false,
    };
  }
}

/**
 * Render settings content
 */
function renderSettingsContent(container: HTMLElement, versionInfo: VersionInfo): void {
  const currentTheme = uiStore.getState().theme;

  container.innerHTML = `
    <div class="settings-page">
      <!-- Header -->
      <div class="page-header mb-8">
        <h1 class="text-3xl font-bold">⚙️ Settings</h1>
        <p class="text-secondary mt-2">Configure AppClean</p>
      </div>

      <!-- Version & Updates Section -->
      <div class="card mb-6">
        <div class="card-header">
          <h2 class="text-xl font-bold">📦 Version & Updates</h2>
        </div>
        <div class="card-body">
          <div class="version-info p-4 bg-secondary rounded mb-4">
            <div class="flex-between mb-3">
              <span class="text-sm font-medium">Current Version</span>
              <span class="text-lg font-bold text-primary">v${escapeHtml(versionInfo.current)}</span>
            </div>
            <div class="flex-between">
              <span class="text-sm font-medium">Latest Version</span>
              <span class="text-lg font-bold ${versionInfo.isUpdateAvailable ? 'text-warning' : 'text-success'}">
                v${escapeHtml(versionInfo.latest)}
              </span>
            </div>
          </div>

          ${
            versionInfo.isUpdateAvailable
              ? `
            <div class="alert alert-warning mb-4">
              <span>A new version of AppClean is available!</span>
            </div>
            <div class="flex gap-2">
              <button class="btn btn-primary flex-1" id="upgrade-btn">
                🚀 Upgrade Now
              </button>
              <button class="btn btn-secondary flex-1" id="check-update-btn">
                🔄 Check Again
              </button>
            </div>
          `
              : `
            <div class="alert alert-success mb-4">
              <span>✓ You're running the latest version!</span>
            </div>
            <button class="btn btn-secondary w-full" id="check-update-btn">
              🔄 Check for Updates
            </button>
          `
          }
        </div>
      </div>

      <!-- Theme Section -->
      <div class="card mb-6">
        <div class="card-header">
          <h2 class="text-xl font-bold">🎨 Appearance</h2>
        </div>
        <div class="card-body">
          <div class="flex-between items-center p-3 border border-color rounded mb-4">
            <div>
              <p class="font-medium">Dark Mode</p>
              <p class="text-sm text-muted">Switch between light and dark themes</p>
            </div>
            <button
              class="btn btn-sm ${currentTheme === 'dark' ? 'btn-primary' : 'btn-secondary'}"
              id="theme-toggle-btn"
            >
              ${currentTheme === 'dark' ? '🌙 Dark' : '☀️ Light'}
            </button>
          </div>
        </div>
      </div>

      <!-- About Section -->
      <div class="card mb-6">
        <div class="card-header">
          <h2 class="text-xl font-bold">ℹ️ About</h2>
        </div>
        <div class="card-body">
          <div class="space-y-4">
            <div>
              <p class="text-sm font-medium mb-2">AppClean</p>
              <p class="text-sm text-muted">
                Intelligently find and safely remove applications with all their artifacts.
              </p>
            </div>

            <div>
              <p class="text-sm font-medium mb-2">Links</p>
              <div class="flex gap-2">
                <a
                  href="https://github.com/praveenkay/AppClean"
                  target="_blank"
                  rel="noopener"
                  class="btn btn-sm btn-ghost"
                >
                  💻 GitHub
                </a>
                <a
                  href="https://github.com/praveenkay/AppClean/issues"
                  target="_blank"
                  rel="noopener"
                  class="btn btn-sm btn-ghost"
                >
                  🐛 Report Issue
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Danger Zone -->
      <div class="card" style="border-color: var(--color-danger);">
        <div class="card-header" style="background: var(--color-danger-light);">
          <h2 class="text-xl font-bold text-danger">⚠️ Danger Zone</h2>
        </div>
        <div class="card-body">
          <p class="text-sm text-muted mb-4">
            Uninstall AppClean from your system. This action cannot be undone.
          </p>
          <button class="btn btn-danger w-full" id="uninstall-btn">
            🗑️ Uninstall AppClean
          </button>
        </div>
      </div>
    </div>
  `;

  // Setup event listeners
  setupSettingsListeners();

  // Scroll to top
  window.scrollTo(0, 0);
}

/**
 * Setup event listeners
 */
function setupSettingsListeners(): void {
  const upgradeBtn = document.getElementById('upgrade-btn');
  const checkUpdateBtn = document.getElementById('check-update-btn');
  const themeToggleBtn = document.getElementById('theme-toggle-btn');
  const uninstallBtn = document.getElementById('uninstall-btn');

  // Upgrade button
  if (upgradeBtn) {
    upgradeBtn.addEventListener('click', async () => {
      (upgradeBtn as HTMLButtonElement).disabled = true;
      upgradeBtn.textContent = '⏳ Upgrading...';

      try {
        const result = await apiClient.post('/api/upgrade', {});

        if (result.success) {
          uiStore.showSuccess(result.message);
          setTimeout(() => {
            window.location.reload();
          }, 2000);
        } else {
          uiStore.showError(result.message);
          (upgradeBtn as HTMLButtonElement).disabled = false;
          upgradeBtn.textContent = '🚀 Upgrade Now';
        }
      } catch (error) {
        uiStore.showError(`Upgrade failed: ${(error as Error).message}`);
        (upgradeBtn as HTMLButtonElement).disabled = false;
        upgradeBtn.textContent = '🚀 Upgrade Now';
      }
    });
  }

  // Check update button
  if (checkUpdateBtn) {
    checkUpdateBtn.addEventListener('click', async () => {
      (checkUpdateBtn as HTMLButtonElement).disabled = true;
      checkUpdateBtn.textContent = '⏳ Checking...';

      try {
        const versionInfo = await apiClient.get<VersionInfo>('/api/version');

        if (versionInfo.isUpdateAvailable) {
          uiStore.showWarning(
            `Update available: v${versionInfo.latest} (current: v${versionInfo.current})`
          );
        } else {
          uiStore.showSuccess('You are running the latest version!');
        }

        // Refresh page to update UI
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } catch (error) {
        uiStore.showError(`Failed to check updates: ${(error as Error).message}`);
        (checkUpdateBtn as HTMLButtonElement).disabled = false;
        checkUpdateBtn.textContent = '🔄 Check Again';
      }
    });
  }

  // Theme toggle button
  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      uiStore.toggleTheme();

      // Update button appearance
      const newTheme = uiStore.getState().theme;
      themeToggleBtn.className = `btn btn-sm ${newTheme === 'dark' ? 'btn-primary' : 'btn-secondary'}`;
      themeToggleBtn.textContent = newTheme === 'dark' ? '🌙 Dark' : '☀️ Light';
    });
  }

  // Uninstall button
  if (uninstallBtn) {
    uninstallBtn.addEventListener('click', () => {
      const confirmed = confirm(
        'Are you sure you want to uninstall AppClean?\n\nThis action cannot be undone.'
      );

      if (!confirmed) return;

      const doubleConfirmed = confirm(
        'This will permanently remove AppClean from your system.\n\nType "YES" in the next dialog to confirm.'
      );

      if (!doubleConfirmed) return;

      uninstall();
    });
  }
}

/**
 * Execute uninstall
 */
async function uninstall(): Promise<void> {
  const uninstallBtn = document.getElementById('uninstall-btn');
  if (uninstallBtn) {
    (uninstallBtn as HTMLButtonElement).disabled = true;
    uninstallBtn.textContent = '⏳ Uninstalling...';
  }

  uiStore.setProcessing(true);

  try {
    const result = await apiClient.post('/api/uninstall', {});

    if (result.success) {
      uiStore.showSuccess(result.message);
      setTimeout(() => {
        // Redirect or close window
        window.close();
      }, 2000);
    } else {
      uiStore.showError(result.message);
      if (uninstallBtn) {
        (uninstallBtn as HTMLButtonElement).disabled = false;
        uninstallBtn.textContent = '🗑️ Uninstall AppClean';
      }
    }
  } catch (error) {
    uiStore.showError(`Uninstall failed: ${(error as Error).message}`);
    if (uninstallBtn) {
      (uninstallBtn as HTMLButtonElement).disabled = false;
      uninstallBtn.textContent = '🗑️ Uninstall AppClean';
    }
  } finally {
    uiStore.setProcessing(false);
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
