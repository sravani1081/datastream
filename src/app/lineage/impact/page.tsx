'use client';

import React from 'react';
import { GitFork, AlertTriangle, ShieldCheck } from 'lucide-react';
import { LineageEngine } from '../../../lib/lineage/lineageEngine';
import { Card } from '../../../components/ui/Card';
import { Badge } from '../../../components/ui/Badge';

export default function ImpactAnalysisPage() {
  const impact = LineageEngine.analyzeImpact('f-timestamp', 'timestamp');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-amber-400" /> Schema Field Impact Analysis
        </h1>
        <p className="text-xs text-slate-400 mt-1">Calculates downstream pipeline, feature set, and report breakage risk when field timestamp evolves.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card title="Impacted Pipelines" subtitle="Pipelines reading target field">
          <div className="space-y-2 text-xs font-mono">
            {impact.affectedPipelines.map((p) => (
              <div key={p.id} className="p-3 bg-slate-950 border border-slate-800 rounded-lg flex items-center justify-between">
                <span className="text-slate-200">{p.name}</span>
                <Badge variant="danger">RISK: {p.risk.toUpperCase()}</Badge>
              </div>
            ))}
          </div>
        </Card>

        <Card title="Impacted Features & Reports" subtitle="Downstream dependencies">
          <div className="space-y-2 text-xs font-mono">
            {impact.affectedFeatures.map((f) => (
              <div key={f.id} className="p-3 bg-slate-950 border border-slate-800 rounded-lg flex items-center justify-between">
                <span className="text-slate-200">{f.name}</span>
                <Badge variant="warning">RISK: {f.risk.toUpperCase()}</Badge>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
