// Event dates are submitted as calendar days (YYYY-MM-DD) and stored at UTC midnight, so
// "which day is it" comparisons use UTC days. An event's stored status is what an admin set;
// the effective status also accounts for time passing, so past events stop showing "Upcoming".
const DAY_MS = 24 * 60 * 60 * 1000;

const startOfUtcDay = (date) => {
  const d = new Date(date);
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
};

const getEffectiveStatus = (event, now = new Date()) => {
  const stored = event.status || 'Upcoming';
  if (stored === 'Cancelled' || stored === 'Completed' || !event.date) return stored;

  const eventDay = startOfUtcDay(event.date).getTime();
  const today = startOfUtcDay(now).getTime();

  if (eventDay < today) return 'Completed';
  if (eventDay === today) return 'Ongoing';
  return stored;
};

// Mongo filter equivalent to "getEffectiveStatus(event) === status", so filtering and the
// displayed badge always agree.
const buildStatusFilter = (status, now = new Date()) => {
  const today = startOfUtcDay(now);
  const tomorrow = new Date(today.getTime() + DAY_MS);
  const active = { $in: ['Upcoming', 'Ongoing'] };

  switch (status) {
    case 'Upcoming':
      return { status: 'Upcoming', date: { $gte: tomorrow } };
    case 'Ongoing':
      return {
        $or: [
          { status: active, date: { $gte: today, $lt: tomorrow } },
          { status: 'Ongoing', date: { $gte: tomorrow } },
        ],
      };
    case 'Completed':
      return { $or: [{ status: 'Completed' }, { status: active, date: { $lt: today } }] };
    case 'Cancelled':
      return { status: 'Cancelled' };
    default:
      return null;
  }
};

const withEffectiveStatus = (event, now = new Date()) => {
  const plain = typeof event.toObject === 'function' ? event.toObject() : { ...event };
  plain.status = getEffectiveStatus(plain, now);
  return plain;
};

// Club recruitments: an "Open" drive is effectively closed once its end day has passed.
const getEffectiveClubStatus = (club, now = new Date()) => {
  if (club.status === 'Closed' || !club.endDate) return club.status || 'Open';
  return startOfUtcDay(club.endDate) < startOfUtcDay(now) ? 'Closed' : club.status || 'Open';
};

const buildClubStatusFilter = (status, now = new Date()) => {
  const today = startOfUtcDay(now);
  if (status === 'Open') return { status: 'Open', endDate: { $gte: today } };
  if (status === 'Closed') return { $or: [{ status: 'Closed' }, { endDate: { $lt: today } }] };
  return null;
};

const withEffectiveClubStatus = (club, now = new Date()) => {
  const plain = typeof club.toObject === 'function' ? club.toObject() : { ...club };
  plain.status = getEffectiveClubStatus(plain, now);
  return plain;
};

module.exports = {
  getEffectiveStatus,
  buildStatusFilter,
  withEffectiveStatus,
  getEffectiveClubStatus,
  buildClubStatusFilter,
  withEffectiveClubStatus,
  startOfUtcDay,
};
