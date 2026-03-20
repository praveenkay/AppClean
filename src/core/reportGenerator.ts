import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
import { RemovalRecord, DeletedArtifact } from './removalRecorder.js';
import { formatBytes, formatDate } from '../utils/logger.js';

export const REMOVAL_DISCLAIMER = `
╔════════════════════════════════════════════════════════════════════════════╗
║                                                                            ║
║                    ⚠️  IMPORTANT DISCLAIMER ⚠️                             ║
║                                                                            ║
║  AppClean is provided "AS IS" without any warranties or representations.   ║
║                                                                            ║
║  By using this tool, you acknowledge and agree that:                      ║
║                                                                            ║
║  1. AppClean provides functionality to detect and remove applications      ║
║     and their associated files from your system.                          ║
║                                                                            ║
║  2. Data deletion is PERMANENT and IRREVERSIBLE. Please ensure you have    ║
║     created backups of any important data before using this tool.         ║
║                                                                            ║
║  3. While AppClean aims to be accurate, it may not detect all files       ║
║     or may encounter errors during deletion. Some files may remain        ║
║     orphaned on your system despite successful removal.                   ║
║                                                                            ║
║  4. AppClean developers and maintainers assume NO LIABILITY or             ║
║     RESPONSIBILITY for any data loss, system damage, or any other         ║
║     consequences arising from the use of this tool.                       ║
║                                                                            ║
║  5. You are solely responsible for verifying the safety of removal        ║
║     operations before execution and for maintaining your own backups.     ║
║                                                                            ║
║  6. By proceeding with app removal, you confirm that you understand       ║
║     and accept these terms and conditions.                                ║
║                                                                            ║
╚════════════════════════════════════════════════════════════════════════════╝
`;

