"use client";

import { useLanguage } from "@/lib/language-context";
import { Reveal } from "@/components/ui/Reveal";
import { venue } from "@/lib/config";

const testimonials = {
  en: [
    { quote: "From the first tour to the last dance, Aurura felt like a dream we didn't want to wake up from. Every detail was considered.", author: "Camila R.", event: "Wedding, June 2026" },
    { quote: "My daughter's quinceañera was more beautiful than I imagined. The team handled everything — we just got to celebrate.", author: "Lourdes M.", event: "Quinceañera, March 2026" },
    { quote: "The ballroom photographs beautifully, but it's even more stunning in person. Our guests are still talking about it.", author: "Daniel & Ana P.", event: "Wedding, November 2025" },
  ],
  es: [
    { quote: "Desde el primer tour hasta el último baile, Aurura se sintió como un sueño del que no queríamos despertar. Cada detalle fue considerado.", author: "Camila R.", event: "Boda, junio 2026" },
    { quote: "La quinceañera de mi hija fue más hermosa de lo que imaginé. El equipo se encargó de todo — nosotros solo celebramos.", author: "Lourdes M.", event: "Quinceañera, marzo 2026" },
    { quote: "El salón se ve hermoso en fotos, pero es aún más impresionante en persona. Nuestros invitados todavía hablan de eso.", author: "Daniel y Ana P.", event: "Boda, noviembre 2025" },
  ],
};

export function Testimonials() {
  const { lang } = useLanguage();
  const items = testimonials[lang];

  return (
    <section className="py-24 md:py-32 bg-charcoal text-ivory">
      <div className="container-aurura">
        <Reveal className="text-center max-w-xl mx-auto mb-16">
          <p className="eyebrow text-gold-soft mb-4">{venue.shortName}</p>
          <h2 className="font-serif-display text-3xl md:text-5xl leading-tight">
            {lang === "en" ? "Loved by Families Across Texas" : "Amado por Familias en Todo Texas"}
          </h2>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8">
          {items.map((item, i) => (
            <Reveal key={item.author} delay={i * 0.12} className="flex flex-col">
              <span className="font-serif-display text-5xl text-gold/40 leading-none mb-3">&ldquo;</span>
              <p className="font-serif-display italic text-lg leading-relaxed text-ivory/90 mb-6 flex-1">{item.quote}</p>
              <div className="gold-divider mb-4" />
              <p className="text-sm tracking-wide">{item.author}</p>
              <p className="text-xs text-ivory/50 mt-0.5">{item.event}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
