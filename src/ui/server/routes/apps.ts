/**
 * App Routes - Handle app listing, searching, analysis, and removal
 */

import { IncomingMessage, ServerResponse } from 'http';
import { appService } from '../services/appService.js';
import { removalService } from '../services/removalService.js';
import {
  sendJson,
  sendError,
  parseQueryParams,
  extractPathParams,
  parseBody,
  asyncHandler,
  matchPattern,
} from '../middleware/errorHandler.js';

/**
 * GET /api/apps/list - Get paginated list of all apps
 */
export const listApps = asyncHandler(async (req, res) => {
  const params = parseQueryParams(req.url || '');
  const limit = Math.min(parseInt(params.limit || '50'), 100); // Max 100 per page
  const offset = parseInt(params.offset || '0');

  const result = await appService.listApps(limit, offset);
  sendJson(res, result);
});

/**
 * GET /api/apps/search - Search, filter, and sort apps
 */
export const searchApps = asyncHandler(async (req, res) => {
  const params = parseQueryParams(req.url || '');

  const result = await appService.searchApps({
    q: params.q,
    method: params.method,
    sort: (params.sort as any) || 'name',
    limit: Math.min(parseInt(params.limit || '50'), 100),
    offset: parseInt(params.offset || '0'),
  });

  sendJson(res, result);
});

/**
 * GET /api/apps/:appName/analysis - Analyze app and get artifacts
 */
export const analyzeApp = asyncHandler(async (req, res, params) => {
  if (!params?.appName) {
    return sendError(res, 'App name is required', 400);
  }

  const result = await appService.analyzeApp(params.appName);
  sendJson(res, result);
});

/**
 * GET /api/apps/:appName/preview - Get dry-run preview
 */
export const previewRemoval = asyncHandler(async (req, res, params) => {
  if (!params?.appName) {
    return sendError(res, 'App name is required', 400);
  }

  const result = await appService.previewRemoval(params.appName);
  sendJson(res, result);
});

/**
 * POST /api/apps/:appName/remove - Execute app removal
 */
export const removeApp = asyncHandler(async (req, res, params) => {
  if (!params?.appName) {
    return sendError(res, 'App name is required', 400);
  }

  const body = await parseBody(req);
  const options = {
    dryRun: body.dryRun || false,
    createBackup: body.createBackup || false,
  };

  const result = await removalService.removeApp(params.appName, options);
  sendJson(res, result);
});

/**
 * Route matcher and handler
 */
export function handleAppRoutes(
  method: string,
  pathname: string,
  req: IncomingMessage,
  res: ServerResponse
): boolean {
  // GET /api/apps/list
  if (method === 'GET' && pathname === '/api/apps/list') {
    listApps(req, res);
    return true;
  }

  // GET /api/apps/search
  if (method === 'GET' && pathname.startsWith('/api/apps/search')) {
    searchApps(req, res);
    return true;
  }

  // GET /api/apps/:appName/analysis
  if (method === 'GET' && matchPattern('/api/apps/:appName/analysis', pathname)) {
    const params = extractPathParams('/api/apps/:appName/analysis', pathname);
    analyzeApp(req, res, params);
    return true;
  }

  // GET /api/apps/:appName/preview
  if (method === 'GET' && matchPattern('/api/apps/:appName/preview', pathname)) {
    const params = extractPathParams('/api/apps/:appName/preview', pathname);
    previewRemoval(req, res, params);
    return true;
  }

  // POST /api/apps/:appName/remove
  if (method === 'POST' && matchPattern('/api/apps/:appName/remove', pathname)) {
    const params = extractPathParams('/api/apps/:appName/remove', pathname);
    removeApp(req, res, params);
    return true;
  }

  return false;
}
