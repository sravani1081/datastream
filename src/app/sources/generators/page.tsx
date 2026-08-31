'use client';

import React, { useState } from 'react';
import { Sparkles, Play, Database, Download } from 'lucide-react';
import { GameTelemetryGenerator } from '../../../lib/generators/gameTelemetry';
import { Card } from '../../../components/ui/Card';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import { DataGrid, DataGridColumn } from '../../../components/ui/DataGrid';

export default function SyntheticGeneratorsPage() {
  const [recordCount, setRecordCount] = useState(25);
  const [seed, setSeed] = useState(42);
  const [targetDataset, setTargetDataset] = useState<'Players' | 'Sessions' | 'Economy'>('Players');

  const generatedData =
    targetDataset === 'Players'
      ? GameTelemetryGenerator.generatePlayers(recordCount, seed)
      : targetDataset === 'Sessions'
      ? GameTelemetryGenerator.generateSessions(recordCount, seed)
      : GameTelemetryGenerator.generateEconomy(recordCount, seed);

  const columns: DataGridColumn<Record<string, unknown>>[] = Object.keys(generatedData[0] || {}).map((k) => ({
    key: k,
    header: k.toUpperCase(),
    sortable: true,
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-brand-400" /> Deterministic Synthetic Generator
          </h1>
          <p className="text-xs text-slate-400 mt-1">Generate deterministic synthetic datasets (Players, Sessions, Matches, Economy) by random seed.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card title="Generator Controls" className="md:col-span-1">
          <div className="space-y-4 font-mono text-xs text-slate-300">
            <div>
              <span className="text-slate-400 block mb-1">Select Dataset Schema</span>
              <select
                value={targetDataset}
                onChange={(e) => setTargetDataset(e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-slate-200"
              >
                <option value="Players">Players Catalog</option>
                <option value="Sessions">Sessions Stream</option>
                <option value="Economy">Economy Transactions</option>
              </select>
            </div>

            <div>
              <span className="text-slate-400 block mb-1">Random Seed ({seed})</span>
              <input
                type="number"
                value={seed}
                onChange={(e) => setSeed(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-slate-200"
              />
            </div>

            <div>
              <span className="text-slate-400 block mb-1">Record Count ({recordCount})</span>
              <input
                type="range"
                min={10}
                max={100}
                step={5}
                value={recordCount}
                onChange={(e) => setRecordCount(Number(e.target.value))}
                className="w-full h-2 bg-slate-950 rounded-lg accent-brand-500 cursor-pointer"
              />
            </div>
          </div>
        </Card>

        <Card title="Deterministic Output Preview" className="md:col-span-2">
          <DataGrid data={generatedData as unknown as Record<string, unknown>[]} columns={columns} keyField={Object.keys(generatedData[0] || {})[0] || 'id'} />
        </Card>
      </div>
    </div>
  );
}
