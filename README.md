# AppClean 🧹

**Safely remove applications and all their hidden files in one command.**

AppClean finds and deletes apps installed via npm, Homebrew, apt, and other package managers—plus all associated files, configs, and cache.

[![version](https://img.shields.io/badge/version-1.9.0-blue?style=flat-square)](https://github.com/praveenkay/AppClean/releases)
[![license](https://img.shields.io/badge/license-MIT-green?style=flat-square)](LICENSE)
[![npm](https://img.shields.io/npm/dm/appclean?style=flat-square)](https://npmjs.com/package/appclean)

---

## Quick Start

### Install
```bash
npm install -g appclean
```

### Usage
```bash
# List all installed apps
appclean list

# Search for an app
appclean search <app-name>

# Show app details
appclean analyze <app-name>

# Remove app completely
appclean remove <app-name>
```

---

## Features

✨ **Find Apps**
- Detect apps from npm, yarn, pnpm, Homebrew, apt, yum, dnf
- Search by name with instant results
- Show app version and installation method

🔍 **Analyze**
- Find all related files (binaries, configs, caches, logs)
- See how much space each app uses
- Preview what will be deleted before removing

🗑️ **Remove Safely**
- Dry-run mode to preview first
- Backup option before deletion
- Confirmation prompts to prevent accidents
- Error reporting for failed deletions

🆙 **Manage**
- Check for updates: `appclean check-update`
- Upgrade automatically: `appclean upgrade`
- Uninstall AppClean: `appclean uninstall`

🎨 **GUI**
- Web interface: `appclean gui`
- Open http://localhost:3000 in your browser
- One-click upgrade and uninstall

---

## Common Tasks

### Find and remove an app

```bash
# Search for the app
appclean search firefox

# View all details
appclean analyze firefox

# Preview what will be deleted
appclean remove firefox --dry-run

# Remove it
appclean remove firefox
```

### Remove multiple apps

```bash
# List all apps and choose which to remove
appclean list

# Remove each one
appclean remove <app-name>
```

### Backup before removing

```bash
# Create backup, then remove
appclean remove <app-name> --backup
```

### Use the GUI

```bash
# Start the web interface
appclean gui

# Open browser to http://localhost:3000
# Click on apps to remove or check updates
```

---

## All Commands

### Search & List
- `appclean search <query>` - Find apps by name
- `appclean list` - Show all installed apps
- `appclean analyze <app>` - View app details and files

### Remove Apps
- `appclean remove <app>` - Remove app (with confirmation)
- `appclean remove <app> --dry-run` - Preview only
- `appclean remove <app> --backup` - Create backup first
- `appclean remove <app> --force` - Skip confirmation

### Update AppClean
- `appclean upgrade` - Update to latest version
- `appclean check-update` - Check for updates
- `appclean --version` - Show current version

### Uninstall
- `appclean uninstall` - Remove AppClean (with confirmation)
- `appclean uninstall --force` - Remove without confirmation

### Server
- `appclean gui` - Start web interface (port 3000)
- `appclean gui --port 8080` - Use custom port

---

## Examples

### Remove Node.js package globally
```bash
appclean remove express
```

### Remove Homebrew app
```bash
appclean remove spotify
```

### Remove system package
```bash
appclean remove vim
```

### Use dry-run before removing
```bash
appclean remove chrome --dry-run
# Review output, then:
appclean remove chrome
```

### Create backup before removing
```bash
appclean remove myapp --backup
# Backup saved in case something goes wrong
```

---

## What Gets Removed?

AppClean finds and removes:
- ✓ Application binaries
- ✓ Configuration files (`.config`, `.local`, etc)
- ✓ Cache directories
- ✓ Log files
- ✓ Launch agents/daemons (macOS)
- ✓ Systemd services (Linux)
- ✓ Data directories
- ✓ Man pages

---

## Platform Support

| Feature | macOS | Linux | Windows |
|---------|-------|-------|---------|
| npm/yarn/pnpm | ✓ | ✓ | ✓ |
| Homebrew | ✓ | ✓ | - |
| apt/yum/dnf | - | ✓ | - |
| GUI | ✓ | ✓ | ✓ |
| Custom apps | ✓ | ✓ | ✓ |

---

## Tips

💡 **Always use `--dry-run` first**
```bash
appclean remove myapp --dry-run
# Review the list, then remove
```

💡 **Create backups for important apps**
```bash
appclean remove myapp --backup
```

💡 **Use the GUI for visual browsing**
```bash
appclean gui
# Open http://localhost:3000
```

💡 **Check updates regularly**
```bash
appclean check-update
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
# Search for exact name
appclean search <partial-name>
```

**Want to keep the app, just remove it from AppClean's list**
```bash
# Use --dry-run to preview, then cancel
appclean remove <app> --dry-run
# Press Ctrl+C to cancel
```

---

## Safety

✅ **All actions require confirmation** (unless `--force` is used)
✅ **Preview with `--dry-run`** before actual removal
✅ **Backup option available** with `--backup`
✅ **No data loss** - only removes application files
✅ **Easy to reinstall** - use npm/brew/apt to reinstall

---

## Getting Help

```bash
# Show all commands
appclean --help

# Get help for specific command
appclean remove --help

# Check your version
appclean --version
```

---

## License

MIT License - Free to use and modify

---

## Support

📝 **Issues**: https://github.com/praveenkay/AppClean/issues
🌟 **Star** if you find it useful!
💬 **Discussions**: https://github.com/praveenkay/AppClean/discussions

---

**Made with ❤️ by Praveen Kothapally**
