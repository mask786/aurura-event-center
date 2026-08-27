import { NextRequest, NextResponse } from "next/server";
import { getStripe, paymentsConfigured } from "@/lib/stripe";

export async function GET(req: NextRequest) {
  if (!paymentsConfigured()) {
    return NextResponse.json({ error: "Payments not configured" }, { status: 503 });
  }

  const sessionId = req.nextUrl.searchParams.get("session_id");
  if (!sessionId) {
    return NextResponse.json({ error: "Missing session_id" }, { status: 400 });
  }

  try {
    const session = await getStripe().checkout.sessions.retrieve(sessionId);

    return NextResponse.json({
      paid: session.payment_status === "paid",
      bookingId: session.metadata?.bookingId,
      amountTotal: session.amount_total != null ? session.amount_total / 100 : null,
      paymentIntentId: typeof session.payment_intent === "string" ? session.payment_intent : session.payment_intent?.id,
    });
  } catch (err) {
    console.error("[api/verify-checkout-session]", err);
    return NextResponse.json({ error: "Failed to verify session" }, { status: 500 });
  }
}
