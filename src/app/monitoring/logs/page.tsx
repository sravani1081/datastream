'use client';

import React, { useState } from 'react';
import { Activity, Search, Filter, Terminal, Download } from 'lucide-react';
import { LogSeverity, SystemLog } from '../../../types/observability';
import { DataGrid, DataGridColumn } from '../../../components/ui/DataGrid';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';

export default function LogsPage() {
  const [severityFilter, setSeverityFilter] = useState<string>('ALL');

  const sampleLogs: SystemLog[] = Array.from({ length: 30 }).map((_, i) => ({
    id: `log-${i + 1}`,
    projectId: 'proj-nexus-game',
    pipelineId: 'pipe-player-session-agg',
    pipelineName: 'Player Session Pipeline',
    severity: (i % 12 === 0 ? 'ERROR' : i % 6 === 0 ? 'WARN' : i % 2 === 0 ? 'INFO' : 'DEBUG') as LogSeverity,
    source: i % 3 === 0 ? 'stream' : 'pipeline',
    message:
      i % 12 === 0
        ? 'Partition offset lag spike on partition_2 (lag > 50 msg)'
        : i % 6 === 0
        ? 'High watermark delay: allowed lateness bounds reached (5.0s)'
        : `Micro-batch #${1040 - i} processed 2,480 recs (18ms)`,
    timestamp: new Date(Date.now() - i * 30000).toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }));

  const filteredLogs = severityFilter === 'ALL' ? sampleLogs : sampleLogs.filter((l) => l.severity === severityFilter);

  const columns: DataGridColumn<SystemLog>[] = [
    { key: 'timestamp', header: 'Timestamp', sortable: true, width: '160px', accessor: (r) => <span className="font-mono text-slate-400">{r.timestamp}</span> },
    {
      key: 'severity',
      header: 'Severity',
      sortable: true,
      width: '100px',
      accessor: (r) => (
        <Badge variant={r.severity === 'ERROR' ? 'danger' : r.severity === 'WARN' ? 'warning' : 'info'}>
          {r.severity}
        </Badge>
      ),
    },
    { key: 'source', header: 'Source', width: '100px', accessor: (r) => <span className="font-mono uppercase text-xs text-brand-400">{r.source}</span> },
    { key: 'message', header: 'Log Message', accessor: (r) => <span className="font-mono text-slate-200">{r.message}</span> },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <Terminal className="w-5 h-5 text-brand-400" /> Log Explorer & Live Diagnostics
          </h1>
          <p className="text-xs text-slate-400 mt-1">Filter, search, and tail real-time system, node, and stream execution logs.</p>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            className="bg-slate-900 border border-slate-800 rounded-lg text-xs font-semibold text-slate-200 px-3 py-1.5 focus:outline-none"
          >
            <option value="ALL">All Severities</option>
            <option value="ERROR">ERROR</option>
            <option value="WARN">WARN</option>
            <option value="INFO">INFO</option>
            <option value="DEBUG">DEBUG</option>
          </select>
        </div>
      </div>

      <DataGrid data={filteredLogs} columns={columns} keyField="id" title={`System Log Stream (${filteredLogs.length} entries)`} />
    </div>
  );
}
