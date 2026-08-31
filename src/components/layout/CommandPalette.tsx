'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useProject } from '../../context/ProjectContext';
import {
  Search,
  Workflow,
  Table,
  Database,
  Play,
  FileCode,
  CheckCircle2,
  GitFork,
  Bell,
  Code2,
  Radio,
  DownloadCloud,
  BookOpen,
  X,
  Sparkles,
} from 'lucide-react';

export function CommandPalette() {
  const router = useRouter();
  const { commandPaletteOpen, setCommandPaletteOpen, addToast } = useProject();
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setCommandPaletteOpen(false);
    };
    if (commandPaletteOpen) window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [commandPaletteOpen, setCommandPaletteOpen]);

  if (!commandPaletteOpen) return null;

  const commands = [
    { label: 'Create Pipeline', icon: <Workflow className="w-4 h-4 text-brand-400" />, path: '/pipelines/builder', category: 'Actions' },
    { label: 'Create Dataset', icon: <Table className="w-4 h-4 text-emerald-400" />, path: '/data/datasets', category: 'Actions' },
    { label: 'Add Data Source', icon: <Database className="w-4 h-4 text-indigo-400" />, path: '/sources', category: 'Actions' },
    { label: 'Run Pipeline Engine', icon: <Play className="w-4 h-4 text-amber-400" />, action: 'run_pipeline', category: 'Actions' },
    { label: 'Open Data Explorer', icon: <FileCode className="w-4 h-4 text-purple-400" />, path: '/data/explorer', category: 'Navigation' },
    { label: 'Create Schema', icon: <CheckCircle2 className="w-4 h-4 text-teal-400" />, path: '/data/schemas', category: 'Governance' },
    { label: 'Run Quality Check', icon: <CheckCircle2 className="w-4 h-4 text-rose-400" />, path: '/quality/validation', category: 'Quality' },
    { label: 'Open Lineage Graph', icon: <GitFork className="w-4 h-4 text-cyan-400" />, path: '/lineage', category: 'Governance' },
    { label: 'Create System Alert', icon: <Bell className="w-4 h-4 text-orange-400" />, path: '/monitoring/alerts', category: 'Monitoring' },
    { label: 'Open SQL Workspace', icon: <Code2 className="w-4 h-4 text-blue-400" />, path: '/transformations/sql', category: 'Transformations' },
    { label: 'Generate Synthetic Data', icon: <Sparkles className="w-4 h-4 text-pink-400" />, path: '/sources/generators', category: 'Simulation' },
    { label: 'Start Stream Simulator', icon: <Radio className="w-4 h-4 text-emerald-400" />, path: '/streaming/live', category: 'Simulation' },
    { label: 'Export Dataset', icon: <DownloadCloud className="w-4 h-4 text-slate-400" />, path: '/exports/jobs', category: 'Exports' },
    { label: 'Open Documentation', icon: <BookOpen className="w-4 h-4 text-yellow-400" />, path: '/documentation', category: 'System' },
  ];

  const filtered = commands.filter(
    (c) =>
      c.label.toLowerCase().includes(query.toLowerCase()) ||
      c.category.toLowerCase().includes(query.toLowerCase())
  );

  const executeCommand = (cmd: (typeof commands)[0]) => {
    setCommandPaletteOpen(false);
    if (cmd.path) {
      router.push(cmd.path);
    } else if (cmd.action === 'run_pipeline') {
      addToast('Engine Execution Started', 'Running pipeline DAG execution in local web worker...', 'success');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4">
      <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md" onClick={() => setCommandPaletteOpen(false)} />

      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col z-10 animate-in fade-in-50 zoom-in-95 duration-150">
        {/* Search Input Bar */}
        <div className="p-4 border-b border-slate-800 flex items-center gap-3">
          <Search className="w-5 h-5 text-slate-400" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command or search DataStream platform..."
            className="w-full bg-transparent text-sm text-slate-100 placeholder-slate-500 focus:outline-none"
          />
          <button onClick={() => setCommandPaletteOpen(false)} className="text-slate-500 hover:text-slate-300">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Command List */}
        <div className="p-2 max-h-96 overflow-y-auto divide-y divide-slate-800/40">
          {filtered.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-500 italic">No matching commands found.</div>
          ) : (
            filtered.map((cmd, idx) => (
              <button
                key={idx}
                onClick={() => executeCommand(cmd)}
                className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-slate-800/80 flex items-center justify-between transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-1.5 bg-slate-950 border border-slate-800 rounded-lg group-hover:border-slate-700">
                    {cmd.icon}
                  </div>
                  <span className="text-xs font-semibold text-slate-200 group-hover:text-white">{cmd.label}</span>
                </div>
                <span className="text-[10px] font-mono text-slate-500 uppercase px-2 py-0.5 bg-slate-950 rounded border border-slate-800">
                  {cmd.category}
                </span>
              </button>
            ))
          )}
        </div>

        {/* Footer shortcuts helper */}
        <div className="px-4 py-2 bg-slate-950 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span>
              <kbd className="px-1 bg-slate-900 border border-slate-800 rounded">↑↓</kbd> navigate
            </span>
            <span>
              <kbd className="px-1 bg-slate-900 border border-slate-800 rounded">↵</kbd> select
            </span>
          </div>
          <span>DataStream Local Mode</span>
        </div>
      </div>
    </div>
  );
}
