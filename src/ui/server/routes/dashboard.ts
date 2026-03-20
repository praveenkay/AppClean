/**
 * Dashboard Routes - Handle statistics and metrics
 */

import { IncomingMessage, ServerResponse } from 'http';
import { Detector } from '../../../core/detector.js';
import { removalService } from '../services/removalService.js';
import { sendJson, asyncHandler } from '../middleware/errorHandler.js';
import { execSync } from 'child_process';

/**
 * GET /api/dashboard/stats - Get dashboard statistics
 */
export const getDashboardStats = asyncHandler(async (req, res) => {
  const detector = new Detector();

  // Get all apps
  const allApps = await detector.searchApps({});
  const totalApps = allApps.length;

  // Calculate total space used
  let totalSpaceUsed = 0;
  for (const app of allApps) {
    try {
      const artifacts = await detector.findArtifacts(app.name, app.installMethod);
      totalSpaceUsed += artifacts.reduce((sum, a) => sum + (a.size || 0), 0);
    } catch (error) {
      // Skip errors for individual apps
    }
  }

  // Get disk usage
  const diskUsagePercent = getDiskUsagePercent();

  // Get session stats from removal service
  const sessionRemovals = removalService.getSessionRemovals();
  const sessionAppsRemoved = sessionRemovals.length;
  const sessionSpaceFreed = sessionRemovals.reduce((sum, r) => sum + r.freedSpace, 0);

  // Format recently removed for display
  const recentlyRemoved = sessionRemovals.map((removal) => ({
    appName: removal.appName,
    timestamp: Date.now(), // Should track actual time, but using now for simplicity
    freedSpace: removal.freedSpace,
    filesRemoved: removal.removedFiles,
  }));

  const stats = {
    totalApps,
    totalSpaceUsed,
    sessionAppsRemoved,
    sessionSpaceFreed,
    diskUsagePercent,
    recentlyRemoved,
  };

  sendJson(res, stats);
});

/**
 * Get disk usage percentage
 */
function getDiskUsagePercent(): number {
  try {
    // Try using 'df' command on Unix systems
    const result = execSync('df -h / | tail -1', { encoding: 'utf-8' });
    const parts = result.trim().split(/\s+/);
    const percentStr = parts[4]?.replace('%', '');
    const percent = parseInt(percentStr || '0', 10);
    return isNaN(percent) ? 0 : Math.min(percent, 100);
  } catch (error) {
    // Fallback: return 0 if we can't determine
    return 0;
  }
}

/**
 * Route matcher and handler
 */
export function handleDashboardRoutes(
  method: string,
  pathname: string,
  req: IncomingMessage,
  res: ServerResponse
): boolean {
  // GET /api/dashboard/stats
  if (method === 'GET' && pathname === '/api/dashboard/stats') {
    getDashboardStats(req, res);
    return true;
  }

  return false;
}
