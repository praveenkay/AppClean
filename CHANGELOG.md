# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.0] - 2026-03-18

### Added
- Elevated permissions handling for system file operations
- Sudo/admin permission prompts for system package removal
- Service file detection with manual cleanup instructions (LaunchAgent/LaunchDaemon on macOS, systemd on Linux)
- User consent confirmation and operation recording
- Post-removal verification checking via file system and command line
- Comprehensive removal report generation (HTML and text formats)
- Professional legal disclaimers and liability notices
- Removal record tracking in ~/.appclean-records directory
- Report generation in ~/.appclean-reports directory
- Detailed verification status tracking (verified_removed, still_exists, partial_removal)
- PermissionHandler module for elevation management
- ServiceFileDetector module for service file discovery
- RemovalRecorder module for operation tracking
- VerificationModule for post-removal verification
- ReportGenerator module for comprehensive reports

### Features
- ✅ Automatic elevation permission detection and requests
- ✅ Service file identification requiring manual cleanup
- ✅ Complete removal verification with status reports
- ✅ Professional HTML and text report generation
- ✅ Comprehensive operation logging and tracking
- ✅ Legal disclaimers and no-liability notices
- ✅ Detailed artifact deletion tracking

### Changed
- Enhanced Remover class with v1.1.0 module integration
- Updated RemovalOptions interface with userConsent and reportFormat fields
- Improved removal workflow with verification and reporting

## [1.0.0] - 2026-03-19

### Added
- Initial release of AppClean
- Support for npm, yarn, and pnpm packages
- Homebrew package detection and removal (macOS/Linux)
- Linux package manager support (apt, yum, dnf)
- Custom binary installer detection
- Interactive CLI menu interface
- Dry-run preview functionality
- Backup creation before removal
- Deep artifact scanning (configs, caches, logs, data files)
- Cross-platform support (macOS, Linux, Windows)
- Comprehensive documentation and examples
- MIT License
- GitHub Actions CI/CD workflows
- npm package publishing

### Features
- 🔍 Smart app detection from multiple sources
- 📊 Installation method identification
- 🗂️ Artifact discovery and location tracking
- 🗑️ Safe removal with preview
- 💾 Backup support
- 🔄 Cross-platform compatibility
- 🎯 Interactive menu interface

### Planned Features (Future Releases)
- [ ] GUI application
- [ ] Duplicate file finder
- [ ] Orphaned dependency detection
- [ ] Plugin system for custom detectors
- [ ] Scheduled cleanup automation
- [ ] App update checker
- [ ] Performance optimization
- [ ] Snap package support

## [Unreleased]

### In Development
- Web UI interface
- Advanced filtering options
- Batch removal
- Statistics and reporting
