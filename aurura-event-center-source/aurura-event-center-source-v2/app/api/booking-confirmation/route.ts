import { NextRequest, NextResponse } from "next/server";
import { sendEmail, emailShell, venueNotifyAddress } from "@/lib/email";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      bookingId,
      firstName,
      lastName,
      email,
      eventType,
      eventDate,
      packageName,
      total,
      depositPaid,
      balance,
      nextPaymentDue,
    } = body ?? {};

    if (!email || !bookingId || !firstName) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const dateLabel = eventDate
      ? new Date(`${eventDate}T00:00:00`).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
      : "TBD";

    const customerHtml = emailShell(`
      <h1 style="font-size:22px; margin:0 0 12px;">You're all set, ${firstName}!</h1>
      <p style="color:#4a453d; line-height:1.6;">Your deposit is in and your date at Aurura is locked in. Here's a summary for your records:</p>
      <table style="width:100%; margin:20px 0; font-size:14px; color:#333;">
        <tr><td style="padding:6px 0; color:#8a8478;">Booking #</td><td style="padding:6px 0; text-align:right;">${bookingId}</td></tr>
        <tr><td style="padding:6px 0; color:#8a8478;">Event type</td><td style="padding:6px 0; text-align:right;">${eventType ?? "—"}</td></tr>
        <tr><td style="padding:6px 0; color:#8a8478;">Event date</td><td style="padding:6px 0; text-align:right;">${dateLabel}</td></tr>
        <tr><td style="padding:6px 0; color:#8a8478;">Package</td><td style="padding:6px 0; text-align:right;">${packageName ?? "—"}</td></tr>
        <tr><td style="padding:6px 0; color:#8a8478;">Total</td><td style="padding:6px 0; text-align:right;">${total ?? "—"}</td></tr>
        <tr><td style="padding:6px 0; color:#8a8478;">Deposit paid</td><td style="padding:6px 0; text-align:right; color:#a8895a;">${depositPaid ?? "—"}</td></tr>
        <tr><td style="padding:6px 0; color:#8a8478;">Remaining balance</td><td style="padding:6px 0; text-align:right;">${balance ?? "—"}</td></tr>
        <tr><td style="padding:6px 0; color:#8a8478;">Balance due</td><td style="padding:6px 0; text-align:right;">${nextPaymentDue ?? "—"}</td></tr>
      </table>
      <p style="color:#4a453d; line-height:1.6; font-size:14px;">Questions before the big day? Just reply to this email.</p>
    `);

    const staffHtml = emailShell(`
      <h1 style="font-size:20px; margin:0 0 12px;">Booking confirmed — deposit paid</h1>
      <table style="width:100%; font-size:14px; color:#333;">
        <tr><td style="padding:4px 0; color:#8a8478;">Booking #</td><td style="padding:4px 0; text-align:right;">${bookingId}</td></tr>
        <tr><td style="padding:4px 0; color:#8a8478;">Customer</td><td style="padding:4px 0; text-align:right;">${firstName} ${lastName ?? ""}</td></tr>
        <tr><td style="padding:4px 0; color:#8a8478;">Email</td><td style="padding:4px 0; text-align:right;">${email}</td></tr>
        <tr><td style="padding:4px 0; color:#8a8478;">Event date</td><td style="padding:4px 0; text-align:right;">${dateLabel}</td></tr>
        <tr><td style="padding:4px 0; color:#8a8478;">Package</td><td style="padding:4px 0; text-align:right;">${packageName ?? "—"}</td></tr>
        <tr><td style="padding:4px 0; color:#8a8478;">Deposit</td><td style="padding:4px 0; text-align:right;">${depositPaid ?? "—"}</td></tr>
      </table>
    `);

    await Promise.all([
      sendEmail({ to: email, subject: "Booking confirmed — Aurura Event Center", html: customerHtml }),
      sendEmail({ to: venueNotifyAddress(), subject: `Deposit paid — ${firstName} ${lastName ?? ""} (${bookingId})`, html: staffHtml, replyTo: email }),
    ]);

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[api/booking-confirmation]", err);
    return NextResponse.json({ ok: false, error: "Email delivery failed" }, { status: 200 });
  }
}
