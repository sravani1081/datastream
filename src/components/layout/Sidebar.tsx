'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  FolderKanban,
  Database,
  Activity,
  GitFork,
  Code2,
  Table,
  CheckCircle2,
  GitPullRequest,
  BrainCircuit,
  CalendarClock,
  Gauge,
  FlaskConical,
  DownloadCloud,
  Users,
  BookOpen,
  Settings,
  ShieldCheck,
  ChevronDown,
  ChevronRight,
  Zap,
  Radio,
  Layers,
  FileCode,
  SlidersHorizontal,
  HardDrive,
  BarChart3,
  ListOrdered,
  Workflow,
  Sparkles,
} from 'lucide-react';
import { clsx } from 'clsx';

interface NavSection {
  title?: string;
  items: Array<{
    label: string;
    href?: string;
    icon: React.ReactNode;
    children?: Array<{ label: string; href: string }>;
  }>;
}

export function Sidebar() {
  const pathname = usePathname();
  const [openSection, setOpenSection] = useState<Record<string, boolean>>({
    Projects: true,
    'Data Sources': true,
    Pipelines: true,
    Streaming: true,
    Transformations: true,
    Data: true,
    Quality: true,
    Lineage: true,
    ML: true,
    Scheduling: true,
    Monitoring: true,
    Analytics: true,
    Testing: true,
    Exports: true,
    Team: true,
  });

  const toggleSection = (label: string) => {
    setOpenSection((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  const navSections: NavSection[] = [
    {
      items: [
        { label: 'Dashboard', href: '/dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
      ],
    },
    {
      title: 'PLATFORM ENGINE',
      items: [
        {
          label: 'Projects',
          icon: <FolderKanban className="w-4 h-4" />,
          children: [
            { label: 'All Projects', href: '/projects' },
            { label: 'Recent Projects', href: '/projects/recent' },
            { label: 'Templates', href: '/projects/templates' },
          ],
        },
        {
          label: 'Data Sources',
          icon: <Database className="w-4 h-4" />,
          children: [
            { label: 'Sources', href: '/sources' },
            { label: 'Connectors', href: '/sources/connectors' },
            { label: 'Synthetic Generators', href: '/sources/generators' },
          ],
        },
        {
          label: 'Pipelines',
          icon: <Workflow className="w-4 h-4" />,
          children: [
            { label: 'All Pipelines', href: '/pipelines' },
            { label: 'Pipeline Builder', href: '/pipelines/builder' },
            { label: 'Templates', href: '/pipelines/templates' },
            { label: 'Runs', href: '/pipelines/runs' },
          ],
        },
        {
          label: 'Streaming',
          icon: <Radio className="w-4 h-4" />,
          children: [
            { label: 'Live Streams', href: '/streaming/live' },
            { label: 'Consumers', href: '/streaming/consumers' },
            { label: 'Topics', href: '/streaming/topics' },
            { label: 'Partitions', href: '/streaming/partitions' },
            { label: 'Windows', href: '/streaming/windows' },
          ],
        },
        {
          label: 'Transformations',
          icon: <Code2 className="w-4 h-4" />,
          children: [
            { label: 'Transform Library', href: '/transformations' },
            { label: 'SQL Workspace', href: '/transformations/sql' },
            { label: 'Query Builder', href: '/transformations/builder' },
          ],
        },
      ],
    },
    {
      title: 'GOVERNANCE & QUALITY',
      items: [
        {
          label: 'Data',
          icon: <Table className="w-4 h-4" />,
          children: [
            { label: 'Datasets', href: '/data/datasets' },
            { label: 'Data Explorer', href: '/data/explorer' },
            { label: 'Schemas', href: '/data/schemas' },
            { label: 'Schema Registry', href: '/data/registry' },
            { label: 'Data Contracts', href: '/data/contracts' },
          ],
        },
        {
          label: 'Quality',
          icon: <CheckCircle2 className="w-4 h-4" />,
          children: [
            { label: 'Data Quality', href: '/quality' },
            { label: 'Validation', href: '/quality/validation' },
            { label: 'Profiling', href: '/quality/profiling' },
            { label: 'Rejected Records', href: '/quality/rejected' },
          ],
        },
        {
          label: 'Lineage',
          icon: <GitFork className="w-4 h-4" />,
          children: [
            { label: 'Dataset Lineage', href: '/lineage' },
            { label: 'Column Lineage', href: '/lineage/column' },
            { label: 'Impact Analysis', href: '/lineage/impact' },
          ],
        },
        {
          label: 'ML',
          icon: <BrainCircuit className="w-4 h-4" />,
          children: [
            { label: 'Features', href: '/ml/features' },
            { label: 'Feature Sets', href: '/ml/sets' },
            { label: 'ML Datasets', href: '/ml/datasets' },
          ],
        },
      ],
    },
    {
      title: 'OPERATIONS & OBSERVABILITY',
      items: [
        {
          label: 'Scheduling',
          icon: <CalendarClock className="w-4 h-4" />,
          children: [
            { label: 'Jobs', href: '/scheduling/jobs' },
            { label: 'Schedules', href: '/scheduling/schedules' },
            { label: 'Runs', href: '/scheduling/runs' },
          ],
        },
        {
          label: 'Monitoring',
          icon: <Activity className="w-4 h-4" />,
          children: [
            { label: 'Pipeline Health', href: '/monitoring/health' },
            { label: 'Metrics', href: '/monitoring/metrics' },
            { label: 'Logs', href: '/monitoring/logs' },
            { label: 'Alerts', href: '/monitoring/alerts' },
          ],
        },
        {
          label: 'Analytics',
          icon: <BarChart3 className="w-4 h-4" />,
          children: [
            { label: 'Throughput', href: '/analytics/throughput' },
            { label: 'Latency', href: '/analytics/latency' },
            { label: 'Data Volume', href: '/analytics/volume' },
            { label: 'Pipeline Performance', href: '/analytics/performance' },
          ],
        },
        {
          label: 'Testing',
          icon: <FlaskConical className="w-4 h-4" />,
          children: [
            { label: 'Test Cases', href: '/testing/cases' },
            { label: 'Test Suites', href: '/testing/suites' },
            { label: 'Test Runs', href: '/testing/runs' },
          ],
        },
        {
          label: 'Exports',
          icon: <DownloadCloud className="w-4 h-4" />,
          children: [
            { label: 'Export Jobs', href: '/exports/jobs' },
            { label: 'History', href: '/exports/history' },
          ],
        },
        {
          label: 'Team',
          icon: <Users className="w-4 h-4" />,
          children: [
            { label: 'Members', href: '/team/members' },
            { label: 'Tasks', href: '/team/tasks' },
            { label: 'Activity', href: '/team/activity' },
          ],
        },
      ],
    },
    {
      title: 'SYSTEM',
      items: [
        { label: 'Documentation', href: '/documentation', icon: <BookOpen className="w-4 h-4" /> },
        { label: 'Settings', href: '/settings', icon: <Settings className="w-4 h-4" /> },
        { label: 'Audit Logs', href: '/audit', icon: <ShieldCheck className="w-4 h-4" /> },
      ],
    },
  ];

  return (
    <aside className="w-64 bg-slate-950 border-r border-slate-800 flex flex-col h-screen select-none shrink-0 overflow-hidden">
      {/* Brand Header */}
      <div className="p-4 border-b border-slate-800/80 flex items-center justify-between">
        <Link href="/dashboard" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-500 p-0.5 shadow-md shadow-brand-900/40">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Zap className="w-5 h-5 text-brand-400 group-hover:scale-110 transition-transform" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-slate-100 text-base tracking-tight">DataStream</span>
              <span className="text-[10px] font-mono font-bold bg-brand-950 text-brand-400 border border-brand-800 px-1 py-0.2 rounded">
                v1.0
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-mono tracking-tight">Stream. Transform. Understand.</p>
          </div>
        </Link>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-5 scrollbar-thin scrollbar-thumb-slate-800">
        {navSections.map((section, sIdx) => (
          <div key={sIdx} className="space-y-1">
            {section.title && (
              <h4 className="px-2 text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                {section.title}
              </h4>
            )}
            {section.items.map((item) => {
              if (item.children) {
                const isOpen = !!openSection[item.label];
                const hasActiveChild = item.children.some((c) => pathname === c.href);

                return (
                  <div key={item.label} className="space-y-0.5">
                    <button
                      onClick={() => toggleSection(item.label)}
                      className={clsx(
                        'w-full flex items-center justify-between px-2.5 py-1.5 text-xs font-medium rounded-lg transition-colors',
                        hasActiveChild
                          ? 'text-slate-100 bg-slate-900/80 font-semibold'
                          : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
                      )}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="text-slate-400">{item.icon}</span>
                        <span>{item.label}</span>
                      </div>
                      {isOpen ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                    </button>
                    {isOpen && (
                      <div className="ml-4 pl-3 border-l border-slate-800/80 space-y-0.5 py-0.5">
                        {item.children.map((child) => {
                          const isActive = pathname === child.href;
                          return (
                            <Link
                              key={child.href}
                              href={child.href}
                              className={clsx(
                                'block px-2.5 py-1 text-xs rounded-md transition-colors',
                                isActive
                                  ? 'text-brand-400 bg-brand-950/60 font-medium border border-brand-800/40'
                                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/40'
                              )}
                            >
                              {child.label}
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              }

              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.label}
                  href={item.href || '#'}
                  className={clsx(
                    'flex items-center gap-2.5 px-2.5 py-1.5 text-xs font-medium rounded-lg transition-colors',
                    isActive
                      ? 'text-brand-400 bg-brand-950/60 font-semibold border border-brand-800/40 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
                  )}
                >
                  <span className={isActive ? 'text-brand-400' : 'text-slate-400'}>{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        ))}
      </div>

      {/* Footer Local Mode Badge */}
      <div className="p-3 border-t border-slate-800/80 bg-slate-950/80">
        <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <div>
              <span className="text-[11px] font-bold text-slate-200 block tracking-wide">LOCAL MODE</span>
              <span className="text-[10px] text-slate-400 block">100% In-Browser State</span>
            </div>
          </div>
          <Sparkles className="w-4 h-4 text-emerald-400" />
        </div>
      </div>
    </aside>
  );
}
