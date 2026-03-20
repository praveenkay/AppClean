# Release Management Guide

This document outlines the standard process for releasing new versions of AppClean and ensuring all documentation is properly updated.

---

## ✅ Pre-Release Checklist

Before starting a release, ensure:
- [ ] All features are implemented and tested
- [ ] All tests pass: `npm test`
- [ ] Build succeeds: `npm run build`
- [ ] No console errors or warnings
- [ ] Code is reviewed and approved
- [ ] No breaking changes without major version bump

---

## 📋 Step-by-Step Release Process

### Step 1: Version Bump
Update the version number in all files:

```bash
# 1a. Update package.json
# Change the "version" field to new version (e.g., "2.0.4")

# 1b. Update src/index.ts
# Change const VERSION = 'X.X.X' to the new version

# 1c. Commit the version bump
git add package.json src/index.ts
git commit -m "chore: Bump version to X.X.X"
```

### Step 2: Feature Implementation
Implement and test all features for this release:

```bash
# Feature commits
git add <files>
git commit -m "feat(category): Add feature description"

# Bug fix commits
git add <files>
git commit -m "fix(category): Fix description"

# Test commits
git add <files>
git commit -m "test: Add tests for feature"
```

### Step 3: 🔴 **CRITICAL - Documentation Updates**

**This step is mandatory for every release!**

#### 3a. Update README.md

```bash
# Update version badge
# Find: [![version](https://img.shields.io/badge/version-X.X.X-blue...
# Replace version number to new version

# Update installation command
# Find: npm install -g appclean@X.X.X
# Replace with new version

# Update "What's New" section
# - Change v2.0.2 to vX.X.X
# - Add new features with emojis
# - Move previous features to "Previous Features" subsection
```

#### 3b. Update CHANGELOG.md

```bash
# Add new entry at the top under "## Unreleased"
# Follow this format:

## [X.X.X] - YYYY-MM-DD

### Added
- 🎉 New feature 1
- 🎯 New feature 2

### Improved
- 📈 Improvement 1
- 🔧 Improvement 2

### Fixed
- 🐛 Bug fix 1
- 🐛 Bug fix 2
```

#### 3c. Verify Logo Consistency

```bash
# Ensure logo is identical across platforms
# 1. Check main logo: assets/logo.svg
# 2. Check GUI logo: src/ui/client/assets/logo.svg
# 3. Sync if different: cp assets/logo.svg src/ui/client/assets/logo.svg
# 4. Verify they display identically in README and website
```

#### 3d. Commit Documentation Changes

```bash
git add README.md CHANGELOG.md src/ui/client/assets/logo.svg
git commit -m "docs: Update README and CHANGELOG for vX.X.X"
```

### Step 4: Git Tag and Push

```bash
# Create annotated tag (important for GitHub releases)
git tag -a vX.X.X -m "Release vX.X.X: Brief description of major changes"

# Push commits to main branch
git push origin main

# Push tag (this triggers GitHub Actions automatically!)
git push origin vX.X.X
```

### Step 5: Verify Automation

Wait and verify the following:

```bash
# 1. GitHub Actions workflow runs automatically (check Actions tab)
# 2. npm package is published (takes 1-2 minutes)
npm view appclean versions --json | tail -5

# 3. GitHub Release is created (check Releases tab)
# Should show auto-generated release notes from commits

# 4. Verify npm package details
npm view appclean@X.X.X
```

### Step 6: Verification & Testing

- [ ] Version badge shows in npm: `npm view appclean@X.X.X`
- [ ] GitHub Release exists: `github.com/praveenkay/AppClean/releases/tag/vX.X.X`
- [ ] GUI displays correct version: Test locally with `appclean gui`
- [ ] Logo displays consistently across platforms
- [ ] README shows updated version and features
- [ ] CHANGELOG shows new version entry

---

## 🔍 Verification Commands

### Check NPM Publishing
```bash
# View latest version
npm view appclean version

# View all versions
npm view appclean versions --json

# View specific version details
npm view appclean@2.0.3

# Install latest version locally
npm install -g appclean@latest
appclean --version
```

### Check GitHub Release
```bash
# Check GitHub API for release
curl https://api.github.com/repos/praveenkay/AppClean/releases/latest

# Check specific tag
git tag -l vX.X.X -n5
```

### Local Testing
```bash
# Build locally
npm run build

# Test GUI locally
node dist/index.js gui

# Verify version in GUI navbar (should show vX.X.X)
```

---

## 📝 Commit Message Format

Follow this format for clear commit history:

### Feature
```
feat(scope): Add new feature
- Description line 1
- Description line 2
```

### Bug Fix
```
fix(scope): Fix issue description
- Root cause explanation
- What was changed
```

### Documentation
```
docs: Update README and CHANGELOG for vX.X.X
```

### Chore
```
chore: Bump version to X.X.X
```

### Test
```
test: Add tests for feature
```

---

## 🎯 Release Checklist Template

Use this for every release:

```markdown
## Release vX.X.X Checklist

- [ ] Version bumped in package.json
- [ ] Version updated in src/index.ts
- [ ] All features implemented and tested
- [ ] All tests pass: npm test
- [ ] Build succeeds: npm run build
- [ ] README.md version badge updated
- [ ] README.md installation command updated
- [ ] README.md "What's New" section updated
- [ ] CHANGELOG.md entry added with [X.X.X] - YYYY-MM-DD
- [ ] Logo consistency verified across platforms
- [ ] Git commits created with proper messages
- [ ] Git tag created: git tag -a vX.X.X -m "..."
- [ ] Main branch pushed: git push origin main
- [ ] Tag pushed: git push origin vX.X.X
- [ ] GitHub Actions workflow triggered
- [ ] npm package published: npm view appclean@X.X.X
- [ ] GitHub Release created automatically
- [ ] Version displays correctly in GUI
- [ ] Documentation verified and consistent
```

---

## ⚠️ Important Notes

### Documentation is NOT Optional
- Every release MUST update README.md and CHANGELOG.md
- Version badges must match across all platforms
- "What's New" section must be current
- Logos must be consistent and identical

### GitHub Actions Automation
- Pushing a `vX.X.X` tag automatically:
  - Builds the project
  - Publishes to npm registry
  - Creates a GitHub Release
  - Generates changelog from commit history

### Logo Consistency
- Same logo must appear in:
  - README.md
  - GitHub repository (social preview)
  - GUI application navbar
  - npm package page
  - Website (if applicable)

### Contributor Management
- Maintain `CODEOWNERS` file with proper maintainers
- Do not include tool/AI references in commits after removal request
- Ensure contributor list reflects actual maintainers

---

## 🚀 Quick Release Command Summary

```bash
# 1. Bump version
# Edit: package.json, src/index.ts
git add . && git commit -m "chore: Bump version to 2.0.4"

# 2. Implement features
git add . && git commit -m "feat: Add new features"

# 3. Update documentation
# Edit: README.md, CHANGELOG.md
git add . && git commit -m "docs: Update README and CHANGELOG for v2.0.4"

# 4. Tag and push
git tag -a v2.0.4 -m "Release v2.0.4: Feature description"
git push origin main
git push origin v2.0.4

# 5. Verify
npm view appclean versions --json
npm view appclean@2.0.4
```

---

## 📞 Support

For questions about the release process:
- Check this guide first
- Review recent release commits in git history
- Check GitHub Actions logs for workflow details
- Open an issue on GitHub for release-related problems
