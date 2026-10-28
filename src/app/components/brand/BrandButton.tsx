'use client';
import React from 'react';

type Variant = 'primary' | 'secondary' | 'accent' | 'mehndi' | 'ghost' | 'danger' | 'success';

const styles: Record<Variant, string> = {
  primary:
    'bg-primary-600 hover:bg-primary-700 text-white shadow-lg shadow-primary-600/25 border-2 border-primary-700',
  secondary:
    'bg-secondary-900 hover:bg-secondary-800 text-secondary-50 border-2 border-secondary-950 shadow-[4px_4px_0px_var(--color-accent-400)]',
  accent:
    'bg-accent-400 hover:bg-accent-300 text-secondary-900 border-2 border-secondary-900 shadow-[4px_4px_0px_var(--color-secondary-900)]',
  mehndi:
    'bg-mehndi-600 hover:bg-mehndi-700 text-white border-2 border-mehndi-800 shadow-lg shadow-mehndi-600/25',
  ghost:
    'bg-background-section hover:bg-secondary-100 text-secondary-900 border-2 border-secondary-200',
  danger:
    'bg-primary-700 hover:bg-primary-800 text-white border-2 border-primary-900',
  success:
    'bg-fresh-600 hover:bg-fresh-700 text-white border-2 border-fresh-800',
};

export function BrandButton({
  variant = 'primary',
  className = '',
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }) {
  return (
    <button
      className={`font-display font-bold rounded-2xl px-5 py-3 text-sm transition-all active:scale-[0.98] disabled:opacity-60 flex items-center justify-center gap-2 ${styles[variant]} ${className}`}
      {...props}
    />
  );
}
