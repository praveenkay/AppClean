# AppClean Release - Quick Start

## 🚀 Release in 5 Minutes

This is the fastest way to release a new version to both npm and GitHub.

### Step 1: Update Version (30 seconds)
```bash
# Update package.json
sed -i '' 's/"version": "2.0.2"/"version": "2.0.3"/' package.json

# Update src/index.ts
sed -i '' "s/const VERSION = '2.0.2'/const VERSION = '2.0.3'/" src/index.ts

# Verify
grep "version" package.json
grep "VERSION = " src/index.ts
```

### Step 2: Build & Test (1 minute)
```bash
npm run build
npm test --if-present || true
```

### Step 3: Commit (30 seconds)
```bash
git add package.json src/index.ts
git commit -m "chore: Bump version to 2.0.3"
```

### Step 4: Release (1 minute)
```bash
git tag -a v2.0.3 -m "Release v2.0.3: Brief description here"
git push origin main
git push origin v2.0.3
```

---

## ✨ What Happens Automatically

When you push the tag, GitHub Actions **automatically**:

1. ✅ Checks out your code
2. ✅ Sets up Node.js 20
3. ✅ Installs dependencies
4. ✅ Builds the project
5. ✅ Runs tests
6. ✅ **Publishes to npm** (using NPM_TOKEN)
7. ✅ **Creates GitHub release** with changelog
8. ✅ Posts success notification

**Total time**: ~3-5 minutes for the workflow to complete

---

## 🔍 Monitor Release

### Watch GitHub Actions (Real-time)
```bash
gh run list --workflow=npm-publish.yml -L 1
gh run view <run-number> --log
```

Or visit: https://github.com/praveenkay/AppClean/actions

### Verify npm Publication
```bash
npm view appclean version
npm view appclean@2.0.3
```

Or visit: https://www.npmjs.com/package/appclean

### Verify GitHub Release
Visit: https://github.com/praveenkay/AppClean/releases

---

## 📋 Checklist Before Release

- [ ] Code changes tested locally
- [ ] `npm run build` succeeds
- [ ] `npm test` passes (or skipped)
- [ ] Version updated in `package.json`
- [ ] Version updated in `src/index.ts`
- [ ] Changes committed to main branch
- [ ] Ready to push tag to trigger workflow

---

## 🎯 Common Release Examples

### Bug Fix Release (2.0.2 → 2.0.3)
```bash
sed -i '' 's/"version": "2.0.2"/"version": "2.0.3"/' package.json
sed -i '' "s/const VERSION = '2.0.2'/const VERSION = '2.0.3'/" src/index.ts
npm run build
git add package.json src/index.ts
git commit -m "chore: Bump version to 2.0.3"
git tag -a v2.0.3 -m "Release v2.0.3: Bug fixes and improvements"
git push origin main && git push origin v2.0.3
```

### Feature Release (2.0.3 → 2.1.0)
```bash
sed -i '' 's/"version": "2.0.3"/"version": "2.1.0"/' package.json
sed -i '' "s/const VERSION = '2.0.3'/const VERSION = '2.1.0'/" src/index.ts
npm run build
git add package.json src/index.ts
git commit -m "chore: Bump version to 2.1.0"
git tag -a v2.1.0 -m "Release v2.1.0: New features - browser auto-launch, improved detection"
git push origin main && git push origin v2.1.0
```

### Major Release (2.1.0 → 3.0.0)
```bash
sed -i '' 's/"version": "2.1.0"/"version": "3.0.0"/' package.json
sed -i '' "s/const VERSION = '2.1.0'/const VERSION = '3.0.0'/" src/index.ts
npm run build
git add package.json src/index.ts
git commit -m "chore: Bump version to 3.0.0"
git tag -a v3.0.0 -m "Release v3.0.0: Major redesign - breaking changes included"
git push origin main && git push origin v3.0.0
```

---

## ⚡ Status Dashboard

| Component | Status | Last Check |
|-----------|--------|-----------|
| npm Registry | ✅ Connected | 2026-03-20 |
| GitHub Secrets | ✅ NPM_TOKEN set | 2026-03-20 |
| Workflow (npm-publish.yml) | ✅ Active | 2026-03-20 |
| Test Workflow | ✅ Active | 2026-03-20 |
| Latest Release | ✅ v2.0.2 | 2026-03-20 |

---

## 🆘 Troubleshooting

### Workflow Failed
1. Check logs: `gh run view <number> --log`
2. Common issues:
   - NPM_TOKEN expired or revoked
   - Tag format incorrect (must be v*.*.*)
   - Build fails (`npm run build`)
   - Tests fail (`npm test`)

### Can't Push Tag
```bash
git fetch origin --tags
git push origin v2.0.3 --force
```

### Version Mismatch
Make sure both files are updated:
```bash
grep "version" package.json
grep "VERSION = " src/index.ts
```

---

## 🔗 Useful Links

- 📦 npm Package: https://www.npmjs.com/package/appclean
- 🔖 GitHub Releases: https://github.com/praveenkay/AppClean/releases
- ⚙️ GitHub Actions: https://github.com/praveenkay/AppClean/actions
- 📖 Full Guide: https://github.com/praveenkay/AppClean/blob/main/RELEASE_GUIDE.md

---

**Happy releasing! 🚀**
