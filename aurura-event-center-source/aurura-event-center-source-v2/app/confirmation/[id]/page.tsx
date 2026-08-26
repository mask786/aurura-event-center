"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { PartyPopper } from "lucide-react";
import { useLanguage } from "@/lib/language-context";
import { getBooking, type Booking } from "@/lib/booking";
import { formatCurrency, getPackage } from "@/lib/pricing";
import { venue, eventTypes } from "@/lib/config";
import { Reveal } from "@/components/ui/Reveal";
import { photo } from "@/lib/images";
import { Photo } from "@/components/ui/Photo";

export default function ConfirmationPage() {
  const { t, lang } = useLanguage();
  const params = useParams<{ id: string }>();
  const [booking, setBooking] = useState<Booking | null | undefined>(undefined);

  useEffect(() => {
    const id = Array.isArray(params.id) ? params.id[0] : params.id;
    if (!id) return;
    setBooking(getBooking(id));
  }, [params.id]);

  if (booking === undefined) return <div className="pt-40 text-center text-charcoal-soft/60">{t.common.loading}</div>;

  if (!booking || !booking.payment?.depositPaid || !booking.estimate || !booking.quote) {
    return (
      <div className="pt-40 pb-32 text-center">
        <p className="text-charcoal-soft/70 mb-6">{t.myBooking.noBooking}</p>
        <Link href="/build-your-event" className="btn btn-primary">
          {t.myBooking.startEstimate}
        </Link>
      </div>
    );
  }

  const pkg = getPackage(booking.estimate.packageId);
  const eventTypeName = eventTypes.find((e) => e.id === booking.estimate!.eventType)?.name[lang];
  const dateLabel = new Date(booking.estimate.eventDate + "T00:00:00").toLocaleDateString(lang === "en" ? "en-US" : "es-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="relative pt-32 md:pt-40 pb-24 md:pb-32 min-h-screen overflow-hidden">
      <div className="absolute inset-0 -z-10 opacity-[0.06]">
        <Photo src={photo("ballroom-1").url} alt="" className="w-full h-full" />
      </div>
      <div className="container-aurura max-w-2xl">
        <Reveal className="text-center mb-10">
          <div className="mx-auto mb-6 h-16 w-16 rounded-full bg-gold flex items-center justify-center">
            <PartyPopper className="text-charcoal" size={26} />
          </div>
          <p className="eyebrow mb-3">{venue.name}</p>
          <h1 className="font-serif-display text-4xl md:text-5xl leading-tight mb-3">{t.confirmation.title}</h1>
          <p className="text-charcoal-soft/70 max-w-md mx-auto">{t.confirmation.body}</p>
        </Reveal>

        <Reveal delay={0.1} className="bg-white border border-gold p-6 md:p-10">
          <h3 className="font-serif-display text-xl mb-6">{t.confirmation.details}</h3>
          <dl className="grid grid-cols-2 gap-x-6 gap-y-5 text-sm">
            <Row label={t.confirmation.customer} value={`${booking.lead?.firstName} ${booking.lead?.lastName}`} />
            <Row label={t.confirmation.eventType} value={eventTypeName ?? ""} />
            <Row label={t.confirmation.eventDate} value={dateLabel} />
            <Row label={t.confirmation.venueLabel} value={venue.name} />
            <Row label={t.confirmation.package} value={pkg?.name[lang] ?? ""} />
            <Row label={t.confirmation.total} value={formatCurrency(booking.quote.finalTotal)} />
            <Row label={t.confirmation.depositPaid} value={formatCurrency(booking.payment.amount)} highlight />
            <Row label={t.confirmation.remaining} value={formatCurrency(booking.quote.balance)} />
            <Row label={t.confirmation.nextPayment} value={new Date(booking.payment.nextPaymentDue).toLocaleDateString()} />
            <Row label={t.confirmation.contractStatus} value={t.contract.signed} />
          </dl>

          <p className="text-xs text-charcoal-soft/50 mt-8 text-center border-t border-hairline pt-5">{t.confirmation.emailSent}</p>
        </Reveal>

        <div className="text-center mt-10">
          <Link href="/my-booking" className="btn btn-primary">
            {t.confirmation.viewBooking}
          </Link>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div>
      <dt className="text-xs uppercase tracking-wide text-charcoal-soft/55">{label}</dt>
      <dd className={`mt-0.5 ${highlight ? "text-gold-deep font-medium" : ""}`}>{value}</dd>
    </div>
  );
}
