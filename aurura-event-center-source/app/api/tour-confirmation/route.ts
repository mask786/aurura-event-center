import { NextRequest, NextResponse } from "next/server";
import { sendEmailSafe, emailShell, venueNotifyAddress } from "@/lib/email";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { firstName, lastName, email, phone, date, time, eventType, guestCount, notes } = body ?? {};

    if (!email || !date || !time || !firstName) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const dateLabel = new Date(`${date}T00:00:00`).toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });

    const customerHtml = emailShell(`
      <h1 style="font-size:22px; margin:0 0 12px;">Your tour is confirmed</h1>
      <p style="color:#4a453d; line-height:1.6;">Hi ${firstName}, we can't wait to show you Aurura. Here are your tour details:</p>
      <table style="width:100%; margin:20px 0; font-size:14px; color:#333;">
        <tr><td style="padding:6px 0; color:#8a8478;">Date</td><td style="padding:6px 0; text-align:right;">${dateLabel}</td></tr>
        <tr><td style="padding:6px 0; color:#8a8478;">Time</td><td style="padding:6px 0; text-align:right;">${time}</td></tr>
        <tr><td style="padding:6px 0; color:#8a8478;">Duration</td><td style="padding:6px 0; text-align:right;">Approx. 30 minutes</td></tr>
      </table>
      <p style="color:#4a453d; line-height:1.6; font-size:14px;">If you need to reschedule, just reply to this email or call us — we're happy to help.</p>
    `);

    const staffHtml = emailShell(`
      <h1 style="font-size:20px; margin:0 0 12px;">New tour booked</h1>
      <table style="width:100%; font-size:14px; color:#333;">
        <tr><td style="padding:4px 0; color:#8a8478;">Name</td><td style="padding:4px 0; text-align:right;">${firstName} ${lastName ?? ""}</td></tr>
        <tr><td style="padding:4px 0; color:#8a8478;">Email</td><td style="padding:4px 0; text-align:right;">${email}</td></tr>
        <tr><td style="padding:4px 0; color:#8a8478;">Phone</td><td style="padding:4px 0; text-align:right;">${phone ?? "—"}</td></tr>
        <tr><td style="padding:4px 0; color:#8a8478;">Date / Time</td><td style="padding:4px 0; text-align:right;">${dateLabel} · ${time}</td></tr>
        <tr><td style="padding:4px 0; color:#8a8478;">Event type</td><td style="padding:4px 0; text-align:right;">${eventType ?? "—"}</td></tr>
        <tr><td style="padding:4px 0; color:#8a8478;">Guests</td><td style="padding:4px 0; text-align:right;">${guestCount ?? "—"}</td></tr>
      </table>
      ${notes ? `<p style="margin-top:14px; font-size:14px; color:#4a453d;"><strong>Notes:</strong> ${notes}</p>` : ""}
    `);

    const [customerResult, staffResult] = await Promise.all([
      sendEmailSafe({ to: email, subject: "Your tour at Aurura Event Center is confirmed", html: customerHtml }),
      sendEmailSafe({ to: venueNotifyAddress(), subject: `New tour booked — ${firstName} ${lastName ?? ""}`, html: staffHtml, replyTo: email }),
    ]);

    return NextResponse.json({ ok: true, customerEmail: customerResult, staffEmail: staffResult });
  } catch (err) {
    console.error("[api/tour-confirmation]", err);
    // Don't fail the booking flow just because email delivery failed.
    return NextResponse.json({ ok: false, error: "Email delivery failed" }, { status: 200 });
  }
}
