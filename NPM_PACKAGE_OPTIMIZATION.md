# npm Package Optimization Guide

## npm Package Description & Keywords

### Current Keywords
```json
"keywords": [
  "uninstaller",
  "app-management",
  "cli",
  "cross-platform",
  "npm",
  "brew",
  "package-manager",
  "cleanup"
]
```

### Optimized Keywords (Add to package.json)
```json
"keywords": [
  "uninstall",
  "uninstaller",
  "app-management",
  "app-remover",
  "cli",
  "command-line",
  "cross-platform",
  "system-cleanup",
  "artifact-removal",
  "disk-cleanup",
  "npm",
  "yarn",
  "pnpm",
  "homebrew",
  "brew",
  "apt",
  "yum",
  "dnf",
  "package-manager",
  "cleanup",
  "macos",
  "linux",
  "windows",
  "duplicate-finder",
  "orphaned-packages",
  "plugin-system",
  "scheduled-cleanup"
]
```

## npm Package README (Custom for npm)

```markdown
# AppClean 🧹

> Intelligently remove apps with all their artifacts

[![npm version](https://img.shields.io/npm/v/appclean.svg)](https://www.npmjs.com/package/appclean)
[![npm downloads](https://img.shields.io/npm/dm/appclean.svg)](https://www.npmjs.com/package/appclean)
[![MIT License](https://img.shields.io/badge/license-MIT-green.svg)](https://github.com/praveenkay/AppClean/blob/main/LICENSE)

## Install & Run in 10 Seconds

```bash
npm install -g appclean
appclean remove webpack  # or any app name
```

## What's the Problem?

When you uninstall an app, it leaves behind:
- 📁 Config files (~/.config, ~/.bashrc)
- 💾 Cache directories (sometimes gigabytes)
- 🔧 Service files that keep running
- 📝 Logs and data files

**AppClean fixes this.** One command removes everything:

```bash
$ appclean remove node
ℹ Found 47 artifacts to remove
✓ Freed 412 MB
✓ Verified complete removal
```

## Features

- 🔍 **Smart Detection** – Finds apps from npm, yarn, pnpm, Homebrew, apt, yum, dnf
- 📊 **Deep Scanning** – Locates configs, caches, logs, data, service files
- 🛡️ **Safe Removal** – Dry-run preview, backups, verification
- ✅ **Verification** – Confirms complete removal via filesystem and commands
- 📄 **Reports** – Professional HTML/text removal reports
- 🎨 **GUI** – Web-based interface (v1.2.0+)
- 🔍 **Duplicate Finder** – Find and clean duplicate files (v1.3.0+)
- 📦 **Orphaned Detector** – Identify unused packages (v1.4.0+)
- 🔌 **Plugin System** – Custom detectors (v1.5.0+)
- ⏰ **Scheduling** – Automate cleanups (v1.6.0+)
- 📈 **Update Checker** – Check for app updates (v1.7.0+)
- 🚀 **Performance Optimizer** – Fast scanning for large systems (v1.8.0+)

## Quick Start

### Search & Remove
```bash
appclean search webpack
appclean remove webpack
```

### Preview First (Dry-run)
```bash
appclean remove webpack --dry-run
```

### With Backup
```bash
appclean remove webpack --backup
```

### Find Duplicates
```bash
appclean find-duplicates ~/Downloads ~/Documents
```

### Check Updates
```bash
appclean check-updates
```

## Supported Package Managers

| Manager | Platform | Status |
|---------|----------|--------|
| npm | All | ✅ |
| yarn | All | ✅ |
| pnpm | All | ✅ |
| Homebrew | macOS, Linux | ✅ |
| apt | Linux | ✅ |
| yum | Linux | ✅ |
| dnf | Linux | ✅ |
| Custom | All | ✅ |

## Real Examples

### Remove npm package with all artifacts
```bash
$ appclean remove webpack
📊 Found 47 artifacts
? Remove webpack? (y/N) y
✓ Freed 1.5 GB
```

### Find duplicate files
```bash
$ appclean find-duplicates /
💾 Found 3 groups of duplicates
💾 Potential savings: 4.2 GB
```

### Schedule automatic cleanups
```bash
$ appclean schedule create node --frequency weekly
⏰ Schedule created (runs weekly)
```

## Why AppClean?

- **Reclaim Space**: Frees gigabytes typically left by uninstallers
- **System Health**: Removes orphaned service files and configs
- **Peace of Mind**: Verifies apps are completely gone
- **Cross-Platform**: Works on macOS, Linux, Windows
- **Open Source**: MIT License, community-driven

## System Requirements

- Node.js 16+
- npm 7+
- macOS (Intel & Apple Silicon), Linux, or Windows

## Documentation

- **Full Guide**: https://github.com/praveenkay/AppClean
- **GitHub**: https://github.com/praveenkay/AppClean
- **Issues**: https://github.com/praveenkay/AppClean/issues
- **Discussions**: https://github.com/praveenkay/AppClean/discussions

## License

MIT © 2026 [Praveen Kothapally](https://github.com/praveenkay)

---

**Made with ❤️ for developers and sysadmins who value clean systems**
```

