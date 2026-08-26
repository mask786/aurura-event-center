"use client";

import { useEffect, useMemo, useState } from "react";
import clsx from "clsx";
import { Check, CalendarPlus, Download } from "lucide-react";
import { useLanguage } from "@/lib/language-context";
import { getAvailability } from "@/lib/tour-availability";
import { getCurrentBooking, createBooking, updateBooking } from "@/lib/booking";
import { buildGoogleCalendarUrl, buildIcsDataUrl, parseTourDateTime } from "@/lib/calendar-links";
import { venue, eventTypes } from "@/lib/config";
import { MonthCalendar } from "./MonthCalendar";
import { Reveal } from "@/components/ui/Reveal";

export function TourScheduler() {
  const { t, lang } = useLanguage();
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [checking, setChecking] = useState(false);
  const [slots, setSlots] = useState<string[]>([]);
  const [confirming, setConfirming] = useState(false);
  const [confirmed, setConfirmed] = useState<{ date: string; time: string } | null>(null);
  const [errors, setErrors] = useState<Record<string, boolean>>({});

  const existing = useMemo(() => getCurrentBooking(), []);

  const [form, setForm] = useState({
    firstName: existing?.lead?.firstName ?? "",
    lastName: existing?.lead?.lastName ?? "",
    phone: existing?.lead?.phone ?? "",
    email: existing?.lead?.email ?? "",
    eventType: existing?.estimate?.eventType ?? eventTypes[0].id,
    eventDate: existing?.estimate?.eventDate ?? "",
    guestCount: existing?.estimate?.guestCount ?? 100,
    notes: existing?.lead?.notes ?? "",
  });

  useEffect(() => {
    if (!selectedDate) return;
    setChecking(true);
    setSelectedTime(null);
    const timeout = setTimeout(() => {
      setSlots(getAvailability(selectedDate));
      setChecking(false);
    }, 500);
    return () => clearTimeout(timeout);
  }, [selectedDate]);

  function validate() {
    const e: Record<string, boolean> = {};
    if (!form.firstName.trim()) e.firstName = true;
    if (!form.lastName.trim()) e.lastName = true;
    if (!form.phone.trim()) e.phone = true;
    if (!form.email.trim() || !form.email.includes("@")) e.email = true;
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleConfirm() {
    if (!selectedDate || !selectedTime || !validate()) return;
    setConfirming(true);
    await new Promise((r) => setTimeout(r, 800));

    if (existing) {
      updateBooking(existing.id, {
        stage: "tour",
        lead: existing.lead
          ? { ...existing.lead, firstName: form.firstName, lastName: form.lastName, phone: form.phone, email: form.email, notes: form.notes }
          : {
              firstName: form.firstName,
              lastName: form.lastName,
              phone: form.phone,
              email: form.email,
              preferredContact: "phone",
              notes: form.notes,
              submittedAt: new Date().toISOString(),
            },
        tour: { date: selectedDate, time: selectedTime, confirmedAt: new Date().toISOString() },
      });
    } else {
      createBooking({
        stage: "tour",
        lead: {
          firstName: form.firstName,
          lastName: form.lastName,
          phone: form.phone,
          email: form.email,
          preferredContact: "phone",
          notes: form.notes,
          submittedAt: new Date().toISOString(),
        },
        tour: { date: selectedDate, time: selectedTime, confirmedAt: new Date().toISOString() },
      });
    }

    setConfirming(false);
    setConfirmed({ date: selectedDate, time: selectedTime });

    fetch("/api/tour-confirmation", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        phone: form.phone,
        date: selectedDate,
        time: selectedTime,
        eventType: form.eventType,
        guestCount: form.guestCount,
        notes: form.notes,
      }),
    }).catch((err) => console.error("Failed to send tour confirmation email", err));
  }

  if (confirmed) {
    const { start, end } = parseTourDateTime(confirmed.date, confirmed.time);
    const title = `Venue Tour — ${venue.name}`;
    const description = `Tour with ${form.firstName} ${form.lastName}\nPhone: ${form.phone}\nEmail: ${form.email}\nEvent type: ${form.eventType}\nEvent date: ${form.eventDate || "TBD"}\nGuests: ${form.guestCount}`;
    const gcalUrl = buildGoogleCalendarUrl({ title, description, start, end });
    const icsUrl = buildIcsDataUrl({ title, description, start, end });
    const dateLabel = new Date(confirmed.date + "T00:00:00").toLocaleDateString(lang === "en" ? "en-US" : "es-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });

    return (
      <Reveal className="max-w-xl mx-auto text-center py-10">
        <div className="mx-auto mb-6 h-14 w-14 rounded-full border border-gold flex items-center justify-center">
          <Check className="text-gold-deep" size={22} />
        </div>
        <h2 className="font-serif-display text-3xl mb-3">{t.tour.confirmed}</h2>
        <p className="text-charcoal-soft/75 mb-8">{t.tour.confirmedBody}</p>

        <div className="bg-white border border-hairline p-6 md:p-8 text-left mb-8">
          <p className="text-xs uppercase tracking-wide text-charcoal-soft/60 mb-1">{t.tour.title}</p>
          <p className="font-serif-display text-xl mb-1">{dateLabel}</p>
          <p className="text-gold-deep text-lg mb-3">{confirmed.time}</p>
          <p className="text-sm text-charcoal-soft/70">{t.tour.duration} · {t.tour.withTeam}</p>
          <div className="border-t border-hairline mt-4 pt-4 text-sm text-charcoal-soft/70 space-y-1">
            <p>{form.firstName} {form.lastName}</p>
            <p>{form.phone} · {form.email}</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <a href={gcalUrl} target="_blank" rel="noreferrer" className="btn btn-gold">
            <CalendarPlus size={15} /> {t.tour.addToCalendar}
          </a>
          <a href={icsUrl} download="aurura-tour.ics" className="btn btn-outline">
            <Download size={15} /> .ics
          </a>
        </div>
      </Reveal>
    );
  }

  return (
    <div className="grid lg:grid-cols-2 gap-10">
      <div>
        <h3 className="font-serif-display text-xl mb-4">{t.tour.selectDate}</h3>
        <MonthCalendar selected={selectedDate} onSelect={setSelectedDate} />
      </div>

      <div>
        <h3 className="font-serif-display text-xl mb-4">{t.tour.selectTime}</h3>
        {!selectedDate && (
          <div className="bg-ivory-deep border border-hairline p-8 text-center text-charcoal-soft/60 text-sm">
            {t.tour.selectDateFirst}
          </div>
        )}
        {selectedDate && checking && (
          <div className="bg-ivory-deep border border-hairline p-8 text-center text-charcoal-soft/60 text-sm animate-pulse">
            {t.tour.checking}
          </div>
        )}
        {selectedDate && !checking && slots.length === 0 && (
          <div className="bg-ivory-deep border border-hairline p-8 text-center text-charcoal-soft/60 text-sm">
            {t.tour.noSlots}
          </div>
        )}
        {selectedDate && !checking && slots.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {slots.map((slot) => (
              <button
                key={slot}
                onClick={() => setSelectedTime(slot)}
                className={clsx(
                  "border py-3 text-sm transition-colors",
                  selectedTime === slot ? "bg-charcoal text-ivory border-charcoal" : "border-hairline hover:border-charcoal/40"
                )}
              >
                {slot}
              </button>
            ))}
          </div>
        )}

        {selectedTime && (
          <Reveal className="mt-10">
            <h3 className="font-serif-display text-xl mb-4">{t.tour.yourInfo}</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <input
                placeholder={t.lead.firstName}
                value={form.firstName}
                onChange={(e) => setForm((f) => ({ ...f, firstName: e.target.value }))}
                className={inputCls(errors.firstName)}
              />
              <input
                placeholder={t.lead.lastName}
                value={form.lastName}
                onChange={(e) => setForm((f) => ({ ...f, lastName: e.target.value }))}
                className={inputCls(errors.lastName)}
              />
              <input
                placeholder={t.lead.phone}
                value={form.phone}
                onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                className={inputCls(errors.phone)}
              />
              <input
                placeholder={t.lead.email}
                type="email"
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                className={inputCls(errors.email)}
              />
              <select
                value={form.eventType}
                onChange={(e) => setForm((f) => ({ ...f, eventType: e.target.value }))}
                className={inputCls(false)}
              >
                {eventTypes.map((ev) => (
                  <option key={ev.id} value={ev.id}>
                    {ev.name[lang]}
                  </option>
                ))}
              </select>
              <input
                type="number"
                min={1}
                placeholder={t.common.guests}
                value={form.guestCount}
                onChange={(e) => setForm((f) => ({ ...f, guestCount: Number(e.target.value) }))}
                className={inputCls(false)}
              />
            </div>
            <textarea
              placeholder={t.lead.notesPlaceholder}
              value={form.notes}
              onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
              rows={3}
              className={clsx(inputCls(false), "mt-4 resize-none")}
            />
            <button onClick={handleConfirm} disabled={confirming} className="btn btn-gold w-full mt-6">
              {confirming ? t.tour.confirming : t.tour.confirm}
            </button>
          </Reveal>
        )}
      </div>
    </div>
  );
}

function inputCls(error?: boolean) {
  return clsx(
    "w-full border bg-white px-4 py-3 text-sm focus:outline-none",
    error ? "border-red-400" : "border-hairline focus:border-gold"
  );
}
