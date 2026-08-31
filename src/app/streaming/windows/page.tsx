'use client';

import React from 'react';
import { Clock, Radio, Activity, CheckCircle2 } from 'lucide-react';
import { Card } from '../../../components/ui/Card';
import { Badge } from '../../../components/ui/Badge';

export default function StreamWindowsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2">
          <Clock className="w-5 h-5 text-brand-400" /> Stream Windows & Watermark Timeline
        </h1>
        <p className="text-xs text-slate-400 mt-1">Tumbling, sliding, and session windows with deterministic watermark delay tracking.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card title="Tumbling Window (5-Min)" subtitle="Fixed non-overlapping time boundaries">
          <div className="space-y-3 text-xs font-mono">
            <Badge variant="purple">Size: 300 Seconds</Badge>
            <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg">
              <span className="text-slate-400 block text-[10px]">CURRENT BOUNDS</span>
              <span className="text-slate-100 font-bold block mt-1">10:40:00 - 10:45:00 UTC</span>
              <span className="text-emerald-400 text-[10px]">Active Window (2,480 recs)</span>
            </div>
          </div>
        </Card>

        <Card title="Sliding Window (1-Min Slide)" subtitle="Overlapping continuous window slides">
          <div className="space-y-3 text-xs font-mono">
            <Badge variant="info">Slide: 60 Seconds</Badge>
            <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg">
              <span className="text-slate-400 block text-[10px]">LATEST SLIDE</span>
              <span className="text-slate-100 font-bold block mt-1">10:44:00 - 10:45:00 UTC</span>
              <span className="text-brand-400 text-[10px]">Sliding (490 recs)</span>
            </div>
          </div>
        </Card>

        <Card title="Event-Time Watermark" subtitle="Out-of-order event handling delay">
          <div className="space-y-3 text-xs font-mono">
            <Badge variant="success">Watermark Delay: 5.0s</Badge>
            <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-400 text-[10px]">MAX EVENT TIME:</span>
                <span className="text-slate-200">10:44:58.210</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 text-[10px]">WATERMARK:</span>
                <span className="text-emerald-400 font-bold">10:44:53.210</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 text-[10px]">LATE EVENTS DROPPED:</span>
                <span className="text-slate-300">2</span>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
