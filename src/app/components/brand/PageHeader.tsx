'use client';
import React from 'react';

export function PageHeader({
  kicker,
  title,
  subtitle,
  actions,
}: {
  kicker?: string;
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}) {
  return (
    <div className="bg-secondary-900 border-2 border-secondary-950 rounded-3xl p-6 sm:p-7 text-secondary-50 relative overflow-hidden shadow-[6px_6px_0px_var(--color-accent-400)]">
      <div className="absolute -top-16 -right-16 w-56 h-56 bg-primary-600/25 rounded-full blur-3xl" />
      <div className="absolute -bottom-20 -left-10 w-64 h-64 bg-mehndi-600/25 rounded-full blur-3xl" />
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
        <div>
          {kicker && (
            <span className="inline-block bg-accent-400 text-secondary-900 text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full border border-secondary-950 mb-2">
              {kicker}
            </span>
          )}
          <h1 className="font-display text-2xl sm:text-3xl font-black tracking-tight">
            {title}
          </h1>
          {subtitle && <p className="text-secondary-300 font-medium mt-1">{subtitle}</p>}
        </div>
        {actions && <div className="flex items-center gap-2 flex-wrap">{actions}</div>}
      </div>
    </div>
  );
}

export function PageShell({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={`p-4 sm:p-6 space-y-6 bg-background min-h-full font-body ${className}`}>{children}</div>;
}
