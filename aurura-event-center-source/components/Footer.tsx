"use client";

import Link from "next/link";
import { Phone, Mail, MapPin } from "lucide-react";
import { useLanguage } from "@/lib/language-context";
import { venue } from "@/lib/config";

export function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-charcoal text-ivory pt-20 pb-28 lg:pb-14">
      <div className="container-aurura">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-5">
              <span className="flex h-10 w-10 items-center justify-center rounded-full border border-ivory/60 font-serif-display text-sm">
                {venue.monogram}
              </span>
              <span className="font-serif-display text-xl">{venue.name}</span>
            </div>
            <p className="text-ivory/60 max-w-sm leading-relaxed">{t.footer.tagline}</p>
          </div>

          <div>
            <p className="eyebrow text-gold-soft mb-5">{t.footer.quickLinks}</p>
            <ul className="space-y-3 text-sm text-ivory/70">
              <li><Link href="/venue" className="hover:text-ivory transition-colors">{t.nav.venue}</Link></li>
              <li><Link href="/gallery" className="hover:text-ivory transition-colors">{t.nav.gallery}</Link></li>
              <li><Link href="/packages" className="hover:text-ivory transition-colors">{t.nav.packages}</Link></li>
              <li><Link href="/build-your-event" className="hover:text-ivory transition-colors">{t.nav.build}</Link></li>
              <li><Link href="/schedule-tour" className="hover:text-ivory transition-colors">{t.nav.tour}</Link></li>
              <li><Link href="/admin" className="hover:text-ivory transition-colors">{t.footer.admin}</Link></li>
            </ul>
          </div>

          <div>
            <p className="eyebrow text-gold-soft mb-5">{t.footer.getInTouch}</p>
            <ul className="space-y-3 text-sm text-ivory/70">
              <li className="flex items-start gap-2"><Phone size={15} className="mt-0.5 shrink-0" /> {venue.phone}</li>
              <li className="flex items-start gap-2"><Mail size={15} className="mt-0.5 shrink-0" /> {venue.email}</li>
              <li className="flex items-start gap-2"><MapPin size={15} className="mt-0.5 shrink-0" /> {venue.address.line1}, {venue.address.city}, {venue.address.state} {venue.address.zip}</li>
            </ul>
            <div className="flex items-center gap-3 mt-6">
              <a href="#" aria-label="Instagram" className="flex h-9 w-9 items-center justify-center rounded-full border border-ivory/30 text-[11px] tracking-wide text-ivory/80 hover:border-gold-soft hover:text-gold-soft transition-colors">IG</a>
              <a href="#" aria-label="Facebook" className="flex h-9 w-9 items-center justify-center rounded-full border border-ivory/30 text-[11px] tracking-wide text-ivory/80 hover:border-gold-soft hover:text-gold-soft transition-colors">FB</a>
            </div>
          </div>
        </div>

        <div className="border-t border-hairline-inverse pt-8 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-ivory/40">
          <p>&copy; {new Date().getFullYear()} {venue.name}. {t.footer.rights}</p>
          <p className="tracking-wide">Cedar Hollow, Texas</p>
        </div>
      </div>
    </footer>
  );
}
