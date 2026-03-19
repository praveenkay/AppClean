import path from 'path';
import { getHomeDir } from '../utils/platform';
import {
  pathExists,
  listDirectory,
  readFile,
  listDirectoryDeep,
} from '../utils/filesystem';
import { InstalledApp, ArtifactPath } from '../types';

export class CustomManager {
  async findCustomInstalledApps(): Promise<InstalledApp[]> {
    const apps: InstalledApp[] = [];
    const home = getHomeDir();

    const customBinPaths = [
      '/usr/local/bin',
      '/usr/bin',
      `${home}/.local/bin`,
    ];

    const foundBinaries = new Set<string>();

    for (const binPath of customBinPaths) {
      if (!pathExists(binPath)) continue;

      const binaries = listDirectory(binPath);
      for (const binary of binaries) {
        const fullPath = path.join(binPath, binary);

        // Skip if already found
        if (foundBinaries.has(binary)) continue;

        // Try to detect installation method from the binary
        const method = await this.detectInstallMethod(fullPath);

        // Only add if it looks like a custom install (not from system)
        if (method === 'custom') {
          foundBinaries.add(binary);
          apps.push({
            name: binary,
            version: 'unknown',
            installMethod: 'custom',
            mainPath: fullPath,
            installedDate: undefined,
          });
        }
      }
    }

    return apps;
  }

  private async detectInstallMethod(binaryPath: string): Promise<string> {
    try {
      const content = readFile(binaryPath);
      if (!content) return 'unknown';

      // Check for common shebangs/markers
      if (content.includes('node') || content.includes('#!/usr/bin/env node')) {
        return 'custom'; // Custom node script
      }

      if (content.includes('python') || content.includes('#!/usr/bin/env python')) {
        return 'custom'; // Custom python script
      }

      if (content.startsWith('#!/bin/bash') || content.startsWith('#!/bin/sh')) {
        return 'custom'; // Shell script
      }

      return 'custom';
    } catch {
      return 'unknown';
    }
  }

  async findArtifacts(appName: string): Promise<ArtifactPath[]> {
    const artifacts: ArtifactPath[] = [];
    const home = getHomeDir();

    // Search in common binary locations
    const binPaths = [
      `/usr/local/bin/${appName}`,
      `/usr/bin/${appName}`,
      `${home}/.local/bin/${appName}`,
    ];

    for (const binPath of binPaths) {
      if (pathExists(binPath)) {
        artifacts.push({
          path: binPath,
          type: 'binary',
          size: 0,
          description: 'Custom binary',
        });
      }
    }

    // Search for config files
    const configPatterns = [
      path.join(home, `.config`, appName),
      path.join(home, `.${appName}`),
      path.join(home, `.${appName}rc`),
      path.join(home, `.${appName}rc.json`),
    ];

    for (const configPath of configPatterns) {
      if (pathExists(configPath)) {
        artifacts.push({
          path: configPath,
          type: 'config',
          size: 0,
          description: 'Configuration',
        });
      }
    }

    // Search for data files
    const dataPath = path.join(home, `.local`, `share`, appName);
    if (pathExists(dataPath)) {
      artifacts.push({
        path: dataPath,
        type: 'data',
        size: 0,
        description: 'Data directory',
      });
    }

    // Search for cache
    const cachePath = path.join(home, `.cache`, appName);
    if (pathExists(cachePath)) {
      artifacts.push({
        path: cachePath,
        type: 'cache',
        size: 0,
        description: 'Cache directory',
      });
    }

    return artifacts;
  }

  async searchByName(query: string): Promise<string[]> {
    const results: string[] = [];
    const home = getHomeDir();

    const binPaths = [
      '/usr/local/bin',
      '/usr/bin',
      `${home}/.local/bin`,
    ];

    for (const binPath of binPaths) {
      if (!pathExists(binPath)) continue;

      const binaries = listDirectory(binPath);
      for (const binary of binaries) {
        if (binary.toLowerCase().includes(query.toLowerCase())) {
          results.push(binary);
        }
      }
    }

    return results;
  }
}
