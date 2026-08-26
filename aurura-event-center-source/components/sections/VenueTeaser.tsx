"use client";

import Link from "next/link";
import { useLanguage } from "@/lib/language-context";
import { photo } from "@/lib/images";
import { Photo } from "@/components/ui/Photo";
import { Reveal } from "@/components/ui/Reveal";

export function VenueTeaser() {
  const { t } = useLanguage();
  const img = photo("ballroom-1");

  const stats = [
    { label: t.venue.capacityLabel, value: t.venue.capacityValue },
    { label: t.venue.hoursLabel, value: t.venue.hoursValue },
    { label: t.venue.parkingLabel, value: t.venue.parkingValue },
    { label: t.venue.layoutLabel, value: t.venue.layoutValue },
  ];

  return (
    <section className="py-24 md:py-32 bg-ivory-deep">
      <div className="container-aurura grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
        <Reveal className="relative aspect-[4/5] lg:aspect-[3/4] order-2 lg:order-1">
          <Photo src={img.url} alt={img.alt} className="w-full h-full" label="The Ballroom" />
          <div className="absolute -bottom-6 -right-6 w-2/3 aspect-[5/4] hidden md:block border border-gold/40" />
        </Reveal>

        <Reveal delay={0.1} className="order-1 lg:order-2">
          <p className="eyebrow mb-4">{t.venue.eyebrow}</p>
          <h2 className="font-serif-display text-3xl md:text-5xl leading-tight text-balance mb-6">{t.venue.title}</h2>
          <p className="text-charcoal-soft/80 leading-relaxed mb-10 max-w-lg">{t.venue.body}</p>

          <div className="grid grid-cols-2 gap-x-8 gap-y-7 mb-10 max-w-md">
            {stats.map((s) => (
              <div key={s.label} className="border-t border-hairline pt-3">
                <p className="font-serif-display text-xl md:text-2xl text-gold-deep">{s.value}</p>
                <p className="text-xs tracking-wide uppercase text-charcoal-soft/70 mt-1">{s.label}</p>
              </div>
            ))}
          </div>

          <Link href="/venue" className="btn btn-outline">
            {t.nav.venue}
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
