"use client";

import { Suspense } from "react";
import { useLanguage } from "@/lib/language-context";
import { Estimator } from "@/components/booking/Estimator";
import { Reveal } from "@/components/ui/Reveal";

function Header() {
  const { t } = useLanguage();
  return (
    <Reveal className="max-w-2xl mx-auto text-center mb-14">
      <p className="eyebrow mb-4">{t.estimator.eyebrow}</p>
      <h1 className="font-serif-display text-3xl md:text-5xl leading-tight mb-5 text-balance">{t.estimator.title}</h1>
      <p className="text-charcoal-soft/80 leading-relaxed">{t.estimator.body}</p>
    </Reveal>
  );
}

export function BuildYourEventPageClient() {
  return (
    <div className="pt-32 md:pt-40 pb-24 md:pb-32 bg-ivory min-h-screen">
      <div className="container-aurura">
        <Header />
        <Suspense fallback={<div className="text-center text-charcoal-soft/60 py-20">…</div>}>
          <Estimator />
        </Suspense>
      </div>
    </div>
  );
}
