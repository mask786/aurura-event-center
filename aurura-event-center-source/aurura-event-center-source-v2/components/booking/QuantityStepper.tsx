"use client";

import { Minus, Plus } from "lucide-react";

export function QuantityStepper({
  value,
  onChange,
  max = 20,
  min = 0,
}: {
  value: number;
  onChange: (v: number) => void;
  max?: number;
  min?: number;
}) {
  return (
    <div className="flex items-center border border-hairline">
      <button
        type="button"
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        className="h-9 w-9 flex items-center justify-center text-charcoal-soft hover:bg-ivory-deep disabled:opacity-30 transition-colors"
        aria-label="Decrease"
      >
        <Minus size={14} />
      </button>
      <span className="w-10 text-center text-sm tabular-nums">{value}</span>
      <button
        type="button"
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        className="h-9 w-9 flex items-center justify-center text-charcoal-soft hover:bg-ivory-deep disabled:opacity-30 transition-colors"
        aria-label="Increase"
      >
        <Plus size={14} />
      </button>
    </div>
  );
}
