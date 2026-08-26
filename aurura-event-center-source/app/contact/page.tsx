"use client";

import { useState } from "react";
import { Phone, MessageCircle, Mail, MapPin, Clock, Check } from "lucide-react";
import { useLanguage } from "@/lib/language-context";
import { venue } from "@/lib/config";
import { Reveal } from "@/components/ui/Reveal";
import { photo } from "@/lib/images";
import { Photo } from "@/components/ui/Photo";

export default function ContactPage() {
  const { t } = useLanguage();
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });

  const contactMethods = [
    { icon: Phone, label: t.contact.call, value: venue.phone, href: `tel:${venue.phoneHref}` },
    { icon: MessageCircle, label: t.contact.whatsapp, value: venue.phone, href: `https://wa.me/${venue.whatsapp.replace("+", "")}` },
    { icon: Mail, label: t.contact.email, value: venue.email, href: `mailto:${venue.email}` },
    { icon: MapPin, label: t.contact.address, value: `${venue.address.line1}, ${venue.address.city}, ${venue.address.state}`, href: "#" },
  ];

  return (
    <div className="pt-32 md:pt-40 pb-24 md:pb-32">
      <div className="container-aurura grid lg:grid-cols-2 gap-16 items-start">
        <Reveal>
          <p className="eyebrow mb-4">{t.contact.eyebrow}</p>
          <h1 className="font-serif-display text-3xl md:text-5xl leading-tight mb-6 text-balance">{t.contact.title}</h1>
          <p className="text-charcoal-soft/80 leading-relaxed mb-10 max-w-md">{t.contact.body}</p>

          <div className="space-y-5 mb-10">
            {contactMethods.map((m) => (
              <a key={m.label} href={m.href} className="flex items-start gap-4 group">
                <span className="h-11 w-11 rounded-full border border-hairline flex items-center justify-center shrink-0 group-hover:border-gold transition-colors">
                  <m.icon size={17} className="text-gold-deep" />
                </span>
                <div>
                  <p className="text-xs uppercase tracking-wide text-charcoal-soft/60">{m.label}</p>
                  <p className="text-sm mt-0.5">{m.value}</p>
                </div>
              </a>
            ))}
            <div className="flex items-start gap-4">
              <span className="h-11 w-11 rounded-full border border-hairline flex items-center justify-center shrink-0">
                <Clock size={17} className="text-gold-deep" />
              </span>
              <div>
                <p className="text-xs uppercase tracking-wide text-charcoal-soft/60">{t.contact.hours}</p>
                <p className="text-sm mt-0.5">{t.contact.hoursValue}</p>
              </div>
            </div>
          </div>

          <div className="relative aspect-[16/10]">
            <Photo src={photo("exterior").url} alt="Aurura Event Center" className="w-full h-full" label={venue.name} />
          </div>
        </Reveal>

        <Reveal delay={0.1} className="bg-white border border-hairline p-7 md:p-10">
          <h2 className="font-serif-display text-2xl mb-6">{t.contact.formTitle}</h2>
          {sent ? (
            <div className="text-center py-10">
              <div className="mx-auto mb-4 h-12 w-12 rounded-full border border-gold flex items-center justify-center">
                <Check className="text-gold-deep" size={18} />
              </div>
              <p className="text-charcoal-soft">{t.lead.success}</p>
            </div>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setSent(true);
              }}
              className="space-y-5"
            >
              <div>
                <label className="block text-xs uppercase tracking-wide text-charcoal-soft/70 mb-2">{t.contact.name}</label>
                <input required value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} className="w-full border border-hairline px-4 py-3 text-sm focus:outline-none focus:border-gold" />
              </div>
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs uppercase tracking-wide text-charcoal-soft/70 mb-2">{t.lead.email}</label>
                  <input required type="email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} className="w-full border border-hairline px-4 py-3 text-sm focus:outline-none focus:border-gold" />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wide text-charcoal-soft/70 mb-2">{t.lead.phone}</label>
                  <input value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} className="w-full border border-hairline px-4 py-3 text-sm focus:outline-none focus:border-gold" />
                </div>
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-charcoal-soft/70 mb-2">{t.contact.message}</label>
                <textarea required rows={5} value={form.message} onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))} className="w-full border border-hairline px-4 py-3 text-sm focus:outline-none focus:border-gold resize-none" />
              </div>
              <button type="submit" className="btn btn-primary w-full">
                {t.contact.send}
              </button>
            </form>
          )}
        </Reveal>
      </div>
    </div>
  );
}
