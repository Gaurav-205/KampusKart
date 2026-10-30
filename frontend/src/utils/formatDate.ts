type DateInput = string | number | Date | null | undefined;

const toDate = (value: DateInput): Date | null => {
  if (value === null || value === undefined || value === '') return null;
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

/** "October 24, 2026". Returns an empty string for missing or invalid dates. */
export const formatDate = (value: DateInput): string =>
  toDate(value)?.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) ?? '';

/** "Oct 24, 2026". Used where space is tight, such as date ranges on cards. */
export const formatShortDate = (value: DateInput): string =>
  toDate(value)?.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) ?? '';

/** "Oct 24, 2026, 4:05 PM". */
export const formatDateTime = (value: DateInput): string =>
  toDate(value)?.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }) ?? '';

/** Today's date in the user's time zone as YYYY-MM-DD, for <input type="date"> defaults. */
export const todayInputValue = (): string => {
  const now = new Date();
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
};
