'use client';

import React from 'react';
import { CalendarClock, Play, Activity } from 'lucide-react';
import { Card } from '../../../components/ui/Card';
import { Badge } from '../../../components/ui/Badge';

export default function SchedulingJobsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2">
          <CalendarClock className="w-5 h-5 text-brand-400" /> Pipeline Scheduler & Batch Workers
        </h1>
        <p className="text-xs text-slate-400 mt-1">Configure cron schedules, event-triggered runs, and batch worker queues.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card title="Hourly Player Feature Recalculation" subtitle="Cron: 0 * * * *" action={<Badge variant="success" dot font-mono>ENABLED</Badge>}>
          <div className="space-y-2 font-mono text-xs text-slate-300">
            <div className="flex justify-between">
              <span className="text-slate-400 text-[10px]">LAST RUN:</span>
              <span className="text-emerald-400">2026-08-31 23:00 UTC (Succeeded)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400 text-[10px]">NEXT SCHEDULED RUN:</span>
              <span className="text-brand-400 font-bold">2026-09-01 00:00 UTC</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400 text-[10px]">TOTAL RUNS:</span>
              <span>142 runs</span>
            </div>
          </div>
        </Card>

        <Card title="Active Batch Worker Nodes" subtitle="Parallel worker pool execution">
          <div className="space-y-2 font-mono text-xs">
            <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-200 block">worker-node-1</span>
                <span className="text-[10px] text-slate-500">14,500 recs processed (1,200 rec/s)</span>
              </div>
              <Badge variant="success">BUSY</Badge>
            </div>
            <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-200 block">worker-node-2</span>
                <span className="text-[10px] text-slate-500">89,000 recs processed (0 rec/s)</span>
              </div>
              <Badge variant="default">IDLE</Badge>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
