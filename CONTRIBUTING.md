# Contributing to AppClean

Thank you for your interest in contributing to AppClean! We welcome contributions of all kinds - bug reports, feature suggestions, documentation improvements, and code contributions.

## Getting Started

### Prerequisites

- Node.js >= 16.0.0
- npm >= 7.0.0
- Git

### Development Setup

1. Fork the repository
2. Clone your fork:
   ```bash
   git clone https://github.com/YOUR_USERNAME/appclean.git
   cd appclean
   ```

3. Add the original repository as upstream:
   ```bash
   git remote add upstream https://github.com/ORIGINAL_OWNER/appclean.git
   ```

4. Install dependencies:
   ```bash
   npm install
   ```

5. Build the project:
   ```bash
   npm run build
   ```

### Development Workflow

1. Create a feature branch:
   ```bash
   git checkout -b feature/my-feature
   ```

2. Make your changes and test them:
   ```bash
   npm run dev          # Run in dev mode
   npm run build        # Build TypeScript
   npm test             # Run tests
   ```

3. Commit with clear messages:
   ```bash
   git commit -m "feat: add new feature"
   ```

4. Push to your fork:
   ```bash
   git push origin feature/my-feature
   ```

5. Create a Pull Request on GitHub

## Code Style

- Use TypeScript for all code
- Follow the existing code style
- Use meaningful variable and function names
- Add comments for complex logic
- Use proper error handling

### Formatting

We use Prettier for code formatting. The project should auto-format on commit via pre-commit hooks.

## Testing

- Write tests for new features
- Run tests before submitting PR: `npm test`
- Aim for >80% code coverage

## Commit Messages

Follow conventional commits format:

```
type(scope): description

body (optional)

footer (optional)
```

Types: feat, fix, docs, style, refactor, test, chore

Examples:
- `feat(npm): add yarn support`
- `fix(remover): handle permission errors`
- `docs(readme): update installation instructions`

## Pull Request Guidelines

1. **Title**: Clear and descriptive
2. **Description**: Explain what changes and why
3. **Testing**: Describe how to test the changes
4. **Screenshots**: Add if UI changes
5. **Documentation**: Update README if needed

## Reporting Bugs

Use GitHub Issues with:
- **Clear title**: What's the problem
- **Steps to reproduce**: How to trigger the bug
- **Expected behavior**: What should happen
- **Actual behavior**: What actually happens
- **Environment**: OS, Node version, etc.
- **Logs**: Error messages or console output

## Suggesting Features

Use GitHub Discussions or Issues with:
- **Problem statement**: What's the need
- **Proposed solution**: How to solve it
- **Alternatives**: Other possible approaches
- **Use cases**: Real-world examples

## Documentation

- README.md: User-facing documentation
- Code comments: For complex logic
- Inline docs: JSDoc comments for functions
- Examples: Usage examples in README

## Directory Structure

```
appclean/
├── src/
│   ├── index.ts           # Entry point
│   ├── core/              # Core functionality
│   ├── managers/          # Package manager integrations
│   ├── ui/                # User interface
│   ├── types/             # TypeScript types
│   └── utils/             # Utilities
├── test/                  # Test files
├── .github/workflows/     # CI/CD
└── docs/                  # Additional documentation
```

## Running Different Scenarios

```bash
# Search for apps
npm run dev -- search npm

# List all apps
npm run dev -- list

# Analyze an app
npm run dev -- analyze lodash

# Remove with dry-run
npm run dev -- remove myapp --dry-run
```

## Key Files to Know

- `src/index.ts` - CLI entry point and command setup
- `src/core/detector.ts` - App detection logic
- `src/core/remover.ts` - App removal logic
- `src/managers/*` - Package manager specific code
- `src/ui/menu.ts` - Interactive menu interface

## Common Issues

### Build fails
```bash
npm run clean
npm install
npm run build
```

### Tests fail
- Ensure all dependencies are installed
- Check Node version (16+)
- Run in clean environment

### Permission errors
- Some operations require `sudo`
- Use `sudo npm run dev` for testing system packages

## Questions?

- Check existing issues and discussions
- Create a new discussion for questions
- Comment on related PRs/issues

## Code Review Process

1. Automated checks must pass (linting, tests, build)
2. At least one review approval
3. All conversations resolved
4. Mergeable with no conflicts

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

**Thank you for contributing to AppClean! 🎉**
