<div align="center">
  <img src="./logo.svg" alt="AppClean Logo" width="120" height="120">

  # AppClean

  > **Intelligently find and safely uninstall applications with all their artifacts**

  [![version](https://img.shields.io/badge/version-1.8.0-blue?style=flat-square)](https://github.com/praveenkay/AppClean/releases)
  [![license](https://img.shields.io/badge/license-MIT-green?style=flat-square)](LICENSE)
  [![platforms](https://img.shields.io/badge/platforms-macOS%20%7C%20Linux%20%7C%20Windows-lightgrey?style=flat-square)](README.md)
  [![npm](https://img.shields.io/npm/dm/appclean?style=flat-square)](https://npmjs.com/package/appclean)

  **A powerful, cross-platform CLI tool for developers and system administrators**

</div>

## ✨ Features

### Core Features
- **🔍 Smart Detection** — Finds apps installed via npm, yarn, pnpm, Homebrew, apt, yum, dnf, and custom installers
- **📊 Deep Analysis** — Shows installation method, version, and locates all related artifacts
- **🛡️ Safe Removal** — Dry-run preview, double confirmation, and optional backups
- **💾 Backup & Restore** — Create backups before deletion and restore if needed
- **⚡ Fast & Efficient** — Scans and analyzes systems in seconds
- **🖥️ Cross-Platform** — macOS (Intel & Apple Silicon), Linux, and Windows
- **🎨 Beautiful CLI** — Interactive menu-driven interface with colors and animations

### Advanced Features (v1.1.0+)
- **🔐 Elevated Permissions** — Automatic sudo/admin detection and prompts
- **🔧 Service File Detection** — Finds LaunchAgent/LaunchDaemon and systemd services
- **📋 Operation Recording** — Complete removal history tracking and reporting
- **✓ Verification** — Post-removal verification to ensure complete uninstall
- **📄 Professional Reports** — HTML and text reports with legal disclaimers

### Latest Features (v1.2.0 - v1.8.0)
- **🎨 GUI Application** — Modern web-based interface (v1.2.0)
- **🔍 Duplicate File Finder** — Find and remove duplicate files (v1.3.0)
- **📦 Orphaned Dependency Detector** — Identify unused npm packages (v1.4.0)
- **🔌 Plugin System** — Extensible architecture for custom detectors (v1.5.0)
- **⏰ Scheduled Cleanup** — Automate regular cleanup tasks (v1.6.0)
- **📈 App Update Checker** — Check for available updates (v1.7.0)
- **🚀 Performance Optimizer** — Multi-threaded scanning & caching (v1.8.0)

## 🚀 Installation

### Quick Install (npm)

```bash
npm install -g appclean
```

### From Source

```bash
git clone https://github.com/praveenkay/AppClean.git
cd AppClean
npm install
npm run build
npm install -g .
```

**Requirements:** Node.js 16+ and npm 7+

## 💻 Usage

### Interactive Mode

Simply run:

```bash
appclean
```

Then use arrow keys to navigate and select actions:
- 🔍 Search for applications
- 📋 List all installed apps
- 📊 View app details and artifacts
- 🗑️ Remove applications safely

### Command Mode

```bash
# Search for an app
appclean search webpack

# List all applications
appclean list

# Analyze app artifacts before removal
appclean analyze webpack

# Preview removal (no files deleted)
appclean remove webpack --dry-run

# Remove with backup
appclean remove webpack --backup

# Remove without confirmations
appclean remove webpack --force
```

## Supported Package Managers

| Manager | Platform | Support |
|---------|----------|---------|
| npm | All | ✅ |
| yarn | All | ✅ |
| pnpm | All | ✅ |
| Homebrew | macOS, Linux | ✅ |
| apt | Linux | ✅ |
| yum | Linux | ✅ |
| dnf | Linux | ✅ |
| Custom Scripts | All | ✅ |

## How It Works

AppClean intelligently detects and removes applications by:

1. **Scanning Installation Locations**
   - Checks npm/yarn/pnpm global directories
   - Queries Homebrew installation database
   - Searches Linux package manager databases
   - Scans custom binary locations

2. **Locating Related Files**
   - Configuration files (`~/.config`, `~/.bashrc`, etc.)
   - Cache directories
   - Data files and logs
   - Service files (systemd, LaunchAgents, etc.)

3. **Safe Removal**
   - Preview all files to be removed with `--dry-run`
   - Create optional backups before deletion
   - Double confirmation before final removal
   - Detailed error reporting

## 📚 Examples

### Interactive Search and Remove

```bash
$ appclean search webpack
ℹ Found 1 app(s)

? Select an app to remove: (Use arrow keys)
❯ webpack (npm) - v5.89.0

? What would you like to do? (Use arrow keys)
❯ 📊 View details and artifacts
  🗑️  Remove this app
  ⬅️  Back to search
```

### Preview Before Removal

```bash
$ appclean remove webpack --dry-run

ℹ Files to be removed:
  binary   512 B    /usr/local/bin/webpack
  config   1.2 KB   ~/.config/webpack
  cache    15 MB    ~/.cache/webpack
  data     2.3 MB   ~/.local/share/webpack
  log      512 B    ~/.local/share/log/webpack

ℹ Total space to be freed: 17.5 MB

✓ This is a preview only. No files were removed.
```

### Safe Removal with Backup

```bash
$ appclean remove webpack --backup

ℹ App: webpack
ℹ Method: npm
ℹ Version: 5.89.0

? This action cannot be undone. Remove webpack and all its files? (y/N) y

✓ Backup created: ~/.appclean-backups/webpack-2024-01-20T15-30-45.tar.gz
✓ Successfully removed webpack (freed 17.5 MB)
```

### Check for Duplicate Files

```bash
$ appclean find-duplicates ~/Documents ~/Downloads

ℹ Scanning for duplicate files...
✓ Found 3 duplicate groups
  Group 1: report.pdf (2.5 MB)
    - ~/Documents/reports/report.pdf
    - ~/Downloads/report.pdf

  Group 2: image.png (1.2 MB)
    - ~/Documents/images/image.png
    - ~/Pictures/image.png

💾 Potential space savings: 3.7 MB
```

### Check for Updates

```bash
$ appclean check-updates

📦 webpack: 5.89.0 → Latest: 5.90.0
   npm install -g webpack@latest

📦 typescript: 5.3.3 → Latest: 5.4.0
   npm install -g typescript@latest

✓ Found 2 updates available
```

### List All Installed Apps

```bash
$ appclean list
ℹ Found 42 app(s)

┌──────────────┬──────────┬──────────┐
│     Name     │ Version  │ Method   │
├──────────────┼──────────┼──────────┤
│ webpack      │ 5.89.0   │ npm      │
│ typescript   │ 5.3.3    │ npm      │
│ lodash       │ 4.17.21  │ npm      │
│ node         │ 20.10.0  │ custom   │
│ git          │ 2.43.0   │ brew     │
│ python       │ 3.11.7   │ system   │
└──────────────┴──────────┴──────────┘
```

## Commands & Options

### Core Commands
```bash
appclean search <query>           # Search for installed applications
appclean list                     # List all installed applications
appclean analyze <appName>        # Analyze an application and show its artifacts
appclean remove <appName>         # Remove an application
appclean gui                      # Launch GUI application (v1.2.0+)
```

### Advanced Commands (v1.2.0 - v1.8.0)
```bash
# Duplicate file operations
appclean find-duplicates [paths]  # Find duplicate files (v1.3.0)

# Dependency management
appclean find-orphaned-packages   # Find unused npm packages (v1.4.0)

# Plugin management
appclean plugin register <path>   # Register custom plugin (v1.5.0)
appclean plugin list              # List installed plugins (v1.5.0)
appclean plugin enable <name>     # Enable plugin (v1.5.0)

# Schedule management
appclean schedule create <app>    # Create cleanup schedule (v1.6.0)
appclean schedule list            # List all schedules (v1.6.0)
appclean schedule delete <id>     # Delete schedule (v1.6.0)

# Update checking
appclean check-updates            # Check for available updates (v1.7.0)
appclean update <appName>         # Update an application (v1.7.0)

# Performance
appclean scan --optimize          # Optimize scan performance (v1.8.0)
appclean clear-cache              # Clear scan cache (v1.8.0)
```

### Common Options
```bash
--dry-run                         # Preview without removing files
--backup                          # Create backup before removal
--force                           # Skip confirmation prompts
--help                            # Show help information
--version                         # Show version information
```

## Safety Features

⚠️ **AppClean prioritizes safety**:

- **Dry-run by default**: Use `--dry-run` to preview what will be deleted
- **Double confirmation**: You'll be asked to confirm twice before actual removal
- **Backups**: Create optional backups before removing apps
- **Detailed logging**: See exactly what's being removed
- **Error reporting**: Clear error messages if something goes wrong

## Latest Features Guide (v1.1.0 - v1.8.0)

### v1.1.0 - Advanced Features
- **Elevated Permissions**: Automatically detects and requests sudo/admin access
- **Service File Detection**: Identifies LaunchAgent/LaunchDaemon (macOS) and systemd (Linux) files
- **User Consent Recording**: Tracks all removal operations with timestamps
- **Post-Removal Verification**: Confirms complete app removal via filesystem and commands
- **Professional Reports**: Generate HTML and text reports with legal disclaimers

**Usage:**
```bash
appclean remove app-name      # Automatic elevation detection
appclean remove app-name --backup  # Creates backup before removal
```

### v1.2.0 - GUI Application
Modern web-based interface for visual app management.

**Usage:**
```bash
appclean gui                   # Opens GUI at http://localhost:3000
```

### v1.3.0 - Duplicate File Finder
Find and manage duplicate files by SHA256 hash.

**Usage:**
```bash
appclean find-duplicates ~/Documents ~/Downloads
appclean find-duplicates --recursive /          # Search entire filesystem
```

### v1.4.0 - Orphaned Dependency Detector
Identify npm packages with no project dependencies.

**Usage:**
```bash
appclean find-orphaned-packages    # Find all unused packages
appclean find-orphaned-packages --dry-run  # Preview without removal
```

### v1.5.0 - Plugin System
Extend AppClean with custom application detectors.

**Usage:**
```bash
appclean plugin register ./my-plugin.js
appclean plugin list
appclean plugin enable my-plugin
appclean plugin config my-plugin --setting value
```

### v1.6.0 - Scheduled Cleanup Automation
Automate cleanup with recurring schedules.

**Usage:**
```bash
appclean schedule create webpack --frequency daily
appclean schedule create node --frequency weekly --backup
appclean schedule list
appclean schedule update schedule-id --frequency monthly
appclean schedule delete schedule-id
```

### v1.7.0 - App Update Checker
Check for available updates across all package managers.

**Usage:**
```bash
appclean check-updates              # Check all apps
appclean check-updates webpack      # Check specific app
appclean update webpack             # Update app
```

### v1.8.0 - Performance Optimizer
Optimize scanning performance for large systems.

**Features:**
- Multi-threaded scanning (configurable threads)
- Intelligent result caching
- Performance metrics and reporting
- Automatic optimization recommendations

**Usage:**
```bash
appclean scan --optimize            # Use optimization settings
appclean scan --threads 8           # Set thread count
appclean clear-cache                # Clear cached scan results
```

## Platform-Specific Notes

### macOS
- Detects both Intel and Apple Silicon installations
- Removes LaunchAgents and LaunchDaemons
- Cleans Application Support directories
- Handles .plist preference files

### Linux
- Supports apt, yum, and dnf package managers
- Removes systemd service files
- Cleans .config and .local directories
- Handles /var/log files

### Windows
- Scans Program Files directories
- Removes APPDATA and LOCALAPPDATA entries
- Handles .exe files and shortcuts

## Troubleshooting

### App not found

```bash
appclean search partial-name
```

Try searching with a partial name. AppClean searches by substring.

### Permission denied

Some system files may require elevated permissions:

```bash
sudo appclean remove app-name
```

### Can't restore backup

Backups are stored in `~/.appclean-backups/`:

```bash
ls ~/.appclean-backups/
tar -xzf ~/.appclean-backups/app-backup.tar.gz
```

## Data & Storage Locations

AppClean stores all data in user home directory:

| Data | Location | Purpose |
|------|----------|---------|
| Backups | `~/.appclean-backups/` | App removal backups |
| Records | `~/.appclean-records/` | Removal operation history |
| Reports | `~/.appclean-reports/` | Generated HTML/text reports |
| Schedules | `~/.appclean-schedules.json` | Cleanup automation schedules |
| Cache | `~/.appclean-cache/` | Scan result cache |
| Results | `~/.appclean-cleanup-results/` | Scheduled cleanup results |

All data is stored locally on your machine. No cloud upload or external connections.

## Performance Tips

### For Large Systems (100k+ files)
1. Use v1.8.0 Performance Optimizer
2. Enable result caching: `appclean scan --cache`
3. Increase thread count: `appclean scan --threads 8`
4. Exclude system directories: `--exclude /usr --exclude /var`

### For Faster Scans
1. Use caching: Results are automatically cached
2. Skip deep directory scans: Set `--max-depth 5`
3. Exclude symlinks: Enabled by default
4. Pre-filter patterns: Use exclude patterns

## Development

### Setup

```bash
git clone https://github.com/YOUR_USERNAME/appclean.git
cd appclean
npm install
```

### Build

```bash
npm run build
```

### Development Server

```bash
npm run dev
```

### Run Tests

```bash
npm test
```

## Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Version History & Roadmap

### Completed Features ✅
- [x] **v1.0.0** - Initial release with core functionality
- [x] **v1.1.0** - Advanced features (permissions, service detection, reporting)
- [x] **v1.2.0** - GUI application for all platforms
- [x] **v1.3.0** - Duplicate file finder
- [x] **v1.4.0** - Orphaned dependency detection
- [x] **v1.5.0** - Plugin system for custom detectors
- [x] **v1.6.0** - Scheduled cleanup automation
- [x] **v1.7.0** - App update checker
- [x] **v1.8.0** - Performance optimization for large scans

### Future Roadmap 🚀
- [ ] Mobile app (iOS/Android)
- [ ] Advanced caching system
- [ ] Batch operations
- [ ] Custom rule builder
- [ ] System notifications
- [ ] Cloud sync for schedules
- [ ] Advanced analytics dashboard

## Known Limitations

- System packages may require elevated permissions to remove
- Some service files may need manual cleanup
- Snap packages (Linux) are currently not supported

## License

MIT License © 2026

## Disclaimer

⚠️ **Use with caution**: This tool permanently deletes files. Always use `--dry-run` first to preview changes.

## 🤝 Support & Community

- **🐛 [Report Issues](https://github.com/praveenkay/AppClean/issues)** — Found a bug? Let us know
- **💬 [Discussions](https://github.com/praveenkay/AppClean/discussions)** — Share ideas and feedback
- **⭐ [Star on GitHub](https://github.com/praveenkay/AppClean)** — Show your support

## 📄 License

MIT License © 2026 [Praveen Kothapally](https://github.com/praveenkay)

---

**Built with care for developers and system administrators who value clean systems**

<div align="center">
  Made with ❤️ by <a href="https://github.com/praveenkay">Praveen Kothapally</a>
</div>
