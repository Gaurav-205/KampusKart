# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |

## Reporting a Vulnerability

We take the security of KampusKart seriously. If you discover a security vulnerability, please follow these steps:

### How to Report

1. **DO NOT** create a public GitHub issue for security vulnerabilities
2. Open a [GitHub Security Advisory](https://github.com/Gaurav-205/KampusKart/security/advisories/new) — this keeps the report private and notifies the maintainer directly
3. Include the following information:
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if any)

### What to Expect

- **Response Time**: We aim to respond within 48 hours
- **Updates**: You'll receive updates on the progress every 7 days
- **Resolution**: We'll work to fix the issue as quickly as possible
- **Credit**: Security researchers will be credited (if desired)

## Security Measures

### Authentication & Authorization
- JWT-based authentication with secure token storage
- Password hashing using bcrypt (10 rounds)
- Google OAuth 2.0 integration
- Role-based access control (User/Admin)
- Session management with token expiration

### Data Protection
- Environment variables for sensitive data
- HTTPS enforcement in production
- CORS configuration with whitelist
- Input validation and sanitization
- XSS protection
- SQL injection prevention (MongoDB parameterized queries)

### API Security
- Rate limiting on all endpoints
- Request size limits
- File upload restrictions
- Secure HTTP headers (Helmet.js)
- CSRF protection

### Database Security
- MongoDB connection with authentication
- Encrypted connections (TLS/SSL)
- Regular backups
- Soft delete for data retention

### Infrastructure
- Secure deployment on Vercel and Render
- Environment variable encryption
- Regular dependency updates
- Security patches applied promptly

## Best Practices for Contributors

1. **Never commit sensitive data**
   - API keys
   - Passwords
   - Connection strings
   - Private keys

2. **Use environment variables**
   - Store all secrets in `.env` files
   - Never commit `.env` files
   - Use `.env.example` for templates

3. **Keep dependencies updated**
   - Run `npm audit` regularly
   - Update vulnerable packages
   - Review security advisories

4. **Follow secure coding practices**
   - Validate all user inputs
   - Sanitize data before database operations
   - Use parameterized queries
   - Implement proper error handling

5. **Test security features**
   - Test authentication flows
   - Verify authorization checks
   - Test input validation
   - Check for XSS vulnerabilities

## Security Checklist

- [x] Environment variables properly configured
- [x] `.env` files excluded from version control
- [x] JWT authentication implemented
- [x] Password hashing with bcrypt
- [x] CORS configured with whitelist
- [x] Rate limiting on critical endpoints
- [x] Input validation and sanitization
- [x] XSS protection
- [x] SQL injection prevention
- [x] Secure HTTP headers
- [x] OAuth 2.0 integration
- [x] File upload restrictions
- [x] Error handling without information leakage
- [x] Secure session management

## Vulnerability Disclosure Policy

We follow responsible disclosure practices:

1. **Private Disclosure**: Report vulnerabilities privately
2. **Investigation**: We investigate and verify the issue
3. **Fix Development**: We develop and test a fix
4. **Coordinated Release**: We coordinate the release with the reporter
5. **Public Disclosure**: After the fix is deployed, we publicly disclose the issue

## Contact

For security concerns:
- Open a [GitHub Security Advisory](https://github.com/Gaurav-205/KampusKart/security/advisories/new) (preferred — keeps report private)
- **GitHub**: [@Gaurav-205](https://github.com/Gaurav-205)

## Acknowledgments

We appreciate the security research community and will acknowledge researchers who responsibly disclose vulnerabilities (with their permission).
