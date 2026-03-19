export type Platform = 'darwin' | 'linux' | 'win32';

export type InstallMethod =
  | 'npm'
  | 'yarn'
  | 'pnpm'
  | 'brew'
  | 'apt'
  | 'yum'
  | 'dnf'
  | 'custom'
  | 'unknown';

export interface InstalledApp {
  name: string;
  version: string;
  installMethod: InstallMethod;
  mainPath: string;
  installedDate?: Date;
  size?: number;
}

export interface ArtifactPath {
  path: string;
  type: 'binary' | 'config' | 'cache' | 'log' | 'data' | 'service' | 'other';
  size: number;
  description: string;
}

export interface AppAnalysis {
  app: InstalledApp;
  artifacts: ArtifactPath[];
  totalSize: number;
  dependents?: string[];
}

export interface RemovalOptions {
  dryRun?: boolean;
  createBackup?: boolean;
  backupPath?: string;
  force?: boolean;
  userConsent?: boolean;
  reportFormat?: 'html' | 'text';
}

export interface RemovalResult {
  success: boolean;
  appName: string;
  removedFiles: number;
  freedSpace: number;
  backupPath?: string;
  errors?: string[];
}

export interface SearchOptions {
  query?: string;
  installMethod?: InstallMethod;
  sortBy?: 'name' | 'date' | 'size';
}
