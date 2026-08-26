"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import clsx from "clsx";
import { isVenueClosed } from "@/lib/tour-availability";
import { useLanguage } from "@/lib/language-context";

const WEEKDAYS_EN = ["S", "M", "T", "W", "T", "F", "S"];
const WEEKDAYS_ES = ["D", "L", "M", "M", "J", "V", "S"];

const MONTH_NAMES = {
  en: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
  es: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"],
};

function toISO(d: Date) {
  return d.toISOString().slice(0, 10);
}

export function MonthCalendar({
  selected,
  onSelect,
}: {
  selected: string | null;
  onSelect: (dateISO: string) => void;
}) {
  const { lang } = useLanguage();
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const [viewDate, setViewDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1));

  const maxDate = new Date(today.getFullYear(), today.getMonth() + 9, 0);
  const minSelectable = new Date(today.getTime() + 86400000 * 2); // require 2 days notice

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const firstDay = new Date(year, month, 1);
  const startWeekday = firstDay.getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells: (Date | null)[] = [];
  for (let i = 0; i < startWeekday; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d));

  const canGoPrev = new Date(year, month, 1) > new Date(today.getFullYear(), today.getMonth(), 1);
  const canGoNext = new Date(year, month + 1, 1) <= maxDate;

  const weekdays = lang === "en" ? WEEKDAYS_EN : WEEKDAYS_ES;

  return (
    <div className="bg-white border border-hairline p-5 md:p-7">
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => canGoPrev && setViewDate(new Date(year, month - 1, 1))}
          disabled={!canGoPrev}
          className="h-8 w-8 flex items-center justify-center border border-hairline disabled:opacity-25 hover:border-charcoal transition-colors"
          aria-label="Previous month"
        >
          <ChevronLeft size={16} />
        </button>
        <p className="font-serif-display text-lg">
          {MONTH_NAMES[lang][month]} {year}
        </p>
        <button
          onClick={() => canGoNext && setViewDate(new Date(year, month + 1, 1))}
          disabled={!canGoNext}
          className="h-8 w-8 flex items-center justify-center border border-hairline disabled:opacity-25 hover:border-charcoal transition-colors"
          aria-label="Next month"
        >
          <ChevronRight size={16} />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2">
        {weekdays.map((w, i) => (
          <div key={i} className="text-center text-[10px] tracking-wide uppercase text-charcoal-soft/50 py-1">
            {w}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {cells.map((date, i) => {
          if (!date) return <div key={i} />;
          const iso = toISO(date);
          const disabled = date < minSelectable || isVenueClosed(date);
          const isSelected = selected === iso;
          return (
            <button
              key={iso}
              disabled={disabled}
              onClick={() => onSelect(iso)}
              className={clsx(
                "aspect-square flex items-center justify-center text-sm rounded-full transition-colors",
                disabled && "text-charcoal-soft/25 cursor-not-allowed",
                !disabled && !isSelected && "text-charcoal hover:bg-ivory-deep",
                isSelected && "bg-gold text-charcoal font-medium"
              )}
            >
              {date.getDate()}
            </button>
          );
        })}
      </div>
    </div>
  );
}
