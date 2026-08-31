import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface CardProps {
  children: React.ReactNode;
  className?: string;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  title?: string;
  subtitle?: string;
  action?: React.ReactNode;
}

export function Card({ children, className, header, footer, title, subtitle, action }: CardProps) {
  return (
    <div className={twMerge(clsx('bg-slate-900 border border-slate-800 rounded-xl shadow-lg overflow-hidden flex flex-col', className))}>
      {(header || title) && (
        <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between gap-4">
          {header ? (
            header
          ) : (
            <div>
              {title && <h3 className="text-base font-semibold text-slate-100">{title}</h3>}
              {subtitle && <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>}
            </div>
          )}
          {action && <div className="shrink-0">{action}</div>}
        </div>
      )}
      <div className="p-5 flex-1">{children}</div>
      {footer && <div className="px-5 py-3 bg-slate-950/50 border-t border-slate-800 text-xs text-slate-400">{footer}</div>}
    </div>
  );
}
