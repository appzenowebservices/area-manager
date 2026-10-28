'use client';
import React from 'react';

export function BrandCard({
  className = '',
  children,
  hard = true,
}: {
  className?: string;
  children: React.ReactNode;
  hard?: boolean;
}) {
  return (
    <div
      className={`bg-background-section rounded-3xl border-2 border-secondary-900 p-6 ${
        hard ? 'shadow-[6px_6px_0px_var(--color-secondary-900)]' : 'shadow-xl shadow-secondary-900/10'
      } ${className}`}
    >
      {children}
    </div>
  );
}

export function BrandStat({
  icon,
  value,
  label,
  tint = 'accent',
  delta,
}: {
  icon: React.ReactNode;
  value: string;
  label: string;
  tint?: string;
  delta?: string;
}) {
  const tints: Record<string, string> = {
    accent: 'bg-accent-100 text-accent-700 border-accent-300',
    primary: 'bg-primary-50 text-primary-700 border-primary-200',
    mehndi: 'bg-mehndi-50 text-mehndi-700 border-mehndi-300',
    fresh: 'bg-fresh-50 text-fresh-700 border-fresh-200',
  };
  return (
    <div className="bg-background-section rounded-3xl border-2 border-secondary-900 p-5 shadow-[6px_6px_0px_var(--color-secondary-900)]">
      <div className="flex items-center justify-between mb-3">
        <div className={`w-11 h-11 rounded-2xl border-2 flex items-center justify-center ${tints[tint]}`}>
          {icon}
        </div>
        {delta && (
          <span className="text-[11px] font-black uppercase tracking-widest bg-accent-400 text-secondary-900 px-2 py-1 rounded-full border border-secondary-900">
            {delta}
          </span>
        )}
      </div>
      <div className="font-display text-2xl font-black text-secondary-900">{value}</div>
      <div className="text-xs font-bold uppercase tracking-widest text-secondary-600 mt-1">{label}</div>
    </div>
  );
}
