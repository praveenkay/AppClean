# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.8.0] - 2026-03-18

### Added
- Performance Optimizer module for large system scans
- Parallel scanning with configurable thread count
- Scan metrics and performance tracking
- Scan result caching system
- Optimization recommendations based on scan metrics
- Performance report generation
- Configurable exclusion patterns for optimized scanning

### Features
- 🚀 Multi-threaded scanning for better performance
- 📊 Detailed performance metrics and reporting
- 💾 Intelligent caching to speed up subsequent scans
- 🎯 Recommendations engine for optimization

## [1.7.0] - 2026-03-18

### Added
- App Update Checker module
- Automatic update detection for all supported package managers
- Version comparison and update availability checking
- Installation command generation for updates
- Support for npm, yarn, pnpm, Homebrew, apt, yum, dnf
- Update summary and reporting

### Features
- 🔄 Check for available updates
- 📦 Support for all major package managers
- 💾 Semantic version comparison
- 📋 Update recommendations

## [1.6.0] - 2026-03-18

### Added
- Scheduled Cleanup Automation module
- Recurring cleanup schedules (daily, weekly, monthly, custom cron)
- Schedule management API
- Cleanup results recording
- Enable/disable schedules
- Custom cleanup options per schedule
- Persistent schedule storage

### Features
- ⏰ Automated cleanup scheduling
- 🔄 Multiple frequency options
- 💾 Schedule persistence
- 📊 Cleanup result tracking
- 🛡️ Dry-run and backup options per schedule

## [1.5.0] - 2026-03-18

### Added
- Plugin System for Custom Detectors
- Extensible architecture for custom app detectors
- Plugin registration and lifecycle management
- Plugin configuration system
- Plugin execution for detection, artifact finding, and removal
- Plugin information and capability tracking
- Plugin enable/disable functionality

### Features
- 🔌 Pluggable architecture
- 📦 Custom detector support
- ⚙️ Plugin configuration management
- 🎯 Multi-plugin execution pipeline
- 📊 Plugin information and discovery

## [1.4.0] - 2026-03-18

### Added
- Orphaned Dependency Detector module
- Identification of npm packages with no dependencies
- Project package scanning
- Dependency tracking and analysis
- Detailed orphaned package information
- Potential space savings calculation
- Support for global and local package detection

### Features
- 🔍 Find unused npm packages
- 📊 Dependency analysis
- 💾 Space savings estimation
- 🛡️ Safe identification without removal

## [1.3.0] - 2026-03-18

### Added
- Duplicate File Finder module
- SHA256 hash-based duplicate detection
- Multi-directory scanning
- Potential space savings calculation
- Duplicate file grouping and reporting
- Configurable scan depth and performance
- File size and hash-based analysis

### Features
- 🔍 Find duplicate files by hash
- 📊 Group duplicates by content
- 💾 Calculate space savings
- ⚡ Efficient recursive scanning
- 📋 Duplicate file reporting

## [1.2.0] - 2026-03-18

### Added
- GUI Server module for web-based interface
- Cross-platform GUI support (macOS, Linux, Windows)
- Modern, responsive HTML interface
- Web server foundation for GUI
- API endpoint structure
- Beautiful UI design with gradient styling

### Features
- 🎨 Web-based graphical interface
- 🌐 Modern, responsive design
- 💻 Cross-platform support
- 🎯 Visual app management
- 📱 Touch-friendly interface

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
