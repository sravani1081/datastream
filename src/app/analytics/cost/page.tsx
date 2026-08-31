'use client';

import React, { useState } from 'react';
import { DollarSign, Cpu, HardDrive, Network, Sparkles } from 'lucide-react';
import { ObservabilityEngine } from '../../../lib/observability/observabilityEngine';
import { Card } from '../../../components/ui/Card';
import { Badge } from '../../../components/ui/Badge';

export default function CostSimulatorPage() {
  const [dataVolumeGB, setDataVolumeGB] = useState(142);
  const [activePipelines, setActivePipelines] = useState(3);

  const cost = ObservabilityEngine.calculateCostEstimate(dataVolumeGB, activePipelines);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-emerald-400" /> Pipeline Cost Model Simulator
          </h1>
          <p className="text-xs text-slate-400 mt-1">Estimate cloud compute, storage, and egress processing costs based on data volume.</p>
        </div>
        <Badge variant="info">SYNTHETIC COST ESTIMATE</Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card title="Volume & Pipeline Sliders" className="lg:col-span-1">
          <div className="space-y-5 text-xs font-mono text-slate-300">
            <div>
              <div className="flex justify-between mb-1">
                <span>Monthly Storage Data Volume</span>
                <span className="font-bold text-brand-400">{dataVolumeGB} GB</span>
              </div>
              <input
                type="range"
                min={10}
                max={1000}
                step={10}
                value={dataVolumeGB}
                onChange={(e) => setDataVolumeGB(Number(e.target.value))}
                className="w-full h-2 bg-slate-950 rounded-lg accent-brand-500 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span>Active Pipeline DAG Nodes</span>
                <span className="font-bold text-emerald-400">{activePipelines} Pipelines</span>
              </div>
              <input
                type="range"
                min={1}
                max={20}
                step={1}
                value={activePipelines}
                onChange={(e) => setActivePipelines(Number(e.target.value))}
                className="w-full h-2 bg-slate-950 rounded-lg accent-emerald-500 cursor-pointer"
              />
            </div>
          </div>
        </Card>

        <Card title="Cost Estimate Breakdown" className="lg:col-span-2" subtitle="Calculated based on synthetic cloud tier pricing">
          <div className="grid grid-cols-3 gap-4 text-xs font-mono mb-4">
            <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl">
              <span className="text-[10px] text-slate-500 block">ESTIMATED COMPUTE</span>
              <span className="text-lg font-bold text-slate-100">${cost.syntheticMonthlyComputeUsd} /mo</span>
            </div>
            <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl">
              <span className="text-[10px] text-slate-500 block">ESTIMATED STORAGE</span>
              <span className="text-lg font-bold text-brand-400">${cost.syntheticMonthlyStorageUsd} /mo</span>
            </div>
            <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl">
              <span className="text-[10px] text-slate-500 block">TOTAL ESTIMATED COST</span>
              <span className="text-lg font-bold text-emerald-400">${cost.syntheticMonthlyTotalUsd} /mo</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
