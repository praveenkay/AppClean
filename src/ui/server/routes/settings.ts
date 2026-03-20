/**
 * Settings Routes - Handle version, upgrade, and uninstall
 */

import { IncomingMessage, ServerResponse } from 'http';
import { UpgradeManager } from '../../../utils/upgrade.js';
import { sendJson, sendError, asyncHandler } from '../middleware/errorHandler.js';

const upgradeManager = new UpgradeManager();

/**
 * GET /api/version - Check version and get update info
 */
export const checkVersion = asyncHandler(async (req, res) => {
  const versionInfo = await upgradeManager.checkForUpdates();
  sendJson(res, versionInfo);
});

/**
 * POST /api/upgrade - Upgrade to latest version
 */
export const upgrade = asyncHandler(async (req, res) => {
  const result = await upgradeManager.upgrade();
  sendJson(res, result);
});

/**
 * POST /api/uninstall - Uninstall AppClean
 */
export const uninstall = asyncHandler(async (req, res) => {
  const result = await upgradeManager.uninstall();
  sendJson(res, result);
});

/**
 * Route matcher and handler
 */
export function handleSettingsRoutes(
  method: string,
  pathname: string,
  req: IncomingMessage,
  res: ServerResponse
): boolean {
  // GET /api/version
  if (method === 'GET' && pathname === '/api/version') {
    checkVersion(req, res);
    return true;
  }

  // POST /api/upgrade
  if (method === 'POST' && pathname === '/api/upgrade') {
    upgrade(req, res);
    return true;
  }

  // POST /api/uninstall
  if (method === 'POST' && pathname === '/api/uninstall') {
    uninstall(req, res);
    return true;
  }

  return false;
}
