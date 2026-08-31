'use client';

import React from 'react';
import { useProject } from '../../context/ProjectContext';
import { CheckCircle2, AlertCircle, Info, XCircle, X } from 'lucide-react';

export function ToastContainer() {
  const { toasts, removeToast } = useProject();

  if (toasts.length === 0) return null;

  const icons = {
    success: <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />,
    info: <Info className="w-4 h-4 text-brand-400 shrink-0" />,
    warning: <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />,
    error: <XCircle className="w-4 h-4 text-rose-400 shrink-0" />,
  };

  const borderColors = {
    success: 'border-emerald-800/80 bg-emerald-950/90',
    info: 'border-brand-800/80 bg-brand-950/90',
    warning: 'border-amber-800/80 bg-amber-950/90',
    error: 'border-rose-800/80 bg-rose-950/90',
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto p-3.5 border rounded-xl shadow-2xl backdrop-blur-md flex items-start gap-3 transition-all animate-in slide-in-from-bottom-2 ${
            borderColors[toast.type]
          }`}
        >
          {icons[toast.type]}
          <div className="flex-1">
            <h4 className="text-xs font-semibold text-slate-100">{toast.title}</h4>
            <p className="text-xs text-slate-300 mt-0.5">{toast.message}</p>
          </div>
          <button
            onClick={() => removeToast(toast.id)}
            className="text-slate-400 hover:text-slate-200"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
}
