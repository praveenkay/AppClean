/**
 * Help Page - Documentation and frequently asked questions
 */

export function renderHelp(): void {
  const container = document.getElementById('page-container');
  if (!container) return;

  renderHelpContent(container);
  window.scrollTo(0, 0);
}

/**
 * Render help content
 */
function renderHelpContent(container: HTMLElement): void {
  container.innerHTML = `
    <div class="help-page">
      <!-- Header -->
      <div style="margin-bottom: 2rem;">
        <h1 class="page-title">❓ Help & Documentation</h1>
        <p class="page-subtitle">Learn how to use AppClean effectively</p>
      </div>

      <!-- Getting Started Section -->
      <div class="card" style="margin-bottom: 2rem;">
        <div class="card-header">
          <h2 style="font-size: 1.25rem; font-weight: 700; margin: 0;">🚀 Getting Started</h2>
        </div>
        <div class="card-body">
          <div style="display: flex; flex-direction: column; gap: 1.5rem;">
            <div>
              <h3 style="font-weight: 600; margin: 0 0 0.5rem 0;">What is AppClean?</h3>
              <p style="margin: 0; color: var(--text-muted);">AppClean is an intelligent application remover that finds and safely uninstalls applications from your system, including all related files, configuration files, caches, and other artifacts that are often left behind by standard uninstallers.</p>
            </div>
            <div>
              <h3 style="font-weight: 600; margin: 0 0 0.5rem 0;">How do I find apps to remove?</h3>
              <p style="margin: 0; color: var(--text-muted);">Navigate to the <strong>Apps</strong> section using the sidebar. You'll see all installed applications detected on your system. Use the search bar to quickly find specific apps, or filter by installation method (npm, Homebrew, apt, etc.).</p>
            </div>
            <div>
              <h3 style="font-weight: 600; margin: 0 0 0.5rem 0;">How do I remove an application?</h3>
              <p style="margin: 0; color: var(--text-muted);">Click on an app in the list to view its details. This shows you all the files and directories that will be removed. Review the "Preview" to see what will be deleted, then click the <strong>Remove</strong> button to proceed. You'll be asked to confirm before any changes are made.</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Understanding the Dashboard -->
      <div class="card" style="margin-bottom: 2rem;">
        <div class="card-header">
          <h2 style="font-size: 1.25rem; font-weight: 700; margin: 0;">📊 Dashboard Overview</h2>
        </div>
        <div class="card-body">
          <div style="display: flex; flex-direction: column; gap: 1.5rem;">
            <div>
              <h3 style="font-weight: 600; margin: 0 0 0.5rem 0;">Stat Cards</h3>
              <p style="margin: 0; color: var(--text-muted);">The dashboard displays key statistics: total installed apps, total space used by applications, apps removed in the current session, and total space freed.</p>
            </div>
            <div>
              <h3 style="font-weight: 600; margin: 0 0 0.5rem 0;">System Health</h3>
              <p style="margin: 0; color: var(--text-muted);">Monitor your disk usage with a visual progress bar. Green indicates healthy usage (<80%), amber indicates caution (80-90%), and red indicates critical usage (>90%).</p>
            </div>
            <div>
              <h3 style="font-weight: 600; margin: 0 0 0.5rem 0;">Recent Activity</h3>
              <p style="margin: 0; color: var(--text-muted);">See a list of applications you've recently removed, including the date removed and space freed for each application.</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Installation Methods -->
      <div class="card" style="margin-bottom: 2rem;">
        <div class="card-header">
          <h2 style="font-size: 1.25rem; font-weight: 700; margin: 0;">📦 Installation Methods</h2>
        </div>
        <div class="card-body">
          <p style="margin: 0 0 1rem 0; color: var(--text-muted);">AppClean detects applications installed through various methods:</p>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem;">
            <div style="padding: 1rem; background: var(--bg-secondary); border-radius: 8px;">
              <p style="margin: 0; font-weight: 600; font-size: 0.875rem; color: #3b82f6;">npm</p>
              <p style="margin: 0.25rem 0 0 0; font-size: 0.875rem; color: var(--text-muted);">Node.js packages installed globally</p>
            </div>
            <div style="padding: 1rem; background: var(--bg-secondary); border-radius: 8px;">
              <p style="margin: 0; font-weight: 600; font-size: 0.875rem; color: #3b82f6;">Homebrew</p>
              <p style="margin: 0.25rem 0 0 0; font-size: 0.875rem; color: var(--text-muted);">Applications installed via Homebrew (macOS/Linux)</p>
            </div>
            <div style="padding: 1rem; background: var(--bg-secondary); border-radius: 8px;">
              <p style="margin: 0; font-weight: 600; font-size: 0.875rem; color: #3b82f6;">apt/yum/dnf</p>
              <p style="margin: 0.25rem 0 0 0; font-size: 0.875rem; color: var(--text-muted);">Linux package manager installations</p>
            </div>
            <div style="padding: 1rem; background: var(--bg-secondary); border-radius: 8px;">
              <p style="margin: 0; font-weight: 600; font-size: 0.875rem; color: #3b82f6;">Custom</p>
              <p style="margin: 0.25rem 0 0 0; font-size: 0.875rem; color: var(--text-muted);">Custom binaries and manual installations</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Safety & Best Practices -->
      <div class="card" style="margin-bottom: 2rem;">
        <div class="card-header">
          <h2 style="font-size: 1.25rem; font-weight: 700; margin: 0;">🛡️ Safety & Best Practices</h2>
        </div>
        <div class="card-body">
          <div style="display: flex; flex-direction: column; gap: 1.5rem;">
            <div>
              <h3 style="font-weight: 600; margin: 0 0 0.5rem 0; color: #10b981;">✓ Always Review Before Removing</h3>
              <p style="margin: 0; color: var(--text-muted);">Take a moment to review the file list that will be deleted. Make sure you're removing the correct application.</p>
            </div>
            <div>
              <h3 style="font-weight: 600; margin: 0 0 0.5rem 0; color: #10b981;">✓ Check Dependencies</h3>
              <p style="margin: 0; color: var(--text-muted);">Some applications might be required by other applications. If you're unsure, search for alternative uninstallers or use the AppClean preview feature first.</p>
            </div>
            <div>
              <h3 style="font-weight: 600; margin: 0 0 0.5rem 0; color: #10b981;">✓ Backup Important Data</h3>
              <p style="margin: 0; color: var(--text-muted);">If an application stored important data or configuration, back it up before removing the application.</p>
            </div>
            <div>
              <h3 style="font-weight: 600; margin: 0 0 0.5rem 0; color: #10b981;">✓ System Applications</h3>
              <p style="margin: 0; color: var(--text-muted);">Be cautious when removing system-level applications, as they may be critical to system stability.</p>
            </div>
          </div>
        </div>
      </div>

      <!-- FAQ Section -->
      <div class="card" style="margin-bottom: 2rem;">
        <div class="card-header">
          <h2 style="font-size: 1.25rem; font-weight: 700; margin: 0;">❓ Frequently Asked Questions</h2>
        </div>
        <div class="card-body">
          <div style="display: flex; flex-direction: column; gap: 1.5rem;">
            <div>
              <h3 style="font-weight: 600; margin: 0 0 0.5rem 0;">Q: Can I undo a removal?</h3>
              <p style="margin: 0; color: var(--text-muted);">A: Once files are deleted, they cannot be recovered through AppClean. Make sure to review the preview carefully before confirming removal. Consider backing up important data beforehand.</p>
            </div>
            <div>
              <h3 style="font-weight: 600; margin: 0 0 0.5rem 0;">Q: Why does AppClean show apps my system package manager doesn't?</h3>
              <p style="margin: 0; color: var(--text-muted);">A: AppClean scans your entire system for application files, binaries, and configurations. It finds apps installed through multiple methods and locations that traditional package managers might not track.</p>
            </div>
            <div>
              <h3 style="font-weight: 600; margin: 0 0 0.5rem 0;">Q: Is it safe to remove the files AppClean shows?</h3>
              <p style="margin: 0; color: var(--text-muted);">A: AppClean is designed to find all related application artifacts. However, we recommend reviewing the file list carefully. If you're unsure about any file, don't remove it.</p>
            </div>
            <div>
              <h3 style="font-weight: 600; margin: 0 0 0.5rem 0;">Q: How often is the app list updated?</h3>
              <p style="margin: 0; color: var(--text-muted);">A: The app list is loaded fresh each time you navigate to the Apps section, ensuring you always see current application information.</p>
            </div>
            <div>
              <h3 style="font-weight: 600; margin: 0 0 0.5rem 0;">Q: Can I use AppClean to remove system applications?</h3>
              <p style="margin: 0; color: var(--text-muted);">A: Yes, but with caution. System applications may be essential to system stability. We recommend researching before removing any system-level applications.</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Links -->
      <div class="card">
        <div class="card-header">
          <h2 style="font-size: 1.25rem; font-weight: 700; margin: 0;">🔗 Resources</h2>
        </div>
        <div class="card-body">
          <div style="display: flex; flex-direction: column; gap: 0.75rem;">
            <a href="https://github.com/praveenkay/AppClean" target="_blank" rel="noopener" style="color: #3b82f6; text-decoration: none; font-weight: 500;">
              📖 GitHub Repository - Visit the project page
            </a>
            <a href="https://github.com/praveenkay/AppClean/issues" target="_blank" rel="noopener" style="color: #3b82f6; text-decoration: none; font-weight: 500;">
              🐛 Report Issues - Found a bug? Let us know
            </a>
            <a href="https://www.npmjs.com/package/appclean" target="_blank" rel="noopener" style="color: #3b82f6; text-decoration: none; font-weight: 500;">
              📦 npm Package - Install or update AppClean
            </a>
          </div>
        </div>
      </div>
    </div>
  `;
}

/**
 * Escape HTML to prevent XSS
 */
function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}
