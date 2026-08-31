'use client';

import React, { useState } from 'react';
import { GitFork, Layers, Database, Workflow, BrainCircuit, Table } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { LineageEngine } from '../../lib/lineage/lineageEngine';

export default function LineagePage() {
  const { nodes, edges } = LineageEngine.getSampleGraph();
  const [activeNodeId, setActiveNodeId] = useState<string>('n-ds2');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <GitFork className="w-5 h-5 text-cyan-400" /> Interactive End-to-End Lineage
          </h1>
          <p className="text-xs text-slate-400 mt-1">Trace data provenance from raw stream sources to ML dataset sinks.</p>
        </div>
      </div>

      {/* Lineage SVG Visual DAG */}
      <Card title="Dataset Lineage DAG" subtitle="Click any node to trace upstream and downstream dependencies">
        <div className="h-72 bg-slate-950 border border-slate-800 rounded-xl relative p-6 flex items-center justify-between overflow-x-auto">
          {nodes.map((node, idx) => {
            const isSelected = activeNodeId === node.id;
            return (
              <div key={node.id} className="flex items-center">
                <div
                  onClick={() => setActiveNodeId(node.id)}
                  className={`p-4 bg-slate-900 border rounded-xl shadow-lg cursor-pointer transition-all w-48 select-none ${
                    isSelected ? 'border-cyan-400 ring-2 ring-cyan-400/30' : 'border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <span className="text-[10px] font-mono font-bold uppercase text-cyan-400 block mb-1">{node.type}</span>
                  <h4 className="text-xs font-semibold text-slate-100">{node.name}</h4>
                  {node.recordCount && <p className="text-[10px] font-mono text-slate-400 mt-1">{node.recordCount.toLocaleString()} recs</p>}
                </div>
                {idx < nodes.length - 1 && (
                  <div className="w-12 border-t-2 border-dashed border-cyan-500/50 mx-2 flex items-center justify-center">
                    <span className="text-[9px] font-mono text-cyan-400 bg-slate-950 px-1">→</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
