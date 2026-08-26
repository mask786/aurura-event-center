"use client";

import { useLanguage } from "@/lib/language-context";
import { eventTypes } from "@/lib/config";
import { photo } from "@/lib/images";
import { Photo } from "@/components/ui/Photo";
import { Reveal } from "@/components/ui/Reveal";
import Link from "next/link";

export function EventTypes() {
  const { t, lang } = useLanguage();

  return (
    <section className="py-24 md:py-32 bg-ivory">
      <div className="container-aurura">
        <Reveal className="max-w-2xl mb-14">
          <p className="eyebrow mb-4">{t.eventTypes.eyebrow}</p>
          <h2 className="font-serif-display text-3xl md:text-5xl leading-tight text-balance mb-5">{t.eventTypes.title}</h2>
          <p className="text-charcoal-soft/80 leading-relaxed">{t.eventTypes.body}</p>
        </Reveal>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
          {eventTypes.map((ev, i) => {
            const img = photo(ev.photoId);
            return (
              <Reveal key={ev.id} delay={i * 0.05}>
                <Link
                  href="/build-your-event"
                  className="group relative block aspect-[4/5] overflow-hidden"
                >
                  <Photo
                    src={img.url}
                    alt={ev.name[lang]}
                    className="w-full h-full transition-transform duration-[1400ms] ease-out group-hover:scale-110"
                    label={ev.name[lang]}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-charcoal/10 to-transparent" />
                  <div className="absolute inset-0 border border-ivory/0 group-hover:border-gold/60 transition-colors duration-500" />
                  <span className="absolute bottom-4 left-4 right-4 font-serif-display text-ivory text-lg md:text-xl">
                    {ev.name[lang]}
                  </span>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
