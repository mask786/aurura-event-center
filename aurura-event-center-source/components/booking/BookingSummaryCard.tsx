"use client";

import { useLanguage } from "@/lib/language-context";
import { formatCurrency } from "@/lib/pricing";
import { getPackage } from "@/lib/pricing";
import { eventTypes } from "@/lib/config";
import type { Booking } from "@/lib/booking";

export function BookingSummaryCard({ booking }: { booking: Booking }) {
  const { t, lang } = useLanguage();
  if (!booking.estimate) return null;
  const pkg = getPackage(booking.estimate.packageId);
  const eventTypeName = eventTypes.find((e) => e.id === booking.estimate!.eventType)?.name[lang] ?? booking.estimate.eventType;
  const dateLabel = new Date(booking.estimate.eventDate + "T00:00:00").toLocaleDateString(lang === "en" ? "en-US" : "es-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="bg-white border border-hairline p-6 md:p-8">
      <h3 className="font-serif-display text-xl mb-5">{t.quote.eventDetails}</h3>
      <dl className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm mb-6">
        <div>
          <dt className="text-xs uppercase tracking-wide text-charcoal-soft/55">{t.estimator.eventType}</dt>
          <dd className="mt-0.5">{eventTypeName}</dd>
        </div>
        <div>
          <dt className="text-xs uppercase tracking-wide text-charcoal-soft/55">{t.estimator.eventDate}</dt>
          <dd className="mt-0.5">{dateLabel}</dd>
        </div>
        <div>
          <dt className="text-xs uppercase tracking-wide text-charcoal-soft/55">{t.common.guests}</dt>
          <dd className="mt-0.5">{booking.estimate.guestCount}</dd>
        </div>
        <div>
          <dt className="text-xs uppercase tracking-wide text-charcoal-soft/55">{t.quote.package}</dt>
          <dd className="mt-0.5">{pkg?.name[lang]}</dd>
        </div>
      </dl>

      {booking.estimate.breakdown.addOnLines.length > 0 && (
        <div className="mb-6">
          <p className="text-xs uppercase tracking-wide text-charcoal-soft/55 mb-2">{t.quote.addOns}</p>
          <ul className="text-sm space-y-1">
            {booking.estimate.breakdown.addOnLines.map((line) => (
              <li key={line.addOn.id} className="flex justify-between text-charcoal-soft">
                <span>{line.addOn.name[lang]}</span>
                <span className="tabular-nums">{formatCurrency(line.total)}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
