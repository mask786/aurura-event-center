// ---------------------------------------------------------------------------
// PAYMENTS (Stripe)
// ---------------------------------------------------------------------------
// Real Stripe Checkout for the deposit payment. If STRIPE_SECRET_KEY isn't
// set, payments simply aren't configured yet — /app/pay/[id]/page.tsx falls
// back to the original mock card-entry demo flow so the prototype keeps
// working end-to-end without any keys.
//
// This app has no live database (see lib/booking.ts) — bookings live in the
// visitor's browser. So instead of a webhook writing to a database, the
// Stripe Checkout success_url sends the visitor back to
// /pay/[id]/success?session_id=..., which calls /api/verify-checkout-session
// to confirm with Stripe (server-side, can't be faked by the client) that
// the session actually paid before marking the local booking as deposit-paid.
// ---------------------------------------------------------------------------
import Stripe from "stripe";

export function paymentsConfigured() {
  return Boolean(process.env.STRIPE_SECRET_KEY);
}

let stripeClient: Stripe | null = null;

export function getStripe(): Stripe {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error("STRIPE_SECRET_KEY is not configured");
  }
  if (!stripeClient) {
    stripeClient = new Stripe(process.env.STRIPE_SECRET_KEY);
  }
  return stripeClient;
}
