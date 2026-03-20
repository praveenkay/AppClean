# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [2.0.3] - 2026-03-20

### Added
- 📚 **Help & Documentation** - Comprehensive Help section with:
  - Getting Started guide
  - Dashboard Overview explanation
  - Installation Methods documentation
  - Safety & Best Practices section
  - Frequently Asked Questions (FAQ)
  - Resource links to GitHub and npm
- 🏷️ **Version Badge** - Display current version (v2.0.3) in navbar header for quick reference
- 🔧 **Safari Compatibility** - Improved mobile and tablet browser support:
  - Viewport meta tags optimization (`viewport-fit=cover`)
  - Apple mobile web app support
  - Fixed rendering issues
  - Status bar styling for iOS
- 📖 **Release Management** - Standardized documentation update process for future releases

### Improved
- 🎨 **Logo Consistency** - Ensured same professional logo (broom + checkmark) across GitHub, website, and all platforms
- 📱 **Mobile Support** - Enhanced viewport configuration for better mobile and tablet experience
- 🔗 **Navigation** - Added Help link to sidebar navigation with question mark icon

### Fixed
- Fixed viewport configuration issues on Safari
- Fixed logo rendering inconsistencies

---

## [2.0.2] - 2026-03-15

### Added
- Initial v2.0 features

### Improved
- Performance optimizations
- UI/UX refinements

---

## [2.0.1] - 2026-03-10

### Fixed
- Bug fixes and stability improvements

---

## [2.0.0] - 2026-03-05

### Added
- 🎉 **Complete GUI Overhaul** - Brand new modern single-page application (SPA) interface
- 🎨 **Beautiful SPA Interface** - Clean, minimal design with dark mode support
- 📊 **Dashboard** - System statistics, disk usage gauge, recent activity log
- 🔍 **Smart App Search** - Fuzzy search, filter by installation method, sort options
- 📂 **Detailed Analysis** - Visual artifacts list, size breakdown, category breakdown
- 👁️ **Preview Mode** - See exactly what will be deleted before confirming
- 🛡️ **Safe Removal** - Dual confirmation dialogs, optional backup creation
- 🌙 **Dark Mode** - Beautiful theme with persistent preference
- 🔌 **REST API** - Full API endpoints for integration
- ⚡ **High Performance** - ~50KB gzipped, <100ms API response time
- 🎯 **Cross-platform Support** - Works on macOS, Linux, and Windows
- 🔧 **Multiple Package Managers** - Support for npm, yarn, pnpm, Homebrew, apt, yum, dnf

---

## [1.9.0] - 2026-02-20

### Added
- CLI mode improvements
- Better error handling

---

## [1.8.0] - 2026-02-10

### Added
- Initial release of AppClean
- Core application detection and removal
- Support for multiple package managers

---

## Release Management Checklist

When releasing a new version, follow these steps:

1. **Version Bump**
   - Update `package.json` version field
   - Update `src/index.ts` VERSION constant
   - Commit with message: `chore: Bump version to X.X.X`

2. **Feature Implementation**
   - Implement and test new features
   - Create comprehensive commits with clear messages
   - Ensure tests pass: `npm test`
   - Build successfully: `npm run build`

3. **Documentation Updates** ⭐ **CRITICAL FOR EVERY RELEASE**
   - Update `README.md`:
     - Version badge: Change version number
     - Installation command: Update to new version
     - What's New section: Add latest features
   - Create/Update `CHANGELOG.md`:
     - Add new version with date
     - List all Added/Improved/Fixed items with emojis
     - Keep semantic versioning format
   - Commit with: `docs: Update README and CHANGELOG for vX.X.X`

4. **Git Commit & Tag**
   - Create feature commit: `git add -A && git commit -m "feat(feature): Description"`
   - Create git tag: `git tag -a vX.X.X -m "Release vX.X.X: Description"`
   - Push commit: `git push origin main`
   - Push tag: `git push origin vX.X.X`

5. **Verification**
   - Verify GitHub Release is created (auto-generated from tag)
   - Wait for GitHub Actions workflow to complete
   - Verify npm package is published: `npm view appclean versions`
   - Check npm package details: `npm view appclean@X.X.X`

6. **Communication**
   - Verify logo consistency across all platforms
   - Confirm version displays correctly in GUI
   - Test in multiple browsers (Chrome, Safari, Firefox)
   - Announce release in appropriate channels

### Important Notes
- All documentation updates (README, CHANGELOG) must be completed BEFORE tagging
- Version badges and references must be updated to match new version
- GitHub releases are auto-created from git tags
- npm publishing is triggered by GitHub Actions workflow on tag push
- Always verify both GitHub and npm reflect the new version
- Never include "Claude" or AI tool references in commits after removal request
