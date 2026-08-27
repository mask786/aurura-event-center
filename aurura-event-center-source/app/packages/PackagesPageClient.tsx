"use client";

import Link from "next/link";
import { useLanguage } from "@/lib/language-context";
import { packages } from "@/lib/config";
import { PackageCard } from "@/components/sections/PackageCard";
import { Reveal } from "@/components/ui/Reveal";

export function PackagesPageClient() {
  const { t } = useLanguage();

  return (
    <div className="pt-32 md:pt-40 pb-24 md:pb-32">
      <div className="container-aurura">
        <Reveal className="max-w-2xl mb-16">
          <p className="eyebrow mb-4">{t.packages.eyebrow}</p>
          <h1 className="font-serif-display text-3xl md:text-5xl leading-tight mb-5">{t.packages.title}</h1>
          <p className="text-charcoal-soft/80 leading-relaxed">{t.packages.body}</p>
        </Reveal>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 pt-4">
          {packages.map((pkg, i) => (
            <Reveal key={pkg.id} delay={i * 0.1}>
              <PackageCard pkg={pkg} index={i} />
            </Reveal>
          ))}
        </div>

        <Reveal className="text-center mt-20 border-t border-hairline pt-16">
          <p className="font-serif-display text-2xl mb-2">{t.packages.ctaFooter}</p>
          <p className="text-charcoal-soft/70 mb-6">{t.packages.ctaFooterBody}</p>
          <Link href="/build-your-event" className="btn btn-primary">
            {t.packages.ctaFooterButton}
          </Link>
        </Reveal>
      </div>
    </div>
  );
}
