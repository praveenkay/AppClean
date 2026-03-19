/**
 * GUI Server for AppClean
 * Provides web-based GUI interface for macOS, Linux, and Windows
 * v1.2.0 Feature
 */

import { createServer, IncomingMessage, ServerResponse } from 'http';
import { Logger } from '../utils/logger';
import { UpgradeManager } from '../utils/upgrade';

export class GUIServer {
  private port: number = 3000;
  private server: any;
  private upgradeManager: UpgradeManager;

  constructor(port: number = 3000) {
    this.port = port;
    this.upgradeManager = new UpgradeManager();
  }

  /**
   * Start GUI server
   */
  async start(): Promise<void> {
    Logger.info(`Starting AppClean GUI server on port ${this.port}...`);

    this.server = createServer((req, res) => {
      if (req.url === '/') {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(this.getIndexHTML());
      } else if (req.url?.startsWith('/api/')) {
        this.handleAPIRequest(req, res);
      } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not Found');
      }
    });

    this.server.listen(this.port, () => {
      Logger.success(`GUI server running at http://localhost:${this.port}`);
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
   * Handle API requests
   */
  private async handleAPIRequest(req: IncomingMessage, res: ServerResponse): Promise<void> {
    const url = req.url || '';

    try {
      if (url === '/api/version') {
        await this.handleVersionCheck(res);
      } else if (url === '/api/upgrade') {
        await this.handleUpgrade(res);
      } else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'API endpoint not found' }));
      }
    } catch (error) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(
        JSON.stringify({ error: (error as Error).message })
      );
    }
  }

  /**
   * Handle version check request
   */
  private async handleVersionCheck(res: ServerResponse): Promise<void> {
    const versionInfo = await this.upgradeManager.checkForUpdates();

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(versionInfo));
  }

  /**
   * Handle upgrade request
   */
  private async handleUpgrade(res: ServerResponse): Promise<void> {
    const result = await this.upgradeManager.upgrade();

    res.writeHead(result.success ? 200 : 500, {
      'Content-Type': 'application/json',
    });
    res.end(JSON.stringify(result));
  }

  /**
   * Get index HTML for GUI
   */
  private getIndexHTML(): string {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>AppClean GUI - v1.2.0</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
    }
    .container {
      background: white;
      border-radius: 12px;
      box-shadow: 0 20px 60px rgba(0,0,0,0.3);
      max-width: 800px;
      width: 100%;
      padding: 40px;
    }
    h1 {
      color: #333;
      margin-bottom: 10px;
    }
    h3 {
      color: #333;
      margin-top: 20px;
      margin-bottom: 15px;
    }
    .version {
      color: #666;
      font-size: 14px;
      margin-bottom: 30px;
    }
    .feature-badge {
      display: inline-block;
      background: #667eea;
      color: white;
      padding: 8px 16px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 600;
      margin-bottom: 20px;
    }
    p {
      color: #666;
      line-height: 1.6;
      margin-bottom: 20px;
    }
    .section {
      background: #f0f4ff;
      border-left: 4px solid #667eea;
      padding: 20px;
      border-radius: 4px;
      margin-top: 30px;
    }
    .version-info {
      background: #f9f9f9;
      padding: 15px;
      border-radius: 6px;
      margin: 15px 0;
      font-family: monospace;
      font-size: 14px;
    }
    .version-row {
      display: flex;
      justify-content: space-between;
      margin: 8px 0;
    }
    .label {
      color: #666;
      font-weight: 500;
    }
    .value {
      color: #333;
      font-weight: 600;
    }
    .update-available {
      color: #f59e0b;
      font-weight: 600;
    }
    .up-to-date {
      color: #10b981;
      font-weight: 600;
    }
    .button-group {
      display: flex;
      gap: 10px;
      margin-top: 20px;
    }
    button {
      flex: 1;
      padding: 12px 20px;
      border: none;
      border-radius: 6px;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
    }
    .btn-primary {
      background: #667eea;
      color: white;
    }
    .btn-primary:hover {
      background: #5568d3;
      transform: translateY(-2px);
      box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
    }
    .btn-primary:disabled {
      background: #ccc;
      cursor: not-allowed;
      transform: none;
    }
    .btn-secondary {
      background: #e5e7eb;
      color: #333;
    }
    .btn-secondary:hover {
      background: #d1d5db;
    }
    .status-message {
      margin-top: 15px;
      padding: 12px;
      border-radius: 6px;
      display: none;
      font-weight: 500;
    }
    .status-success {
      background: #d1fae5;
      color: #065f46;
      display: block;
    }
    .status-error {
      background: #fee2e2;
      color: #991b1b;
      display: block;
    }
    .status-loading {
      background: #dbeafe;
      color: #1e40af;
      display: block;
    }
    .spinner {
      display: inline-block;
      width: 16px;
      height: 16px;
      border: 2px solid rgba(30, 64, 175, 0.3);
      border-top-color: #1e40af;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
      margin-right: 8px;
      vertical-align: middle;
    }
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
    ul {
      margin-left: 20px;
      margin-top: 10px;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>🎨 AppClean GUI</h1>
    <p class="version">v1.2.0 - GUI Application Feature</p>
    <span class="feature-badge">Coming Soon</span>

    <p>
      A beautiful, intuitive graphical user interface for AppClean, bringing the power of
      intelligent app removal to users who prefer a visual interface.
    </p>

    <div class="section">
      <h3>📦 Version & Updates</h3>
      <div class="version-info">
        <div class="version-row">
          <span class="label">Current Version:</span>
          <span class="value" id="currentVersion">Loading...</span>
        </div>
        <div class="version-row">
          <span class="label">Latest Version:</span>
          <span class="value" id="latestVersion">Loading...</span>
        </div>
        <div class="version-row">
          <span class="label">Status:</span>
          <span id="updateStatus">Checking...</span>
        </div>
      </div>
      <div class="button-group">
        <button class="btn-secondary" onclick="checkVersion()">🔄 Check for Updates</button>
        <button class="btn-primary" id="upgradeBtn" onclick="upgradeAppClean()" disabled>⬆️ Upgrade</button>
      </div>
      <div id="statusMessage" class="status-message"></div>
    </div>

    <div class="section">
      <h3>🚀 Features Coming in v1.2.0</h3>
      <ul>
        <li>✨ Modern, responsive GUI design</li>
        <li>🖥️ Cross-platform support (macOS, Linux, Windows)</li>
        <li>🔍 Visual app search and discovery</li>
        <li>📊 Beautiful artifact visualization</li>
        <li>🗑️ Drag-and-drop app removal</li>
        <li>📈 Real-time removal progress</li>
        <li>📋 Interactive report viewer</li>
      </ul>
    </div>
  </div>

  <script>
    // Check version on page load
    window.addEventListener('load', checkVersion);

    async function checkVersion() {
      const statusEl = document.getElementById('statusMessage');
      statusEl.textContent = '🔄 Checking for updates...';
      statusEl.className = 'status-message status-loading';
      statusEl.innerHTML = '<span class="spinner"></span>Checking for updates...';

      try {
        const response = await fetch('/api/version');
        const data = await response.json();

        document.getElementById('currentVersion').textContent = 'v' + data.current;
        document.getElementById('latestVersion').textContent = 'v' + data.latest;

        const upgradeBtn = document.getElementById('upgradeBtn');
        const updateStatus = document.getElementById('updateStatus');

        if (data.isUpdateAvailable) {
          updateStatus.innerHTML = '<span class="update-available">⚠️ Update available!</span>';
          upgradeBtn.disabled = false;
          statusEl.textContent = '✓ Update available! Click the Upgrade button to install.';
          statusEl.className = 'status-message status-success';
        } else {
          updateStatus.innerHTML = '<span class="up-to-date">✓ Up to date</span>';
          upgradeBtn.disabled = true;
          statusEl.textContent = '✓ AppClean is already up to date!';
          statusEl.className = 'status-message status-success';
        }
      } catch (error) {
        statusEl.textContent = '✗ Failed to check for updates: ' + error.message;
        statusEl.className = 'status-message status-error';
      }
    }

    async function upgradeAppClean() {
      const statusEl = document.getElementById('statusMessage');
      const upgradeBtn = document.getElementById('upgradeBtn');

      upgradeBtn.disabled = true;
      statusEl.innerHTML = '<span class="spinner"></span>Upgrading AppClean...';
      statusEl.className = 'status-message status-loading';

      try {
        const response = await fetch('/api/upgrade');
        const data = await response.json();

        if (data.success) {
          statusEl.textContent = '✓ ' + data.message;
          statusEl.className = 'status-message status-success';
          setTimeout(() => {
            statusEl.textContent = 'Please refresh the page or restart the GUI server.';
            checkVersion();
          }, 2000);
        } else {
          statusEl.textContent = '✗ ' + data.message;
          statusEl.className = 'status-message status-error';
          upgradeBtn.disabled = false;
        }
      } catch (error) {
        statusEl.textContent = '✗ Upgrade failed: ' + error.message;
        statusEl.className = 'status-message status-error';
        upgradeBtn.disabled = false;
      }
    }
  </script>
</body>
</html>
    `;
  }
}
