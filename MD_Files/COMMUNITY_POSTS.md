# Community Posts & Marketing

## Show HN Submission

**Title:** Show HN: AppClean – Intelligently remove apps with all their artifacts (npm, brew, apt, etc.)

**Description:**

I built AppClean because uninstalling apps properly is surprisingly hard. When you remove an app, files get left behind everywhere:

- Config files in ~/.config or ~/Library
- Caches that take gigabytes
- Service files that keep running
- Dependencies scattered across your system

AppClean solves this by:

1. **Finding all artifacts** — It knows where npm, Homebrew, apt, and custom installers leave files
2. **Removing everything** — Not just the binary, but configs, caches, logs, even service files
3. **Staying safe** — Dry-run preview, backups, and post-removal verification
4. **Cross-platform** — Works on macOS, Linux, and Windows

**Current features:**
- Detects apps from 8+ package managers
- Deep file scanning for configs, caches, logs
- Service file detection (LaunchAgent, systemd)
- One-command uninstall: `appclean remove app-name`
- 8 versions with advanced features (duplicate finder, plugin system, scheduled cleanup, etc.)

**Real example:**
```bash
$ appclean remove webpack
📊 Found 47 artifacts to remove
✓ Freed 237.5 MB
✓ Complete removal verified
```

Looking for feedback and would love to hear about missing features or broken detection for specific apps!

**GitHub:** https://github.com/praveenkay/AppClean
**npm:** `npm install -g appclean`

---

## Reddit r/commandline Post

**Title:** Show your CLIs - AppClean: Intelligently uninstall apps and clean all artifacts

**Description:**

Tired of uninstalling apps only to discover they left behind gigabytes of config files, caches, and service files?

I built **AppClean** to solve the frustration of incomplete app removal across npm, Homebrew, apt, and custom installers.

### The Problem
- `npm uninstall -g webpack` leaves behind ~/.config/webpack, ~/.cache/webpack, and service files
- `brew uninstall package` leaves behind LaunchAgents and preference files
- `apt remove package` misses config in ~/.local and systemd service files
- No built-in way to verify an app is actually gone

### The Solution
```bash
appclean remove webpack
# Finds 47 artifacts
# Creates backup
# Removes everything
# Verifies removal
```

### What It Does
- 🔍 Scans 8+ package managers (npm, yarn, pnpm, brew, apt, yum, dnf, custom)
- 📊 Finds configs, caches, logs, data, service files
- 🛡️ Safe: dry-run preview, backups, verification
- ✓ Post-removal verification via filesystem and commands
- 📄 Professional removal reports with legal disclaimers

### Latest Features
- v1.2.0: GUI application
- v1.3.0: Duplicate file finder
- v1.4.0: Orphaned dependency detector
- v1.5.0: Plugin system for custom apps
- v1.6.0: Scheduled cleanup automation
- v1.7.0: App update checker
- v1.8.0: Performance optimizer for large systems

**Install:** `npm install -g appclean`
**Repo:** https://github.com/praveenkay/AppClean

Would love feedback on what package managers or edge cases I'm missing!

---

## Reddit r/linux Post

**Title:** AppClean - Finally, a proper way to uninstall packages and clean all their artifacts

**Description:**

Linux package managers are great, but they're designed for *system* stability, not *disk* cleanliness.

When you `apt remove` or `dnf remove` a package, you're left with:
- Orphaned config files in ~/.config
- Cache directories that never get touched again
- Systemd service files
- Leftover data directories

I built **AppClean** to fix this. It's like `apt autoremove` but actually useful:

### Problem Statement
Your `apt remove package` removed the binary. But did it remove:
- ~/.config/package/ ✗
- ~/.cache/package/ ✗
- ~/.local/share/package/ ✗
- /etc/systemd/user/package.service ✗

AppClean finds and removes all of these automatically.

### How It Works
```bash
$ appclean remove node
ℹ Found 23 artifacts
ℹ Detected systemd service file requiring manual cleanup
? Remove node and all its files? (y/N) y
✓ Successfully removed node (freed 412 MB)
```

### Features
- 🔍 Detects apt, yum, dnf packages (plus npm, brew, and custom installs)
- 📋 Shows configs, caches, logs, data files before removal
- 🛡️ Dry-run preview and backups
- ✓ Verifies complete removal
- 📊 Orphaned dependency detection
- ⏰ Scheduled cleanup automation
- 🚀 Performance optimized for large systems

**Install:** `npm install -g appclean`
**Repo:** https://github.com/praveenkay/AppClean

---

## Reddit r/node Post

**Title:** AppClean - Remove global npm packages properly (including all artifacts)

