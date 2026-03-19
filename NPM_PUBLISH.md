# 📦 Publishing AppClean to npm

Your AppClean is ready to be published to npm! Follow these simple steps to publish your package.

## ✅ What's Ready

- ✅ Code is complete and built
- ✅ GitHub repository is public: https://github.com/praveenkay/AppClean
- ✅ Version tagged as v1.0.0
- ✅ README updated with professional design
- ✅ Logo added
- ✅ All documentation in place

## 🚀 How to Publish to npm

### Step 1: Create npm Account (if you don't have one)

1. Visit https://www.npmjs.com/signup
2. Sign up with your email
3. Verify your email address

### Step 2: Login to npm (One-time)

```bash
npm login
```

You'll be prompted for:
- **Username**: Your npm username
- **Password**: Your npm password
- **Email**: Your email address
- **OTP** (if 2FA is enabled): Enter the code from your authenticator

### Step 3: Verify Login

```bash
npm whoami
```

This should display your npm username if you're logged in.

### Step 4: Publish to npm

Navigate to the project directory and run:

```bash
cd /tmp/appclean
npm publish
```

### Success!

Once published, users can install AppClean with:

```bash
npm install -g appclean
```

Your package will be available at:
- **npm**: https://npmjs.com/package/appclean
- **GitHub**: https://github.com/praveenkay/AppClean

## 📝 Future Releases

To release a new version in the future:

```bash
# Update version (patch, minor, or major)
npm version patch

# Push to GitHub
git push origin main
git push origin v1.0.1

# Publish to npm
npm publish
```

## 🔑 API Token (Alternative Method)

If you prefer using an API token instead of your password:

1. Go to https://www.npmjs.com/settings/tokens
2. Create a new "Automation" token
3. Create `.npmrc` file in your home directory:

```bash
echo "//registry.npmjs.org/:_authToken=YOUR_TOKEN_HERE" > ~/.npmrc
```

4. Then run: `npm publish`

## ✨ What Happens After Publishing

1. Package becomes available on npm registry
2. Users can install with `npm install -g appclean`
3. GitHub Actions will auto-publish future releases when you tag

## 🎯 Quick Checklist

- [ ] Create npm account at https://npmjs.com
- [ ] Run `npm login` to authenticate
- [ ] Run `npm whoami` to verify
- [ ] Run `npm publish` to publish
- [ ] Visit https://npmjs.com/package/appclean to verify
- [ ] Test installation: `npm install -g appclean`

## 📞 Need Help?

- **npm Documentation**: https://docs.npmjs.com
- **npm CLI Docs**: https://docs.npmjs.com/cli-documentation
- **GitHub Releases**: https://github.com/praveenkay/AppClean/releases

---

**Your AppClean is ready! Just follow the 4 steps above to publish.** 🚀
