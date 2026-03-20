#!/bin/bash

# AppClean GitHub Setup Script
# This script automates the setup and deployment process

set -e

echo "╔════════════════════════════════════════════════════════════════╗"
echo "║          AppClean - GitHub Setup Automation                   ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check prerequisites
echo -e "${BLUE}[1/5]${NC} Checking prerequisites..."
if ! command -v git &> /dev/null; then
    echo -e "${RED}❌ Git is not installed${NC}"
    exit 1
fi

if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ npm is not installed${NC}"
    exit 1
fi

if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is not installed${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Git, npm, and Node.js found${NC}"
echo ""

# Get GitHub username
echo -e "${BLUE}[2/5]${NC} Getting your GitHub username..."
read -p "Enter your GitHub username: " GITHUB_USERNAME

if [ -z "$GITHUB_USERNAME" ]; then
    echo -e "${RED}❌ GitHub username is required${NC}"
    exit 1
fi

echo -e "${GREEN}✓ GitHub username: $GITHUB_USERNAME${NC}"
echo ""

# Get email and name
echo -e "${BLUE}[3/5]${NC} Getting your information..."
read -p "Enter your name: " USER_NAME
read -p "Enter your email: " USER_EMAIL

if [ -z "$USER_NAME" ] || [ -z "$USER_EMAIL" ]; then
    echo -e "${RED}❌ Name and email are required${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Name: $USER_NAME${NC}"
echo -e "${GREEN}✓ Email: $USER_EMAIL${NC}"
echo ""

# Configure git
echo -e "${BLUE}[4/5]${NC} Configuring Git..."
git config user.name "$USER_NAME"
git config user.email "$USER_EMAIL"

# Update package.json
sed -i '' "s|YOUR_USERNAME|$GITHUB_USERNAME|g" package.json
sed -i '' "s|Your Name|$USER_NAME|g" package.json

echo -e "${GREEN}✓ Git configured${NC}"
echo -e "${GREEN}✓ package.json updated${NC}"
echo ""

# Setup git remote
echo -e "${BLUE}[5/5]${NC} Setting up Git remote..."

git remote rm origin 2>/dev/null || true
git remote add origin "https://github.com/$GITHUB_USERNAME/appclean.git"

# Rename master to main
if git rev-parse --verify master &>/dev/null; then
    git branch -m master main
fi

echo -e "${GREEN}✓ Git remote configured${NC}"
echo ""

# Summary
echo "╔════════════════════════════════════════════════════════════════╗"
echo -e "${GREEN}✓ Setup Complete!${NC}"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""

echo -e "${YELLOW}Next Steps:${NC}"
echo ""
echo "1. Create GitHub repository:"
echo "   👉 Visit: https://github.com/new"
echo "   - Name: appclean"
echo "   - Description: A powerful CLI tool to intelligently find and safely uninstall applications"
echo "   - Public"
echo ""
echo "2. Push to GitHub:"
echo "   ${BLUE}git push -u origin main${NC}"
echo ""
echo "3. Setup npm:"
echo "   ${BLUE}npm login${NC}"
echo ""
echo "4. Publish to npm:"
echo "   ${BLUE}git tag v1.0.0${NC}"
echo "   ${BLUE}git push origin v1.0.0${NC}"
echo "   ${BLUE}npm publish${NC}"
echo ""
echo -e "${YELLOW}Repository will be at:${NC}"
echo "  📦 GitHub: https://github.com/$GITHUB_USERNAME/appclean"
echo "  📝 npm: https://npmjs.com/package/appclean"
echo ""
echo -e "${YELLOW}For detailed instructions, see:${NC}"
echo "  📖 SETUP_GITHUB.md"
echo "  📖 QUICKSTART.md"
echo ""
