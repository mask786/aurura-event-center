// ---------------------------------------------------------------------------
// TOUR AVAILABILITY
// ---------------------------------------------------------------------------
// Simulates checking a connected calendar (in production: the venue's
// Google Calendar) for open tour slots before displaying them to a visitor.
// The function signature (`getAvailability(dateISO)`) is what would be
// swapped for a real Google Calendar freebusy lookup — everything that
// calls it (the TourCalendar component) stays the same either way.
//
// Availability is deterministic per date (seeded from the date string) so
// the demo behaves consistently rather than reshuffling on every render.
// ---------------------------------------------------------------------------

const ALL_SLOTS = ["10:00 AM", "11:00 AM", "12:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM", "6:00 PM"];

function hashString(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = (h << 5) - h + s.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
}

export function isVenueClosed(date: Date): boolean {
  const day = date.getDay(); // 0 = Sunday, 1 = Monday
  return day === 0 || day === 1;
}

/** Returns the list of open (not-yet-booked) tour times for a given date. */
export function getAvailability(dateISO: string): string[] {
  const date = new Date(dateISO + "T00:00:00");
  if (isVenueClosed(date)) return [];

  const seed = hashString(dateISO);
  // "Busy" (already booked / blocked on the connected calendar) slots —
  // deterministic per day so the same date always shows the same demo state.
  const busyCount = seed % 4; // 0-3 slots blocked
  const busyIndexes = new Set<number>();
  for (let i = 0; i < busyCount; i++) {
    busyIndexes.add((seed + i * 3) % ALL_SLOTS.length);
  }

  return ALL_SLOTS.filter((_, idx) => !busyIndexes.has(idx));
}

export function getAllSlots(): string[] {
  return ALL_SLOTS;
}
