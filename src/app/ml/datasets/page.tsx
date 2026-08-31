'use client';

import React, { useState } from 'react';
import { BrainCircuit, Play, Sparkles, Download, CheckCircle2 } from 'lucide-react';
import { MLFeatureEngine } from '../../../lib/ml/featureEngine';
import { GameTelemetryGenerator } from '../../../lib/generators/gameTelemetry';
import { Card } from '../../../components/ui/Card';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';

export default function MLDatasetsPage() {
  const [splitPct, setSplitPct] = useState(80);
  const raw = GameTelemetryGenerator.generatePlayers(100, 42);
  const featured = MLFeatureEngine.extractFeatures(raw as unknown as Record<string, unknown>[]);

  const { dataset, trainRows, testRows } = MLFeatureEngine.createMLDataset(
    'Player Churn Predictor Dataset v1',
    '80/20 Train/Test split for predicting player churn within 7 days',
    featured,
    { sourceFeatureSetIds: ['fs-1'], labelColumn: 'is_churned', entityKey: 'player_id', trainSplitPct: splitPct }
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <BrainCircuit className="w-5 h-5 text-brand-400" /> ML Dataset Builder & Train/Test Split
          </h1>
          <p className="text-xs text-slate-400 mt-1">Feature selection, label assignment, train/test ratio split, and export.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card title="Train/Test Split Config" className="md:col-span-1">
          <div className="space-y-4 text-xs font-mono">
            <div>
              <span className="text-slate-400 block mb-1">Train Split Percentage ({splitPct}%)</span>
              <input
                type="range"
                min={50}
                max={90}
                step={5}
                value={splitPct}
                onChange={(e) => setSplitPct(Number(e.target.value))}
                className="w-full h-2 bg-slate-950 rounded-lg accent-brand-500 cursor-pointer"
              />
            </div>
            <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-400">TRAIN ROWS:</span>
                <span className="text-emerald-400 font-bold">{trainRows.length} recs</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">TEST ROWS:</span>
                <span className="text-brand-400 font-bold">{testRows.length} recs</span>
              </div>
            </div>
          </div>
        </Card>

        <Card title="Generated ML Dataset Specs" className="md:col-span-2" action={<Badge variant="success">Status: Ready</Badge>}>
          <div className="space-y-3 font-mono text-xs text-slate-300">
            <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg">
              <span className="text-slate-400 text-[10px] block">LABEL COLUMN</span>
              <span className="font-bold text-rose-400 text-sm">{dataset.labelColumn}</span>
            </div>
            <div className="space-y-1">
              <span className="text-[10px] text-slate-500 uppercase block">Selected Feature Columns</span>
              <div className="flex flex-wrap gap-1.5">
                {dataset.featureColumns.map((fc) => (
                  <span key={fc} className="px-2 py-0.5 bg-slate-800 border border-slate-700 text-slate-200 rounded text-[10px]">
                    {fc}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
