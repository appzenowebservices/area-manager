"use client";

import React from "react";

type Tone = "primary" | "fresh" | "accent" | "mehndi" | "neutral" | "danger";

const toneText: Record<Tone, string> = {
  primary: "text-primary-600",
  fresh: "text-fresh-600",
  accent: "text-accent-600",
  mehndi: "text-mehndi-700",
  neutral: "text-secondary-900",
  danger: "text-primary-700",
};

export interface StatStripItem {
  label: string;
  value: React.ReactNode;
  tone?: Tone;
}

/**
 * Compact KPI strip used at the top of list pages. Mirrors the vendor panel's
 * hard-border / offset-shadow card language without taking over the page.
 */
export function BrandStatStrip({ items }: { items: StatStripItem[] }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-2.5 sm:gap-3">
      {items.map((item) => (
        <div
          key={item.label}
          className="bg-background-section rounded-2xl border-2 border-secondary-900 px-3.5 py-3 shadow-[4px_4px_0px_var(--color-secondary-900)]"
        >
          <div
            className={`font-display text-xl sm:text-2xl font-black leading-none tabular-nums ${
              toneText[item.tone ?? "neutral"]
            }`}
          >
            {item.value}
          </div>
          <div className="mt-1 text-[9px] sm:text-[10px] font-black uppercase tracking-[0.14em] text-secondary-600 leading-tight">
            {item.label}
          </div>
        </div>
      ))}
    </div>
  );
}
