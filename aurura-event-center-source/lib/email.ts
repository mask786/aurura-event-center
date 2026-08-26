// ---------------------------------------------------------------------------
// EMAIL DELIVERY (Resend)
// ---------------------------------------------------------------------------
// Thin wrapper around Resend so every API route sends mail the same way and
// fails the same way. If RESEND_API_KEY isn't set (e.g. a preview deploy
// with no env vars configured yet), sending is skipped rather than throwing
// — the booking/lead flow in the UI should never break just because email
// isn't configured.
// ---------------------------------------------------------------------------
import { Resend } from "resend";

const FROM = process.env.EMAIL_FROM || "Aurura Event Center <onboarding@resend.dev>";
const VENUE_NOTIFY_EMAIL = process.env.VENUE_NOTIFY_EMAIL || "events@aururaeventcenter.com";

export function emailConfigured() {
  return Boolean(process.env.RESEND_API_KEY);
}

export async function sendEmail(opts: { to: string | string[]; subject: string; html: string; replyTo?: string }) {
  if (!emailConfigured()) {
    console.warn("[email] RESEND_API_KEY not set — skipping send:", opts.subject, "->", opts.to);
    return { skipped: true };
  }

  const resend = new Resend(process.env.RESEND_API_KEY);
  const { data, error } = await resend.emails.send({
    from: FROM,
    to: opts.to,
    subject: opts.subject,
    html: opts.html,
    replyTo: opts.replyTo,
  });

  if (error) {
    console.error("[email] Resend error:", error);
    throw new Error(error.message || "Failed to send email");
  }

  return { skipped: false, id: data?.id };
}

export function venueNotifyAddress() {
  return VENUE_NOTIFY_EMAIL;
}

// ---------------------------------------------------------------------------
// Shared layout so every email looks like it belongs to Aurura.
// ---------------------------------------------------------------------------
export function emailShell(bodyHtml: string): string {
  return `
  <div style="font-family: Georgia, 'Times New Roman', serif; background:#faf6ef; padding:32px 16px;">
    <div style="max-width:520px; margin:0 auto; background:#ffffff; border:1px solid #e8e0d0;">
      <div style="padding:28px 32px; border-bottom:1px solid #e8e0d0;">
        <p style="margin:0; font-size:11px; letter-spacing:2px; text-transform:uppercase; color:#a8895a;">Aurura Event Center</p>
      </div>
      <div style="padding:32px;">
        ${bodyHtml}
      </div>
      <div style="padding:20px 32px; border-top:1px solid #e8e0d0; font-size:12px; color:#8a8478;">
        Aurura Event Center · Cedar Hollow, TX
      </div>
    </div>
  </div>`;
}
