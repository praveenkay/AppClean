<div align="center">
  <img src="https://raw.githubusercontent.com/praveenkay/AppClean/main/assets/logo.svg" alt="AppClean - Intelligent Application Uninstaller" width="150" height="150">

  # AppClean 🧹

  **Intelligently find and safely uninstall applications with all their artifacts**

  [![version](https://img.shields.io/badge/version-2.0.3-blue?style=flat-square)](https://github.com/praveenkay/AppClean/releases/tag/v2.0.3)
  [![license](https://img.shields.io/badge/license-MIT-green?style=flat-square)](LICENSE)
  [![platforms](https://img.shields.io/badge/platforms-macOS%20%7C%20Linux%20%7C%20Windows-blue?style=flat-square)](#platform-support)
  [![npm](https://img.shields.io/npm/dm/appclean?style=flat-square)](https://npmjs.com/package/appclean)

  **A powerful, cross-platform tool for developers, system administrators, and everyone**

</div>

---

## What is AppClean?

AppClean is an intelligent application uninstaller that completely removes apps from your system along with all their hidden files, configurations, caches, and leftover data. It supports apps installed via npm, Homebrew, apt, yum, and custom installers across macOS, Linux, and Windows.

### Why AppClean?
- 🎯 **Complete Removal** - Finds and removes all app-related files, not just the executable
- 🛡️ **Safe & Smart** - Preview what will be deleted before confirming
- 💾 **Backup Option** - Create backups before removal for peace of mind
- 🎨 **Beautiful Interface** - Modern GUI makes app management easy for everyone
- ⚡ **Fast & Efficient** - ~50KB bundle, <100ms API responses
- 🔌 **Programmable** - Full REST API for automation and integration

---

## ✨ What's New in v2.0.3

### Latest Updates
- 📚 **Help & Documentation** - Comprehensive Help section with guides, FAQ, and best practices
- 🏷️ **Version Badge** - Quick version reference displayed in the navbar header
- 🔧 **Safari Compatibility** - Improved mobile and tablet browser support with meta tag optimizations
- 🎨 **Professional Logo** - Refined broom + checkmark logo across all platforms

### Previous Features (v2.0.0+)
- 🎨 **Beautiful SPA Interface** - Clean, minimal design with dark mode support
- 📊 **Dashboard** - System statistics, disk usage gauge, recent activity log
- 🔍 **Smart App Search** - Fuzzy search, filter by installation method, sort by name/size/date
- 📂 **Detailed Analysis** - Visual artifacts list, size breakdown pie chart, category breakdown
- 👁️ **Preview Mode** - See exactly what will be deleted before confirming
- 🛡️ **Safe Removal** - Dual confirmation dialogs, optional backup creation
- 🌙 **Dark Mode** - Beautiful theme with persistent preference
- 🔌 **REST API** - Full API endpoints for integration
- ⚡ **High Performance** - ~50KB gzipped, <100ms API response time

---

## Quick Start

### 1. Install AppClean

```bash
npm install -g appclean@2.0.3
```

### 2. Launch the GUI (Recommended)

```bash
appclean gui
```

Then open **http://localhost:3000** in your browser.

### 3. Or Use the CLI

```bash
# List all apps
appclean list

# Search for an app
appclean search <app-name>

# Analyze app and artifacts
appclean analyze <app-name>

# Remove app (with confirmation)
appclean remove <app-name>
```

---

## Features

### 🎨 Modern GUI Interface

**Dashboard View**
- 📊 Total apps, total space used, session metrics
- 💾 Real-time disk usage gauge with health indicators
- 📜 Recent activity log showing removed apps
- 🚀 Quick action buttons

**App Discovery (`#/apps`)**
- 🔍 Real-time search with fuzzy matching
- 🏷️ Filter by installation method (npm, Homebrew, apt, yum, custom)
- 📊 Sort by name, size, or date installed
- 📦 Visual app cards with version and size
- 📄 Infinite scroll pagination

**App Analysis (`#/apps/:appName`)**
- 📂 Complete artifact listing with file paths
- 📈 Visual pie chart showing size breakdown
- 📋 Category breakdown (binaries, configs, caches, data, logs)
- 👁️ Preview mode showing what will be deleted
- 🗑️ Safe removal with dual confirmation
- 💾 Optional backup creation before removal

**Settings**
- 🔄 Version checking and update notifications
- 🚀 One-click upgrade to latest version
- 🎨 Theme toggle (light/dark mode)
- ℹ️ About section with documentation
- ⚠️ Danger zone for uninstalling AppClean

### 💻 Powerful CLI

**Find Apps**
- Detect apps from npm, yarn, pnpm, Homebrew, apt, yum, dnf
- Search by name with instant results
- Show app version and installation method

**Analyze**
- Find all related files (binaries, configs, caches, logs)
- See how much space each app uses
- Preview what will be deleted before removing

**Remove Safely**
- Dry-run mode to preview first
- Backup option before deletion
- Confirmation prompts to prevent accidents
- Error reporting for failed deletions

**Manage**
- Check for updates: `appclean check-update`
- Upgrade automatically: `appclean upgrade`
- Uninstall AppClean: `appclean uninstall`

---

## GUI vs CLI

| Feature | GUI | CLI |
|---------|-----|-----|
| **User-Friendly** | ✅ Great for everyone | ✅ Great for power users |
| **Visuals** | ✅ Charts, cards, animations | ❌ Text-based |
| **Speed** | ✅ Fast with API | ✅ Very fast |
| **Automation** | ❌ Interactive | ✅ Scriptable |
| **Remote Access** | ✅ Via network | ❌ Local only |
| **Learning Curve** | ✅ Minimal | ⚠️ Moderate |

**Recommendation**: Use the GUI for discovery and management, CLI for scripting and automation.

---

## Common Tasks

### Using the GUI

```bash
# Start the GUI
appclean gui

# Open http://localhost:3000
# Then:
# 1. Click "Apps" to browse installed applications
# 2. Search for an app by name
# 3. Click app card to see details
# 4. Click "Preview Removal" to see what will be deleted
# 5. Click "Remove App" to uninstall (with confirmation)
```

### Using the CLI

```bash
# Find and remove an app
appclean search firefox
appclean analyze firefox
appclean remove firefox --dry-run  # Preview first
appclean remove firefox             # Actually remove

# Remove multiple apps
appclean list
appclean remove <app1>
appclean remove <app2>

# Backup before removing
appclean remove <app-name> --backup

# Use without confirmation
appclean remove <app-name> --force
```

---

## All Commands

### GUI Server
```bash
appclean gui                 # Start GUI on port 3000
appclean gui --port 8080    # Use custom port
```

### Search & List
```bash
appclean search <query>     # Find apps by name
appclean list               # Show all installed apps
appclean analyze <app>      # View app details and files
```

### Remove Apps
```bash
appclean remove <app>                # Remove app (with confirmation)
appclean remove <app> --dry-run      # Preview only
appclean remove <app> --backup       # Create backup first
appclean remove <app> --force        # Skip confirmation
```

### Update AppClean
```bash
appclean upgrade            # Update to latest version
appclean check-update       # Check for updates
appclean --version          # Show current version
```

### Uninstall
```bash
appclean uninstall          # Remove AppClean (with confirmation)
appclean uninstall --force  # Remove without confirmation
```

---

## API Documentation

The GUI server provides a REST API for integration with other tools.

### Base URL
```
http://localhost:3000
```

### Endpoints

**Get Dashboard Statistics**
```bash
curl http://localhost:3000/api/dashboard/stats
```

Response:
```json
{
  "success": true,
  "data": {
    "totalApps": 99,
    "totalSpaceUsed": 4236604496,
    "sessionAppsRemoved": 0,
    "sessionSpaceFreed": 0,
    "diskUsagePercent": 12,
    "recentlyRemoved": []
  }
}
```

**List Applications**
```bash
curl 'http://localhost:3000/api/apps/list?limit=20&offset=0'
```

Response:
```json
{
  "success": true,
  "data": {
    "apps": [...],
    "total": 99,
    "page": 1,
    "pageSize": 20
  }
}
```

**Search Applications**
```bash
curl 'http://localhost:3000/api/apps/search?q=node&method=npm&sort=name'
```

**Analyze Application**
```bash
curl 'http://localhost:3000/api/apps/node/analysis'
```

Response:
```json
{
  "success": true,
  "data": {
    "app": {...},
    "artifacts": [...],
    "totalSize": 52428800,
    "breakdown": {
      "binaries": 5000000,
      "configs": 2000000,
      "caches": 45000000,
      "data": 100000,
      "logs": 328800
    }
  }
}
```

**Remove Application**
```bash
curl -X POST 'http://localhost:3000/api/apps/node/remove' \
  -H 'Content-Type: application/json' \
  -d '{"dryRun": false, "createBackup": true}'
```

**Check Version**
```bash
curl 'http://localhost:3000/api/version'
```

**Upgrade AppClean**
```bash
curl -X POST 'http://localhost:3000/api/upgrade'
```

**Uninstall AppClean**
```bash
curl -X POST 'http://localhost:3000/api/uninstall'
```

---

## Examples

### Remove Node.js package globally
```bash
# Using GUI: Click on app → Preview → Remove
# Using CLI:
appclean remove express
```

### Remove Homebrew app
```bash
# Using GUI: Search "spotify" → Click → Remove
# Using CLI:
appclean remove spotify
```

### Remove system package
```bash
# Using GUI: Search "vim" → Filter by apt → Click → Remove
# Using CLI:
sudo appclean remove vim
```

### Preview before removing
```bash
# Using GUI: Click "Preview Removal" button
# Using CLI:
appclean remove chrome --dry-run
# Review output, then:
appclean remove chrome
```

### Create backup before removing
```bash
# Using GUI: Automatic backup option is shown
# Using CLI:
appclean remove myapp --backup
```

### Use custom GUI port
```bash
appclean gui --port 8080
# Open http://localhost:8080
```

---

## What Gets Removed?

AppClean intelligently finds and removes:

- ✓ Application binaries and executables
- ✓ Configuration files (`.config`, `.local`, etc)
- ✓ Cache directories and files
- ✓ Log files and directories
- ✓ Data files and user data
- ✓ Launch agents/daemons (macOS)
- ✓ Systemd services (Linux)
- ✓ Man pages and documentation
- ✓ Package manager metadata

---

## Platform Support

| Feature | macOS | Linux | Windows |
|---------|-------|-------|---------|
| **npm/yarn/pnpm** | ✓ | ✓ | ✓ |
| **Homebrew** | ✓ | ✓ | - |
| **apt/yum/dnf** | - | ✓ | - |
| **GUI** | ✓ | ✓ | ✓ |
| **CLI** | ✓ | ✓ | ✓ |
| **Custom apps** | ✓ | ✓ | ✓ |

---

## Architecture

### Technology Stack

**GUI (Client)**
- ES2020 JavaScript modules
- Hash-based SPA routing
- Event-driven state management
- CSS with design tokens and animations
- Responsive layout (Flexbox, Grid)

**Server**
- Native Node.js HTTP module (no Express)
- TypeScript with strict mode
- RESTful API design
- CORS enabled

**Core**
- Intelligent app detection
- Multi-package-manager support
- Artifact discovery and categorization
- Safe removal with validation

### Directory Structure

```
src/
├── ui/
│   ├── client/              # SPA application
│   │   ├── pages/           # Dashboard, Apps, Settings
│   │   ├── state/           # Reactive stores
│   │   ├── styles/          # CSS design system
│   │   ├── utils/           # Router, formatting
│   │   └── app.ts           # SPA entry point
│   ├── server/              # API backend
│   │   ├── routes/          # API endpoints
│   │   ├── services/        # Business logic
│   │   └── middleware/      # Request handling
│   └── guiServer.ts         # HTTP server
├── core/                    # App detection & removal
├── managers/                # Package manager integrations
└── utils/                   # Utilities
```

---

## Performance

- **Bundle Size**: ~50KB gzipped (no frameworks)
- **API Response**: <100ms per request
- **Page Load**: <2 seconds
- **Startup Time**: <1 second
- **Memory Usage**: Minimal footprint

---

## Tips & Best Practices

💡 **Always preview first**
```bash
# GUI: Click "Preview Removal"
# CLI: Use --dry-run flag
appclean remove myapp --dry-run
```

💡 **Create backups for important apps**
```bash
# GUI: Backup option is shown before removal
# CLI: Use --backup flag
appclean remove myapp --backup
```

💡 **Use the GUI for visual browsing**
```bash
appclean gui
# Open http://localhost:3000
# Visual cards and charts make it easy
```

💡 **Use CLI for scripting and automation**
```bash
# In shell scripts or CI/CD pipelines
appclean remove myapp --force
```

💡 **Check updates regularly**
```bash
appclean check-update
# Or use GUI: Settings → Check for Updates
```

---

## Permissions

- **macOS/Linux**: May need `sudo` for system packages
  ```bash
  sudo appclean remove system-package
  ```
- **Windows**: May need to run as Administrator

---

## Troubleshooting

**"Permission denied" error**
```bash
# Try with sudo
sudo appclean remove <app>
```

**App not found**
```bash
# Search for partial name
appclean search <partial-name>
# Or use GUI search with fuzzy matching
```

**GUI won't start**
```bash
# Check if port 3000 is in use
# Use custom port:
appclean gui --port 8080
```

**Want to preview without removing**
```bash
# Using GUI: Click "Preview Removal"
# Using CLI: Use --dry-run flag
appclean remove <app> --dry-run
```

**Want to restore from backup**
```bash
# Backups are saved in ~/.appclean-backups/
ls ~/.appclean-backups/
# Manually restore from tar.gz if needed
```

---

## Safety Guarantees

✅ **All actions require confirmation** (unless `--force` is used)
✅ **Preview mode available** - see what will be deleted first
✅ **Backup option available** - protect important data
✅ **No data loss** - only removes application files
✅ **Easy to reinstall** - use npm/brew/apt to reinstall apps
✅ **Dry-run mode** - test before actual removal

---

## Getting Help

```bash
# Show all commands
appclean --help

# Get help for specific command
appclean remove --help

# Check your version
appclean --version

# Check if update available
appclean check-update
```

---

## License

MIT License - Free to use and modify. See [LICENSE](LICENSE) file for details.

---

## Support & Community

📝 **Report Issues**: https://github.com/praveenkay/AppClean/issues
💬 **Discussions**: https://github.com/praveenkay/AppClean/discussions
🌟 **Star** if you find it useful!
📖 **Documentation**: https://github.com/praveenkay/AppClean#readme

---

## Changelog

For detailed changelog with all versions and updates, see [CHANGELOG.md](CHANGELOG.md).

### Latest Release
- v2.0.3: Help documentation, version badge, Safari compatibility improvements
- v2.0.2: Performance improvements and bug fixes
- v2.0.0: Complete GUI overhaul with modern SPA interface

---

## Maintainers

**Praveen Kothapally** - Original creator and maintainer
- GitHub: [@praveenkay](https://github.com/praveenkay)
- Email: pkothapally@gmail.com

---

**Made with ❤️ by Praveen Kothapally**

*AppClean - Making app removal intelligent, safe, and beautiful.* ✨
