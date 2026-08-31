import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'purple';
  size?: 'sm' | 'md';
  className?: string;
  dot?: boolean;
}

export function Badge({ children, variant = 'default', size = 'sm', className, dot }: BadgeProps) {
  const base = 'inline-flex items-center font-medium rounded-md border';

  const variants = {
    default: 'bg-slate-800 border-slate-700 text-slate-300',
    success: 'bg-emerald-950/60 border-emerald-800/60 text-emerald-400',
    warning: 'bg-amber-950/60 border-amber-800/60 text-amber-400',
    danger: 'bg-rose-950/60 border-rose-800/60 text-rose-400',
    info: 'bg-brand-950/60 border-brand-800/60 text-brand-400',
    purple: 'bg-purple-950/60 border-purple-800/60 text-purple-400',
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-xs gap-1.5',
    md: 'px-2.5 py-1 text-sm gap-2',
  };

  const dotColors = {
    default: 'bg-slate-400',
    success: 'bg-emerald-400',
    warning: 'bg-amber-400',
    danger: 'bg-rose-400',
    info: 'bg-brand-400',
    purple: 'bg-purple-400',
  };

  return (
    <span className={twMerge(clsx(base, variants[variant], sizes[size], className))}>
      {dot && <span className={clsx('w-1.5 h-1.5 rounded-full shrink-0 animate-pulse', dotColors[variant])} />}
      {children}
    </span>
  );
}
