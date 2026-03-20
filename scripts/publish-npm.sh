#!/bin/bash

# AppClean NPM Publishing Script
# Usage: ./scripts/publish-npm.sh [version]
# Example: ./scripts/publish-npm.sh 2.0.1

set -e

VERSION=${1:-}

if [ -z "$VERSION" ]; then
  echo "Usage: ./scripts/publish-npm.sh <version>"
  echo "Example: ./scripts/publish-npm.sh 2.0.1"
  exit 1
fi

# Check if npm is logged in
if ! npm whoami &>/dev/null; then
  echo "❌ Not logged into npm"
  echo "Please run: npm login"
  exit 1
fi

echo "📦 Publishing AppClean v$VERSION to npm..."

# Ensure clean working directory
if [ -n "$(git status --porcelain)" ]; then
  echo "❌ Working directory not clean. Please commit all changes."
  git status
  exit 1
fi

# Update version in package.json and src/index.ts
echo "📝 Updating version to $VERSION..."
sed -i.bak "s/\"version\": \"[^\"]*\"/\"version\": \"$VERSION\"/" package.json
sed -i.bak "s/const VERSION = '[^']*'/const VERSION = '$VERSION'/" src/index.ts
rm -f package.json.bak src/index.ts.bak

# Build the project
echo "🔨 Building project..."
npm run build

# Commit version changes
echo "📌 Committing version changes..."
git add package.json src/index.ts
git commit -m "chore: Bump version to $VERSION"

# Create git tag
echo "🏷️  Creating git tag v$VERSION..."
git tag -a "v$VERSION" -m "AppClean v$VERSION - Published to npm" || true

# Publish to npm
echo "🚀 Publishing to npm..."
npm publish

# Push changes and tags to origin
echo "📤 Pushing changes to origin..."
git push origin main
git push origin "v$VERSION" || true

echo ""
echo "✅ Successfully published AppClean v$VERSION"
echo "📍 View on npm: https://www.npmjs.com/package/appclean"
echo "🏷️  View on GitHub: https://github.com/praveenkay/AppClean/releases/tag/v$VERSION"
