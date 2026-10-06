/**
 * Returns milliseconds remaining until targetIso.
 * Returns 0 if already passed.
 */
export function msRemaining(targetIso) {
  if (!targetIso) return null;
  const diff = new Date(targetIso).getTime() - Date.now();
  return diff > 0 ? diff : 0;
}

/**
 * Formats a millisecond duration as "Xd Xh Xm Xs".
 */
export function formatDuration(ms) {
  if (ms === null || ms === undefined) return '—';
  if (ms <= 0) return 'Ready';

  const totalSecs = Math.floor(ms / 1000);
  const days = Math.floor(totalSecs / 86400);
  const hours = Math.floor((totalSecs % 86400) / 3600);
  const mins = Math.floor((totalSecs % 3600) / 60);
  const secs = totalSecs % 60;

  const parts = [];
  if (days > 0) parts.push(`${days}d`);
  if (hours > 0) parts.push(`${hours}h`);
  if (mins > 0) parts.push(`${mins}m`);
  parts.push(`${secs}s`);

  return parts.join(' ');
}

/**
 * Formats a duration more compactly for summary cards (no seconds).
 */
export function formatDurationShort(ms) {
  if (ms === null || ms === undefined) return '—';
  if (ms <= 0) return 'Ready';

  const totalMins = Math.floor(ms / 60000);
  const days = Math.floor(totalMins / 1440);
  const hours = Math.floor((totalMins % 1440) / 60);
  const mins = totalMins % 60;

  const parts = [];
  if (days > 0) parts.push(`${days}d`);
  if (hours > 0) parts.push(`${hours}h`);
  parts.push(`${mins}m`);

  return parts.join(' ');
}

/**
 * Formats a Date/ISO string as a readable local date-time string.
 */
export function formatDateTime(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleString(undefined, {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
}

/**
 * Returns a sort key (ms) for an email entry.
 * Uses the smallest non-null waiting reset time, or Infinity if fully ready/unset.
 */
export function emailSortKey(email) {
  const slots = [];

  const gms = email.gemini?.resetAt ? msRemaining(email.gemini.resetAt) : null;
  const oms = email.other?.resetAt ? msRemaining(email.other.resetAt) : null;

  if (gms !== null && email.gemini?.status === 'waiting') slots.push(gms);
  if (oms !== null && email.other?.status === 'waiting') slots.push(oms);

  if (slots.length === 0) return Infinity;
  return Math.min(...slots);
}

/**
 * Sorts emails by the requested sort option.
 */
export function sortEmails(emails, sortOption) {
  const copy = [...emails];

  switch (sortOption) {
    case 'soonest':
      return copy.sort((a, b) => emailSortKey(a) - emailSortKey(b));

    case 'latest':
      return copy.sort((a, b) => {
        const ak = emailSortKey(a);
        const bk = emailSortKey(b);
        // Put Infinity (ready/unset) at bottom even in latest sort
        if (ak === Infinity && bk === Infinity) return 0;
        if (ak === Infinity) return 1;
        if (bk === Infinity) return -1;
        return bk - ak;
      });

    case 'az':
      return copy.sort((a, b) => a.email.localeCompare(b.email));

    case 'za':
      return copy.sort((a, b) => b.email.localeCompare(a.email));

    default:
      return copy;
  }
}

/**
 * Generates a simple unique ID.
 */
export function genId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}
