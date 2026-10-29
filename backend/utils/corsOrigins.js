const DEFAULT_ORIGINS = ['http://localhost:3000', 'http://localhost:5000', 'http://localhost:5173'];

const escapeRegex = (value) => value.replace(/[.+?^${}()|[\]\\]/g, '\\$&');

// ALLOWED_ORIGINS is a comma-separated list. An entry may contain `*`, which matches a single
// DNS label fragment (letters, digits, hyphens; never a dot), so preview deployments such as
// https://kampuskart-*-gaurav.vercel.app can be allowed without opening up every *.vercel.app.
const parseAllowedOrigins = (raw = process.env.ALLOWED_ORIGINS) => {
  const extra = raw
    ? raw
        .split(',')
        .map((o) => o.trim().replace(/\/$/, ''))
        .filter(Boolean)
    : [];
  return [...DEFAULT_ORIGINS, ...extra];
};

const toMatcher = (pattern) => {
  if (!pattern.includes('*')) {
    return (origin) => origin === pattern;
  }
  const regex = new RegExp(`^${pattern.split('*').map(escapeRegex).join('[a-z0-9-]+')}$`, 'i');
  return (origin) => regex.test(origin);
};

const isOriginAllowed = (origin, patterns = parseAllowedOrigins()) =>
  patterns.some((pattern) => toMatcher(pattern)(origin));

module.exports = { parseAllowedOrigins, isOriginAllowed, DEFAULT_ORIGINS };
