"use client";

import Link from "next/link";
import { Check } from "lucide-react";
import { useLanguage } from "@/lib/language-context";
import { formatCurrency } from "@/lib/pricing";
import { photo } from "@/lib/images";
import { Photo } from "@/components/ui/Photo";
import type { Package } from "@/lib/config";
import clsx from "clsx";

export function PackageCard({ pkg }: { pkg: Package; index?: number }) {
  const { t, lang } = useLanguage();
  const img = photo(pkg.photoId);

  return (
    <div
      className={clsx(
        "group relative flex flex-col bg-white",
        pkg.featured && "lg:-translate-y-4 shadow-[0_30px_60px_-25px_rgba(33,31,28,0.25)]"
      )}
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        <Photo
          src={img.url}
          alt={pkg.name[lang]}
          className="w-full h-full transition-transform duration-[1200ms] group-hover:scale-105"
          label={pkg.name[lang]}
        />
        {pkg.featured && (
          <span className="absolute top-4 left-4 bg-gold text-charcoal text-[10px] tracking-[0.16em] uppercase px-3 py-1.5">
            {t.packages.mostPopular}
          </span>
        )}
      </div>

      <div className="flex flex-col flex-1 p-7 md:p-9 border border-t-0 border-hairline">
        <h3 className="font-serif-display text-2xl md:text-[26px] mb-1.5">{pkg.name[lang]}</h3>
        <p className="text-sm text-charcoal-soft/70 mb-5 leading-relaxed">{pkg.tagline[lang]}</p>

        <div className="mb-6">
          <span className="text-[11px] uppercase tracking-wide text-charcoal-soft/60">{t.packages.startingAt}</span>
          <p className="font-serif-display text-3xl md:text-4xl text-gold-deep">{formatCurrency(pkg.startingPrice)}</p>
          <p className="text-xs text-charcoal-soft/60 mt-1">
            {t.packages.includesUpTo} {pkg.includedGuests} {t.packages.guests} · {pkg.includedHours} {t.packages.hours}
          </p>
        </div>

        <ul className="space-y-2.5 mb-8 flex-1">
          {pkg.inclusions[lang].map((item) => (
            <li key={item} className="flex items-start gap-2.5 text-[14px] text-charcoal-soft leading-snug">
              <Check size={15} className="mt-0.5 text-gold-deep shrink-0" strokeWidth={1.8} />
              {item}
            </li>
          ))}
        </ul>

        <Link
          href={`/build-your-event?package=${pkg.id}`}
          className={clsx("btn w-full", pkg.featured ? "btn-gold" : "btn-outline")}
        >
          {t.packages.selectPackage}
        </Link>
      </div>
    </div>
  );
}