**Description:**

Ever installed a global npm package and forgotten about it? Then one day you need disk space and realize you have gigabytes of cached dependencies and config files from packages you removed years ago?

I built **AppClean** to fix this.

### The Real Problem
```bash
$ npm uninstall -g webpack
removed 1 package

# But still there:
$ ls ~/.config/webpack/      # Config files
$ ls ~/.cache/webpack/       # Build cache (1.5 GB!)
$ ls ~/.local/share/webpack/ # Leftover data
```

### The Solution
```bash
$ appclean remove webpack
📊 Found 47 artifacts
💾 Potential savings: 1.5 GB
? Remove webpack? (y/N) y
✓ Freed 1.5 GB
```

### What It Detects
- npm packages (global and local)
- yarn and pnpm packages
- Configs in ~/.config
- Caches in ~/.cache
- Data in ~/.local/share
- Service files (systemd, LaunchAgent on macOS)

### Features
- 🔍 Finds all artifacts left by global packages
- 📊 Shows what will be removed before deletion
- 🛡️ Creates backups by default
- ✓ Verifies removal worked
- 📦 Detects orphaned npm dependencies
- ⏰ Schedule automatic cleanups

**Install:** `npm install -g appclean`
**Usage:** `appclean remove package-name`
**Repo:** https://github.com/praveenkay/AppClean

### Why This Matters
If you regularly install/uninstall global packages, this reclaims gigabytes. If you share systems with others, orphaned packages add up fast.

Would love feedback on npm-specific edge cases or missing detection!

---

## Reddit r/opensource Post

**Title:** AppClean - Open source app uninstaller supporting npm, brew, apt, and more

**Description:**

I've been building **AppClean** – an open source tool to intelligently remove applications with all their artifacts across multiple operating systems and package managers.

### The Problem
Every package manager (npm, Homebrew, apt, yum, dnf) leaves behind files in different locations:
- Configuration files
- Caches (sometimes gigabytes)
- Service files that keep running
- Data directories
- Logs

There's no built-in way to clean these up completely.

### The Solution
One command removes everything:
```bash
npm install -g appclean
appclean remove webpack  # Removes app + all artifacts
```

### Current Status
- **v1.8.0** released with 8 versions of features
- 13 GitHub topics for discoverability
- Cross-platform: macOS, Linux, Windows
- Multiple package manager support: npm, yarn, pnpm, brew, apt, yum, dnf
- Advanced features: GUI, duplicate finder, orphaned detector, plugin system, scheduling, update checker, performance optimizer

### Open Source Stack
- TypeScript + Node.js
- Commander.js for CLI
- Inquirer.js for interactive menus
- MIT Licensed
- Active development

### Looking For
- Users and feedback
- Contributions (especially Windows testing)
- Plugin developers
- Ideas for next features

**Repo:** https://github.com/praveenkay/AppClean
**npm:** `npm install -g appclean`
**License:** MIT

---

## Twitter/X One-Liner

🧹 Tired of bloated systems? Try AppClean – removes apps + all their artifacts (configs, caches, service files) in one command.

npm install -g appclean
appclean remove webpack  # Frees gigabytes, not just the binary

Works on macOS, Linux, Windows. Supports npm, brew, apt, and more.

https://github.com/praveenkay/AppClean

#devtools #cli #opensource

---

## Dev.to Blog Post Template

**Title:** AppClean: The App Uninstaller Your System Deserves

**Introduction:**

We've all been there. You uninstall an app, but somehow your disk is still full. That's because uninstalling is broken. Package managers remove the binary but leave behind:

- Configuration files
- Cache directories (sometimes gigabytes)
- Service files that keep running
- Data directories
- Log files

I built AppClean to fix this properly.

**The Problem Section:**
[Explain the frustration of incomplete uninstalls]

**The Solution Section:**
[Show how AppClean solves it]

**Features Section:**
[Highlight the 8 versions and features]

**Getting Started Section:**
[Installation and usage examples]

**Conclusion:**
[Call to action: GitHub, npm, feedback]

---

## HackerNews Comment Strategy

When AppClean gets mentioned in threads about package managers, disk cleanup, or system maintenance:

- Lead with the problem, not features
- Show before/after disk space
- Mention cross-platform support
- Link to GitHub (not npm directly)
- Ask for feedback on missing detectors

**Example:** "This reminds me of a problem I ran into – package managers leave behind gigabytes of artifacts. I built AppClean to fix this. npm install -g appclean, then appclean remove package-name to clean everything. Supports npm, brew, apt, and more. Feedback welcome: https://github.com/praveenkay/AppClean"
