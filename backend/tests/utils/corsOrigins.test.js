const { isOriginAllowed, parseAllowedOrigins } = require('../../utils/corsOrigins');

describe('CORS origin matching', () => {
  const patterns = parseAllowedOrigins(
    'https://kampuskart.vercel.app, https://kampuskart-*-gaurav.vercel.app/'
  );

  test('always allows the local development origins', () => {
    expect(isOriginAllowed('http://localhost:5173', patterns)).toBe(true);
  });

  test('allows exact production origins', () => {
    expect(isOriginAllowed('https://kampuskart.vercel.app', patterns)).toBe(true);
  });

  test('allows preview deployments that match a wildcard entry', () => {
    expect(isOriginAllowed('https://kampuskart-git-main-gaurav.vercel.app', patterns)).toBe(true);
  });

  test('wildcards never cross a dot, so other subdomains and hosts are rejected', () => {
    expect(isOriginAllowed('https://kampuskart-x.evil.com-gaurav.vercel.app', patterns)).toBe(
      false
    );
    expect(isOriginAllowed('https://attacker.vercel.app', patterns)).toBe(false);
    expect(isOriginAllowed('https://kampuskart.vercel.app.evil.com', patterns)).toBe(false);
  });
});
