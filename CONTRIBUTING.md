# Contributing to AppClean

First off, thanks for taking the time to contribute! 🎉

AppClean is an open source project and we love receiving contributions from our community. Whether it's a bug report, feature request, or code contribution, your help makes AppClean better.

## Code of Conduct

This project and everyone participating in it is governed by our [Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code.

## How Can I Contribute?

### 🐛 Reporting Bugs

Before creating bug reports, please check the issue list as you might find out that you don't need to create one. When you are creating a bug report, please include as many details as possible:

- **Use a clear and descriptive title**
- **Describe the exact steps which reproduce the problem**
- **Provide specific examples to demonstrate the steps**
- **Describe the behavior you observed after following the steps**
- **Explain which behavior you expected to see instead and why**
- **Include screenshots if possible**
- **Your environment:**
  - Operating System and version
  - Node.js version
  - npm/yarn/pnpm version
  - AppClean version

### 💡 Suggesting Enhancements

When creating enhancement suggestions, please include:

- **Use a clear and descriptive title**
- **Provide a step-by-step description of the suggested enhancement**
- **Provide specific examples to demonstrate the steps**
- **Describe the current behavior and expected behavior**
- **Explain why this enhancement would be useful**

### 📝 Code Contribution

**Did you write a patch that fixes a bug?**

- Open a new GitHub pull request with the patch.
- Ensure the PR description clearly describes the problem and solution.
- Include the relevant issue number if applicable.

**Do you intend to add a new feature or change an existing one?**

- Start by opening an issue first to discuss it with maintainers.
- Don't start coding until you get positive feedback.

**Do you have questions about the source code?**

- Ask in GitHub Discussions or open an issue with your question.

## Getting Started with Development

### Prerequisites

- Node.js 16 or higher
- npm 7 or higher
- Git

### Setup Development Environment

\`\`\`bash
# Clone the repository
git clone https://github.com/praveenkay/AppClean.git
cd AppClean

# Install dependencies
npm install

# Build TypeScript
npm run build

# Run in development mode
npm run dev

# Run tests
npm test
\`\`\`

### Development Workflow

1. **Create a feature branch:**
   \`\`\`bash
   git checkout -b feature/amazing-feature
   \`\`\`

2. **Make your changes and test:**
   \`\`\`bash
   npm run build
   npm test
   \`\`\`

3. **Commit with conventional commits:**
   \`\`\`bash
   git commit -m "feat: add amazing feature"
   \`\`\`

4. **Push and open a Pull Request**

## Conventional Commits

Use clear commit messages:

- `feat:` for new features
- `fix:` for bug fixes
- `docs:` for documentation
- `refactor:` for code refactoring
- `test:` for test changes
- `perf:` for performance improvements

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

**Happy contributing! 🚀**
