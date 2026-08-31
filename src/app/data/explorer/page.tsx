'use client';

import React, { useState } from 'react';
import { Table, Search, Download, Filter, Eye, Sparkles } from 'lucide-react';
import { DataGrid, DataGridColumn } from '../../../components/ui/DataGrid';
import { Card } from '../../../components/ui/Card';
import { Badge } from '../../../components/ui/Badge';

export default function DataExplorerPage() {
  const sampleRecords = Array.from({ length: 50 }).map((_, i) => ({
    id: `rec-${i + 1}`,
    player_id: `ply_${1000 + i}`,
    country: i % 4 === 0 ? 'US' : i % 3 === 0 ? 'DE' : i % 2 === 0 ? 'JP' : 'UK',
    platform: i % 3 === 0 ? 'PlayStation' : i % 2 === 0 ? 'PC' : 'iOS',
    level: Math.floor(Math.random() * 80) + 1,
    score: Math.floor(Math.random() * 20000) + 500,
    session_count: Math.floor(Math.random() * 40) + 1,
    avg_duration_sec: Math.floor(Math.random() * 600) + 120,
    churn_risk: i % 7 === 0 ? 'High' : i % 3 === 0 ? 'Medium' : 'Low',
    created_at: new Date(Date.now() - i * 86400000).toISOString().split('T')[0],
  }));

  const columns: DataGridColumn<(typeof sampleRecords)[0]>[] = [
    { key: 'player_id', header: 'Player ID', sortable: true, accessor: (r) => <span className="font-mono text-brand-400 font-bold">{r.player_id}</span> },
    { key: 'country', header: 'Country', sortable: true },
    { key: 'platform', header: 'Platform', sortable: true },
    { key: 'level', header: 'Level', sortable: true },
    { key: 'score', header: 'Score', sortable: true, accessor: (r) => r.score.toLocaleString() },
    { key: 'session_count', header: 'Sessions (7D)', sortable: true },
    { key: 'avg_duration_sec', header: 'Avg Duration', accessor: (r) => `${r.avg_duration_sec}s` },
    {
      key: 'churn_risk',
      header: 'Churn Risk',
      accessor: (r) => (
        <Badge variant={r.churn_risk === 'High' ? 'danger' : r.churn_risk === 'Medium' ? 'warning' : 'success'}>
          {r.churn_risk}
        </Badge>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2">
          <Table className="w-5 h-5 text-brand-400" /> Interactive Data Explorer
        </h1>
        <p className="text-xs text-slate-400 mt-1">Explore, search, filter, and analyze records in ds-player-features.</p>
      </div>

      {/* Dataset Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 font-mono text-xs">
        <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl">
          <span className="text-slate-400 text-[10px] block">TOTAL ROWS</span>
          <span className="text-lg font-bold text-slate-100">14,500</span>
        </div>
        <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl">
          <span className="text-slate-400 text-[10px] block">NULL PERCENTAGE</span>
          <span className="text-lg font-bold text-emerald-400">0.02%</span>
        </div>
        <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl">
          <span className="text-slate-400 text-[10px] block">COLUMNS COUNT</span>
          <span className="text-lg font-bold text-brand-400">8 Fields</span>
        </div>
        <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl">
          <span className="text-slate-400 text-[10px] block">FRESHNESS</span>
          <span className="text-lg font-bold text-purple-400">4 mins ago</span>
        </div>
      </div>

      <DataGrid data={sampleRecords} columns={columns} keyField="id" title="Record Explorer" />
    </div>
  );
}
