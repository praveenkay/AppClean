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
  // List of known system utilities that should be excluded
  private readonly systemBinaries = new Set([
    '2to3', 'actool', 'afclip', 'arch', 'asa', 'awk', 'bash', 'basename',
    'bc', 'bdiff', 'bg', 'bison', 'cat', 'cc', 'chgrp', 'chmod', 'chown',
    'cksum', 'clang', 'cmake', 'codesign', 'comm', 'cp', 'cpp', 'cut',
    'date', 'dd', 'defaults', 'df', 'diff', 'diffstat', 'dill', 'dirname',
    'dmesg', 'du', 'ed', 'env', 'expand', 'expr', 'false', 'file', 'find',
    'flex', 'fold', 'fsync', 'gawk', 'gcc', 'gcov', 'gdb', 'getconf', 'getopt',
    'git', 'git-receive-pack', 'git-shell', 'git-upload-archive', 'git-upload-pack',
    'glob', 'gnumake', 'go', 'grep', 'gzip', 'head', 'hexdump', 'hostname',
    'id', 'install', 'ipcalc', 'join', 'kill', 'killall', 'lame', 'ld',
    'ldd', 'less', 'lex', 'link', 'ln', 'locale', 'localedef', 'locate',
    'logger', 'login', 'logname', 'ls', 'lsattr', 'lsof', 'lz4', 'make',
    'man', 'md5sum', 'mddigest', 'mknod', 'mmap', 'mount', 'mv', 'netstat',
    'nl', 'nm', 'nohup', 'od', 'openssl', 'paste', 'patch', 'pax', 'pbcopy',
    'pbpaste', 'perl', 'php', 'ping', 'pkill', 'plutil', 'printf', 'ps',
    'pwd', 'python', 'python3', 'python2', 'ranlib', 'realpath', 'renice',
    'rev', 'rm', 'rmdir', 'ruby', 'sed', 'seq', 'sh', 'shasum', 'shell_cmds',
    'sleep', 'sort', 'split', 'stat', 'strings', 'strip', 'sudo', 'sum',
    'swift', 'swiftc', 'tail', 'tar', 'tee', 'test', 'tic', 'touch', 'tr',
    'true', 'tsort', 'tty', 'uname', 'uncompress', 'uniq', 'unlink', 'unzip',
    'users', 'uuidgen', 'uuencode', 'uudecode', 'vchk', 'vis', 'wc', 'what',
    'whereis', 'which', 'while', 'whoami', 'whois', 'xargs', 'xcode-select',
    'xcodebuild', 'xml2-config', 'xmllint', 'xz', 'yes', 'zcat', 'zip', 'zsh',
    // PostScript and Ghostscript utilities
    'dvipdf', 'eps2eps', 'pdf2ps', 'ps2ascii', 'ps2epsi', 'ps2pdf', 'ps2pdf12',
    'ps2pdf13', 'ps2pdf14', 'ps2pdfwr', 'ps2ps', 'ps2ps2', 'pf2afm', 'pfbtopfa',
    'pphs', 'printafm', 'prlcopy', 'prlctl', 'prlexec', 'prlsrvctl', 'prl_convert',
    'prl_disk_tool', 'prl_perf_ctl',
    // Ghostscript
    'gsbj', 'gsdj', 'gsdj500', 'gslj', 'gslp', 'gsnd',
    // System scripts (shell scripts)
    'lprsetup.sh', 'unix-lpr.sh', 'uninstall-container.sh', 'update-container.sh',
  ]);

  async findCustomInstalledApps(): Promise<InstalledApp[]> {
    const apps: InstalledApp[] = [];
    const home = getHomeDir();

    // Only check user-installed binaries in ~/.local/bin and /usr/local/bin
    // Completely skip /usr/bin as it's all system utilities
    const customBinPaths = [
      '/usr/local/bin',
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

        // Skip known system binaries
        if (this.systemBinaries.has(binary)) continue;

        // Skip if it looks like a system binary
        if (await this.isSystemBinary(binary, fullPath)) {
          continue;
        }

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

    return apps;
  }

  private async isSystemBinary(binaryName: string, binaryPath: string): Promise<boolean> {
    try {
      const content = readFile(binaryPath);
      if (!content) {
        // Binary files don't have text content - likely compiled system binaries
        // We'll only accept text-based scripts (node, python, bash)
        return true;
      }

      // Check for common shebangs/markers that indicate user scripts
      if (content.includes('#!/usr/bin/env node') ||
          content.includes('#!/usr/bin/env python') ||
          content.includes('#!/bin/bash') ||
          content.includes('#!/bin/sh') ||
          content.includes('#!/usr/bin/env python3') ||
          content.includes('#!/usr/bin/perl')) {
        return false; // It's a user script
      }

      // If we can't identify it, assume it's a system binary
      return true;
    } catch {
      // If we can't read it, assume it's a system binary
      return true;
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
