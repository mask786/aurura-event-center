import type { Booking } from "./booking";
import { venue } from "./config";

function hashString(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = (h << 5) - h + s.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
}

/**
 * Simulates the venue reviewing an estimate and issuing a final quote. In
 * production this is where an admin, from /admin, adjusts line items and
 * clicks "Send Quote" — here we apply a small deterministic adjustment so
 * the customer-facing flow can be experienced end-to-end without a second
 * "admin" session.
 */
export function generateFinalQuote(booking: Booking): NonNullable<Booking["quote"]> {
  const base = booking.estimate?.breakdown.total ?? 0;
  const seed = hashString(booking.id) % 5; // 0-4% adjustment
  const finalTotal = Math.round((base * (1 + seed / 100)) / 5) * 5;
  const deposit = Math.round(finalTotal * venue.depositPercent);
  const balance = finalTotal - deposit;
  const expires = new Date();
  expires.setDate(expires.getDate() + venue.quoteValidDays);

  return {
    finalTotal,
    deposit,
    balance,
    status: "sent",
    sentAt: new Date().toISOString(),
    expiresAt: expires.toISOString(),
  };
}
