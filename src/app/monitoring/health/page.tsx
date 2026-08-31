'use client';

import React from 'react';
import { Activity, ShieldCheck, Zap, Radio } from 'lucide-react';
import { MetricCard } from '../../../components/ui/MetricCard';

export default function MonitoringHealthPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2">
          <Activity className="w-5 h-5 text-brand-400" /> Pipeline Health & SLA Observability
        </h1>
        <p className="text-xs text-slate-400 mt-1">Real-time health, buffer queues, latency trends, and active error alerts.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <MetricCard title="System Health Score" value="100%" change="Optimal" isPositive={true} icon={<ShieldCheck className="w-5 h-5 text-emerald-400" />} />
        <MetricCard title="Active Streams" value="2 Topics" change="Live" isPositive={true} icon={<Radio className="w-5 h-5 text-brand-400" />} />
        <MetricCard title="Micro-batch Speed" value="38 ms" change="Sub-second" isPositive={true} icon={<Zap className="w-5 h-5 text-purple-400" />} />
      </div>
    </div>
  );
}
