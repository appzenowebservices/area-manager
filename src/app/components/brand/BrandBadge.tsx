'use client';
import React from 'react';

type Tone = 'primary' | 'accent' | 'mehndi' | 'fresh' | 'neutral' | 'dark';

const tones: Record<Tone, string> = {
  primary: 'bg-primary-50 text-primary-700 border-primary-300',
  accent: 'bg-accent-100 text-accent-700 border-accent-300',
  mehndi: 'bg-mehndi-50 text-mehndi-700 border-mehndi-300',
  fresh: 'bg-fresh-50 text-fresh-700 border-fresh-200',
  neutral: 'bg-secondary-100 text-secondary-700 border-secondary-300',
  dark: 'bg-secondary-900 text-accent-300 border-secondary-700',
};

export function BrandBadge({
  tone = 'neutral',
  className = '',
  children,
}: {
  tone?: Tone;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1 text-[11px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full border-2 ${tones[tone]} ${className}`}
    >
      {children}
    </span>
  );
}

export function statusTone(status: string): Tone {
  const s = status.toLowerCase();
  if (/(new|pending|prep)/.test(s)) return 'accent';
  if (/(ready|complete|deliver|success|active|paid|in-stock)/.test(s)) return 'fresh';
  if (/(veg|organic|desi)/.test(s)) return 'mehndi';
  if (/(cancel|fail|reject|error|out)/.test(s)) return 'primary';
  return 'neutral';
}
