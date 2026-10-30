// How long resolved records stay visible and how long soft-deleted records are kept before
// permanent deletion. Overridable per deployment; invalid values fall back to the defaults.
const readDays = (name, fallback) => {
  const value = Number.parseInt(process.env[name], 10);
  return Number.isFinite(value) && value > 0 ? value : fallback;
};

const RESOLVED_RETENTION_DAYS = readDays('RESOLVED_RETENTION_DAYS', 14);
const SOFT_DELETE_RETENTION_DAYS = readDays('SOFT_DELETE_RETENTION_DAYS', 7);

const daysAgo = (days, now = new Date()) => {
  const date = new Date(now);
  date.setDate(date.getDate() - days);
  return date;
};

module.exports = { RESOLVED_RETENTION_DAYS, SOFT_DELETE_RETENTION_DAYS, daysAgo, readDays };