## npm Badge Suggestions

```markdown
<!-- Version Badge -->
[![npm version](https://img.shields.io/npm/v/appclean.svg?style=flat-square)](https://www.npmjs.com/package/appclean)

<!-- Downloads Badge -->
[![npm downloads](https://img.shields.io/npm/dm/appclean.svg?style=flat-square)](https://www.npmjs.com/package/appclean)

<!-- Downloads This Week -->
[![npm downloads weekly](https://img.shields.io/npm/dw/appclean.svg?style=flat-square)](https://www.npmjs.com/package/appclean)

<!-- License Badge -->
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

<!-- Build Status (if you add CI/CD) -->
[![Build Status](https://img.shields.io/github/actions/workflow/status/praveenkay/AppClean/ci.yml?branch=main)](https://github.com/praveenkay/AppClean/actions)

<!-- Node Version -->
[![Node.js Version](https://img.shields.io/node/v/appclean.svg)](https://www.npmjs.com/package/appclean)
```

## npm Package Checklist

- [x] Keyword optimization (problem-focused)
- [x] Clear description in package.json
- [x] README with quick start (install + one command)
- [x] Usage examples
- [x] Platform support clearly stated
- [ ] Add `npm install -g appclean` to Twitter/social
- [ ] Post npm package link to Product Hunt
- [ ] Create npm org account (optional future)
- [ ] Add npm lifecycle scripts for releasing
- [ ] Monitor npm package trends/downloads

## npm Publishing Commands

```bash
# Update version
npm version patch  # 1.8.0 -> 1.8.1
npm version minor  # 1.8.0 -> 1.9.0
npm version major  # 1.8.0 -> 2.0.0

# Build before publishing
npm run build

# Publish to npm
npm publish

# Tag release on GitHub
git push origin v1.8.1

# View npm stats
npm view appclean
```

## npm Package SEO Tips

1. **Title** should include primary keyword: "AppClean – Uninstall apps with all artifacts"
2. **Description** should address the problem first
3. **Keywords** should include long-tail terms: "uninstall npm package", "remove app cache", "system cleanup tool"
4. **README** should be on npm.js.org (it auto-syncs from GitHub)
5. **Downloads** trending matter – encourage installs with social posts
6. **GitHub link** from npm drives traffic both ways

## Increase npm Downloads

1. **Social Media**: Share npm install command
   - Twitter: "npm install -g appclean"
   - Bluesky, Mastodon: Spread across platforms

2. **Developer Communities**: Post in:
   - r/commandline
   - r/linux
   - r/node
   - Dev.to
   - Hacker News
   - Product Hunt

3. **Newsletter**: Get featured in JavaScript/DevTools newsletters

4. **GitHub Releases**: Include npm install command in release notes

5. **Stack Overflow**: Answer uninstall questions with AppClean link

6. **Documentation Sites**: Cross-link with npm and GitHub
