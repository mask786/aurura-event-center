"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { useLanguage } from "@/lib/language-context";
import { photos } from "@/lib/images";
import { Photo } from "@/components/ui/Photo";
import { Reveal } from "@/components/ui/Reveal";

const teaserIds = ["ballroom-2", "florals", "dance-floor", "table-setting-3", "wedding-toast", "quince-1"];

export function GalleryTeaser() {
  const { t } = useLanguage();
  const items = teaserIds.map((id) => photos.find((p) => p.id === id)!).filter(Boolean);

  return (
    <section className="py-24 md:py-32 bg-ivory">
      <div className="container-aurura">
        <Reveal className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14">
          <div className="max-w-xl">
            <p className="eyebrow mb-4">{t.gallery.eyebrow}</p>
            <h2 className="font-serif-display text-3xl md:text-5xl leading-tight text-balance">{t.gallery.title}</h2>
          </div>
          <Link href="/gallery" className="inline-flex items-center gap-2 text-sm tracking-wide uppercase text-charcoal-soft hover:text-gold-deep transition-colors shrink-0">
            {t.common.viewMore} <ArrowUpRight size={16} />
          </Link>
        </Reveal>

        <div className="grid grid-cols-2 md:grid-cols-6 gap-2 md:gap-3 auto-rows-[140px] md:auto-rows-[160px]">
          {items.map((img, i) => (
            <Reveal
              key={img.id}
              delay={i * 0.04}
              className={i === 0 || i === 3 ? "col-span-2 row-span-2" : "col-span-1"}
            >
              <Link href="/gallery" className="group block relative w-full h-full overflow-hidden">
                <Photo src={img.url} alt={img.alt} className="w-full h-full transition-transform duration-700 group-hover:scale-110" label={img.alt} />
                <div className="absolute inset-0 bg-charcoal/0 group-hover:bg-charcoal/20 transition-colors duration-500" />
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
