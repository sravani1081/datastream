'use client';

import React, { useState } from 'react';
import { Code2, Play, Table, Download, Sparkles } from 'lucide-react';
import { SQLEngine } from '../../../lib/sql/sqlParser';
import { GameTelemetryGenerator } from '../../../lib/generators/gameTelemetry';
import { Button } from '../../../components/ui/Button';
import { DataGrid, DataGridColumn } from '../../../components/ui/DataGrid';
import { Card } from '../../../components/ui/Card';
import { Badge } from '../../../components/ui/Badge';

export default function SQLWorkspacePage() {
  const [query, setQuery] = useState(
    "SELECT player_id, country, level, total_spent_usd FROM players WHERE total_spent_usd > 50 ORDER BY level LIMIT 10"
  );

  const playersData = GameTelemetryGenerator.generatePlayers(50, 42);
  const [queryResult, setQueryResult] = useState(() => SQLEngine.executeQuery(query, playersData as unknown as Record<string, unknown>[]));

  const handleRunQuery = () => {
    const res = SQLEngine.executeQuery(query, playersData as unknown as Record<string, unknown>[]);
    setQueryResult(res);
  };

  const columns: DataGridColumn<Record<string, unknown>>[] = queryResult.columns.map((c) => ({
    key: c.name,
    header: c.name.toUpperCase(),
    sortable: true,
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <Code2 className="w-5 h-5 text-brand-400" /> Controlled SQL Workspace
          </h1>
          <p className="text-xs text-slate-400 mt-1">Execute safe AST queries over local datasets (SELECT, WHERE, ORDER BY, LIMIT).</p>
        </div>
      </div>

      <Card title="SQL Query Editor" action={<Button variant="primary" size="sm" icon={<Play className="w-4 h-4" />} onClick={handleRunQuery}>Execute SQL</Button>}>
        <div className="space-y-3">
          <textarea
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            rows={4}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-xs font-mono text-brand-300 focus:outline-none focus:border-brand-500 shadow-inner"
          />
          <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
            <span>Target Table: players (50 recs)</span>
            <span>Execution Time: {queryResult.executionTimeMs} ms</span>
          </div>
        </div>
      </Card>

      <DataGrid data={queryResult.rows} columns={columns} keyField="player_id" title={`Query Results (${queryResult.totalCount} records)`} />
    </div>
  );
}
