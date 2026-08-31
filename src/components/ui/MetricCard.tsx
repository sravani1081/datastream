import React from 'react';
import { clsx } from 'clsx';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

export interface MetricCardProps {
  title: string;
  value: string | number;
  change?: string;
  isPositive?: boolean;
  icon?: React.ReactNode;
  subtitle?: string;
  badgeText?: string;
  className?: string;
}

export function MetricCard({
  title,
  value,
  change,
  isPositive = true,
  icon,
  subtitle,
  badgeText,
  className,
}: MetricCardProps) {
  return (
    <div
      className={clsx(
        'bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg relative overflow-hidden transition-all hover:border-slate-700',
        className
      )}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">{title}</span>
        {icon && <div className="p-2 bg-slate-800/80 text-brand-400 rounded-lg border border-slate-700/50">{icon}</div>}
      </div>

      <div className="mt-3 flex items-baseline justify-between gap-2">
        <div className="text-2xl font-bold text-slate-100 tracking-tight">{value}</div>
        {change && (
          <div
            className={clsx(
              'inline-flex items-center text-xs font-semibold px-2 py-0.5 rounded-md border',
              isPositive
                ? 'text-emerald-400 bg-emerald-950/50 border-emerald-800/50'
                : 'text-rose-400 bg-rose-950/50 border-rose-800/50'
            )}
          >
            {isPositive ? <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" /> : <ArrowDownRight className="w-3.5 h-3.5 mr-0.5" />}
            {change}
          </div>
        )}
      </div>

      {(subtitle || badgeText) && (
        <div className="mt-2.5 flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800/60">
          {subtitle && <span>{subtitle}</span>}
          {badgeText && <span className="bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded text-[10px] font-mono">{badgeText}</span>}
        </div>
      )}
    </div>
  );
}
