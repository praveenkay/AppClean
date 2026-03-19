# Pushing AppClean to GitHub

This guide will help you create a new GitHub repository and push the AppClean project.

## Prerequisites

- GitHub account (free or paid)
- Git installed on your machine
- The appclean project directory

## Step-by-Step Instructions

### 1. Create a New Repository on GitHub

1. Go to https://github.com/new
2. Fill in the repository details:
   - **Repository name**: `appclean`
   - **Description**: `A powerful CLI tool to intelligently find and safely uninstall applications`
   - **Public** (to make it open-source)
   - **Do NOT initialize** with README, .gitignore, or license (we already have them)
3. Click "Create repository"
4. GitHub will show you the repository URL and commands

### 2. Add Remote and Push

Copy the repository URL from GitHub, then run:

```bash
cd /tmp/appclean

# Add GitHub as remote (replace YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/appclean.git

# Rename branch to main (optional but recommended)
git branch -m master main

# Push to GitHub
git push -u origin main
```

### 3. Set Up NPM Publishing

#### Create an NPM Account

1. Go to https://www.npmjs.com/signup
2. Create a free account
3. Verify your email

#### Configure NPM Locally

```bash
# Login to npm (one time)
npm login

# You'll be prompted for:
# - Username
# - Password
# - Email
# - One-time password (if 2FA enabled)
```

#### Update package.json with Your Details

Edit `package.json` and update:

```json
{
  "name": "appclean",
  "author": "Your Name <your.email@example.com>",
  "repository": {
    "type": "git",
    "url": "https://github.com/YOUR_USERNAME/appclean.git"
  },
  "homepage": "https://github.com/YOUR_USERNAME/appclean#readme",
  "bugs": {
    "url": "https://github.com/YOUR_USERNAME/appclean/issues"
  }
}
```

Commit the changes:

```bash
git add package.json
git commit -m "chore: update package metadata"
git push origin main
```

### 4. Create a Version Tag and Publish to npm

```bash
# Create a version tag
git tag v1.0.0

# Push the tag
git push origin v1.0.0

# Publish to npm
npm publish
```

Your package will now be available at:
- npm: https://npmjs.com/package/appclean
- GitHub: https://github.com/YOUR_USERNAME/appclean

### 5. Set Up GitHub Actions (CI/CD)

The workflows in `.github/workflows/` are already configured!

#### For Publishing Automation

To enable automatic publishing on tag push:

1. Go to GitHub > Settings > Secrets and variables > Actions
2. Click "New repository secret"
3. Add secret:
   - **Name**: `NPM_TOKEN`
   - **Value**: Your npm token from https://www.npmjs.com/settings/tokens
4. Create a "Publish" token with "Automation" type
4. Copy the token and paste it as the secret value

Now when you create a version tag, GitHub Actions will automatically:
- Build the project
- Run tests
- Publish to npm
- Create a release

### 6. Installation Instructions for Users

Once published, users can install with:

```bash
npm install -g appclean
```

## Verification

### Verify Git is Set Up Correctly

```bash
cd /tmp/appclean

# Check remote
git remote -v

# Check branch
git branch -a

# Check commit history
git log --oneline
```

### Verify npm Package

After publishing, check:

```bash
# View package on npm
npm view appclean

# Install globally (after publishing)
npm install -g appclean

# Verify installation
appclean --version
```

## After Publishing

### Update Version for Next Release

```bash
# Update version in package.json
npm version patch  # or minor/major

# This automatically:
# - Updates package.json version
# - Creates a commit
# - Creates a git tag

# Push the changes
git push origin main
git push origin v1.0.1  # push the new tag
```

### Create Release Notes on GitHub

1. Go to your repository
2. Click "Releases" tab
3. Click "Draft a new release"
4. Select the tag you just pushed
5. Add release notes describing the changes
6. Click "Publish release"

## Troubleshooting

### Problem: "Repository not found" when pushing

**Solution**: Make sure you're using the correct GitHub URL and have SSH keys/credentials set up.

```bash
# Try with HTTPS first
git remote set-url origin https://github.com/YOUR_USERNAME/appclean.git
```

### Problem: "npm ERR! 403 Forbidden" when publishing

**Solution**: Make sure you:
- Are logged in to npm: `npm login`
- Have the correct npm token in GitHub Actions
- The package name is unique (not already taken)

### Problem: "npm ERR! You do not have permission"

**Solution**: You need to own the npm package name. If it already exists, use a different name in package.json.

## Next Steps

1. ✅ Push code to GitHub
2. ✅ Publish to npm registry
3. Test the installation globally
4. Announce to the community
5. Gather feedback and contributions
6. Iterate and release new versions

## GitHub Topics

After pushing, add these topics to your repository for discoverability:

1. Go to Settings > Topics
2. Add: `uninstaller`, `cli`, `npm`, `app-management`, `cross-platform`, `typescript`

## License Reminder

Your project is now under MIT License. Anyone can use, modify, and distribute it (with attribution).

---

**Congratulations! AppClean is now open-source on GitHub and npm! 🚀**
