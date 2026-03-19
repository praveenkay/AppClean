# Security Policy

## Reporting Security Issues

**Do not open public GitHub issues for security vulnerabilities.**

If you discover a security vulnerability in AppClean, please report it responsibly by:

1. **Email**: Send details to the maintainer via GitHub (check profile for contact)
2. **GitHub Security Advisory**: Use GitHub's private vulnerability reporting feature
3. **Include**:
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if you have one)

We will:
- Acknowledge receipt within 48 hours
- Provide a timeline for a fix
- Credit you in the advisory (unless you prefer anonymity)
- Work with you on the patch

## Supported Versions

| Version | Status | Support |
|---------|--------|---------|
| 1.8.x | Current | Security + Bug fixes |
| 1.7.x | Active | Security fixes only |
| < 1.7.0 | Outdated | Best effort |

## Security Considerations

### What AppClean Does
- Reads file system metadata
- Executes system commands (with your permission)
- Stores operation records locally
- Creates backups of removed artifacts

### What AppClean Does NOT Do
- Modify system files outside designated removal targets
- Send data to external servers
- Collect personal information
- Store sensitive data

### Best Practices
1. **Always use `--dry-run` first** to preview what will be removed
2. **Create backups** before major removals (`--backup` flag)
3. **Run as regular user** when possible, not as root
4. **Review removal details** before confirming
5. **Keep AppClean updated** to get security patches

## Dependencies

AppClean has minimal dependencies:

```json
{
  "chalk": "^4.1.2",
  "commander": "^11.1.0",
  "inquirer": "^8.2.6",
  "ora": "^5.4.1"
}
```

We monitor dependencies for security updates using:
- npm audit
- Dependabot
- Manual reviews

## Data Privacy

- **No external connections**: AppClean only reads/writes local files
- **No data collection**: No usage statistics or telemetry
- **Transparent operations**: All actions are logged locally
- **User control**: You control what gets removed

## Disclosure Policy

We follow responsible disclosure:

1. Vulnerability reported privately
2. We develop and test a fix
3. Security patch released
4. Public disclosure and credit (with your consent)
5. CVE assigned if critical

## Compliance

AppClean is designed to:
- Respect file permissions
- Work with system security features
- Maintain audit trails
- Support air-gapped/offline usage

## Contact

For security concerns:
- Check GitHub profile for current contact method
- Use GitHub's private vulnerability reporting
- Refer to this document for process

---

**Thank you for helping keep AppClean secure! 🔒**
