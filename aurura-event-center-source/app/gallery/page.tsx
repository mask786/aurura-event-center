"use client";

import { useMemo, useState } from "react";
import clsx from "clsx";
import { useLanguage } from "@/lib/language-context";
import { photos, type VenuePhoto } from "@/lib/images";
import { Photo } from "@/components/ui/Photo";
import { Lightbox } from "@/components/ui/Lightbox";
import { Reveal } from "@/components/ui/Reveal";

const categories: Array<VenuePhoto["category"] | "all"> = [
  "all",
  "ballroom",
  "wedding",
  "quinceanera",
  "decor",
  "stage",
  "tables",
  "celebration",
];

export default function GalleryPage() {
  const { t } = useLanguage();
  const [active, setActive] = useState<VenuePhoto["category"] | "all">("all");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const filtered = useMemo(
    () => (active === "all" ? photos : photos.filter((p) => p.category === active)),
    [active]
  );

  return (
    <div className="pt-32 md:pt-40 pb-24 md:pb-32">
      <div className="container-aurura">
        <Reveal className="max-w-2xl mb-10">
          <p className="eyebrow mb-4">{t.gallery.eyebrow}</p>
          <h1 className="font-serif-display text-3xl md:text-5xl leading-tight mb-5">{t.gallery.title}</h1>
          <p className="text-charcoal-soft/80 leading-relaxed">{t.gallery.body}</p>
        </Reveal>

        <div className="flex flex-wrap gap-2 mb-12 border-b border-hairline pb-8">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActive(cat)}
              className={clsx(
                "px-4 py-2 text-xs tracking-[0.1em] uppercase border transition-colors",
                active === cat ? "bg-charcoal text-ivory border-charcoal" : "border-hairline text-charcoal-soft hover:border-charcoal"
              )}
            >
              {cat === "all" ? t.gallery.all : t.gallery.categories[cat]}
            </button>
          ))}
        </div>

        <div className="columns-2 md:columns-3 gap-3 space-y-3">
          {filtered.map((img, i) => (
            <button
              key={img.id}
              onClick={() => setLightboxIndex(i)}
              className="group block w-full break-inside-avoid relative overflow-hidden"
            >
              <Photo
                src={img.url}
                alt={img.alt}
                className="w-full h-auto transition-transform duration-700 group-hover:scale-105"
                label={img.alt}
              />
              <div className="absolute inset-0 bg-charcoal/0 group-hover:bg-charcoal/15 transition-colors duration-500" />
            </button>
          ))}
        </div>
      </div>

      <Lightbox
        photos={filtered}
        index={lightboxIndex}
        onClose={() => setLightboxIndex(null)}
        onNavigate={setLightboxIndex}
      />
    </div>
  );
}
