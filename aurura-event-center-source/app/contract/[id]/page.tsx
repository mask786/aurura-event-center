"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Check, ShieldCheck } from "lucide-react";
import { useLanguage } from "@/lib/language-context";
import { getBooking, updateBooking, type Booking } from "@/lib/booking";
import { formatCurrency, getPackage } from "@/lib/pricing";
import { contractTerms, venue, eventTypes } from "@/lib/config";
import { Reveal } from "@/components/ui/Reveal";

export default function ContractPage() {
  const { t, lang } = useLanguage();
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [booking, setBooking] = useState<Booking | null | undefined>(undefined);
  const [fullName, setFullName] = useState("");
  const [address, setAddress] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [signing, setSigning] = useState(false);

  useEffect(() => {
    const id = Array.isArray(params.id) ? params.id[0] : params.id;
    if (!id) return;
    setBooking(getBooking(id));
  }, [params.id]);

  useEffect(() => {
    if (booking?.lead) setFullName(`${booking.lead.firstName} ${booking.lead.lastName}`);
  }, [booking]);

  if (booking === undefined) return <div className="pt-40 text-center text-charcoal-soft/60">{t.common.loading}</div>;

  if (!booking || !booking.quote || booking.quote.status !== "accepted" || !booking.estimate) {
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
  const isSigned = !!booking.contract?.signedAt;

  async function handleSign() {
    if (!booking || !fullName.trim() || !agreed) return;
    setSigning(true);
    await new Promise((r) => setTimeout(r, 900));
    updateBooking(booking.id, {
      stage: "contract_signed",
      contract: { signedName: fullName.trim(), signedAt: new Date().toISOString(), agreed: true },
    });
    setBooking(getBooking(booking.id));
    setSigning(false);
  }

  return (
    <div className="pt-32 md:pt-40 pb-24 md:pb-32 bg-ivory-deep min-h-screen">
      <div className="container-aurura max-w-3xl">
        <Reveal className="text-center mb-10">
          <p className="eyebrow mb-4">{venue.name}</p>
          <h1 className="font-serif-display text-3xl md:text-5xl leading-tight mb-3">{t.contract.title}</h1>
          <p className="text-charcoal-soft/70">{t.contract.subtitle}</p>
        </Reveal>

        <div className="bg-white border border-hairline p-6 md:p-10 mb-8">
          <div className="grid sm:grid-cols-2 gap-8 mb-8 pb-8 border-b border-hairline">
            <div>
              <p className="eyebrow mb-2">{t.contract.partyA}</p>
              <p className="text-sm">{venue.name}</p>
              <p className="text-sm text-charcoal-soft/70">{venue.address.line1}, {venue.address.city}, {venue.address.state} {venue.address.zip}</p>
              <p className="text-sm text-charcoal-soft/70">{venue.email}</p>
            </div>
            <div>
              <p className="eyebrow mb-2">{t.contract.partyB}</p>
              <p className="text-sm">{booking.lead?.firstName} {booking.lead?.lastName}</p>
              <p className="text-sm text-charcoal-soft/70">{booking.lead?.phone} · {booking.lead?.email}</p>
              <p className="text-sm text-charcoal-soft/70">{address || "—"}</p>
            </div>
          </div>

          <h3 className="font-serif-display text-xl mb-4">{t.contract.eventSummary}</h3>
          <dl className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm mb-8">
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

          <h3 className="font-serif-display text-xl mb-4">{t.contract.financialSummary}</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm mb-8">
            <div>
              <dt className="text-xs uppercase tracking-wide text-charcoal-soft/55">{t.quote.total}</dt>
              <dd className="mt-0.5 text-gold-deep font-medium">{formatCurrency(booking.quote.finalTotal)}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wide text-charcoal-soft/55">{t.quote.deposit}</dt>
              <dd className="mt-0.5">{formatCurrency(booking.quote.deposit)}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wide text-charcoal-soft/55">{t.quote.balance}</dt>
              <dd className="mt-0.5">{formatCurrency(booking.quote.balance)}</dd>
            </div>
          </div>

          <div className="space-y-5 text-sm text-charcoal-soft/75 leading-relaxed">
            <div>
              <p className="text-xs uppercase tracking-wide text-charcoal mb-1.5">{t.contract.paymentSchedule}</p>
              <p>{contractTerms.paymentSchedule[lang]}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-charcoal mb-1.5">{t.contract.cancellation}</p>
              <p>{contractTerms.cancellation[lang]}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-charcoal mb-1.5">{t.contract.policies}</p>
              <p>{contractTerms.policies[lang]}</p>
            </div>
          </div>
        </div>

        {isSigned ? (
          <Reveal className="bg-white border border-gold p-8 text-center">
            <div className="mx-auto mb-4 h-12 w-12 rounded-full border border-gold flex items-center justify-center">
              <Check className="text-gold-deep" size={18} />
            </div>
            <p className="font-serif-display text-xl mb-1">{t.contract.signed}</p>
            <p className="text-charcoal-soft/70 mb-1">{t.contract.signedBody}</p>
            <p className="text-xs text-charcoal-soft/50 mb-6">
              {t.contract.signedOn} {new Date(booking.contract!.signedAt).toLocaleString(lang === "en" ? "en-US" : "es-US")}
            </p>
            <Link href={`/pay/${booking.id}`} className="btn btn-gold">
              {t.contract.continuePayment}
            </Link>
          </Reveal>
        ) : (
          <Reveal className="bg-ivory-deep border border-hairline p-6 md:p-10">
            <h3 className="font-serif-display text-xl mb-2 flex items-center gap-2">
              <ShieldCheck size={18} className="text-gold-deep" /> {t.contract.signHere}
            </h3>
            <p className="text-sm text-charcoal-soft/70 mb-6">{t.contract.signBody}</p>

            <div className="grid sm:grid-cols-2 gap-5 mb-5">
              <div>
                <label className="block text-xs uppercase tracking-wide text-charcoal-soft/70 mb-2">{t.contract.fullName}</label>
                <input value={fullName} onChange={(e) => setFullName(e.target.value)} className="w-full border border-hairline bg-white px-4 py-3 text-sm font-serif-display italic text-lg focus:outline-none focus:border-gold" />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-charcoal-soft/70 mb-2">{t.contact.address}</label>
                <input value={address} onChange={(e) => setAddress(e.target.value)} className="w-full border border-hairline bg-white px-4 py-3 text-sm focus:outline-none focus:border-gold" />
              </div>
            </div>

            <label className="flex items-start gap-3 mb-6 cursor-pointer">
              <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} className="mt-1 accent-[#B4914F]" />
              <span className="text-sm text-charcoal-soft">{t.contract.agree}</span>
            </label>

            <button onClick={handleSign} disabled={!fullName.trim() || !agreed || signing} className="btn btn-gold w-full disabled:opacity-30">
              {signing ? t.contract.signing : t.contract.sign}
            </button>
            <p className="text-[11px] text-center text-charcoal-soft/50 mt-4">{t.contract.poweredBy}</p>
          </Reveal>
        )}
      </div>
    </div>
  );
}
