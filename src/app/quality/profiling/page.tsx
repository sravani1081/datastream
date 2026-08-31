'use client';

import React from 'react';
import { ShieldCheck, BarChart3, Table } from 'lucide-react';
import { DataProfilerEngine } from '../../../lib/quality/dataProfiler';
import { GameTelemetryGenerator } from '../../../lib/generators/gameTelemetry';
import { Card } from '../../../components/ui/Card';
import { Badge } from '../../../components/ui/Badge';

export default function ProfilingPage() {
  const records = GameTelemetryGenerator.generatePlayers(50, 42);
  const profile = DataProfilerEngine.profileDataset(records as unknown as Record<string, unknown>[]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-brand-400" /> Statistical Data Profiler
        </h1>
        <p className="text-xs text-slate-400 mt-1">Automated column statistics, null counts, distinct cardinality, percentiles, and top frequency distributions.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Object.entries(profile.columnStats).map(([col, stats]) => (
          <Card key={col} title={`Column: ${col}`} subtitle={`Distinct: ${stats.distinctCount} | Nulls: ${stats.nullPct}%`}>
            <div className="space-y-3 font-mono text-xs text-slate-300">
              <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg space-y-1">
                {stats.min !== undefined && (
                  <div className="flex justify-between">
                    <span className="text-slate-400 text-[10px]">MIN / MAX:</span>
                    <span className="text-brand-400 font-bold">{stats.min} / {stats.max}</span>
                  </div>
                )}
                {stats.avg !== undefined && (
                  <div className="flex justify-between">
                    <span className="text-slate-400 text-[10px]">MEAN (AVG):</span>
                    <span className="text-emerald-400 font-bold">{stats.avg}</span>
                  </div>
                )}
                {stats.p50 !== undefined && (
                  <div className="flex justify-between">
                    <span className="text-slate-400 text-[10px]">P50 / P90 / P99:</span>
                    <span className="text-slate-200">{stats.p50} / {stats.p90} / {stats.p99}</span>
                  </div>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
