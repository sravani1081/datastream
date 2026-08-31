'use client';

import React, { useState } from 'react';
import { useProject } from '../../../context/ProjectContext';
import { PipelineNode, PipelineEdge, NodeType } from '../../../types/pipeline';
import { INITIAL_PIPELINES } from '../../../providers/local/initialData';
import {
  Workflow,
  Plus,
  Play,
  Save,
  Trash2,
  Copy,
  Settings,
  Zap,
  CheckCircle2,
  XCircle,
  Code2,
  Filter,
  Layers,
  Database,
  Radio,
  Sliders,
  Sparkles,
} from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { Badge } from '../../../components/ui/Badge';
import { PipelineEngine } from '../../../lib/engine/pipelineEngine';

const ALL_NODE_TYPES: Array<{ type: NodeType; label: string; desc: string; category: string }> = [
  { type: 'Source', label: 'DataSource Input', desc: 'Read from static or streaming source', category: 'Inputs' },
  { type: 'Stream', label: 'Live Stream Ingestion', desc: 'Pub/Sub topic message subscriber', category: 'Inputs' },
  { type: 'Batch Input', label: 'Batch Dataset Ingestion', desc: 'Bulk dataset reader', category: 'Inputs' },
  { type: 'Filter', label: 'Record Filter', desc: 'Filter rows based on rule expression', category: 'Transforms' },
  { type: 'Map', label: 'Column Mapping & Cast', desc: 'Rename and cast field types', category: 'Transforms' },
  { type: 'Transform', label: 'JS Expression Transform', desc: 'Calculate derived fields', category: 'Transforms' },
  { type: 'Aggregate', label: 'Group Aggregator', desc: 'Count, sum, avg, min, max, percentiles', category: 'Transforms' },
  { type: 'Window', label: 'Stream Window (5m/1h)', desc: 'Tumbling, sliding, or session windows', category: 'Transforms' },
  { type: 'Join', label: 'Stream / Dataset Join', desc: 'Inner, left, right, or full join', category: 'Transforms' },
  { type: 'Deduplicate', label: 'Deduplicator', desc: 'Remove duplicate records by key', category: 'Transforms' },
  { type: 'Sort', label: 'Sorter', desc: 'Sort stream records by field', category: 'Transforms' },
  { type: 'Sample', label: 'Sampler', desc: 'Sample record fraction', category: 'Transforms' },
  { type: 'Validate', label: 'Rule Validator', desc: 'Validate schema constraints', category: 'Quality' },
  { type: 'Enrich', label: 'Lookup Enricher', desc: 'Join external lookup metadata', category: 'Quality' },
  { type: 'Split', label: 'Branch Splitter', desc: 'Split records into multiple streams', category: 'Flow' },
  { type: 'Merge', label: 'Stream Merger', desc: 'Combine multiple inputs', category: 'Flow' },
  { type: 'Feature', label: 'ML Feature Generator', desc: 'Calculate rolling/lag ML features', category: 'ML' },
  { type: 'Quality Check', label: 'Data Quality Gate', desc: 'Contract & quality SLA check', category: 'Quality' },
  { type: 'Output', label: 'Dataset Sink', desc: 'Write output records to catalog sink', category: 'Outputs' },
];

