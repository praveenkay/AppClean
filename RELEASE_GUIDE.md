# AppClean Release Guide

This guide explains how to release new versions of AppClean to npm and GitHub with **full automation**.

## ⚡ CRITICAL: Setup Required (One-time)

Before you can use automatic releases, you MUST set up **NPM_TOKEN** in GitHub Secrets:

### 1. Get NPM Token
```bash
npm token create --read-only
```
Visit: https://www.npmjs.com/settings/YOUR_USERNAME/tokens

### 2. Add to GitHub Secrets
1. Go to: https://github.com/praveenkay/AppClean/settings/secrets/actions
2. Click **"New repository secret"**
3. Name: `NPM_TOKEN`
4. Value: Paste your npm token
5. Click **"Add secret"**

⚠️ **Without this, automatic publishing will fail!**

---

## Quick Start

### Option 1: Automatic Publishing (Recommended)

Once GitHub Actions is set up, releases are published automatically:

1. **Create a git tag**:
   ```bash
   git tag -a v2.0.1 -m "AppClean v2.0.1 - Description here"
   git push origin v2.0.1
   ```

2. **GitHub Actions automatically**:
   - Builds the project
   - Runs tests
   - Publishes to npm
   - Creates a GitHub release

### Option 2: Manual Publishing via Script

Use the provided publish script to handle everything:

```bash
./scripts/publish-npm.sh 2.0.1
```

This script:
- Updates version in `package.json` and `src/index.ts`
- Builds the project
- Creates a git commit and tag
- Publishes to npm
- Pushes changes to GitHub

## Setup Requirements

### 1. npm Authentication

Set up npm credentials for publishing:

```bash
npm login
```

This creates an `.npmrc` file in your home directory with authentication tokens.

### 2. GitHub Actions (for automatic publishing)

Add NPM_TOKEN to GitHub Secrets:

1. Go to your repository settings: https://github.com/praveenkay/AppClean/settings/secrets/actions
2. Click "New repository secret"
3. Name: `NPM_TOKEN`
4. Value: Your npm authentication token

**To get your npm token**:
```bash
npm token create --read-only
```

Or view existing tokens at: https://www.npmjs.com/settings/YOUR_USERNAME/tokens

### 3. Ensure Files are Updated

Before releasing, make sure:

- ✅ `package.json` has correct version
- ✅ `src/index.ts` has correct VERSION constant
- ✅ Built files are up-to-date (`npm run build`)
- ✅ All tests pass (`npm test`)
- ✅ Changes are committed

## Release Process

### Step 1: Update Version

Update the version in both files:

```bash
# Edit package.json
"version": "2.0.1"

# Edit src/index.ts
const VERSION = '2.0.1';
```

### Step 2: Build and Test

```bash
npm run build
npm test
```

### Step 3: Commit Changes

```bash
git add package.json src/index.ts
git commit -m "chore: Bump version to 2.0.1"
```

### Step 4: Create Release

#### Option A: Via Git Tag (triggers GitHub Actions)

```bash
git tag -a v2.0.1 -m "AppClean v2.0.1 - Bug fixes and improvements"
git push origin main
git push origin v2.0.1
```

GitHub Actions will automatically:
- Build the project
- Publish to npm
- Create a GitHub release

#### Option B: Via Script

```bash
./scripts/publish-npm.sh 2.0.1
```

## Automated Workflow

The GitHub Actions workflow (`.github/workflows/npm-publish.yml`) handles:

1. **On every tag push** (`v*.*.*`):
   - Checkout code
   - Setup Node.js 20
   - Install dependencies
   - Build project
   - Run tests
   - Publish to npm (using NPM_TOKEN)
   - Create GitHub release

2. **On every GitHub release published**:
   - Same steps as above

## Checking Publication

After publishing, verify:

1. **npm Registry**:
   ```bash
   npm info appclean
   npm view appclean versions
   ```
   Or visit: https://www.npmjs.com/package/appclean

2. **GitHub Releases**:
   Visit: https://github.com/praveenkay/AppClean/releases

3. **Local Installation**:
   ```bash
   npm install -g appclean@2.0.1
   appclean --version
   ```

## Versioning Strategy

AppClean follows [Semantic Versioning](https://semver.org/):

- **Major** (X.0.0): Breaking changes
- **Minor** (X.Y.0): New features, backward compatible
- **Patch** (X.Y.Z): Bug fixes, no new features

Examples:
- Bug fix: 2.0.0 → 2.0.1
- New feature: 2.0.1 → 2.1.0
- Breaking change: 2.1.0 → 3.0.0

## Troubleshooting

### "Not logged into npm"

Run: `npm login`

### GitHub Actions failing

Check:
1. NPM_TOKEN is set in GitHub Secrets
2. Token hasn't expired
3. Token has publish permissions

### Version mismatch errors

Ensure both files are updated:
- `package.json`
- `src/index.ts`

## Release Checklist

- [ ] Update version in `package.json`
- [ ] Update VERSION constant in `src/index.ts`
- [ ] Run `npm run build`
- [ ] Run `npm test`
- [ ] Commit changes: `git commit -m "chore: Bump version to X.Y.Z"`
- [ ] Create tag: `git tag -a vX.Y.Z -m "Message"`
- [ ] Push: `git push origin main && git push origin vX.Y.Z`
- [ ] Verify npm publication
- [ ] Verify GitHub release created

## Example: Releasing v2.0.1

```bash
# 1. Update version files
echo 'Update package.json version to 2.0.1'
echo 'Update src/index.ts VERSION to 2.0.1'

# 2. Build and test
npm run build
npm test

# 3. Commit
git add package.json src/index.ts
git commit -m "chore: Bump version to 2.0.1"

# 4. Create release tag
git tag -a v2.0.1 -m "AppClean v2.0.1 - Bug fixes for GUI"

# 5. Push to trigger GitHub Actions
git push origin main
git push origin v2.0.1

# 6. Watch GitHub Actions publish automatically
# View at: https://github.com/praveenkay/AppClean/actions
```

## Support

For issues with publishing, check:
- GitHub Actions logs: https://github.com/praveenkay/AppClean/actions
- npm package page: https://www.npmjs.com/package/appclean
- GitHub releases: https://github.com/praveenkay/AppClean/releases
