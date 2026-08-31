'use client';

import React, { useState } from 'react';
import { ShieldCheck, Plus, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { INITIAL_CONTRACTS } from '../../../providers/local/initialData';
import { Card } from '../../../components/ui/Card';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';

export default function ContractsPage() {
  const [contracts] = useState(INITIAL_CONTRACTS);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" /> Data Contracts & Quality SLAs
          </h1>
          <p className="text-xs text-slate-400 mt-1">Enforce freshness max latency, min quality thresholds, and null boundaries.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {contracts.map((c) => (
          <Card key={c.id} title={c.name} subtitle={`Target Dataset: ${c.datasetName}`} action={<Badge variant="success" dot>COMPLIANT</Badge>}>
            <div className="space-y-3 text-xs font-mono">
              <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-400 text-[10px]">MIN QUALITY SCORE:</span>
                  <span className="text-emerald-400 font-bold">{c.minQualityScorePct}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 text-[10px]">MAX FRESHNESS LATENCY:</span>
                  <span className="text-brand-400 font-bold">{c.slaMaxLatencyMinutes} Minutes</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 text-[10px]">MAX ALLOWED NULL %:</span>
                  <span className="text-slate-200 font-bold">{c.maxNullPct}%</span>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
