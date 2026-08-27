"use client";

import Link from "next/link";
import { useLanguage } from "@/lib/language-context";
import { photo } from "@/lib/images";
import { Photo } from "@/components/ui/Photo";
import { Reveal } from "@/components/ui/Reveal";
import { venue } from "@/lib/config";

const featureImages = ["ballroom-2", "stage", "dance-floor", "table-setting-2", "lounge", "exterior"];

export function VenuePageClient() {
  const { t } = useLanguage();
  const heroImg = photo("ballroom-1");
  const stats = [
    { label: t.venue.capacityLabel, value: t.venue.capacityValue },
    { label: t.venue.hoursLabel, value: t.venue.hoursValue },
    { label: t.venue.parkingLabel, value: t.venue.parkingValue },
    { label: t.venue.layoutLabel, value: t.venue.layoutValue },
  ];

  return (
    <>
      <section className="relative h-[64vh] min-h-[440px] w-full overflow-hidden">
        <div className="absolute inset-0">
          <Photo src={heroImg.url} alt={heroImg.alt} className="w-full h-full" label="The Venue" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-charcoal/20 to-charcoal/30" />
        <div className="relative z-10 h-full flex flex-col justify-end pb-16">
          <div className="container-aurura">
            <p className="eyebrow text-gold-soft mb-4">{t.venue.eyebrow}</p>
            <h1 className="font-serif-display text-ivory text-4xl md:text-6xl leading-tight max-w-2xl text-balance">
              {t.venue.title}
            </h1>
          </div>
        </div>
      </section>

      <section className="py-20 md:py-28 bg-ivory">
        <div className="container-aurura">
          <Reveal className="max-w-2xl mb-16">
            <p className="text-charcoal-soft/80 leading-relaxed text-lg">{t.venue.body}</p>
          </Reveal>

          <Reveal className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-24 max-w-3xl">
            {stats.map((s) => (
              <div key={s.label} className="border-t border-gold/60 pt-4">
                <p className="font-serif-display text-2xl md:text-3xl text-gold-deep">{s.value}</p>
                <p className="text-xs tracking-wide uppercase text-charcoal-soft/70 mt-1.5">{s.label}</p>
              </div>
            ))}
          </Reveal>

          <div className="space-y-24 md:space-y-32">
            {t.venue.features.map((feature, i) => {
              const img = photo(featureImages[i % featureImages.length]);
              const reverse = i % 2 === 1;
              return (
                <div
                  key={feature.title}
                  className={`grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center ${reverse ? "lg:[&>*:first-child]:order-2" : ""}`}
                >
                  <Reveal className="relative aspect-[4/3]">
                    <Photo src={img.url} alt={feature.title} className="w-full h-full" label={feature.title} />
                  </Reveal>
                  <Reveal delay={0.1}>
                    <span className="font-serif-display text-5xl text-gold/30">{String(i + 1).padStart(2, "0")}</span>
                    <h3 className="font-serif-display text-2xl md:text-3xl mt-3 mb-4">{feature.title}</h3>
                    <p className="text-charcoal-soft/80 leading-relaxed max-w-md">{feature.body}</p>
                  </Reveal>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-24 bg-charcoal text-ivory text-center">
        <div className="container-aurura">
          <Reveal>
            <p className="eyebrow text-gold-soft mb-4">{venue.name}</p>
            <h2 className="font-serif-display text-3xl md:text-5xl mb-8 max-w-2xl mx-auto text-balance">{t.hero.headline}</h2>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/schedule-tour" className="btn btn-gold">{t.hero.ctaPrimary}</Link>
              <Link href="/gallery" className="btn btn-outline-inverse">{t.nav.gallery}</Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
