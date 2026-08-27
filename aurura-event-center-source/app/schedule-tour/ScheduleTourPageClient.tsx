"use client";

import { useLanguage } from "@/lib/language-context";
import { TourScheduler } from "@/components/booking/TourScheduler";
import { Reveal } from "@/components/ui/Reveal";

export function ScheduleTourPageClient() {
  const { t } = useLanguage();
  return (
    <div className="pt-32 md:pt-40 pb-24 md:pb-32 bg-ivory min-h-screen">
      <div className="container-aurura">
        <Reveal className="max-w-2xl mx-auto text-center mb-14">
          <p className="eyebrow mb-4">{t.tour.eyebrow}</p>
          <h1 className="font-serif-display text-3xl md:text-5xl leading-tight mb-5 text-balance">{t.tour.title}</h1>
          <p className="text-charcoal-soft/80 leading-relaxed">{t.tour.body}</p>
        </Reveal>
        <TourScheduler />
      </div>
    </div>
  );
}
