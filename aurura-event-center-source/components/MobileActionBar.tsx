"use client";

import { Phone, MessageCircle, Calculator, CalendarDays } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/lib/language-context";
import { venue } from "@/lib/config";

export function MobileActionBar() {
  const { t } = useLanguage();

  const items = [
    { href: `tel:${venue.phoneHref}`, icon: Phone, label: t.mobileBar.call },
    { href: `https://wa.me/${venue.whatsapp.replace("+", "")}`, icon: MessageCircle, label: t.mobileBar.whatsapp },
    { href: "/build-your-event", icon: Calculator, label: t.mobileBar.estimate },
    { href: "/schedule-tour", icon: CalendarDays, label: t.mobileBar.tour },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 lg:hidden bg-charcoal/95 backdrop-blur-md border-t border-hairline-inverse">
      <div className="grid grid-cols-4">
        {items.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className="flex flex-col items-center justify-center gap-1 py-3 text-ivory/90 active:bg-white/5"
          >
            <item.icon size={19} strokeWidth={1.6} />
            <span className="text-[10px] tracking-wide uppercase">{item.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
