"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Check } from "lucide-react";
import { useLanguage } from "@/lib/language-context";
import { getBooking, updateBooking, type Booking } from "@/lib/booking";
import { generateFinalQuote } from "@/lib/quote";
import { formatCurrency } from "@/lib/pricing";
import { contractTerms, venue } from "@/lib/config";
import { BookingSummaryCard } from "@/components/booking/BookingSummaryCard";
import { Reveal } from "@/components/ui/Reveal";
import Link from "next/link";

export default function QuotePage() {
  const { t, lang } = useLanguage();
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [booking, setBooking] = useState<Booking | null | undefined>(undefined);
  const [accepting, setAccepting] = useState(false);

  useEffect(() => {
    const id = Array.isArray(params.id) ? params.id[0] : params.id;
    if (!id) return;
    let b = getBooking(id);
    if (b && b.estimate && !b.quote) {
      b = updateBooking(id, { quote: generateFinalQuote(b), stage: "quote_sent" });
    }
    setBooking(b);
  }, [params.id]);

  if (booking === undefined) return <div className="pt-40 text-center text-charcoal-soft/60">{t.common.loading}</div>;

  if (!booking || !booking.quote || !booking.estimate) {
    return (
      <div className="pt-40 pb-32 text-center">
        <p className="text-charcoal-soft/70 mb-6">{t.myBooking.noBooking}</p>
        <Link href="/build-your-event" className="btn btn-primary">
          {t.myBooking.startEstimate}
        </Link>
      </div>
    );
  }

  async function handleAccept() {
    if (!booking) return;
    setAccepting(true);
    await new Promise((r) => setTimeout(r, 700));
    updateBooking(booking.id, {
      stage: "quote_accepted",
      quote: { ...booking.quote!, status: "accepted", acceptedAt: new Date().toISOString() },
    });
    setAccepting(false);
    router.push(`/contract/${booking.id}`);
  }

  const expires = new Date(booking.quote.expiresAt).toLocaleDateString(lang === "en" ? "en-US" : "es-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  const isAccepted = booking.quote.status === "accepted";

  return (
    <div className="pt-32 md:pt-40 pb-24 md:pb-32 bg-ivory-deep min-h-screen">
      <div className="container-aurura max-w-3xl">
        <Reveal className="text-center mb-12">
          <p className="eyebrow mb-4">{venue.name}</p>
          <h1 className="font-serif-display text-3xl md:text-5xl leading-tight mb-3">{t.quote.title}</h1>
          <p className="text-charcoal-soft/70">
            {t.quote.preparedFor} {booking.lead?.firstName} {booking.lead?.lastName}
          </p>
          <span className="inline-block mt-4 text-xs uppercase tracking-wide px-3 py-1.5 border border-gold text-gold-deep">
            {isAccepted ? t.quote.status.accepted : t.quote.status.sent}
          </span>
        </Reveal>

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <BookingSummaryCard booking={booking} />

          <div className="bg-white border border-hairline p-6 md:p-8">
            <h3 className="font-serif-display text-xl mb-5">{t.quote.pricing}</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-charcoal-soft">{t.quote.subtotal}</span>
                <span className="tabular-nums">{formatCurrency(booking.estimate.breakdown.subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-charcoal-soft">{t.quote.serviceFee}</span>
                <span className="tabular-nums">{formatCurrency(booking.estimate.breakdown.serviceFee)}</span>
              </div>
              <div className="flex justify-between border-t border-hairline pt-3">
                <span className="font-serif-display text-lg">{t.quote.total}</span>
                <span className="font-serif-display text-2xl text-gold-deep tabular-nums">{formatCurrency(booking.quote.finalTotal)}</span>
              </div>
              <div className="flex justify-between pt-2">
                <span className="text-charcoal-soft">{t.quote.deposit}</span>
                <span className="tabular-nums">{formatCurrency(booking.quote.deposit)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-charcoal-soft">{t.quote.balance}</span>
                <span className="tabular-nums">{formatCurrency(booking.quote.balance)}</span>
              </div>
            </div>
            <div className="border-t border-hairline mt-5 pt-4 text-xs text-charcoal-soft/60 space-y-2">
              <p>
                <span className="uppercase tracking-wide">{t.quote.schedule}:</span> {contractTerms.paymentSchedule[lang]}
              </p>
              <p>
                <span className="uppercase tracking-wide">{t.quote.expires}:</span> {expires}
              </p>
            </div>
          </div>
        </div>

        {isAccepted ? (
          <Reveal className="bg-white border border-gold p-8 text-center">
            <div className="mx-auto mb-4 h-12 w-12 rounded-full border border-gold flex items-center justify-center">
              <Check className="text-gold-deep" size={18} />
            </div>
            <p className="font-serif-display text-xl mb-2">{t.quote.accepted}</p>
            <p className="text-charcoal-soft/70 mb-6">{t.quote.acceptedBody}</p>
            <Link href={`/contract/${booking.id}`} className="btn btn-gold">
              {t.quote.viewContract}
            </Link>
          </Reveal>
        ) : (
          <div className="text-center">
            <button onClick={handleAccept} disabled={accepting} className="btn btn-gold px-14">
              {accepting ? t.quote.accepting : t.quote.accept}
            </button>
            <p className="text-xs text-charcoal-soft/50 mt-6 max-w-sm mx-auto">{t.quote.questions}</p>
          </div>
        )}
      </div>
    </div>
  );
}
