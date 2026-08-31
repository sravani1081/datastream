'use client';

import React, { useState } from 'react';
import { useProject } from '../../context/ProjectContext';
import {
  Workflow,
  Radio,
  CheckCircle2,
  AlertTriangle,
  Zap,
  Activity,
  Table,
  ShieldCheck,
  Play,
  Clock,
  ArrowUpRight,
  Sparkles,
  BarChart3,
} from 'lucide-react';
import { MetricCard } from '../../components/ui/MetricCard';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';

export default function DashboardPage() {
  const { activeProject, addToast } = useProject();
  const [chartTimeframe, setChartTimeframe] = useState<'1h' | '6h' | '24h' | '7d'>('1h');

  const stats = activeProject?.stats || {
    sourcesCount: 4,
    pipelinesCount: 3,
    datasetsCount: 5,
    activeJobsCount: 2,
    totalRecordsProcessed: 1482090,
    avgLatencyMs: 42,
    qualityScorePct: 98.4,
  };

  const handleSimulatePulse = () => {
    addToast('Stream Pulse Triggered', 'Injected 5,000 synthetic events into topic player-events', 'success');
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-full bg-gradient-to-l from-brand-600/10 to-transparent pointer-events-none" />
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-slate-100 tracking-tight">DataStream Control Center</h1>
            <Badge variant="info">SYNTHETIC LOCAL MODE</Badge>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time telemetry, pipeline DAG orchestrator & governance overview for{' '}
            <strong className="text-slate-200">{activeProject?.name || 'Nexus Game Telemetry'}</strong>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="secondary" size="sm" icon={<Sparkles className="w-4 h-4 text-brand-400" />} onClick={handleSimulatePulse}>
            Inject Synthetic Burst
          </Button>
          <Button variant="primary" size="sm" icon={<Play className="w-4 h-4" onClick={() => addToast('Engine Run', 'Running active pipeline DAGs', 'info')} />}>
            Run Pipelines
          </Button>
        </div>
      </div>

      {/* Primary KPI Grid (12 Metrics required by Prompt #9) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Active Pipelines"
          value={stats.pipelinesCount}
          change="+1 this week"
          isPositive={true}
          icon={<Workflow className="w-5 h-5" />}
          subtitle="Running: 2 | Draft: 1"
          badgeText="LIVE"
        />
        <MetricCard
          title="Events Processed"
          value={stats.totalRecordsProcessed.toLocaleString()}
          change="+12.4%/hr"
          isPositive={true}
          icon={<Zap className="w-5 h-5" />}
          subtitle="295 events/sec throughput"
          badgeText="REAL-TIME"
        />
        <MetricCard
          title="Processing Latency"
          value={`${stats.avgLatencyMs} ms`}
          change="-4ms optimization"
          isPositive={true}
          icon={<Clock className="w-5 h-5" />}
          subtitle="P95: 82ms | P99: 140ms"
          badgeText="SUB-SECOND"
        />
        <MetricCard
          title="Data Quality Score"
          value={`${stats.qualityScorePct}%`}
          change="+0.6% contract SLA"
          isPositive={true}
          icon={<ShieldCheck className="w-5 h-5 text-emerald-400" />}
          subtitle="0 Schema Violations"
          badgeText="COMPLIANT"
        />
        <MetricCard
          title="Failed Pipelines"
          value="0"
          change="0.0% failure rate"
          isPositive={true}
          icon={<CheckCircle2 className="w-5 h-5 text-emerald-400" />}
          subtitle="Pipeline success rate: 100%"
        />
        <MetricCard
          title="Dataset Catalog"
          value={stats.datasetsCount}
          change="+2 new sinks"
          isPositive={true}
          icon={<Table className="w-5 h-5 text-brand-400" />}
          subtitle="14.5k records aggregated"
        />
        <MetricCard
          title="Consumer Group Lag"
          value="42 msg"
          change="Optimal buffer"
          isPositive={true}
          icon={<Radio className="w-5 h-5 text-amber-400" />}
          subtitle="2 active consumers"
        />
        <MetricCard
          title="Failed Jobs / Alerts"
          value="0"
          change="Clean status"
          isPositive={true}
          icon={<AlertTriangle className="w-5 h-5 text-slate-400" />}
          subtitle="2 scheduled cron jobs"
        />
      </div>

      {/* Interactive Synthetic Visual Charts & Live Telemetry */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Events per second & Throughput Chart */}
        <Card
          className="lg:col-span-2"
          title="Real-Time Streaming Throughput & Latency"
          subtitle="Live local simulator metrics sampled every 1,000ms"
          action={
            <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
              {(['1h', '6h', '24h', '7d'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setChartTimeframe(t)}
                  className={`px-2 py-0.5 rounded font-mono text-[11px] ${
                    chartTimeframe === t ? 'bg-brand-600 text-white font-bold' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          }
        >
          <div className="space-y-4">
            {/* Visual SVG Chart Representation */}
            <div className="h-64 bg-slate-950 border border-slate-800 rounded-xl p-4 relative flex flex-col justify-between">
              <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
                <span>350 msg/s</span>
                <span className="text-emerald-400 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Live Feed
                </span>
              </div>

              {/* Synthetic SVG Area Sparkline */}
              <svg className="w-full h-44 overflow-visible" viewBox="0 0 500 150">
                <defs>
                  <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#0c7eff" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#0c7eff" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Grid Lines */}
                <line x1="0" y1="30" x2="500" y2="30" stroke="#1e293b" strokeDasharray="4 4" />
                <line x1="0" y1="75" x2="500" y2="75" stroke="#1e293b" strokeDasharray="4 4" />
                <line x1="0" y1="120" x2="500" y2="120" stroke="#1e293b" strokeDasharray="4 4" />

                {/* Path Area */}
                <path
                  d="M0,120 Q50,90 100,70 T200,40 T300,60 T400,30 T500,50 L500,150 L0,150 Z"
                  fill="url(#chartGrad)"
                />
                {/* Line Path */}
                <path
                  d="M0,120 Q50,90 100,70 T200,40 T300,60 T400,30 T500,50"
                  fill="none"
                  stroke="#369eff"
                  strokeWidth="3"
                />

                {/* Active Data Points */}
                <circle cx="200" cy="40" r="4" fill="#369eff" className="animate-ping" />
                <circle cx="200" cy="40" r="4" fill="#369eff" />
                <circle cx="400" cy="30" r="4" fill="#10b981" />
              </svg>

              <div className="flex items-center justify-between text-[11px] font-mono text-slate-500">
                <span>10:00 AM</span>
                <span>10:15 AM</span>
                <span>10:30 AM</span>
                <span>10:45 AM</span>
                <span>NOW</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 text-xs font-mono">
              <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg">
                <span className="text-slate-400 block text-[10px]">AVG THROUGHPUT</span>
                <span className="text-sm font-bold text-slate-100">295.4 events/s</span>
              </div>
              <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg">
                <span className="text-slate-400 block text-[10px]">AVG LATENCY</span>
                <span className="text-sm font-bold text-brand-400">38.2 ms</span>
              </div>
              <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg">
                <span className="text-slate-400 block text-[10px]">ERROR RATE</span>
                <span className="text-sm font-bold text-emerald-400">0.00%</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Live Active Pipelines Status List */}
        <Card title="Active Pipeline DAG Status" subtitle="Monitored in current project environment">
          <div className="space-y-3">
            <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Workflow className="w-4 h-4 text-brand-400" />
                  <span className="text-xs font-bold text-slate-100">Player Session Pipeline</span>
                </div>
                <Badge variant="success" dot>
                  Running
                </Badge>
              </div>
              <p className="text-[11px] text-slate-400">5-min Tumbling Window → Player Features Sink</p>
              <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
                <div className="bg-brand-500 h-full w-[85%] animate-pulse" />
              </div>
              <div className="flex items-center justify-between text-[10px] font-mono text-slate-500">
                <span>2,480 recs in</span>
                <span>Latency: 18ms</span>
              </div>
            </div>

            <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Workflow className="w-4 h-4 text-indigo-400" />
                  <span className="text-xs font-bold text-slate-100">Economy Fraud Detector</span>
                </div>
                <Badge variant="success" dot>
                  Running
                </Badge>
              </div>
              <p className="text-[11px] text-slate-400">Real-time Stream Join → Alert Gate</p>
              <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
                <div className="bg-indigo-500 h-full w-[65%]" />
              </div>
              <div className="flex items-center justify-between text-[10px] font-mono text-slate-500">
                <span>45 recs in</span>
                <span>Latency: 24ms</span>
              </div>
            </div>

            <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Workflow className="w-4 h-4 text-slate-400" />
                  <span className="text-xs font-bold text-slate-100">Weekly Batch Profiler</span>
                </div>
                <Badge variant="default">Idle</Badge>
              </div>
              <p className="text-[11px] text-slate-400">Scheduled batch job (Cron: 0 0 * * 0)</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