export class ReportGenerator {
  /**
   * Generate HTML report
   */
  static generateHTMLReport(record: RemovalRecord): string {
    const timestamp = formatDate(record.timestamp);
    const totalFreed = formatBytes(record.totalSpaceFreed);

    let html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AppClean Removal Report - ${record.appName}</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            margin: 0;
            padding: 20px;
            background: #f5f5f5;
            color: #333;
        }
        .container {
            max-width: 900px;
            margin: 0 auto;
            background: white;
            padding: 30px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        h1 {
            color: #2c3e50;
            border-bottom: 3px solid #3b82f6;
            padding-bottom: 10px;
        }
        h2 {
            color: #34495e;
            margin-top: 30px;
        }
        .summary {
            background: #f8f9fa;
            padding: 20px;
            border-left: 4px solid #3b82f6;
            margin: 20px 0;
            border-radius: 4px;
        }
        .summary-item {
            margin: 10px 0;
        }
        .summary-label {
            font-weight: bold;
            color: #2c3e50;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
        }
        th {
            background: #3b82f6;
            color: white;
            padding: 12px;
            text-align: left;
            font-weight: 600;
        }
        td {
            padding: 12px;
            border-bottom: 1px solid #e0e0e0;
        }
        tr:hover {
            background: #f5f5f5;
        }
        .status-deleted {
            background: #d4edda;
            color: #155724;
            padding: 4px 8px;
            border-radius: 4px;
        }
        .status-failed {
            background: #f8d7da;
            color: #721c24;
            padding: 4px 8px;
            border-radius: 4px;
        }
        .status-skipped {
            background: #fff3cd;
            color: #856404;
            padding: 4px 8px;
            border-radius: 4px;
        }
        .disclaimer {
            background: #fff3cd;
            border: 2px solid #ff6b6b;
            padding: 20px;
            margin: 20px 0;
            border-radius: 4px;
            color: #721c24;
        }
        .disclaimer h3 {
            margin-top: 0;
            color: #721c24;
        }
        .footer {
            text-align: center;
            color: #7f8c8d;
            font-size: 12px;
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #e0e0e0;
        }
        .success {
            color: #27ae60;
        }
        .warning {
            color: #e67e22;
        }
        .error {
            color: #e74c3c;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>📋 AppClean Removal Report</h1>

        <div class="summary">
            <div class="summary-item">
                <span class="summary-label">Application:</span> ${record.appName}
            </div>
            <div class="summary-item">
                <span class="summary-label">Installation Method:</span> ${record.installMethod}
            </div>
            <div class="summary-item">
                <span class="summary-label">Removal Date:</span> ${timestamp}
            </div>
            <div class="summary-item">
                <span class="summary-label">User Consent:</span>
                <span class="${record.userConsent ? 'success' : 'error'}">
                    ${record.userConsent ? '✓ Yes' : '✗ No'}
                </span>
            </div>
            <div class="summary-item">
                <span class="summary-label">Completion Status:</span>
                <span class="${record.completionStatus === 'success' ? 'success' : record.completionStatus === 'partial' ? 'warning' : 'error'}">
                    ${record.completionStatus.toUpperCase()}
                </span>
            </div>
            <div class="summary-item">
                <span class="summary-label">Verification Status:</span>
                <span class="${record.verificationStatus === 'verified_removed' ? 'success' : 'warning'}">
                    ${record.verificationStatus.replace(/_/g, ' ').toUpperCase()}
                </span>
            </div>
            <div class="summary-item">
                <span class="summary-label">Total Space Freed:</span>
                <span class="success">${totalFreed}</span>
            </div>
        </div>

        <h2>Deletion Details</h2>
        <table>
            <thead>
                <tr>
                    <th>File/Folder</th>
                    <th>Type</th>
                    <th>Size</th>
                    <th>Status</th>
                </tr>
            </thead>
            <tbody>
                ${record.artifactsDeleted
                  .map(
                    (artifact) => `
                    <tr>
                        <td><code>${artifact.path}</code></td>
                        <td>${artifact.type}</td>
                        <td>${formatBytes(artifact.size)}</td>
                        <td>
                            <span class="status-${artifact.status}">
                                ${artifact.status.toUpperCase()}
                                ${artifact.errorMessage ? ` - ${artifact.errorMessage}` : ''}
                            </span>
                        </td>
                    </tr>
                `
                  )
                  .join('')}
            </tbody>
        </table>

        <div class="disclaimer">
            <h3>⚠️ DISCLAIMER & NO LIABILITY NOTICE</h3>
            <p>
                <strong>IMPORTANT:</strong> AppClean is provided "AS IS" without any warranties or representations.
                This report documents the data removal operations performed by AppClean.
            </p>
            <p>
                <strong>By using AppClean, you acknowledge that:</strong>
            </p>
            <ol>
                <li>Data deletion is PERMANENT and IRREVERSIBLE</li>
                <li>AppClean developers assume NO LIABILITY for any data loss</li>
                <li>You are responsible for maintaining your own backups</li>
                <li>Some files may remain orphaned despite successful removal</li>
                <li>You have reviewed and consented to all removal operations</li>
            </ol>
            <p>
                <strong>AppClean is NOT responsible for any consequences arising from the use of this tool.</strong>
            </p>
        </div>

        <div class="footer">
            <p>Generated by AppClean v1.1.0 | Report timestamp: ${new Date().toISOString()}</p>
            <p>For support, visit: https://github.com/praveenkay/AppClean</p>
        </div>
    </div>
</body>
</html>
    `;

    return html;
  }

  /**
   * Generate text report
   */
  static generateTextReport(record: RemovalRecord): string {
    const timestamp = formatDate(record.timestamp);
    const totalFreed = formatBytes(record.totalSpaceFreed);

    let report = `
═══════════════════════════════════════════════════════════════════════════════
                    📋 APPCLEAN REMOVAL REPORT
═══════════════════════════════════════════════════════════════════════════════

SUMMARY
──────────────────────────────────────────────────────────────────────────────
Application:           ${record.appName}
Installation Method:   ${record.installMethod}
Removal Date:          ${timestamp}
User Consent:          ${record.userConsent ? '✓ Yes' : '✗ No'}
Completion Status:     ${record.completionStatus.toUpperCase()}
Verification Status:   ${record.verificationStatus.replace(/_/g, ' ').toUpperCase()}
Total Space Freed:     ${totalFreed}

DELETED FILES & FOLDERS
──────────────────────────────────────────────────────────────────────────────
`;

    record.artifactsDeleted.forEach((artifact, index) => {
      report += `\n${index + 1}. ${artifact.path}
   Type:     ${artifact.type}
   Size:     ${formatBytes(artifact.size)}
   Status:   ${artifact.status.toUpperCase()}`;

      if (artifact.errorMessage) {
        report += `\n   Error:    ${artifact.errorMessage}`;
      }
    });

    report += `\n\n${REMOVAL_DISCLAIMER}`;

    report += `

═══════════════════════════════════════════════════════════════════════════════
                              END OF REPORT
═══════════════════════════════════════════════════════════════════════════════

Generated by AppClean v1.1.0
Timestamp: ${new Date().toISOString()}
For support, visit: https://github.com/praveenkay/AppClean
`;

    return report;
  }

  /**
   * Save report to file
   */
  static saveReport(record: RemovalRecord, format: 'html' | 'text' = 'html'): string {
    const home = path.resolve(process.env.HOME || '/root');
    const reportsDir = path.join(home, '.appclean-reports');

    // Create reports directory
    if (!fs.existsSync(reportsDir)) {
      fs.mkdirSync(reportsDir, { recursive: true });
    }

    const timestamp = record.timestamp.getTime();
    const filename = `${record.appName}-removal-${timestamp}.${format === 'html' ? 'html' : 'txt'}`;
    const filepath = path.join(reportsDir, filename);

    const content = format === 'html'
      ? this.generateHTMLReport(record)
      : this.generateTextReport(record);

    fs.writeFileSync(filepath, content, 'utf-8');

    return filepath;
  }

  /**
   * Display report in console
   */
  static displayReport(record: RemovalRecord): void {
    console.log(chalk.cyan(REMOVAL_DISCLAIMER));
    console.log('\n' + chalk.bold('Removal Summary:'));
    console.log(chalk.gray(`  App: ${record.appName}`));
    console.log(chalk.gray(`  Method: ${record.installMethod}`));
    console.log(chalk.gray(`  Timestamp: ${formatDate(record.timestamp)}`));
    console.log(chalk.gray(`  Space Freed: ${formatBytes(record.totalSpaceFreed)}`));
    console.log(chalk.gray(`  Status: ${record.completionStatus.toUpperCase()}`));
    console.log(chalk.gray(`  Verification: ${record.verificationStatus.replace(/_/g, ' ').toUpperCase()}`));
  }
}
