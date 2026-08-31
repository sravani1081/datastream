'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import { useProject } from '../../context/ProjectContext';
import {
  Search,
  Command,
  Bell,
  CheckCircle2,
  Activity,
  Folder,
  Layers,
  ChevronRight,
  HardDrive,
  ShieldCheck,
  Flame,
} from 'lucide-react';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';

export function Header() {
  const pathname = usePathname();
  const { projects, activeProject, setActiveProjectId, setCommandPaletteOpen, addToast } = useProject();
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  // Generate dynamic breadcrumb segments
  const segments = pathname.split('/').filter(Boolean);
  const breadcrumbs = segments.map((seg, idx) => {
    const url = '/' + segments.slice(0, idx + 1).join('/');
    const formatted = seg.charAt(0).toUpperCase() + seg.slice(1).replace(/-/g, ' ');
    return { label: formatted, url };
  });

  return (
    <header className="h-14 bg-slate-950 border-b border-slate-800 px-6 flex items-center justify-between shrink-0 z-20">
      {/* Left: Breadcrumbs & Project Switcher */}
      <div className="flex items-center gap-4">
        {/* Project Selector */}
        <div className="relative">
          <select
            value={activeProject?.id || ''}
            onChange={(e) => setActiveProjectId(e.target.value)}
            className="bg-slate-900 border border-slate-700/80 hover:border-slate-600 rounded-lg text-xs font-semibold text-slate-200 px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-brand-500 cursor-pointer"
          >
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>

        {/* Breadcrumb Trail */}
        <nav className="hidden md:flex items-center gap-1.5 text-xs text-slate-400">
          <span className="text-slate-500">DataStream</span>
          {breadcrumbs.map((b, idx) => (
            <React.Fragment key={b.url}>
              <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
              <span className={idx === breadcrumbs.length - 1 ? 'font-semibold text-slate-200' : 'hover:text-slate-200'}>
                {b.label}
              </span>
            </React.Fragment>
          ))}
        </nav>
      </div>

      {/* Right: Search, Command Palette, Indicators, Notifications */}
      <div className="flex items-center gap-3">
        {/* Global Command Palette Trigger */}
        <button
          onClick={() => setCommandPaletteOpen(true)}
          className="flex items-center gap-2 bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-400 hover:text-slate-200 transition-colors"
        >
          <Search className="w-3.5 h-3.5 text-slate-400" />
          <span className="hidden sm:inline">Search or command...</span>
          <kbd className="hidden sm:inline-flex items-center gap-0.5 bg-slate-950 border border-slate-800 rounded px-1.5 py-0.5 text-[10px] font-mono text-slate-400">
            <Command className="w-2.5 h-2.5" /> K
          </kbd>
        </button>

        {/* Processing & Save Status Indicators */}
        <div className="hidden lg:flex items-center gap-2 border-l border-r border-slate-800 px-3 py-1 text-xs">
          <Badge variant="success" size="sm" dot>
            Engine Active
          </Badge>
          <span className="text-[10px] text-slate-500 font-mono">295 events/s</span>
        </div>

        {/* Local Mode Badge */}
        <div className="hidden sm:flex items-center gap-1.5 bg-brand-950/60 border border-brand-800/60 rounded-md px-2.5 py-1 text-xs text-brand-300 font-mono">
          <HardDrive className="w-3.5 h-3.5 text-brand-400" />
          <span className="font-bold">LOCAL MODE</span>
        </div>

        {/* Notification Bell */}
        <div className="relative">
          <button
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="p-2 text-slate-400 hover:text-slate-200 rounded-lg hover:bg-slate-900 relative transition-colors"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-brand-500 rounded-full animate-ping" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-brand-500 rounded-full" />
          </button>

          {notificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl p-4 z-40 animate-in fade-in-50 duration-150">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <span className="text-xs font-semibold text-slate-100">System Notifications</span>
                <Badge variant="info">3 New</Badge>
              </div>
              <div className="py-2 space-y-2 text-xs text-slate-300">
                <div className="p-2 bg-slate-950 rounded-lg border border-slate-800">
                  <div className="flex items-center gap-1.5 font-semibold text-emerald-400">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Pipeline Run Succeeded
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Player Session Pipeline completed micro-batch #1042 (2,480 recs).
                  </p>
                </div>
                <div className="p-2 bg-slate-950 rounded-lg border border-slate-800">
                  <div className="flex items-center gap-1.5 font-semibold text-brand-400">
                    <ShieldCheck className="w-3.5 h-3.5" /> Schema Evolution Validated
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    GameTelemetryEvent v3 backward compatibility check passed.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
