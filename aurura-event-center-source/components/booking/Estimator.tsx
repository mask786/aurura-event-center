"use client";

import { useMemo, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Check } from "lucide-react";
import clsx from "clsx";
import { useLanguage } from "@/lib/language-context";
import { eventTypes, packages, addOns, venue } from "@/lib/config";
import { calcEstimate, formatCurrency, type AddOnSelection } from "@/lib/pricing";
import { createBooking } from "@/lib/booking";
import { photo } from "@/lib/images";
import { Photo } from "@/components/ui/Photo";
import { Reveal } from "@/components/ui/Reveal";
import { StepIndicator } from "./StepIndicator";
import { QuantityStepper } from "./QuantityStepper";

const MIN_DATE = new Date(Date.now() + 86400000 * 3).toISOString().slice(0, 10);

function tomorrowPlus(days: number) {
  return new Date(Date.now() + 86400000 * days).toISOString().slice(0, 10);
}

export function Estimator() {
  const { t, lang } = useLanguage();
  const router = useRouter();
  const searchParams = useSearchParams();
  const presetPackage = searchParams.get("package");

  const [step, setStep] = useState(0);
  const [eventType, setEventType] = useState(eventTypes[0].id);
  const [eventDate, setEventDate] = useState(tomorrowPlus(60));
  const [guestCount, setGuestCount] = useState(100);
  const [packageId, setPackageId] = useState<string | null>(presetPackage ?? null);
  const [selections, setSelections] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [lead, setLead] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    preferredContact: "phone" as "phone" | "text" | "email" | "whatsapp",
    notes: "",
  });
  const [errors, setErrors] = useState<Record<string, boolean>>({});

  const steps = [t.estimator.steps.details, t.estimator.steps.package, t.estimator.steps.addons, t.estimator.steps.summary];

  const addOnSelections: AddOnSelection[] = useMemo(
    () => Object.entries(selections).map(([addOnId, quantity]) => ({ addOnId, quantity })),
    [selections]
  );

  const breakdown = useMemo(
    () => calcEstimate({ packageId, guestCount, selections: addOnSelections }, lang),
    [packageId, guestCount, addOnSelections, lang]
  );

  const setQty = (id: string, qty: number) => setSelections((s) => ({ ...s, [id]: Math.max(0, qty) }));
  const toggle = (id: string) => setSelections((s) => ({ ...s, [id]: s[id] > 0 ? 0 : 1 }));

  const canContinue = () => {
    if (step === 0) return !!eventType && !!eventDate && guestCount > 0;
    if (step === 1) return !!packageId;
    return true;
  };

  const grouped = useMemo(() => {
    const cats: Record<string, typeof addOns> = {};
    addOns.forEach((a) => {
      cats[a.category] = cats[a.category] ? [...cats[a.category], a] : [a];
    });
    return cats;
  }, []);

  const categoryLabels: Record<string, { en: string; es: string }> = {
    logistics: { en: "Logistics", es: "Logística" },
    decor: { en: "Decor & Styling", es: "Decoración y Estilo" },
    food_beverage: { en: "Food & Beverage", es: "Comida y Bebida" },
    entertainment: { en: "Entertainment", es: "Entretenimiento" },
    staffing: { en: "Staffing", es: "Personal" },
  };

  function validateLead() {
    const e: Record<string, boolean> = {};
    if (!lead.firstName.trim()) e.firstName = true;
    if (!lead.lastName.trim()) e.lastName = true;
    if (!lead.phone.trim()) e.phone = true;
    if (!lead.email.trim() || !lead.email.includes("@")) e.email = true;
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmitLead(mode: "estimate" | "booking") {
    if (!validateLead() || !packageId) return;
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 700));
    const booking = createBooking({
      stage: "lead",
      estimate: {
        eventType,
        eventDate,
        guestCount,
        packageId,
        selections: addOnSelections,
        breakdown,
      },
      lead: {
        ...lead,
        submittedAt: new Date().toISOString(),
      },
    });
    setSubmitting(false);
    setSubmitted(true);
    if (mode === "booking") {
      router.push("/schedule-tour");
    } else {
      void booking;
    }
  }

  if (submitted) {
    return (
      <Reveal className="max-w-xl mx-auto text-center py-16">
        <div className="mx-auto mb-6 h-14 w-14 rounded-full border border-gold flex items-center justify-center">
          <Check className="text-gold-deep" size={22} />
        </div>
        <h2 className="font-serif-display text-3xl mb-3">{t.lead.success}</h2>
        <p className="text-charcoal-soft/75 mb-8">{t.myBooking.body}</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <a href="/schedule-tour" className="btn btn-gold">{t.nav.ctaPrimary}</a>
          <a href="/my-booking" className="btn btn-outline">{t.myBooking.title}</a>
        </div>
      </Reveal>
    );
  }

  return (
    <div>
      <StepIndicator steps={steps} current={step} />

      {step === 0 && (
        <Reveal className="max-w-2xl mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-10">
            {eventTypes.map((ev) => (
              <button
                key={ev.id}
                onClick={() => setEventType(ev.id)}
                className={clsx(
                  "relative aspect-[4/3] overflow-hidden text-left group border",
                  eventType === ev.id ? "border-gold" : "border-transparent"
                )}
              >
                <Photo src={photo(ev.photoId).url} alt={ev.name[lang]} className="w-full h-full" label={ev.name[lang]} />
                <div className="absolute inset-0 bg-charcoal/40 group-hover:bg-charcoal/25 transition-colors" />
                {eventType === ev.id && <div className="absolute inset-0 ring-2 ring-inset ring-gold" />}
                <span className="absolute bottom-2 left-2 right-2 text-ivory text-xs md:text-sm font-medium tracking-wide">
                  {ev.name[lang]}
                </span>
              </button>
            ))}
          </div>

          <div className="grid sm:grid-cols-2 gap-6 mb-8">
            <div>
              <label className="block text-xs uppercase tracking-wide text-charcoal-soft/70 mb-2">{t.estimator.eventDate}</label>
              <input
                type="date"
                value={eventDate}
                min={MIN_DATE}
                onChange={(e) => setEventDate(e.target.value)}
                className="w-full border border-hairline bg-white px-4 py-3 text-sm focus:outline-none focus:border-gold"
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wide text-charcoal-soft/70 mb-2">
                {t.estimator.guestCount}
              </label>
              <div className="flex items-center gap-4 border border-hairline bg-white px-4 py-2.5">
                <input
                  type="range"
                  min={10}
                  max={350}
                  step={5}
                  value={guestCount}
                  onChange={(e) => setGuestCount(Number(e.target.value))}
                  className="flex-1 accent-[#B4914F]"
                />
                <span className="text-sm tabular-nums w-20 text-right">
                  {guestCount} {t.estimator.guests}
                </span>
              </div>
            </div>
          </div>
        </Reveal>
      )}

      {step === 1 && (
        <Reveal>
          <p className="text-center text-charcoal-soft/70 mb-8">{t.estimator.choosePackage}</p>
          <div className="grid md:grid-cols-3 gap-5">
            {packages.map((pkg) => (
              <button
                key={pkg.id}
                onClick={() => setPackageId(pkg.id)}
                className={clsx(
                  "text-left border bg-white transition-all",
                  packageId === pkg.id ? "border-gold shadow-[0_20px_45px_-25px_rgba(180,145,79,0.5)]" : "border-hairline hover:border-charcoal/30"
                )}
              >
                <div className="relative aspect-[16/10]">
                  <Photo src={photo(pkg.photoId).url} alt={pkg.name[lang]} className="w-full h-full" label={pkg.name[lang]} />
                  {packageId === pkg.id && (
                    <div className="absolute top-3 right-3 h-7 w-7 rounded-full bg-gold flex items-center justify-center">
                      <Check size={14} className="text-charcoal" />
                    </div>
                  )}
                </div>
                <div className="p-5">
                  <h3 className="font-serif-display text-xl mb-1">{pkg.name[lang]}</h3>
                  <p className="text-gold-deep font-serif-display text-lg">{formatCurrency(pkg.startingPrice)}</p>
                  <p className="text-xs text-charcoal-soft/60 mt-1">
                    {pkg.includedHours} {t.packages.hours} · {pkg.includedGuests} {t.packages.guests}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </Reveal>
      )}

      {step === 2 && (
        <Reveal>
          <p className="text-center text-charcoal-soft/70 mb-10">{t.estimator.addOnsBody}</p>
          <div className="space-y-10 max-w-3xl mx-auto">
            {Object.entries(grouped).map(([cat, items]) => (
              <div key={cat}>
                <h4 className="eyebrow mb-4">{categoryLabels[cat]?.[lang] ?? cat}</h4>
                <div className="divide-y divide-hairline border-t border-b border-hairline">
                  {items.map((addOn) => {
                    const qty = selections[addOn.id] ?? 0;
                    const isToggle = addOn.model === "flat" || addOn.model === "per_guest";
                    const lineTotal =
                      addOn.model === "per_guest"
                        ? qty > 0
                          ? addOn.price * guestCount
                          : 0
                        : addOn.model === "flat"
                          ? qty > 0
                            ? addOn.price
                            : 0
                          : addOn.price * qty;
                    return (
                      <div key={addOn.id} className="flex items-center justify-between gap-4 py-4">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium">{addOn.name[lang]}</p>
                          <p className="text-xs text-charcoal-soft/60 mt-0.5">{addOn.description[lang]}</p>
                          <p className="text-xs text-gold-deep mt-1">
                            {formatCurrency(addOn.price)}
                            {addOn.model === "per_guest" && ` ${t.estimator.perGuest}`}
                            {addOn.model === "per_hour" && ` ${t.estimator.perHour}`}
                            {addOn.model === "quantity" && addOn.unitLabel && ` ${addOn.unitLabel[lang]}`}
                            {addOn.model === "flat" && ` (${t.estimator.flatFee})`}
                          </p>
                        </div>
                        <div className="flex items-center gap-3 shrink-0">
                          {lineTotal > 0 && (
                            <span className="text-sm tabular-nums text-charcoal-soft hidden sm:inline">
                              {formatCurrency(lineTotal)}
                            </span>
                          )}
                          {isToggle ? (
                            <button
                              onClick={() => toggle(addOn.id)}
                              className={clsx(
                                "h-9 w-9 flex items-center justify-center border transition-colors",
                                qty > 0 ? "bg-charcoal border-charcoal text-ivory" : "border-hairline text-transparent hover:border-charcoal/40"
                              )}
                              aria-label={`Toggle ${addOn.name.en}`}
                            >
                              <Check size={15} />
                            </button>
                          ) : (
                            <QuantityStepper value={qty} onChange={(v) => setQty(addOn.id, v)} max={addOn.max ?? 20} />
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      )}

      {step === 3 && (
        <Reveal className="max-w-2xl mx-auto">
          <div className="bg-white border border-hairline p-6 md:p-10">
            <h3 className="font-serif-display text-2xl mb-6 text-center">{t.estimator.summaryTitle}</h3>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-charcoal-soft">
                  {t.estimator.base} — {breakdown.packageName}
                </span>
                <span className="tabular-nums">{formatCurrency(breakdown.packageBase)}</span>
              </div>

              {breakdown.addOnLines.length > 0 && (
                <div className="pt-2">
                  <p className="text-charcoal-soft mb-1.5">{t.estimator.addOnsLine}</p>
                  {breakdown.addOnLines.map((line) => (
                    <div key={line.addOn.id} className="flex justify-between pl-4 text-charcoal-soft/80 text-[13px] py-0.5">
                      <span>
                        {line.addOn.name[lang]}
                        {line.addOn.model === "quantity" || line.addOn.model === "per_hour" ? ` × ${line.quantity}` : ""}
                      </span>
                      <span className="tabular-nums">{formatCurrency(line.total)}</span>
                    </div>
                  ))}
                </div>
              )}

              <div className="border-t border-hairline pt-3 flex justify-between">
                <span className="text-charcoal-soft">{t.estimator.subtotal}</span>
                <span className="tabular-nums">{formatCurrency(breakdown.subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-charcoal-soft">{t.estimator.serviceFee}</span>
                <span className="tabular-nums">{formatCurrency(breakdown.serviceFee)}</span>
              </div>
              <div className="border-t border-charcoal pt-3 flex justify-between items-baseline">
                <span className="font-serif-display text-lg">{t.estimator.total}</span>
                <span className="font-serif-display text-2xl text-gold-deep tabular-nums">{formatCurrency(breakdown.total)}</span>
              </div>
            </div>

            <p className="text-[11px] text-charcoal-soft/55 leading-relaxed mt-6">{t.estimator.disclaimer}</p>
          </div>

          <div className="mt-12 bg-ivory-deep border border-hairline p-6 md:p-10">
            <h3 className="font-serif-display text-xl mb-1.5">{t.lead.title}</h3>
            <p className="text-sm text-charcoal-soft/70 mb-7">{t.lead.body}</p>

            <div className="grid sm:grid-cols-2 gap-5">
              <Field label={t.lead.firstName} error={errors.firstName}>
                <input value={lead.firstName} onChange={(e) => setLead((l) => ({ ...l, firstName: e.target.value }))} className={inputClass(errors.firstName)} />
              </Field>
              <Field label={t.lead.lastName} error={errors.lastName}>
                <input value={lead.lastName} onChange={(e) => setLead((l) => ({ ...l, lastName: e.target.value }))} className={inputClass(errors.lastName)} />
              </Field>
              <Field label={t.lead.phone} error={errors.phone}>
                <input type="tel" value={lead.phone} onChange={(e) => setLead((l) => ({ ...l, phone: e.target.value }))} className={inputClass(errors.phone)} />
              </Field>
              <Field label={t.lead.email} error={errors.email}>
                <input type="email" value={lead.email} onChange={(e) => setLead((l) => ({ ...l, email: e.target.value }))} className={inputClass(errors.email)} />
              </Field>
            </div>

            <div className="mt-5">
              <label className="block text-xs uppercase tracking-wide text-charcoal-soft/70 mb-2">{t.lead.preferredContact}</label>
              <div className="flex flex-wrap gap-2">
                {(["phone", "text", "email", "whatsapp"] as const).map((opt) => (
                  <button
                    key={opt}
                    onClick={() => setLead((l) => ({ ...l, preferredContact: opt }))}
                    className={clsx(
                      "px-4 py-2 text-xs uppercase tracking-wide border transition-colors",
                      lead.preferredContact === opt ? "bg-charcoal text-ivory border-charcoal" : "border-hairline text-charcoal-soft"
                    )}
                  >
                    {t.lead.contactOptions[opt]}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-5">
              <label className="block text-xs uppercase tracking-wide text-charcoal-soft/70 mb-2">{t.lead.notes}</label>
              <textarea
                value={lead.notes}
                onChange={(e) => setLead((l) => ({ ...l, notes: e.target.value }))}
                placeholder={t.lead.notesPlaceholder}
                rows={3}
                className="w-full border border-hairline bg-white px-4 py-3 text-sm focus:outline-none focus:border-gold resize-none"
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-3 mt-8">
              <button onClick={() => handleSubmitLead("estimate")} disabled={submitting} className="btn btn-outline flex-1">
                {submitting ? t.lead.submitting : t.estimator.requestPackage}
              </button>
              <button onClick={() => handleSubmitLead("booking")} disabled={submitting} className="btn btn-gold flex-1">
                {submitting ? t.lead.submitting : t.estimator.continueBooking}
              </button>
            </div>
          </div>
        </Reveal>
      )}

      {step < 3 && (
        <div className="flex items-center justify-between mt-12 max-w-3xl mx-auto">
          <button
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            className={clsx("text-sm tracking-wide uppercase text-charcoal-soft", step === 0 && "invisible")}
          >
            ← {t.estimator.back}
          </button>
          <div className="text-xs text-charcoal-soft/60">
            {t.estimator.step} {step + 1} {t.estimator.of} {steps.length}
          </div>
          <button
            onClick={() => canContinue() && setStep((s) => Math.min(3, s + 1))}
            disabled={!canContinue()}
            className="btn btn-primary disabled:opacity-30"
          >
            {t.estimator.next} →
          </button>
        </div>
      )}

      {step === 3 && (
        <div className="text-center mt-8">
          <button onClick={() => setStep(2)} className="text-sm tracking-wide uppercase text-charcoal-soft">
            ← {t.estimator.back}
          </button>
        </div>
      )}

      <div className="max-w-3xl mx-auto mt-10 flex items-center justify-between text-xs text-charcoal-soft/50 border-t border-hairline pt-5">
        <span>{venue.name}</span>
        <span className="tabular-nums">{formatCurrency(breakdown.total)} {t.estimator.total.toLowerCase()}</span>
      </div>
    </div>
  );
}

function inputClass(error?: boolean) {
  return clsx(
    "w-full border bg-white px-4 py-3 text-sm focus:outline-none",
    error ? "border-red-400" : "border-hairline focus:border-gold"
  );
}

function Field({ label, children }: { label: string; error?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs uppercase tracking-wide text-charcoal-soft/70 mb-2">{label}</label>
      {children}
    </div>
  );
}
