import fs from 'fs';
import path from 'path';

export function getFileSize(filePath: string): number {
  try {
    const stats = fs.statSync(filePath);
    if (stats.isDirectory()) {
      return getDirectorySize(filePath);
    }
    return stats.size;
  } catch {
    return 0;
  }
}

export function getDirectorySize(dirPath: string): number {
  try {
    let size = 0;
    const files = fs.readdirSync(dirPath, { withFileTypes: true });

    for (const file of files) {
      const fullPath = path.join(dirPath, file.name);
      if (file.isDirectory()) {
        size += getDirectorySize(fullPath);
      } else {
        const stats = fs.statSync(fullPath);
        size += stats.size;
      }
    }
    return size;
  } catch {
    return 0;
  }
}

export function pathExists(filePath: string): boolean {
  return fs.existsSync(filePath);
}

export function isDirectory(filePath: string): boolean {
  try {
    return fs.statSync(filePath).isDirectory();
  } catch {
    return false;
  }
}

export function isFile(filePath: string): boolean {
  try {
    return fs.statSync(filePath).isFile();
  } catch {
    return false;
  }
}

export function listDirectory(dirPath: string): string[] {
  try {
    return fs.readdirSync(dirPath);
  } catch {
    return [];
  }
}

export function listDirectoryDeep(
  dirPath: string,
  maxDepth: number = 5,
  currentDepth: number = 0
): string[] {
  const files: string[] = [];

  if (currentDepth >= maxDepth) return files;

  try {
    const entries = fs.readdirSync(dirPath, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dirPath, entry.name);

      try {
        // Skip symlinks and permission issues
        if (entry.isSymbolicLink()) continue;

        files.push(fullPath);

        if (entry.isDirectory() && currentDepth < maxDepth - 1) {
          files.push(...listDirectoryDeep(fullPath, maxDepth, currentDepth + 1));
        }
      } catch {
        // Skip entries that can't be accessed
        continue;
      }
    }
  } catch {
    return files;
  }

  return files;
}

export function deleteFile(filePath: string): boolean {
  try {
    fs.unlinkSync(filePath);
    return true;
  } catch {
    return false;
  }
}

export function deleteDirectory(dirPath: string): boolean {
  try {
    fs.rmSync(dirPath, { recursive: true, force: true });
    return true;
  } catch {
    return false;
  }
}

export function readFile(filePath: string): string | null {
  try {
    return fs.readFileSync(filePath, 'utf-8');
  } catch {
    return null;
  }
}

export function writeFile(filePath: string, content: string): boolean {
  try {
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(filePath, content, 'utf-8');
    return true;
  } catch {
    return false;
  }
}

export function getModificationTime(filePath: string): Date | null {
  try {
    return fs.statSync(filePath).mtime;
  } catch {
    return null;
  }
}
