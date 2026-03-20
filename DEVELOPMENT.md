# AppClean Development Guide

## Commit Message Standards

All commits should follow the format:

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Commit Types
- **feat**: New feature
- **fix**: Bug fix
- **docs**: Documentation changes
- **style**: Code style changes (no logic changes)
- **refactor**: Code refactoring
- **perf**: Performance improvements
- **test**: Test additions/changes
- **chore**: Build, dependencies, tooling
- **ci**: CI/CD configuration

### Example Commits

Good ✅
```
feat(gui): Add dark mode support
fix(dashboard): Resolve loading state issue
docs: Update installation instructions
chore: Update dependencies
```

### Important Notes

- **DO NOT** include tool attribution in commit messages
- **DO NOT** add "Co-Authored-By" lines unless there are actual human co-authors
- Keep commit messages clear and focused
- Use imperative mood ("Add" not "Added")
- Reference issues if applicable (#123)

## Git Hooks

A pre-commit hook is installed to prevent unauthorized references in commit messages.

To test:
```bash
git commit -m "fix: Some fix

Tool Attribution Line"  # This will be rejected
```

## Repository History

This repository has been cleaned of all tool attribution references. The code is built by the team, not by external tools.

## Future Releases

When releasing new versions:

1. Update version in `package.json`
2. Update VERSION in `src/index.ts`
3. Build and test: `npm run build && npm test`
4. Create commit: `git commit -m "chore: Bump version to X.Y.Z"`
5. Create tag: `git tag -a vX.Y.Z -m "AppClean vX.Y.Z"`
6. Push: `git push origin main && git push origin vX.Y.Z`

See `RELEASE_GUIDE.md` for detailed publishing instructions.

## Code Quality

- Follow existing code style
- Write meaningful variable/function names
- Add comments for complex logic
- Keep functions focused and modular
- Write tests for new features

## Support

For issues or questions about development, check:
- GitHub Issues: https://github.com/praveenkay/AppClean/issues
- GitHub Discussions: https://github.com/praveenkay/AppClean/discussions
