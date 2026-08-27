"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Check } from "lucide-react";
import clsx from "clsx";
import { useLanguage } from "@/lib/language-context";
import { getCurrentBooking, type Booking } from "@/lib/booking";
import { formatCurrency, getPackage } from "@/lib/pricing";
import { venue, eventTypes } from "@/lib/config";
import { Reveal } from "@/components/ui/Reveal";

export function MyBookingPageClient() {
  const { t, lang } = useLanguage();
  const [booking, setBooking] = useState<Booking | null | undefined>(undefined);

  useEffect(() => {
    setBooking(getCurrentBooking());
  }, []);

  if (booking === undefined) return <div className="pt-40 text-center text-charcoal-soft/60">{t.common.loading}</div>;

  if (!booking) {
    return (
      <div className="pt-40 pb-32 text-center">
        <p className="text-charcoal-soft/70 mb-6 max-w-sm mx-auto">{t.myBooking.noBooking}</p>
        <Link href="/build-your-event" className="btn btn-primary">
          {t.myBooking.startEstimate}
        </Link>
      </div>
    );
  }

  const pkg = booking.estimate ? getPackage(booking.estimate.packageId) : null;
  const eventTypeName = booking.estimate ? eventTypes.find((e) => e.id === booking.estimate!.eventType)?.name[lang] : null;

  const timeline = [
    { key: "estimate", done: !!booking.estimate, href: "/build-your-event" },
    { key: "lead", done: !!booking.lead, href: "/build-your-event" },
    { key: "tour", done: !!booking.tour, href: "/schedule-tour" },
    { key: "quote", done: !!booking.quote, href: `/quote/${booking.id}` },
    { key: "accepted", done: booking.quote?.status === "accepted", href: `/quote/${booking.id}` },
    { key: "contract", done: !!booking.contract?.signedAt, href: `/contract/${booking.id}` },
    { key: "deposit", done: !!booking.payment?.depositPaid, href: `/pay/${booking.id}` },
    { key: "confirmed", done: booking.stage === "confirmed", href: `/confirmation/${booking.id}` },
  ] as const;

  const nextStep = timeline.find((s) => !s.done);

  return (
    <div className="pt-32 md:pt-40 pb-24 md:pb-32 bg-ivory-deep min-h-screen">
      <div className="container-aurura max-w-3xl">
        <Reveal className="text-center mb-12">
          <p className="eyebrow mb-4">{venue.name} · {booking.id}</p>
          <h1 className="font-serif-display text-3xl md:text-5xl leading-tight mb-3">{t.myBooking.title}</h1>
          <p className="text-charcoal-soft/70">{t.myBooking.body}</p>
        </Reveal>

        <div className="grid md:grid-cols-[1fr_1.4fr] gap-8">
          <Reveal className="bg-white border border-hairline p-6 md:p-8 h-fit">
            <h3 className="font-serif-display text-lg mb-5">{t.quote.eventDetails}</h3>
            {booking.estimate ? (
              <dl className="space-y-4 text-sm">
                <Row label={t.estimator.eventType} value={eventTypeName ?? ""} />
                <Row
                  label={t.estimator.eventDate}
                  value={new Date(booking.estimate.eventDate + "T00:00:00").toLocaleDateString()}
                />
                <Row label={t.common.guests} value={String(booking.estimate.guestCount)} />
                <Row label={t.quote.package} value={pkg?.name[lang] ?? ""} />
                <Row label={t.estimator.total} value={formatCurrency(booking.quote?.finalTotal ?? booking.estimate.breakdown.total)} />
                {booking.quote && <Row label={t.quote.deposit} value={formatCurrency(booking.quote.deposit)} />}
                {booking.payment?.depositPaid && <Row label={t.confirmation.depositPaid} value={formatCurrency(booking.payment.amount)} />}
              </dl>
            ) : (
              <p className="text-sm text-charcoal-soft/60">—</p>
            )}

            {nextStep && (
              <Link href={nextStep.href} className="btn btn-gold w-full mt-8">
                {t.myBooking.timeline[nextStep.key]} →
              </Link>
            )}
          </Reveal>

          <Reveal delay={0.1} className="bg-white border border-hairline p-6 md:p-8">
            <h3 className="font-serif-display text-lg mb-6">{t.myBooking.title}</h3>
            <ol className="space-y-0">
              {timeline.map((step, i) => (
                <li key={step.key} className="flex gap-4 relative pb-8 last:pb-0">
                  {i < timeline.length - 1 && (
                    <span className={clsx("absolute left-[13px] top-7 bottom-0 w-px", step.done ? "bg-gold" : "bg-hairline")} />
                  )}
                  <span
                    className={clsx(
                      "h-7 w-7 rounded-full border flex items-center justify-center shrink-0 z-10 bg-white",
                      step.done ? "bg-gold border-gold" : "border-hairline"
                    )}
                  >
                    {step.done && <Check size={13} className="text-charcoal" />}
                  </span>
                  <div className="flex-1 flex items-center justify-between">
                    <span className={clsx("text-sm", step.done ? "text-charcoal" : "text-charcoal-soft/50")}>
                      {t.myBooking.timeline[step.key]}
                    </span>
                    {!step.done && step === nextStep && (
                      <Link href={step.href} className="text-xs uppercase tracking-wide text-gold-deep hover:underline">
                        {t.common.viewMore}
                      </Link>
                    )}
                  </div>
                </li>
              ))}
            </ol>
          </Reveal>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="text-charcoal-soft/60">{label}</dt>
      <dd className="text-right">{value}</dd>
    </div>
  );
}
