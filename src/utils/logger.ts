import chalk from 'chalk';

export class Logger {
  static info(message: string): void {
    console.log(chalk.blue('ℹ'), message);
  }

  static success(message: string): void {
    console.log(chalk.green('✓'), message);
  }

  static warn(message: string): void {
    console.log(chalk.yellow('⚠'), message);
  }

  static error(message: string): void {
    console.log(chalk.red('✗'), message);
  }

  static debug(message: string): void {
    if (process.env.DEBUG) {
      console.log(chalk.gray('🐛'), message);
    }
  }

  static table(data: any[]): void {
    console.table(data);
  }

  static space(): void {
    console.log('');
  }
}

export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';

  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export function formatDate(date: Date | undefined): string {
  if (!date) return 'Unknown';
  return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
}