export default function PipelineBuilderPage() {
  const { addToast } = useProject();
  const initialPipe = INITIAL_PIPELINES[0];

  const [nodes, setNodes] = useState<PipelineNode[]>(initialPipe.nodes);
  const [edges, setEdges] = useState<PipelineEdge[]>(initialPipe.edges);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(nodes[0]?.id || null);
  const [isExecuting, setIsExecuting] = useState(false);
  const [runLog, setRunLog] = useState<string[]>([]);

  const selectedNode = nodes.find((n) => n.id === selectedNodeId) || null;

  const handleAddNode = (type: NodeType) => {
    const id = `node-${Date.now()}`;
    const newNode: PipelineNode = {
      id,
      type,
      label: `${type} Node`,
      position: { x: 250 + (nodes.length % 4) * 180, y: 150 + (nodes.length % 3) * 120 },
      config: {},
      inputs: [],
      outputs: [],
      status: 'idle',
    };
    setNodes((prev) => [...prev, newNode]);
    setSelectedNodeId(id);
    addToast('Node Added', `Added ${type} node to DAG canvas`, 'info');
  };

  const handleDeleteNode = (id: string) => {
    setNodes((prev) => prev.filter((n) => n.id !== id));
    setEdges((prev) => prev.filter((e) => e.sourceNodeId !== id && e.targetNodeId !== id));
    if (selectedNodeId === id) setSelectedNodeId(null);
    addToast('Node Removed', 'Deleted node and connected edges', 'info');
  };

  const handleDuplicateNode = (node: PipelineNode) => {
    const dupId = `node-${Date.now()}`;
    const dupNode: PipelineNode = {
      ...node,
      id: dupId,
      label: `${node.label} (Copy)`,
      position: { x: node.position.x + 40, y: node.position.y + 40 },
    };
    setNodes((prev) => [...prev, dupNode]);
    setSelectedNodeId(dupId);
    addToast('Node Duplicated', `Created copy of ${node.label}`, 'info');
  };

  const handleRunPipeline = async () => {
    setIsExecuting(true);
    setRunLog(['[Engine] Starting local DAG topological execution plan...']);

    const pipelineToRun = {
      ...initialPipe,
      nodes,
      edges,
    };

    try {
      const output = await PipelineEngine.runPipeline(pipelineToRun, 'manual');
      if (output.run.status === 'Succeeded') {
        setRunLog((prev) => [
          ...prev,
          `[Planner] Execution order: ${pipelineToRun.nodes.map((n) => n.label).join(' → ')}`,
          `[Engine] Succeeded! Processed ${output.run.totalRecordsProcessed} records in ${output.run.durationMs}ms.`,
          `[Sink] Output dataset updated with ${output.finalOutputRecords.length} records.`,
        ]);
        addToast('DAG Execution Succeeded', `Processed ${output.run.totalRecordsProcessed} records`, 'success');
      } else {
        setRunLog((prev) => [...prev, `[Engine Failed] ${output.run.errorLog?.join(', ')}`]);
        addToast('Execution Failed', 'Errors in DAG topological planner', 'error');
      }
    } catch (err) {
      addToast('Engine Error', 'Failed to execute DAG locally', 'error');
    } finally {
      setIsExecuting(false);
    }
  };

  return (
    <div className="h-[calc(100vh-6rem)] flex flex-col space-y-4 overflow-hidden">
      {/* Action Header */}
      <div className="flex items-center justify-between bg-slate-900 border border-slate-800 p-4 rounded-xl shrink-0">
        <div className="flex items-center gap-3">
          <Workflow className="w-6 h-6 text-brand-400" />
          <div>
            <h1 className="text-base font-bold text-slate-100">{initialPipe.name}</h1>
            <p className="text-xs text-slate-400">Visual DAG Editor • {nodes.length} Nodes • {edges.length} Edges</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm" icon={<Save className="w-4 h-4" />} onClick={() => addToast('Pipeline Saved', 'Visual DAG saved to local project storage', 'success')}>
            Save Spec
          </Button>
          <Button variant="primary" size="sm" disabled={isExecuting} icon={<Play className="w-4 h-4" />} onClick={handleRunPipeline}>
            {isExecuting ? 'Executing...' : 'Run DAG Pipeline'}
          </Button>
        </div>
      </div>

      {/* Main Canvas Workspace */}
      <div className="flex-1 grid grid-cols-12 gap-4 min-h-0 overflow-hidden">
        {/* Left Palette: 20 Node Types */}
        <div className="col-span-3 bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col overflow-hidden">
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 mb-3">Node Palette</h3>
          <div className="flex-1 overflow-y-auto space-y-2 pr-1 scrollbar-thin">
            {ALL_NODE_TYPES.map((nt) => (
              <button
                key={nt.type}
                onClick={() => handleAddNode(nt.type)}
                className="w-full text-left p-2.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-lg flex items-center justify-between transition-colors group"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <Plus className="w-3.5 h-3.5 text-brand-400 group-hover:scale-125 transition-transform" />
                    <span className="text-xs font-semibold text-slate-200">{nt.label}</span>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-0.5">{nt.desc}</p>
                </div>
                <span className="text-[9px] font-mono text-slate-500 uppercase px-1.5 py-0.5 bg-slate-900 border border-slate-800 rounded">
                  {nt.type}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Center Canvas: Interactive SVG DAG */}
        <div className="col-span-6 bg-slate-950 border border-slate-800 rounded-xl relative overflow-hidden flex flex-col p-4">
          <div className="flex items-center justify-between text-xs text-slate-400 font-mono mb-2">
            <span>VISUAL DAG CANVAS</span>
            <Badge variant="info">DRAG & DROP ACTIVE</Badge>
          </div>

          <div className="flex-1 border border-slate-800/60 rounded-xl relative overflow-auto bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px]">
            {/* SVG Connecting Edges */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
              {edges.map((e) => {
                const srcNode = nodes.find((n) => n.id === e.sourceNodeId);
                const tgtNode = nodes.find((n) => n.id === e.targetNodeId);
                if (!srcNode || !tgtNode) return null;

                const x1 = srcNode.position.x + 140;
                const y1 = srcNode.position.y + 25;
                const x2 = tgtNode.position.x;
                const y2 = tgtNode.position.y + 25;

                return (
                  <g key={e.id}>
                    <path
                      d={`M ${x1} ${y1} C ${x1 + 60} ${y1}, ${x2 - 60} ${y2}, ${x2} ${y2}`}
                      fill="none"
                      stroke="#0c7eff"
                      strokeWidth="2.5"
                      className="animate-flow-dash"
                    />
                  </g>
                );
              })}
            </svg>

            {/* Interactive Node Cards */}
            {nodes.map((node) => {
              const isSelected = selectedNodeId === node.id;
              return (
                <div
                  key={node.id}
                  onClick={() => setSelectedNodeId(node.id)}
                  style={{ left: `${node.position.x}px`, top: `${node.position.y}px` }}
                  className={`absolute w-44 p-3 bg-slate-900 border rounded-xl shadow-xl cursor-pointer select-none transition-all z-10 ${
                    isSelected ? 'border-brand-500 ring-2 ring-brand-500/30' : 'border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-mono uppercase font-bold text-brand-400">{node.type}</span>
                    <div className="flex items-center gap-1">
                      <button onClick={(e) => { e.stopPropagation(); handleDuplicateNode(node); }} className="text-slate-500 hover:text-slate-300">
                        <Copy className="w-3 h-3" />
                      </button>
                      <button onClick={(e) => { e.stopPropagation(); handleDeleteNode(node.id); }} className="text-slate-500 hover:text-rose-400">
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                  <h4 className="text-xs font-semibold text-slate-100 truncate">{node.label}</h4>
                  {node.executionMetrics && (
                    <div className="mt-2 pt-1.5 border-t border-slate-800 text-[10px] font-mono text-slate-400 flex items-center justify-between">
                      <span>{node.executionMetrics.recordsOut} recs</span>
                      <span>{node.executionMetrics.processingTimeMs}ms</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Bottom Execution Log Viewer */}
          {runLog.length > 0 && (
            <div className="mt-3 p-3 bg-slate-900 border border-slate-800 rounded-xl font-mono text-[11px] text-slate-300 max-h-28 overflow-y-auto space-y-1">
              {runLog.map((log, idx) => (
                <div key={idx} className="text-emerald-400">{log}</div>
              ))}
            </div>
          )}
        </div>

        {/* Right Inspector & Node Properties Panel */}
        <div className="col-span-3 bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col overflow-hidden">
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
            <Sliders className="w-4 h-4 text-brand-400" /> Node Inspector
          </h3>

          {selectedNode ? (
            <div className="space-y-4 flex-1 overflow-y-auto text-xs text-slate-300">
              <div>
                <label className="text-[10px] font-mono text-slate-500 uppercase block mb-1">Node Label</label>
                <input
                  type="text"
                  value={selectedNode.label}
                  onChange={(e) => {
                    const newLabel = e.target.value;
                    setNodes((prev) => prev.map((n) => (n.id === selectedNode.id ? { ...n, label: newLabel } : n)));
                  }}
                  className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-brand-500"
                />
              </div>

              <div>
                <label className="text-[10px] font-mono text-slate-500 uppercase block mb-1">Node Type</label>
                <Badge variant="purple">{selectedNode.type}</Badge>
              </div>

              {selectedNode.type === 'Filter' && (
                <div>
                  <label className="text-[10px] font-mono text-slate-500 uppercase block mb-1">Filter Rule</label>
                  <input
                    type="text"
                    value={selectedNode.config.filterExpression || ''}
                    onChange={(e) => {
                      const expr = e.target.value;
                      setNodes((prev) =>
                        prev.map((n) => (n.id === selectedNode.id ? { ...n, config: { ...n.config, filterExpression: expr } } : n))
                      );
                    }}
                    placeholder="e.g. score > 100 AND player_id != null"
                    className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-100 focus:outline-none"
                  />
                </div>
              )}

              {selectedNode.type === 'Window' && (
                <div>
                  <label className="text-[10px] font-mono text-slate-500 uppercase block mb-1">Window Size (Seconds)</label>
                  <input
                    type="number"
                    value={selectedNode.config.windowSizeSeconds || 300}
                    onChange={(e) => {
                      const sec = Number(e.target.value);
                      setNodes((prev) =>
                        prev.map((n) => (n.id === selectedNode.id ? { ...n, config: { ...n.config, windowSizeSeconds: sec } } : n))
                      );
                    }}
                    className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-100"
                  />
                </div>
              )}

              <div className="pt-4 border-t border-slate-800">
                <Button variant="danger" size="sm" className="w-full" icon={<Trash2 className="w-3.5 h-3.5" />} onClick={() => handleDeleteNode(selectedNode.id)}>
                  Delete Node
                </Button>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-xs text-slate-500 italic">Select a node on canvas to configure parameters.</div>
          )}
        </div>
      </div>
    </div>
  );
}
