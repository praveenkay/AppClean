/**
 * Simple Hash-Based Router for SPA
 */

export type RouteHandler = (params: Record<string, string>) => void;

export interface Route {
  path: string;
  handler: RouteHandler;
  title?: string;
}

export class Router {
  private routes: Route[] = [];
  private currentRoute: Route | null = null;
  private onRouteChange: ((route: Route) => void) | null = null;

  constructor() {
    this.listenToHashChanges();
  }

  /**
   * Register a route
   */
  register(path: string, handler: RouteHandler, title?: string): void {
    this.routes.push({ path, handler, title });
  }

  /**
   * Navigate to a route
   */
  navigate(path: string): void {
    window.location.hash = `#/${path}`.replace('##', '#');
  }

  /**
   * Get current route path
   */
  getCurrentPath(): string {
    return window.location.hash.slice(2) || '';
  }

  /**
   * Listen to hash changes and trigger handlers
   */
  private listenToHashChanges(): void {
    window.addEventListener('hashchange', () => {
      this.route();
    });

    // Initial route on load
    this.route();
  }

  /**
   * Route the current hash to a handler
   */
  private route(): void {
    const path = this.getCurrentPath();
    const route = this.matchRoute(path);

    if (route) {
      const params = this.extractParams(route.path, path);
      this.currentRoute = route;

      if (route.title) {
        document.title = route.title;
      }

      try {
        route.handler(params);
      } catch (error) {
        console.error('Route handler error:', error);
      }

      if (this.onRouteChange) {
        this.onRouteChange(route);
      }
    } else {
      console.warn(`No route found for: ${path}`);
    }
  }

  /**
   * Match a path to a registered route
   */
  private matchRoute(path: string): Route | null {
    // Exact match first
    const exactMatch = this.routes.find((r) => r.path === path || r.path === `/${path}`);
    if (exactMatch) return exactMatch;

    // Dynamic route match
    for (const route of this.routes) {
      if (this.pathMatches(route.path, path)) {
        return route;
      }
    }

    return null;
  }

  /**
   * Check if a route path matches a given path
   * Supports dynamic segments like /apps/:appName
   */
  private pathMatches(routePath: string, actualPath: string): boolean {
    const routeParts = routePath.split('/').filter(Boolean);
    const actualParts = actualPath.split('/').filter(Boolean);

    if (routeParts.length !== actualParts.length) {
      return false;
    }

    return routeParts.every((part, i) => {
      return part.startsWith(':') || part === actualParts[i];
    });
  }

  /**
   * Extract params from a path
   * Example: /apps/:appName with path /apps/myapp returns { appName: 'myapp' }
   */
  private extractParams(routePath: string, actualPath: string): Record<string, string> {
    const params: Record<string, string> = {};
    const routeParts = routePath.split('/').filter(Boolean);
    const actualParts = actualPath.split('/').filter(Boolean);

    routeParts.forEach((part, i) => {
      if (part.startsWith(':')) {
        const paramName = part.slice(1);
        params[paramName] = decodeURIComponent(actualParts[i]);
      }
    });

    return params;
  }

  /**
   * Register a callback for route changes
   */
  onchange(callback: (route: Route) => void): void {
    this.onRouteChange = callback;
  }

  /**
   * Get all registered routes
   */
  getRoutes(): Route[] {
    return this.routes;
  }

  /**
   * Get current route
   */
  getCurrentRoute(): Route | null {
    return this.currentRoute;
  }
}

// Export singleton instance
export const router = new Router();
