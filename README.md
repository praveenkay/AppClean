# AppClean

> A powerful, cross-platform CLI tool to intelligently find and safely uninstall applications with all their artifacts

![version](https://img.shields.io/badge/version-1.0.0-blue)
![license](https://img.shields.io/badge/license-MIT-green)
![platforms](https://img.shields.io/badge/platforms-macOS%20%7C%20Linux%20%7C%20Windows-lightgrey)

## Features

- 🔍 **Smart App Detection** - Finds apps installed via npm, yarn, pnpm, Homebrew, apt, yum, dnf, and custom installers
- 📊 **Installation Method Identification** - Shows exactly how and where each app was installed
- 🗂️ **Artifact Discovery** - Locates all related files including configs, caches, data files, and service files
- 🗑️ **Safe Removal** - Completely removes applications with dry-run preview option
- 💾 **Backup Support** - Create backups before deletion for peace of mind
- 🔄 **Cross-Platform** - Works on macOS, Linux, and Windows
- 🎯 **Interactive CLI** - Beautiful, intuitive menu-driven interface similar to Mole

## Installation

### Via npm (Global)

```bash
npm install -g appclean
```

### From Source

```bash
git clone https://github.com/YOUR_USERNAME/appclean.git
cd appclean
npm install
npm run build
npm install -g .
```

## Quick Start

### Interactive Mode

```bash
appclean
```

This launches the interactive menu where you can:
- Search for applications
- Browse all installed apps
- View detailed information about an app and its artifacts
- Safely remove applications

### Command-line Mode

```bash
# Search for an app
appclean search nodejs

# List all installed apps
appclean list

# Analyze an app and show artifacts
appclean analyze my-app

# Remove an app (with preview)
appclean remove my-app --dry-run

# Remove an app (with backup)
appclean remove my-app --backup

# Remove an app (without confirmations)
appclean remove my-app --force
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

## Examples

### Find and Remove an npm Package

```bash
$ appclean search lodash
ℹ Found 1 app(s)

? Select an app to remove: (Use arrow keys)
❯ lodash (npm) - v4.17.21

? What would you like to do? (Use arrow keys)
❯ 📊 View details and artifacts
  🗑️  Remove this app
  ⬅️  Back to search
```

### Remove with Backup

```bash
$ appclean remove myapp --backup
ℹ App: myapp
ℹ Method: npm

? Remove this app and all its artifacts? (y/N) y

ℹ Removal options:
? Select options:
  ◉ Dry run (preview without removing)
  ◯ Create backup before removal

✓ Successfully removed myapp (freed 2.5 MB)
ℹ Backup saved at: ~/.appclean-backups/myapp-2024-01-15T10-30-45.tar.gz
```

### List All Apps

```bash
$ appclean list
ℹ Found 42 app(s)

┌─────────────┬─────────┬────────────┐
│    Name     │ Version │   Method   │
├─────────────┼─────────┼────────────┤
│   lodash    │ 4.17.21 │    npm     │
│   webpack   │ 5.89.0  │    npm     │
│    node     │  20.10  │   custom   │
│    brew     │   4.1.6 │    brew    │
└─────────────┴─────────┴────────────┘
```

## Options

```
Usage: appclean [command] [options]

Commands:
  search <query>        Search for installed applications
  list                  List all installed applications
  analyze <appName>     Analyze an application and show its artifacts
  remove <appName>      Remove an application
  help                  Show help

Options:
  --dry-run             Preview without removing files
  --backup              Create backup before removal
  --force               Skip confirmation prompts
  --help                Show help information
  --version             Show version information
```

## Safety Features

⚠️ **AppClean prioritizes safety**:

- **Dry-run by default**: Use `--dry-run` to preview what will be deleted
- **Double confirmation**: You'll be asked to confirm twice before actual removal
- **Backups**: Create optional backups before removing apps
- **Detailed logging**: See exactly what's being removed
- **Error reporting**: Clear error messages if something goes wrong

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

## Roadmap

- [ ] GUI application
- [ ] Duplicate file finder
- [ ] Orphaned dependency detection
- [ ] Plugin system for custom detectors
- [ ] Scheduled cleanup automation
- [ ] App update checker
- [ ] Performance optimization for large scans

## Known Limitations

- System packages may require elevated permissions to remove
- Some service files may need manual cleanup
- Snap packages (Linux) are currently not supported

## License

MIT License © 2024

## Disclaimer

⚠️ **Use with caution**: This tool permanently deletes files. Always use `--dry-run` first to preview changes.

## Support

- 🐛 [Report a bug](https://github.com/YOUR_USERNAME/appclean/issues)
- 💬 [Discuss ideas](https://github.com/YOUR_USERNAME/appclean/discussions)
- ⭐ [Star us on GitHub](https://github.com/YOUR_USERNAME/appclean)

---

**Made with ❤️ for developers who want clean systems**
