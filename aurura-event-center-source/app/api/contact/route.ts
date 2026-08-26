import { NextRequest, NextResponse } from "next/server";
import { sendEmail, emailShell, venueNotifyAddress } from "@/lib/email";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, phone, message } = body ?? {};

    if (!name || !email || !message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const customerHtml = emailShell(`
      <h1 style="font-size:22px; margin:0 0 12px;">We received your message</h1>
      <p style="color:#4a453d; line-height:1.6;">Hi ${name}, thanks for reaching out to Aurura Event Center. A member of our team will get back to you shortly.</p>
      <p style="margin-top:20px; padding:16px; background:#faf6ef; font-size:13px; color:#4a453d; white-space:pre-wrap;">${message}</p>
    `);

    const staffHtml = emailShell(`
      <h1 style="font-size:20px; margin:0 0 12px;">New contact form submission</h1>
      <table style="width:100%; font-size:14px; color:#333;">
        <tr><td style="padding:4px 0; color:#8a8478;">Name</td><td style="padding:4px 0; text-align:right;">${name}</td></tr>
        <tr><td style="padding:4px 0; color:#8a8478;">Email</td><td style="padding:4px 0; text-align:right;">${email}</td></tr>
        <tr><td style="padding:4px 0; color:#8a8478;">Phone</td><td style="padding:4px 0; text-align:right;">${phone ?? "—"}</td></tr>
      </table>
      <p style="margin-top:14px; padding:16px; background:#faf6ef; font-size:13px; color:#4a453d; white-space:pre-wrap;">${message}</p>
    `);

    await Promise.all([
      sendEmail({ to: email, subject: "We received your message — Aurura Event Center", html: customerHtml }),
      sendEmail({ to: venueNotifyAddress(), subject: `New inquiry — ${name}`, html: staffHtml, replyTo: email }),
    ]);

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[api/contact]", err);
    return NextResponse.json({ ok: false, error: "Email delivery failed" }, { status: 200 });
  }
}
