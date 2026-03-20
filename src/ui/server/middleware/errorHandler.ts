/**
 * Error Handler Middleware
 */

import { IncomingMessage, ServerResponse } from 'http';

export interface ApiError {
  success: false;
  error: string;
  statusCode?: number;
}

export interface ApiSuccess<T> {
  success: true;
  data: T;
}

export type ApiResponse<T> = ApiSuccess<T> | ApiError;

/**
 * Send JSON response
 */
export function sendJson<T>(
  res: ServerResponse,
  data: T,
  statusCode = 200
): void {
  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  const response: ApiSuccess<T> = {
    success: true,
    data,
  };

  res.end(JSON.stringify(response));
}

/**
 * Send error response
 */
export function sendError(
  res: ServerResponse,
  message: string,
  statusCode = 400
): void {
  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');

  const response: ApiError = {
    success: false,
    error: message,
    statusCode,
  };

  res.end(JSON.stringify(response));
}

/**
 * Parse URL query parameters
 */
export function parseQueryParams(url: string): Record<string, string> {
  const params: Record<string, string> = {};
  const queryStart = url.indexOf('?');

  if (queryStart === -1) return params;

  const queryString = url.substring(queryStart + 1);
  const pairs = queryString.split('&');

  pairs.forEach((pair) => {
    const [key, value] = pair.split('=');
    if (key) {
      params[decodeURIComponent(key)] = decodeURIComponent(value || '');
    }
  });

  return params;
}

/**
 * Parse URL path and extract parameters
 * Example: /api/apps/:appName with path /api/apps/myapp returns { appName: 'myapp' }
 */
export function extractPathParams(
  pattern: string,
  path: string
): Record<string, string> | null {
  const patternParts = pattern.split('/').filter(Boolean);
  const pathParts = path.split('/').filter(Boolean);

  if (patternParts.length !== pathParts.length) {
    return null;
  }

  const params: Record<string, string> = {};

  for (let i = 0; i < patternParts.length; i++) {
    const patternPart = patternParts[i];

    if (patternPart.startsWith(':')) {
      const paramName = patternPart.slice(1);
      params[paramName] = decodeURIComponent(pathParts[i]);
    } else if (patternPart !== pathParts[i]) {
      return null;
    }
  }

  return params;
}

/**
 * Parse request body as JSON
 */
export function parseBody(req: IncomingMessage): Promise<any> {
  return new Promise((resolve, reject) => {
    let data = '';

    req.on('data', (chunk) => {
      data += chunk;
      // Prevent abuse: reject if body > 1MB
      if (data.length > 1024 * 1024) {
        reject(new Error('Request body too large'));
      }
    });

    req.on('end', () => {
      try {
        resolve(data ? JSON.parse(data) : {});
      } catch (error) {
        reject(new Error('Invalid JSON'));
      }
    });

    req.on('error', reject);
  });
}

/**
 * Match URL pattern
 */
export function matchPattern(pattern: string, url: string): boolean {
  const patternParts = pattern.split('/').filter(Boolean);
  const urlParts = url.split('/').filter(Boolean);

  if (patternParts.length !== urlParts.length) {
    return false;
  }

  return patternParts.every((part, i) => {
    return part.startsWith(':') || part === urlParts[i];
  });
}

/**
 * Async route handler wrapper
 */
export function asyncHandler(
  handler: (req: IncomingMessage, res: ServerResponse, params?: any) => Promise<void>
) {
  return async (req: IncomingMessage, res: ServerResponse, params?: any) => {
    try {
      await handler(req, res, params);
    } catch (error) {
      console.error('Route handler error:', error);
      const message = (error as Error).message || 'Internal server error';
      sendError(res, message, 500);
    }
  };
}
