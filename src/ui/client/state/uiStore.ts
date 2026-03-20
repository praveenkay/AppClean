/**
 * UIStore - Manages UI state: active view, modals, notifications, theme
 */

import { Store } from '../utils/events.js';

export type ViewType = 'dashboard' | 'apps' | 'app-details' | 'settings';
export type NotificationType = 'success' | 'error' | 'warning' | 'info';
export type ThemeType = 'light' | 'dark';

export interface Notification {
  id: string;
  type: NotificationType;
  message: string;
  duration?: number; // ms, 0 = persistent
}

export interface UIStoreState {
  currentView: ViewType;
  theme: ThemeType;
  sidebarVisible: boolean;
  isModalOpen: boolean;
  modalType: string | null;
  modalData: any;
  notifications: Notification[];
  isProcessing: boolean;
}

const INITIAL_STATE: UIStoreState = {
  currentView: 'dashboard',
  theme: (localStorage.getItem('theme') as ThemeType) || 'light',
  sidebarVisible: true,
  isModalOpen: false,
  modalType: null,
  modalData: null,
  notifications: [],
  isProcessing: false,
};

export class UIStore extends Store<UIStoreState> {
  private notificationTimers: Map<string, number> = new Map();

  constructor() {
    super(INITIAL_STATE);
    this.applyTheme(this.state.theme);
  }

  // Navigation
  navigateTo(view: ViewType): void {
    this.setState({ currentView: view });
    window.location.hash = `#/${view === 'dashboard' ? '' : view}`;
  }

  // Sidebar
  toggleSidebar(): void {
    this.setState({ sidebarVisible: !this.state.sidebarVisible });
  }

  showSidebar(): void {
    this.setState({ sidebarVisible: true });
  }

  hideSidebar(): void {
    this.setState({ sidebarVisible: false });
  }

  // Modals
  openModal(type: string, data?: any): void {
    this.setState({
      isModalOpen: true,
      modalType: type,
      modalData: data,
    });
  }

  closeModal(): void {
    this.setState({
      isModalOpen: false,
      modalType: null,
      modalData: null,
    });
  }

  // Theme
  setTheme(theme: ThemeType): void {
    this.setState({ theme });
    this.applyTheme(theme);
    localStorage.setItem('theme', theme);
  }

  toggleTheme(): void {
    const newTheme = this.state.theme === 'light' ? 'dark' : 'light';
    this.setTheme(newTheme);
  }

  private applyTheme(theme: ThemeType): void {
    const root = document.documentElement;
    if (theme === 'dark') {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }

  // Notifications
  addNotification(notification: Omit<Notification, 'id'>): string {
    const id = `notif-${Date.now()}-${Math.random()}`;
    const fullNotification: Notification = { ...notification, id };

    this.setState({
      notifications: [...this.state.notifications, fullNotification],
    });

    if (notification.duration && notification.duration > 0) {
      const timer = window.setTimeout(() => {
        this.removeNotification(id);
      }, notification.duration);
      this.notificationTimers.set(id, timer);
    }

    return id;
  }

  removeNotification(id: string): void {
    const timer = this.notificationTimers.get(id);
    if (timer) {
      clearTimeout(timer);
      this.notificationTimers.delete(id);
    }

    this.setState({
      notifications: this.state.notifications.filter((n) => n.id !== id),
    });
  }

  // Shortcuts
  showSuccess(message: string, duration = 4000): void {
    this.addNotification({ type: 'success', message, duration });
  }

  showError(message: string, duration = 5000): void {
    this.addNotification({ type: 'error', message, duration });
  }

  showWarning(message: string, duration = 4000): void {
    this.addNotification({ type: 'warning', message, duration });
  }

  showInfo(message: string, duration = 3000): void {
    this.addNotification({ type: 'info', message, duration });
  }

  // Processing state
  setProcessing(isProcessing: boolean): void {
    this.setState({ isProcessing });
  }

  clearNotifications(): void {
    this.notificationTimers.forEach((timer) => clearTimeout(timer));
    this.notificationTimers.clear();
    this.setState({ notifications: [] });
  }
}

// Export singleton instance
export const uiStore = new UIStore();
