"use client";

import clsx from "clsx";
import { Check } from "lucide-react";

export function StepIndicator({
  steps,
  current,
}: {
  steps: string[];
  current: number;
}) {
  return (
    <div className="flex items-center w-full mb-10 md:mb-14">
      {steps.map((label, i) => (
        <div key={label} className="flex items-center flex-1 last:flex-none">
          <div className="flex flex-col items-center gap-2">
            <div
              className={clsx(
                "h-8 w-8 md:h-9 md:w-9 rounded-full flex items-center justify-center text-xs border transition-colors shrink-0",
                i < current && "bg-gold border-gold text-charcoal",
                i === current && "border-gold text-gold-deep",
                i > current && "border-hairline text-charcoal-soft/50"
              )}
            >
              {i < current ? <Check size={14} /> : i + 1}
            </div>
            <span
              className={clsx(
                "text-[10px] md:text-[11px] tracking-wide uppercase text-center whitespace-nowrap",
                i <= current ? "text-charcoal" : "text-charcoal-soft/40"
              )}
            >
              {label}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div className={clsx("flex-1 h-px mx-2 md:mx-4 mt-[-18px]", i < current ? "bg-gold" : "bg-hairline")} />
          )}
        </div>
      ))}
    </div>
  );
}
