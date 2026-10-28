'use client';
import React from 'react';

export function BrandField({
  label,
  children,
  action,
}: {
  label: string;
  children: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center ml-1">
        <label className="text-xs font-bold text-secondary-700 uppercase tracking-widest">{label}</label>
        {action}
      </div>
      {children}
    </div>
  );
}

export const brandInputCls =
  'w-full px-4 py-3.5 bg-secondary-50 border-2 border-secondary-200 rounded-2xl text-primary-text outline-none focus:border-primary-600 focus:bg-white transition-all placeholder:text-text-muted font-semibold';

export function BrandInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={`${brandInputCls} ${props.className ?? ''}`} />;
}
