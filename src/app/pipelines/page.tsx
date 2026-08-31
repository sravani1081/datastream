'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useProject } from '../../context/ProjectContext';
import { Pipeline } from '../../types/pipeline';
import { INITIAL_PIPELINES } from '../../providers/local/initialData';
import { Workflow, Plus, Play, CheckCircle2, AlertTriangle, Clock, GitBranch } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { PipelineEngine } from '../../lib/engine/pipelineEngine';

export default function PipelinesPage() {
  const { activeProject, addToast } = useProject();
  const [pipelines, setPipelines] = useState<Pipeline[]>(INITIAL_PIPELINES);
  const [runningId, setRunningId] = useState<string | null>(null);

  const handleRunPipeline = async (pipeline: Pipeline) => {
    setRunningId(pipeline.id);
    addToast('Executing DAG', `Running topological execution plan for ${pipeline.name}...`, 'info');

    try {
      const output = await PipelineEngine.runPipeline(pipeline, 'manual');
      addToast(
        'Run Completed',
        `Processed ${output.run.totalRecordsProcessed} recs in ${output.run.durationMs}ms (${output.run.throughputRecPerSec} recs/s)`,
        'success'
      );
    } catch (e) {
      addToast('Run Failed', 'Error executing pipeline graph', 'error');
    } finally {
      setRunningId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <Workflow className="w-5 h-5 text-brand-400" /> Pipeline Orchestration
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Build, validate, schedule, and execute real-time streaming and batch DAG pipelines.
          </p>
        </div>
        <Link href="/pipelines/builder">
          <Button variant="primary" size="sm" icon={<Plus className="w-4 h-4" />}>
            New Visual Pipeline
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {pipelines.map((pipe) => (
          <Card
            key={pipe.id}
            title={pipe.name}
            subtitle={pipe.description}
            action={
              <Badge variant={pipe.status === 'running' ? 'success' : 'default'} dot={pipe.status === 'running'}>
                {pipe.status.toUpperCase()}
              </Badge>
            }
            footer={
              <div className="flex items-center justify-between">
                <span className="font-mono text-slate-400">Version v{pipe.currentVersion}</span>
                <div className="flex items-center gap-2">
                  <Link href={`/pipelines/builder?id=${pipe.id}`}>
                    <Button variant="outline" size="sm">
                      Edit Canvas
                    </Button>
                  </Link>
                  <Button
                    variant="primary"
                    size="sm"
                    disabled={runningId === pipe.id}
                    icon={<Play className="w-3.5 h-3.5" />}
                    onClick={() => handleRunPipeline(pipe)}
                  >
                    {runningId === pipe.id ? 'Running...' : 'Run DAG'}
                  </Button>
                </div>
              </div>
            }
          >
            <div className="space-y-4 text-xs">
              <div className="flex items-center justify-between text-slate-400 bg-slate-950 p-3 rounded-lg border border-slate-800 font-mono">
                <div>
                  <span className="text-[10px] block text-slate-500">DAG NODES</span>
                  <span className="font-bold text-slate-200">{pipe.nodes.length} Nodes</span>
                </div>
                <div>
                  <span className="text-[10px] block text-slate-500">EDGES</span>
                  <span className="font-bold text-slate-200">{pipe.edges.length} Edges</span>
                </div>
                <div>
                  <span className="text-[10px] block text-slate-500">CRON SCHEDULE</span>
                  <span className="font-bold text-brand-400">{pipe.scheduleCron || 'Manual'}</span>
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-mono text-slate-500 uppercase">Tags</span>
                <div className="flex flex-wrap gap-1.5">
                  {pipe.tags.map((t) => (
                    <span key={t} className="px-2 py-0.5 bg-slate-800 text-slate-300 rounded text-[10px] font-mono">
                      #{t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
