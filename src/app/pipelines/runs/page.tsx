'use client';

import React, { useState } from 'react';
import { useProject } from '../../../context/ProjectContext';
import { Play, CheckCircle2, XCircle, Clock, Zap, FileText } from 'lucide-react';
import { DataGrid, DataGridColumn } from '../../../components/ui/DataGrid';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';

export default function PipelineRunsPage() {
  const { addToast } = useProject();

  const [runs] = useState([
    {
      id: 'run-101',
      pipelineName: 'Player Session & Churn Predictor Pipeline',
      status: 'Succeeded',
      startedAt: '2026-08-31T23:45:00Z',
      durationMs: 42,
      totalRecordsProcessed: 2480,
      totalRecordsDropped: 20,
      throughputRecPerSec: 590.4,
      triggeredBy: 'manual',
    },
    {
      id: 'run-100',
      pipelineName: 'Player Session & Churn Predictor Pipeline',
      status: 'Succeeded',
      startedAt: '2026-08-31T23:00:00Z',
      durationMs: 38,
      totalRecordsProcessed: 2450,
      totalRecordsDropped: 18,
      throughputRecPerSec: 644.7,
      triggeredBy: 'scheduler',
    },
    {
      id: 'run-99',
      pipelineName: 'Real-Time Financial Audit',
      status: 'Succeeded',
      startedAt: '2026-08-31T22:30:00Z',
      durationMs: 28,
      totalRecordsProcessed: 1200,
      totalRecordsDropped: 0,
      throughputRecPerSec: 428.5,
      triggeredBy: 'event',
    },
  ]);

  const columns: DataGridColumn<(typeof runs)[0]>[] = [
    { key: 'id', header: 'Run ID', sortable: true, width: '120px' },
    { key: 'pipelineName', header: 'Pipeline Name', sortable: true },
    {
      key: 'status',
      header: 'Status',
      accessor: (row) => (
        <Badge variant={row.status === 'Succeeded' ? 'success' : 'danger'} dot>
          {row.status}
        </Badge>
      ),
    },
    { key: 'startedAt', header: 'Started At', sortable: true },
    { key: 'durationMs', header: 'Duration', accessor: (row) => `${row.durationMs} ms` },
    { key: 'totalRecordsProcessed', header: 'Records Processed', sortable: true, accessor: (row) => row.totalRecordsProcessed.toLocaleString() },
    { key: 'throughputRecPerSec', header: 'Throughput', accessor: (row) => `${row.throughputRecPerSec} recs/s` },
    { key: 'triggeredBy', header: 'Triggered By', accessor: (row) => <span className="font-mono text-xs uppercase text-brand-400">{row.triggeredBy}</span> },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <Play className="w-5 h-5 text-brand-400" /> Pipeline Execution Runs
          </h1>
          <p className="text-xs text-slate-400 mt-1">Audit execution history, latency profiles, and topological run logs.</p>
        </div>
      </div>

      <DataGrid data={runs} columns={columns} keyField="id" title="Run Audit Log History" searchPlaceholder="Search runs..." />
    </div>
  );
}
