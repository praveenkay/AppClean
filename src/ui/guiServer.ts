/**
 * GUI Server for AppClean v2.0.0
 * Modern SPA with API endpoints
 */

import { createServer, IncomingMessage, ServerResponse } from 'http';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { Logger } from '../utils/logger.js';
import { sendJson, sendError, parseQueryParams } from './server/middleware/errorHandler.js';
import { handleAppRoutes } from './server/routes/apps.js';
import { handleDashboardRoutes } from './server/routes/dashboard.js';
import { handleSettingsRoutes } from './server/routes/settings.js';

// ES module compatibility: Define __dirname and __filename
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export class GUIServer {
  private port: number = 3000;
  private server: any;
  private spaHtml: string | null = null;

  constructor(port: number = 3000) {
    this.port = port;
  }

  /**
   * Start GUI server
   */
  async start(): Promise<void> {
    Logger.info(`Starting AppClean GUI server on port ${this.port}...`);

    // Try to load SPA HTML (from compiled dist)
    this.loadSPAHtml();

    this.server = createServer((req, res) => {
      this.handleRequest(req, res);
    });

    return new Promise((resolve) => {
      this.server.listen(this.port, () => {
        Logger.success(`✨ AppClean GUI running at http://localhost:${this.port}`);
        Logger.info('Press Ctrl+C to stop the server');
        resolve();
      });
    });
  }

  /**
   * Stop GUI server
   */
  async stop(): Promise<void> {
    if (this.server) {
      this.server.close();
      Logger.info('GUI server stopped');
    }
  }

  /**
   * Main request handler
   */
  private async handleRequest(req: IncomingMessage, res: ServerResponse): Promise<void> {
    const url = req.url || '/';
    const method = req.method || 'GET';
    const pathname = url.split('?')[0];

    // Set CORS headers
    this.setCORSHeaders(res);

    // Handle preflight requests
    if (method === 'OPTIONS') {
      res.writeHead(200);
      res.end();
      return;
    }

    try {
      // Route API requests
      if (pathname.startsWith('/api/')) {
        return this.handleAPIRequest(method, pathname, req, res);
      }

      // Serve static assets
      if (pathname.startsWith('/static/')) {
        return this.serveStaticAsset(pathname, res);
      }

      // Serve SPA for all other routes
      this.serveSPA(res);
    } catch (error) {
      Logger.error(`Request error: ${(error as Error).message}`);
      sendError(res, 'Internal server error', 500);
    }
  }

  /**
   * Handle API requests
   */
  private handleAPIRequest(
    method: string,
    pathname: string,
    req: IncomingMessage,
    res: ServerResponse
  ): void {
    // Try app routes
    if (handleAppRoutes(method, pathname, req, res)) {
      return;
    }

    // Try dashboard routes
    if (handleDashboardRoutes(method, pathname, req, res)) {
      return;
    }

    // Try settings routes
    if (handleSettingsRoutes(method, pathname, req, res)) {
      return;
    }

    // Unknown endpoint
    sendError(res, 'API endpoint not found', 404);
  }

  /**
   * Serve static assets (CSS, JS)
   */
  private serveStaticAsset(pathname: string, res: ServerResponse): void {
    // Remove /static/ prefix
    const relativePath = pathname.slice(8);

    // Security: prevent directory traversal
    if (relativePath.includes('..')) {
      sendError(res, 'Access denied', 403);
      return;
    }

    // Construct file path
    const filePath = join(__dirname, 'client', relativePath);

    // Check if file exists
    if (!existsSync(filePath)) {
      sendError(res, 'Asset not found', 404);
      return;
    }

    try {
      const content = readFileSync(filePath);
      const contentType = this.getContentType(filePath);

      res.writeHead(200, {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=3600', // 1 hour
      });
      res.end(content);
    } catch (error) {
      Logger.warn(`Failed to serve asset ${pathname}: ${(error as Error).message}`);
      sendError(res, 'Failed to load asset', 500);
    }
  }

  /**
   * Serve SPA HTML
   */
  private serveSPA(res: ServerResponse): void {
    if (!this.spaHtml) {
      // Fallback: serve minimal HTML with error message
      const fallbackHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>AppClean</title>
</head>
<body style="font-family: system-ui; padding: 20px; text-align: center;">
  <h1>⚠️ GUI Not Ready</h1>
  <p>The SPA assets haven't been compiled yet.</p>
  <p>Run <code>npm run build</code> to compile the TypeScript/CSS files.</p>
  <p>For now, use the CLI: <code>appclean --help</code></p>
</body>
</html>`;

      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(fallbackHtml);
      return;
    }

    res.writeHead(200, {
      'Content-Type': 'text/html',
      'Cache-Control': 'no-cache',
    });
    res.end(this.spaHtml);
  }

  /**
   * Load SPA HTML from compiled dist
   */
  private loadSPAHtml(): void {
    const htmlPath = join(__dirname, 'client', 'index.html');

    try {
      if (existsSync(htmlPath)) {
        this.spaHtml = readFileSync(htmlPath, 'utf-8');
        Logger.debug('✓ Loaded SPA HTML');
      } else {
        Logger.warn(`⚠️  SPA HTML not found at ${htmlPath}`);
        Logger.info('Make sure to run: npm run build');
      }
    } catch (error) {
      Logger.warn(`Failed to load SPA HTML: ${(error as Error).message}`);
    }
  }

  /**
   * Determine content type from file extension
   */
  private getContentType(filePath: string): string {
    const ext = filePath.toLowerCase().split('.').pop();

    const typeMap: Record<string, string> = {
      'js': 'application/javascript; charset=utf-8',
      'css': 'text/css; charset=utf-8',
      'html': 'text/html; charset=utf-8',
      'json': 'application/json; charset=utf-8',
      'svg': 'image/svg+xml',
      'png': 'image/png',
      'jpg': 'image/jpeg',
      'jpeg': 'image/jpeg',
      'gif': 'image/gif',
      'ico': 'image/x-icon',
      'webp': 'image/webp',
      'woff': 'font/woff',
      'woff2': 'font/woff2',
      'ttf': 'font/ttf',
      'eot': 'application/vnd.ms-fontobject',
    };

    return typeMap[ext || ''] || 'application/octet-stream';
  }

  /**
   * Set CORS headers
   */
  private setCORSHeaders(res: ServerResponse): void {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Max-Age', '3600');
  }
}

// Export for use in CLI
export default GUIServer;
