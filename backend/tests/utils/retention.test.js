const { readDays, daysAgo } = require('../../config/retention');

describe('retention config', () => {
  afterEach(() => {
    delete process.env.TEST_RETENTION_DAYS;
  });

  test('uses the env value when it is a positive integer', () => {
    process.env.TEST_RETENTION_DAYS = '30';
    expect(readDays('TEST_RETENTION_DAYS', 14)).toBe(30);
  });

  test.each(['', 'abc', '0', '-5'])('falls back to the default for %p', (value) => {
    process.env.TEST_RETENTION_DAYS = value;
    expect(readDays('TEST_RETENTION_DAYS', 14)).toBe(14);
  });

  test('daysAgo subtracts whole days', () => {
    expect(daysAgo(14, new Date('2026-10-30T12:00:00Z')).toISOString()).toBe(
      '2026-10-16T12:00:00.000Z'
    );
  });
});
