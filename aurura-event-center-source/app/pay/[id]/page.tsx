"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Lock, ShieldCheck } from "lucide-react";
import { useLanguage } from "@/lib/language-context";
import { getBooking, updateBooking, type Booking } from "@/lib/booking";
import { formatCurrency, getPackage } from "@/lib/pricing";
import { venue, eventTypes } from "@/lib/config";
import { Reveal } from "@/components/ui/Reveal";

// Set at build time from the Vercel env var of the same name. When present,
// the page sends visitors through real Stripe Checkout instead of the mock
// card form below — see /lib/stripe.ts for why verification happens via a
// redirect rather than a webhook (this prototype has no live database).
const STRIPE_PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
const STRIPE_TEST_MODE = STRIPE_PUBLISHABLE_KEY?.startsWith("pk_test_") ?? false;

export default function PayPage() {
  const { t } = useLanguage();
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [booking, setBooking] = useState<Booking | null | undefined>(undefined);
  const [card, setCard] = useState({ number: "", expiry: "", cvc: "", name: "", zip: "" });
  const [paying, setPaying] = useState(false);
  const [redirecting, setRedirecting] = useState(false);
  const [checkoutError, setCheckoutError] = useState(false);

  useEffect(() => {
    const id = Array.isArray(params.id) ? params.id[0] : params.id;
    if (!id) return;
    setBooking(getBooking(id));
  }, [params.id]);

  if (booking === undefined) return <div className="pt-40 text-center text-charcoal-soft/60">{t.common.loading}</div>;

  if (!booking || !booking.contract?.signedAt || !booking.quote) {
    return (
      <div className="pt-40 pb-32 text-center">
        <p className="text-charcoal-soft/70 mb-6">{t.myBooking.noBooking}</p>
        <Link href="/build-your-event" className="btn btn-primary">
          {t.myBooking.startEstimate}
        </Link>
      </div>
    );
  }

  const eventDate = booking.estimate ? new Date(booking.estimate.eventDate) : null;
  const nextPaymentDate = eventDate ? new Date(eventDate.getTime() - 14 * 86400000) : new Date();

  const canPay = card.number.replace(/\s/g, "").length >= 12 && card.expiry.length >= 4 && card.cvc.length >= 3 && card.name.trim();

  async function handlePay() {
    if (!booking || !canPay) return;
    setPaying(true);
    await new Promise((r) => setTimeout(r, 1400));
    updateBooking(booking.id, {
      stage: "confirmed",
      payment: {
        depositPaid: true,
        amount: booking.quote!.deposit,
        paidAt: new Date().toISOString(),
        method: "Visa •••• " + card.number.replace(/\s/g, "").slice(-4),
        nextPaymentDue: nextPaymentDate.toISOString(),
      },
    });
    setPaying(false);

    const pkg = booking.estimate ? getPackage(booking.estimate.packageId) : undefined;
    const eventTypeName = booking.estimate ? eventTypes.find((e) => e.id === booking.estimate!.eventType)?.name.en : undefined;
    fetch("/api/booking-confirmation", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        bookingId: booking.id,
        firstName: booking.lead?.firstName,
        lastName: booking.lead?.lastName,
        email: booking.lead?.email,
        eventType: eventTypeName,
        eventDate: booking.estimate?.eventDate,
        packageName: pkg?.name.en,
        total: formatCurrency(booking.quote!.finalTotal),
        depositPaid: formatCurrency(booking.quote!.deposit),
        balance: formatCurrency(booking.quote!.balance),
        nextPaymentDue: nextPaymentDate.toLocaleDateString(),
      }),
    }).catch((err) => console.error("Failed to send booking confirmation email", err));

    router.push(`/confirmation/${booking.id}`);
  }

  async function handleStripeCheckout() {
    if (!booking) return;
    setCheckoutError(false);
    setRedirecting(true);
    try {
      const res = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookingId: booking.id,
          amount: booking.quote!.deposit,
          description: `Deposit for ${booking.lead?.firstName ?? "your"} ${booking.lead?.lastName ?? ""} — ${booking.id}`.trim(),
          customerEmail: booking.lead?.email,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.url) throw new Error(data.error || "Checkout session failed");
      window.location.href = data.url;
    } catch (err) {
      console.error("Failed to start Stripe checkout", err);
      setCheckoutError(true);
      setRedirecting(false);
    }
  }

  return (
    <div className="pt-32 md:pt-40 pb-24 md:pb-32 bg-ivory-deep min-h-screen">
      <div className="container-aurura max-w-2xl">
        <Reveal className="text-center mb-10">
          <p className="eyebrow mb-4">{venue.name}</p>
          <h1 className="font-serif-display text-3xl md:text-5xl leading-tight mb-3">{t.payment.title}</h1>
          <p className="text-charcoal-soft/70">{t.payment.subtitle}</p>
        </Reveal>

        <div className="bg-white border border-hairline p-6 md:p-8 mb-6 grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
          <div>
            <p className="text-xs uppercase tracking-wide text-charcoal-soft/55">{t.payment.eventTotal}</p>
            <p className="mt-0.5 font-medium">{formatCurrency(booking.quote.finalTotal)}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-charcoal-soft/55">{t.payment.depositDue}</p>
            <p className="mt-0.5 font-medium text-gold-deep">{formatCurrency(booking.quote.deposit)}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-charcoal-soft/55">{t.payment.remainingBalance}</p>
            <p className="mt-0.5 font-medium">{formatCurrency(booking.quote.balance)}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-charcoal-soft/55">{t.payment.nextPaymentDue}</p>
            <p className="mt-0.5 font-medium">{nextPaymentDate.toLocaleDateString()}</p>
          </div>
        </div>

        {STRIPE_PUBLISHABLE_KEY ? (
          <>
            {STRIPE_TEST_MODE && (
              <div className="bg-amber-50 border border-amber-200 text-amber-900 text-xs px-5 py-3 mb-6 flex items-start gap-2">
                <ShieldCheck size={15} className="mt-0.5 shrink-0" />
                Stripe test mode — no real charge will be made. Use test card 4242 4242 4242 4242, any future expiry, any
                CVC.
              </div>
            )}
            {checkoutError && (
              <div className="bg-red-50 border border-red-200 text-red-800 text-xs px-5 py-3 mb-6">
                Something went wrong starting checkout. Please try again.
              </div>
            )}
            <div className="bg-white border border-hairline p-6 md:p-8 text-center">
              <h3 className="font-serif-display text-xl mb-2">{t.payment.cardDetails}</h3>
              <p className="text-sm text-charcoal-soft/70 mb-6">
                You&apos;ll be redirected to Stripe&apos;s secure checkout to pay by card. Your card details are handled
                entirely by Stripe and never touch our servers.
              </p>
              <button onClick={handleStripeCheckout} disabled={redirecting} className="btn btn-gold w-full disabled:opacity-30">
                <Lock size={14} /> {redirecting ? t.payment.paying : `${t.payment.payButton} — ${formatCurrency(booking.quote.deposit)}`}
              </button>
              <p className="text-[11px] text-center text-charcoal-soft/50 mt-4">{t.payment.secure}</p>
            </div>
          </>
        ) : (
          <>
            <div className="bg-amber-50 border border-amber-200 text-amber-900 text-xs px-5 py-3 mb-6 flex items-start gap-2">
              <ShieldCheck size={15} className="mt-0.5 shrink-0" />
              {t.payment.demoNotice}
            </div>

            <div className="bg-white border border-hairline p-6 md:p-8">
              <h3 className="font-serif-display text-xl mb-6">{t.payment.cardDetails}</h3>
              <div className="space-y-5">
                <div>
                  <label className="block text-xs uppercase tracking-wide text-charcoal-soft/70 mb-2">{t.payment.cardNumber}</label>
                  <input
                    value={card.number}
                    onChange={(e) => setCard((c) => ({ ...c, number: e.target.value }))}
                    placeholder="4242 4242 4242 4242"
                    className="w-full border border-hairline px-4 py-3 text-sm focus:outline-none focus:border-gold"
                  />
                </div>
                <div className="grid grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs uppercase tracking-wide text-charcoal-soft/70 mb-2">{t.payment.expiry}</label>
                    <input
                      value={card.expiry}
                      onChange={(e) => setCard((c) => ({ ...c, expiry: e.target.value }))}
                      placeholder="MM/YY"
                      className="w-full border border-hairline px-4 py-3 text-sm focus:outline-none focus:border-gold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wide text-charcoal-soft/70 mb-2">{t.payment.cvc}</label>
                    <input
                      value={card.cvc}
                      onChange={(e) => setCard((c) => ({ ...c, cvc: e.target.value }))}
                      placeholder="CVC"
                      className="w-full border border-hairline px-4 py-3 text-sm focus:outline-none focus:border-gold"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs uppercase tracking-wide text-charcoal-soft/70 mb-2">{t.payment.nameOnCard}</label>
                    <input
                      value={card.name}
                      onChange={(e) => setCard((c) => ({ ...c, name: e.target.value }))}
                      className="w-full border border-hairline px-4 py-3 text-sm focus:outline-none focus:border-gold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wide text-charcoal-soft/70 mb-2">{t.payment.billingZip}</label>
                    <input
                      value={card.zip}
                      onChange={(e) => setCard((c) => ({ ...c, zip: e.target.value }))}
                      className="w-full border border-hairline px-4 py-3 text-sm focus:outline-none focus:border-gold"
                    />
                  </div>
                </div>
              </div>

              <button onClick={handlePay} disabled={!canPay || paying} className="btn btn-gold w-full mt-8 disabled:opacity-30">
                <Lock size={14} /> {paying ? t.payment.paying : `${t.payment.payButton} — ${formatCurrency(booking.quote.deposit)}`}
              </button>
              <p className="text-[11px] text-center text-charcoal-soft/50 mt-4">{t.payment.secure}</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
