/**
 * AppClean GUI - Main SPA Controller
 * Initializes router, stores, and pages
 */

import { router } from './utils/router.js';
import { appStore } from './state/appStore.js';
import { dashboardStore } from './state/dashboardStore.js';
import { uiStore } from './state/uiStore.js';

// Import page modules
import { renderDashboard } from './pages/dashboard.js';
import { renderAppSearch } from './pages/appSearch.js';
import { renderAppDetails } from './pages/appDetails.js';
import { renderSettings } from './pages/settings.js';
import { renderHelp } from './pages/help.js';

/**
 * Initialize the SPA
 */
export async function initApp(): Promise<void> {
  console.log('🧹 AppClean GUI v1.0.0 initializing...');

  // Register routes first
  registerRoutes();

  // Setup UI listeners
  setupUIListeners();

  // Initialize stores with data
  await initializeStores();

  // Navigate to initial route
  router.navigate('');

  console.log('✓ AppClean GUI ready');
}

/**
 * Register all routes
 */
function registerRoutes(): void {
  router.register('', () => {
    uiStore.navigateTo('dashboard');
    renderDashboard();
  }, 'AppClean - Dashboard');

  router.register('apps', () => {
    uiStore.navigateTo('apps');
    renderAppSearch();
  }, 'AppClean - Apps');

  router.register('apps/:appName', (params) => {
    uiStore.navigateTo('app-details');
    renderAppDetails(params.appName);
  }, 'AppClean - App Details');

  router.register('settings', () => {
    uiStore.navigateTo('settings');
    renderSettings();
  }, 'AppClean - Settings');

  router.register('help', () => {
    uiStore.navigateTo('help');
    renderHelp();
  }, 'AppClean - Help');
}

/**
 * Initialize stores with data
 */
async function initializeStores(): Promise<void> {
  try {
    // Load dashboard stats (required for initial render)
    await dashboardStore.loadStats();

    // Load app list in background (don't block on this)
    appStore.loadApps().catch((error) => {
      console.error('Failed to load apps:', error);
    });
  } catch (error) {
    console.error('Failed to initialize stores:', error);
    uiStore.showError('Failed to load application data');
  }
}

/**
 * Setup UI event listeners
 */
function setupUIListeners(): void {
  // Subscribe to UI store changes
  uiStore.subscribe((state) => {
    console.log('UI State changed:', state.currentView);
  });

  // Subscribe to app store changes
  appStore.subscribe((state) => {
    if (state && state.apps) {
      console.log(`Apps loaded: ${state.apps.length}`);
    }
  });

  // Subscribe to dashboard store changes
  dashboardStore.subscribe((state) => {
    if (state.stats) {
      console.log(`Dashboard stats: ${state.stats.totalApps} apps, ${state.stats.totalSpaceUsed} bytes`);
    }
  });

  // Handle route changes
  router.onchange((route) => {
    console.log('Navigated to:', route.path);
  });

  // Theme toggle listener
  document.addEventListener('theme-toggle', () => {
    uiStore.toggleTheme();
  });
}

/**
 * Export for consumption in HTML
 */
export { appStore, dashboardStore, uiStore, router };

// Initialize on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => initApp().catch(e => console.error('Init error:', e)));
} else {
  initApp().catch(e => console.error('Init error:', e));
}
