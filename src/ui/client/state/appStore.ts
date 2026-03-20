/**
 * AppStore - Manages installed applications list and search/filter state
 */

import { Store } from '../utils/events.js';

export interface InstalledApp {
  name: string;
  version: string;
  installMethod: string;
  mainPath: string;
  installedDate?: string;
  size?: number;
}

export interface SearchOptions {
  query: string;
  installMethod?: string;
  sortBy?: 'name' | 'size' | 'date';
}

export interface AppStoreState {
  apps: InstalledApp[];
  searchOptions: SearchOptions;
  selectedApp: InstalledApp | null;
  isLoading: boolean;
  error: string | null;
  total: number;
  page: number;
  pageSize: number;
}

const INITIAL_STATE: AppStoreState = {
  apps: [],
  searchOptions: {
    query: '',
    installMethod: undefined,
    sortBy: 'name',
  },
  selectedApp: null,
  isLoading: false,
  error: null,
  total: 0,
  page: 1,
  pageSize: 50,
};

export class AppStore extends Store<AppStoreState> {
  constructor() {
    super(INITIAL_STATE);
  }

  // Load all apps
  async loadApps(): Promise<void> {
    this.setState({ isLoading: true, error: null });
    try {
      const response = await fetch('/api/apps/list');
      if (!response.ok) throw new Error('Failed to load apps');

      const data = await response.json();
      this.setState({
        apps: data.apps,
        total: data.total,
        page: data.page,
        isLoading: false,
      });
    } catch (error) {
      this.setState({
        error: (error as Error).message,
        isLoading: false,
      });
    }
  }

  // Search apps
  async searchApps(options: Partial<SearchOptions>): Promise<void> {
    const searchOptions = { ...this.state.searchOptions, ...options };
    this.setState({ searchOptions, isLoading: true, error: null, page: 1 });

    try {
      const params = new URLSearchParams();
      if (searchOptions.query) params.append('q', searchOptions.query);
      if (searchOptions.installMethod) params.append('method', searchOptions.installMethod);
      if (searchOptions.sortBy) params.append('sort', searchOptions.sortBy);
      params.append('limit', String(this.state.pageSize));
      params.append('offset', '0');

      const response = await fetch(`/api/apps/search?${params}`);
      if (!response.ok) throw new Error('Failed to search apps');

      const data = await response.json();
      this.setState({
        apps: data.apps,
        total: data.count,
        isLoading: false,
      });
    } catch (error) {
      this.setState({
        error: (error as Error).message,
        isLoading: false,
      });
    }
  }

  // Set search query
  setSearchQuery(query: string): void {
    this.searchApps({ query });
  }

  // Set install method filter
  setInstallMethodFilter(method?: string): void {
    this.searchApps({ installMethod: method });
  }

  // Set sort option
  setSortBy(sortBy: 'name' | 'size' | 'date'): void {
    this.searchApps({ sortBy });
  }

  // Select an app
  selectApp(app: InstalledApp): void {
    this.setState({ selectedApp: app });
  }

  // Clear selection
  clearSelection(): void {
    this.setState({ selectedApp: null });
  }

  // Load next page
  async loadNextPage(): Promise<void> {
    const nextPage = this.state.page + 1;
    const offset = (nextPage - 1) * this.state.pageSize;

    this.setState({ isLoading: true });
    try {
      const params = new URLSearchParams();
      if (this.state.searchOptions.query) params.append('q', this.state.searchOptions.query);
      if (this.state.searchOptions.installMethod) {
        params.append('method', this.state.searchOptions.installMethod);
      }
      params.append('limit', String(this.state.pageSize));
      params.append('offset', String(offset));

      const response = await fetch(`/api/apps/search?${params}`);
      if (!response.ok) throw new Error('Failed to load more apps');

      const data = await response.json();
      this.setState({
        apps: [...this.state.apps, ...data.apps],
        page: nextPage,
        isLoading: false,
      });
    } catch (error) {
      this.setState({
        error: (error as Error).message,
        isLoading: false,
      });
    }
  }

  // Clear error
  clearError(): void {
    this.setState({ error: null });
  }
}

// Export singleton instance
export const appStore = new AppStore();
