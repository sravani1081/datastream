'use client';

import React from 'react';
import { BrainCircuit, Sparkles, Plus, Table } from 'lucide-react';
import { Card } from '../../../components/ui/Card';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';

export default function MLFeaturesPage() {
  const features = [
    { name: 'sessions_7d', type: 'Rolling Aggregation', dataType: 'Integer', window: '7 Days', description: 'Total player login sessions in last 7 days' },
    { name: 'avg_session_duration_7d', type: 'Rolling Average', dataType: 'Float', window: '7 Days', description: 'Average session duration in seconds' },
    { name: 'score_per_minute', type: 'Ratio Feature', dataType: 'Float', window: 'Instant', description: 'Match score per minute of gameplay' },
    { name: 'engagement_tier', type: 'Categorical', dataType: 'String', window: 'Static', description: 'High / Medium / Low player engagement classification' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <BrainCircuit className="w-5 h-5 text-brand-400" /> ML Feature Store Catalog
          </h1>
          <p className="text-xs text-slate-400 mt-1">Managed ML features, rolling aggregations, ratios, and time-based features.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {features.map((f) => (
          <Card key={f.name} title={f.name} subtitle={f.description} action={<Badge variant="purple">{f.dataType}</Badge>}>
            <div className="space-y-2 font-mono text-xs text-slate-300">
              <div className="flex justify-between">
                <span className="text-slate-400 text-[10px]">FEATURE TYPE:</span>
                <span className="text-brand-400 font-bold">{f.type}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 text-[10px]">EVALUATION WINDOW:</span>
                <span className="text-slate-200">{f.window}</span>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
