"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useLanguage } from "@/lib/language-context";
import { Photo } from "@/components/ui/Photo";
import { photo } from "@/lib/images";

export function Hero() {
  const { t } = useLanguage();
  const img = photo("hero");

  return (
    <section className="relative h-[100svh] min-h-[640px] w-full overflow-hidden">
      <motion.div
        initial={{ scale: 1.12 }}
        animate={{ scale: 1 }}
        transition={{ duration: 3.2, ease: [0.22, 1, 0.36, 1] }}
        className="absolute inset-0"
      >
        <Photo src={img.url} alt={img.alt} className="w-full h-full" />
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-t from-charcoal/85 via-charcoal/35 to-charcoal/25" />
      <div className="absolute inset-0 bg-gradient-to-r from-charcoal/50 via-transparent to-transparent" />

      <div className="relative z-10 h-full flex flex-col justify-end pb-28 md:pb-32">
        <div className="container-aurura">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.4 }}
            className="eyebrow text-gold-soft mb-6"
          >
            {t.hero.eyebrow}
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="font-serif-display text-ivory text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-[1.08] max-w-3xl text-balance"
          >
            {t.hero.headline}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.85 }}
            className="mt-6 text-ivory/85 text-base md:text-lg max-w-xl font-light tracking-wide"
          >
            {t.hero.sub}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 1.1 }}
            className="mt-10 flex flex-col sm:flex-row gap-4"
          >
            <Link href="/schedule-tour" className="btn btn-gold">
              {t.hero.ctaPrimary}
            </Link>
            <Link href="/build-your-event" className="btn btn-outline-inverse">
              {t.hero.ctaSecondary}
            </Link>
          </motion.div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 hidden sm:flex flex-col items-center gap-2 text-ivory/70"
      >
        <span className="text-[10px] tracking-[0.24em] uppercase">{t.hero.scroll}</span>
        <motion.div animate={{ y: [0, 6, 0] }} transition={{ repeat: Infinity, duration: 1.8 }}>
          <ChevronDown size={18} />
        </motion.div>
      </motion.div>
    </section>
  );
}
