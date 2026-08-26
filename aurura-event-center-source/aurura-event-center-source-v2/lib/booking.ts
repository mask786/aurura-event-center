// ---------------------------------------------------------------------------
// DEMO BOOKING STORE
// ---------------------------------------------------------------------------
// This prototype has no live database yet — bookings are persisted to the
// visitor's browser (localStorage) so the full customer journey (estimate →
// lead → tour → quote → contract → deposit → confirmation) can be clicked
// through end-to-end and revisited via /my-booking.
//
// In production this module's function signatures (createBooking,
// getBooking, updateBooking) would be swapped for calls to a real database
// / API — nothing in the pages that call them would need to change. The
// admin dashboard already reads through `listAllBookings()`, which merges
// this local store with the seed data in mock-admin-data.ts, so wiring in a
// real backend is a matter of replacing that one function.
// ---------------------------------------------------------------------------

import type { AddOnSelection, EstimateBreakdown } from "./pricing";

export type BookingStage =
  | "estimate"
  | "lead"
  | "tour"
  | "quote_pending"
  | "quote_sent"
  | "quote_accepted"
  | "contract_signed"
  | "deposit_paid"
  | "confirmed";

export type Booking = {
  id: string;
  createdAt: string;
  source: string;
  stage: BookingStage;

  estimate?: {
    eventType: string;
    eventDate: string;
    guestCount: number;
    packageId: string;
    selections: AddOnSelection[];
    breakdown: EstimateBreakdown;
  };

  lead?: {
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
    preferredContact: "phone" | "text" | "email" | "whatsapp";
    notes: string;
    submittedAt: string;
  };

  tour?: {
    date: string;
    time: string;
    confirmedAt: string;
  };

  quote?: {
    finalTotal: number;
    deposit: number;
    balance: number;
    status: "draft" | "sent" | "accepted" | "declined";
    sentAt: string;
    expiresAt: string;
    acceptedAt?: string;
  };

  contract?: {
    signedName: string;
    signedAt: string;
    agreed: boolean;
  };

  payment?: {
    depositPaid: boolean;
    amount: number;
    paidAt: string;
    method: string;
    nextPaymentDue: string;
  };
};

const BOOKING_PREFIX = "aurura_booking_";
const CURRENT_KEY = "aurura_current_booking_id";

function isBrowser() {
  return typeof window !== "undefined";
}

export function genId(): string {
  return "AU-" + Math.random().toString(36).slice(2, 8).toUpperCase();
}

export function saveBooking(booking: Booking) {
  if (!isBrowser()) return;
  window.localStorage.setItem(BOOKING_PREFIX + booking.id, JSON.stringify(booking));
  window.localStorage.setItem(CURRENT_KEY, booking.id);
}

export function getBooking(id: string): Booking | null {
  if (!isBrowser()) return null;
  const raw = window.localStorage.getItem(BOOKING_PREFIX + id);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as Booking;
  } catch {
    return null;
  }
}

export function getCurrentBookingId(): string | null {
  if (!isBrowser()) return null;
  return window.localStorage.getItem(CURRENT_KEY);
}

export function getCurrentBooking(): Booking | null {
  const id = getCurrentBookingId();
  if (!id) return null;
  return getBooking(id);
}

export function updateBooking(id: string, patch: Partial<Booking>): Booking | null {
  const existing = getBooking(id);
  if (!existing) return null;
  const updated: Booking = { ...existing, ...patch };
  saveBooking(updated);
  return updated;
}

export function createBooking(partial: Omit<Booking, "id" | "createdAt" | "stage" | "source"> & { stage?: BookingStage }): Booking {
  const booking: Booking = {
    id: genId(),
    createdAt: new Date().toISOString(),
    source: "direct",
    stage: partial.stage ?? "estimate",
    ...partial,
  };
  saveBooking(booking);
  return booking;
}

export function listLocalBookings(): Booking[] {
  if (!isBrowser()) return [];
  const out: Booking[] = [];
  for (let i = 0; i < window.localStorage.length; i++) {
    const key = window.localStorage.key(i);
    if (key && key.startsWith(BOOKING_PREFIX)) {
      const raw = window.localStorage.getItem(key);
      if (raw) {
        try {
          out.push(JSON.parse(raw) as Booking);
        } catch {
          // ignore malformed
        }
      }
    }
  }
  return out;
}
