const {
  getEffectiveStatus,
  buildStatusFilter,
  getEffectiveClubStatus,
  buildClubStatusFilter,
} = require('../../services/scheduleStatus');

const now = new Date('2026-10-30T10:00:00Z');

describe('event effective status', () => {
  test.each([
    [
      'past Upcoming event becomes Completed',
      { status: 'Upcoming', date: '2026-10-29' },
      'Completed',
    ],
    [
      'Upcoming event on the current day is Ongoing',
      { status: 'Upcoming', date: '2026-10-30' },
      'Ongoing',
    ],
    [
      'future Upcoming event stays Upcoming',
      { status: 'Upcoming', date: '2026-11-02' },
      'Upcoming',
    ],
    [
      'past Ongoing event becomes Completed',
      { status: 'Ongoing', date: '2026-10-01' },
      'Completed',
    ],
    ['Cancelled is never overridden', { status: 'Cancelled', date: '2026-10-01' }, 'Cancelled'],
    [
      'manually Completed future event stays Completed',
      { status: 'Completed', date: '2026-12-01' },
      'Completed',
    ],
  ])('%s', (_label, event, expected) => {
    expect(getEffectiveStatus(event, now)).toBe(expected);
  });

  test('status filters match the effective status', () => {
    const today = new Date('2026-10-30T00:00:00Z');
    const tomorrow = new Date('2026-10-31T00:00:00Z');
    expect(buildStatusFilter('Upcoming', now)).toEqual({
      status: 'Upcoming',
      date: { $gte: tomorrow },
    });
    expect(buildStatusFilter('Completed', now)).toEqual({
      $or: [
        { status: 'Completed' },
        { status: { $in: ['Upcoming', 'Ongoing'] }, date: { $lt: today } },
      ],
    });
    expect(buildStatusFilter('All', now)).toBeNull();
  });
});

describe('club recruitment effective status', () => {
  test('an Open drive past its end date is Closed', () => {
    expect(getEffectiveClubStatus({ status: 'Open', endDate: '2026-10-29' }, now)).toBe('Closed');
  });

  test('an Open drive ending today is still Open', () => {
    expect(getEffectiveClubStatus({ status: 'Open', endDate: '2026-10-30' }, now)).toBe('Open');
  });

  test('Open filter excludes expired drives', () => {
    expect(buildClubStatusFilter('Open', now)).toEqual({
      status: 'Open',
      endDate: { $gte: new Date('2026-10-30T00:00:00Z') },
    });
  });
});
