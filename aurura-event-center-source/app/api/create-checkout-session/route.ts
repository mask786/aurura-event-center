import { NextRequest, NextResponse } from "next/server";
import { getStripe, paymentsConfigured } from "@/lib/stripe";

export async function POST(req: NextRequest) {
  if (!paymentsConfigured()) {
    return NextResponse.json({ error: "Payments not configured" }, { status: 503 });
  }

  try {
    const body = await req.json();
    const { bookingId, amount, description, customerEmail } = body ?? {};

    if (!bookingId || !amount || amount <= 0) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const origin = req.headers.get("origin") || `https://${req.headers.get("host")}`;

    const session = await getStripe().checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      customer_email: customerEmail || undefined,
      line_items: [
        {
          price_data: {
            currency: "usd",
            unit_amount: Math.round(amount * 100), // dollars -> cents
            product_data: {
              name: "Aurura Event Center — Deposit",
              description: description || `Deposit for booking ${bookingId}`,
            },
          },
          quantity: 1,
        },
      ],
      metadata: { bookingId },
      success_url: `${origin}/pay/${bookingId}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/pay/${bookingId}`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("[api/create-checkout-session]", err);
    return NextResponse.json({ error: "Failed to create checkout session" }, { status: 500 });
  }
}
