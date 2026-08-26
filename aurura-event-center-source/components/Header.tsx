"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { useLanguage } from "@/lib/language-context";
import { venue } from "@/lib/config";
import clsx from "clsx";

const navItems = [
  { href: "/", key: "home" as const },
  { href: "/venue", key: "venue" as const },
  { href: "/gallery", key: "gallery" as const },
  { href: "/packages", key: "packages" as const },
  { href: "/build-your-event", key: "build" as const },
  { href: "/contact", key: "contact" as const },
];

export function Header() {
  const { t, lang, setLang } = useLanguage();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const isHome = pathname === "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const solid = scrolled || !isHome || open;

  return (
    <header
      className={clsx(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
        solid ? "bg-ivory/95 backdrop-blur-md border-b border-hairline" : "bg-transparent"
      )}
    >
      <div className="container-aurura flex items-center justify-between h-20 md:h-24">
        <Link href="/" className="flex items-center gap-3 group">
          <span
            className={clsx(
              "flex h-10 w-10 items-center justify-center rounded-full border font-serif-display text-sm tracking-wide transition-colors",
              solid ? "border-charcoal text-charcoal" : "border-ivory/70 text-ivory"
            )}
          >
            {venue.monogram}
          </span>
          <span className={clsx("font-serif-display text-lg md:text-xl tracking-wide transition-colors", solid ? "text-charcoal" : "text-ivory")}>
            {venue.name}
          </span>
        </Link>

        <nav className="hidden lg:flex items-center gap-9">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                "text-[13px] tracking-[0.08em] uppercase transition-colors relative pb-1",
                solid ? "text-charcoal-soft hover:text-charcoal" : "text-ivory/90 hover:text-ivory",
                pathname === item.href && (solid ? "text-charcoal" : "text-ivory")
              )}
            >
              {t.nav[item.key]}
              {pathname === item.href && (
                <span className="absolute left-0 right-0 -bottom-0.5 h-px bg-gold" />
              )}
            </Link>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-4">
          <button
            onClick={() => setLang(lang === "en" ? "es" : "en")}
            className={clsx(
              "text-[12px] tracking-[0.12em] uppercase transition-colors px-2 py-1",
              solid ? "text-charcoal-soft hover:text-charcoal" : "text-ivory/90 hover:text-ivory"
            )}
            aria-label="Toggle language"
          >
            <span className={lang === "en" ? "text-gold-deep font-medium" : ""}>EN</span>
            <span className="mx-1 opacity-50">|</span>
            <span className={lang === "es" ? "text-gold-deep font-medium" : ""}>ES</span>
          </button>
          <Link href="/build-your-event" className={clsx("btn", solid ? "btn-outline" : "btn-outline-inverse")}>
            {t.nav.ctaSecondary}
          </Link>
          <Link href="/schedule-tour" className="btn btn-gold">
            {t.nav.ctaPrimary}
          </Link>
        </div>

        <button
          className={clsx("lg:hidden p-2", solid ? "text-charcoal" : "text-ivory")}
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {open ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {open && (
        <div className="lg:hidden bg-ivory border-t border-hairline">
          <div className="container-aurura py-6 flex flex-col gap-5">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} className="text-base tracking-wide text-charcoal-soft">
                {t.nav[item.key]}
              </Link>
            ))}
            <div className="flex items-center gap-3 pt-2 border-t border-hairline">
              <button onClick={() => setLang("en")} className={clsx("text-sm px-3 py-1.5 border", lang === "en" ? "border-gold text-gold-deep" : "border-hairline text-charcoal-soft")}>
                English
              </button>
              <button onClick={() => setLang("es")} className={clsx("text-sm px-3 py-1.5 border", lang === "es" ? "border-gold text-gold-deep" : "border-hairline text-charcoal-soft")}>
                Español
              </button>
            </div>
            <div className="flex flex-col gap-3 pt-2">
              <Link href="/build-your-event" className="btn btn-outline w-full">
                {t.nav.ctaSecondary}
              </Link>
              <Link href="/schedule-tour" className="btn btn-gold w-full">
                {t.nav.ctaPrimary}
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
