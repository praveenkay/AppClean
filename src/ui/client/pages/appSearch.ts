/**
 * App Search Page - Search, filter, and browse installed applications
 */

import { appStore, InstalledApp, SearchOptions } from '../state/appStore.js';
import { uiStore } from '../state/uiStore.js';
import { formatBytes, getMethodBadgeColor, formatInstallMethod, debounce } from '../utils/formatting.js';

/**
 * Render App Search Page
 */
export function renderAppSearch(): void {
  const container = document.getElementById('page-container');
  if (!container) return;

  // Show loading state
  container.innerHTML = `
    <div class="loading-state" style="text-align: center; padding: 60px 20px;">
      <div class="spinner-lg spinner"></div>
      <p class="text-center text-muted mt-4">Loading apps...</p>
    </div>
  `;

  // Load apps
  appStore.loadApps().then(() => {
    renderAppSearchContent(container);

    // Subscribe to store updates
    appStore.subscribe((state) => {
      if (!state.isLoading) {
        renderAppSearchContent(container);
      }
    });
  });
}

/**
 * Render app search page content
 */
function renderAppSearchContent(container: HTMLElement): void {
  const state = appStore.getState();

  container.innerHTML = `
    <div class="app-search-page">
      <!-- Header -->
      <div class="page-header mb-8">
        <h1 class="text-3xl font-bold">📦 Applications</h1>
        <p class="text-secondary mt-2">Search and manage installed apps</p>
      </div>

      <!-- Search and Filters -->
      <div class="card mb-6">
        <div class="card-body">
          <!-- Search Input -->
          <div class="form-group">
            <input
              type="text"
              id="search-input"
              class="form-input"
              placeholder="Search apps by name..."
              value="${escapeHtml(state.searchOptions.query)}"
              autocomplete="off"
            >
          </div>

          <!-- Filters Row -->
          <div class="flex flex-wrap gap-2 items-center">
            <span class="text-sm font-medium text-muted">Method:</span>
            ${renderMethodFilter(state.searchOptions.installMethod || '')}

            <span class="text-sm font-medium text-muted ml-4">Sort:</span>
            ${renderSortFilter(state.searchOptions.sortBy || 'name')}
          </div>

          <!-- Results Count -->
          <p class="text-sm text-muted mt-4">
            ${state.isLoading ? 'Loading...' : `${state.total} app${state.total !== 1 ? 's' : ''} found`}
          </p>
        </div>
      </div>

      <!-- Apps Grid -->
      <div class="apps-grid">
        ${
          state.apps.length > 0
            ? `
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            ${state.apps.map((app) => renderAppCard(app)).join('')}
          </div>
        `
            : `
          <div class="card">
            <div class="card-body text-center py-12">
              <p class="text-2xl mb-2">🔍</p>
              <p class="text-lg font-medium">No apps found</p>
              <p class="text-muted mt-2">
                ${state.searchOptions.query ? 'Try a different search query' : 'No applications detected'}
              </p>
            </div>
          </div>
        `
        }
      </div>

      <!-- Load More Button -->
      ${
        state.apps.length < state.total
          ? `
        <div class="text-center mt-8">
          <button class="btn btn-secondary" id="load-more-btn">
            Load More (${state.apps.length} of ${state.total})
          </button>
        </div>
      `
          : ''
      }
    </div>
  `;

  // Setup event listeners
  setupSearchListeners();
  setupLoadMoreListener();

  // Scroll to top
  window.scrollTo(0, 0);
}

/**
 * Render app card
 */
function renderAppCard(app: InstalledApp): string {
  return `
    <div class="card app-card hover-lift cursor-pointer" onclick="window.location.hash = '#/apps/${encodeURIComponent(app.name)}'">
      <div class="card-body">
        <div class="flex-between mb-2">
          <h3 class="text-lg font-bold">${escapeHtml(app.name)}</h3>
          <span class="badge ${getMethodBadgeColor(app.installMethod)}">
            ${formatInstallMethod(app.installMethod)}
          </span>
        </div>

        <p class="text-sm text-muted mb-3">
          ${app.version ? `v${escapeHtml(app.version)}` : 'Version unknown'}
        </p>

        <div class="flex-between pt-3 border-t border-color">
          <span class="text-sm text-muted">
            ${app.size ? formatBytes(app.size) : 'Size unknown'}
          </span>
          <button
            class="btn btn-sm btn-ghost-primary"
            onclick="
              event.stopPropagation();
              window.location.hash = '#/apps/${encodeURIComponent(app.name)}';
            "
          >
            Details →
          </button>
        </div>
      </div>
    </div>
  `;
}

/**
 * Render method filter buttons
 */
function renderMethodFilter(selected: string): string {
  const methods = ['', 'npm', 'yarn', 'pnpm', 'brew', 'apt', 'yum', 'dnf', 'custom'];
  const labels: Record<string, string> = {
    '': 'All',
    'npm': 'npm',
    'yarn': 'Yarn',
    'pnpm': 'pnpm',
    'brew': 'Homebrew',
    'apt': 'apt',
    'yum': 'yum',
    'dnf': 'dnf',
    'custom': 'Custom',
  };

  return methods
    .map(
      (method) => `
    <button
      class="btn btn-sm ${method === selected ? 'btn-primary' : 'btn-ghost'} method-filter"
      data-method="${method}"
    >
      ${labels[method]}
    </button>
  `
    )
    .join('');
}

/**
 * Render sort filter dropdown
 */
function renderSortFilter(selected: string): string {
  return `
    <select id="sort-select" class="form-input" style="width: auto;">
      <option value="name" ${selected === 'name' ? 'selected' : ''}>Name (A-Z)</option>
      <option value="size" ${selected === 'size' ? 'selected' : ''}>Size (Largest)</option>
      <option value="date" ${selected === 'date' ? 'selected' : ''}>Date (Newest)</option>
    </select>
  `;
}

/**
 * Setup search input listener with debounce
 */
function setupSearchListeners(): void {
  const searchInput = document.getElementById('search-input') as HTMLInputElement;
  const methodButtons = document.querySelectorAll('.method-filter');
  const sortSelect = document.getElementById('sort-select') as HTMLSelectElement;

  // Debounced search
  const debouncedSearch = debounce((query: string) => {
    appStore.setSearchQuery(query);
  }, 300);

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const query = (e.target as HTMLInputElement).value;
      debouncedSearch(query);
    });
  }

  // Method filter buttons
  methodButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const method = btn.getAttribute('data-method');
      appStore.setInstallMethodFilter(method || undefined);
    });
  });

  // Sort dropdown
  if (sortSelect) {
    sortSelect.addEventListener('change', (e) => {
      const sort = (e.target as HTMLSelectElement).value as any;
      appStore.setSortBy(sort);
    });
  }
}

/**
 * Setup load more button
 */
function setupLoadMoreListener(): void {
  const loadMoreBtn = document.getElementById('load-more-btn');
  if (loadMoreBtn) {
    loadMoreBtn.addEventListener('click', () => {
      appStore.loadNextPage();
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
  return text.replace(/[&<>"']/g, (m) => map[m]);
}
