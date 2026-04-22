// src/utils/timeUtils.js
import { formatISO, subDays } from 'date-fns';

/**
 * Returns YYYY-MM-DD for exactly 30 days before now (UTC).
 */
export function defaultStartDateUTC() {
  return formatISO(subDays(new Date(), 30), { representation: 'date' });
}

/**
 * Returns YYYY-MM-DD for today (UTC).
 */
export function defaultEndDateUTC() {
  return formatISO(new Date(), { representation: 'date' });
}

/**
 * Formats an ISO timestamp into a human‑readable UTC label.
 * e.g. "2025-07-01 14:23 UTC"
 */
export function formatUTCTimeLabel(isoString) {
  const d = new Date(isoString);
  const YYYY = d.getUTCFullYear();
  const MM   = String(d.getUTCMonth() + 1).padStart(2, '0');
  const DD   = String(d.getUTCDate()).padStart(2, '0');
  const hh   = String(d.getUTCHours()).padStart(2, '0');
  const mm   = String(d.getUTCMinutes()).padStart(2, '0');
  return `${YYYY}-${MM}-${DD} ${hh}:${mm} UTC`;
}
