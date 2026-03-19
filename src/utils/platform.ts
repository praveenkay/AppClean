import os from 'os';
import { Platform } from '../types';

export function getPlatform(): Platform {
  return (os.platform() as Platform);
}

export function isMacOS(): boolean {
  return getPlatform() === 'darwin';
}

export function isLinux(): boolean {
  return getPlatform() === 'linux';
}

export function isWindows(): boolean {
  return getPlatform() === 'win32';
}

export function getHomeDir(): string {
  return os.homedir();
}

export function getConfigDir(): string {
  const platform = getPlatform();
  const home = getHomeDir();

  switch (platform) {
    case 'darwin':
      return home;
    case 'linux':
      return home;
    case 'win32':
      return process.env.APPDATA || home;
    default:
      return home;
  }
}

export function getCommonPaths(subpath: string): string[] {
  const platform = getPlatform();
  const home = getHomeDir();
  const paths: string[] = [];

  switch (platform) {
    case 'darwin':
      paths.push(`${home}/.config/${subpath}`);
      paths.push(`${home}/Library/Application Support/${subpath}`);
      paths.push(`${home}/Library/Preferences/${subpath}`);
      paths.push(`${home}/Library/Caches/${subpath}`);
      paths.push(`${home}/Library/Logs/${subpath}`);
      paths.push(`${home}/.${subpath}`);
      break;

    case 'linux':
      paths.push(`${home}/.config/${subpath}`);
      paths.push(`${home}/.local/share/${subpath}`);
      paths.push(`${home}/.cache/${subpath}`);
      paths.push(`${home}/.${subpath}`);
      paths.push(`/var/log/${subpath}`);
      paths.push(`/usr/local/etc/${subpath}`);
      paths.push(`/etc/${subpath}`);
      break;

    case 'win32':
      const appData = process.env.APPDATA || `${home}\\AppData\\Roaming`;
      const localAppData = process.env.LOCALAPPDATA || `${home}\\AppData\\Local`;
      paths.push(`${appData}\\${subpath}`);
      paths.push(`${localAppData}\\${subpath}`);
      paths.push(`${home}\\.${subpath}`);
      break;
  }

  return paths;
}
