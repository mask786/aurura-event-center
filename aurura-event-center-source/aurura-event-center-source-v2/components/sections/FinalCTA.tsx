"use client";

import Link from "next/link";
import { Phone, MessageCircle, Calculator, CalendarDays } from "lucide-react";
import { useLanguage } from "@/lib/language-context";
import { venue } from "@/lib/config";
import { Reveal } from "@/components/ui/Reveal";
import { photo } from "@/lib/images";
import { Photo } from "@/components/ui/Photo";

export function FinalCTA() {
  const { t } = useLanguage();
  const img = photo("aisle");

  const actions = [
    { href: `tel:${venue.phoneHref}`, icon: Phone, label: t.contact.call },
    { href: `https://wa.me/${venue.whatsapp.replace("+", "")}`, icon: MessageCircle, label: t.contact.whatsapp },
    { href: "/build-your-event", icon: Calculator, label: t.nav.ctaSecondary },
    { href: "/schedule-tour", icon: CalendarDays, label: t.nav.ctaPrimary },
  ];

  return (
    <section className="relative py-28 md:py-36 overflow-hidden">
      <div className="absolute inset-0">
        <Photo src={img.url} alt={img.alt} className="w-full h-full" />
        <div className="absolute inset-0 bg-charcoal/80" />
      </div>
      <div className="relative container-aurura text-center">
        <Reveal>
          <p className="eyebrow text-gold-soft mb-5">{venue.name}</p>
          <h2 className="font-serif-display text-3xl md:text-5xl text-ivory leading-tight max-w-2xl mx-auto text-balance mb-10">
            {t.hero.headline}
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl mx-auto">
            {actions.map((a) => (
              <Link
                key={a.label}
                href={a.href}
                className="flex flex-col items-center gap-2.5 border border-ivory/25 hover:border-gold py-6 px-3 transition-colors"
              >
                <a.icon size={20} className="text-gold-soft" strokeWidth={1.5} />
                <span className="text-xs tracking-[0.1em] uppercase text-ivory/90">{a.label}</span>
              </Link>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
