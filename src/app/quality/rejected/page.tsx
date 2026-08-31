'use client';

import React, { useState } from 'react';
import { XCircle, Filter, Download } from 'lucide-react';
import { DataGrid, DataGridColumn } from '../../../components/ui/DataGrid';
import { Badge } from '../../../components/ui/Badge';

export default function RejectedRecordsPage() {
  const [rejectedRecords] = useState([
    {
      id: 'rej-1',
      pipelineName: 'Player Session & Churn Predictor Pipeline',
      failedField: 'player_id',
      errorMessage: "Field 'player_id' is required but was null/empty.",
      ruleName: 'player_id NOT NULL',
      rejectedAt: '2026-08-31T23:45:10Z',
      payload: '{"score": 450, "duration": 300}',
    },
    {
      id: 'rej-2',
      pipelineName: 'Economy Fraud Detector',
      failedField: 'amount',
      errorMessage: "Field 'amount' value -50 is less than minimum 0.",
      ruleName: 'currency_amount >= 0',
      rejectedAt: '2026-08-31T23:40:00Z',
      payload: '{"player_id": "ply_1002", "item": "gems", "amount": -50}',
    },
  ]);

  const columns: DataGridColumn<(typeof rejectedRecords)[0]>[] = [
    { key: 'id', header: 'Record ID', sortable: true },
    { key: 'pipelineName', header: 'Pipeline Source', sortable: true },
    { key: 'failedField', header: 'Failed Field', accessor: (r) => <span className="font-mono text-rose-400 font-bold">{r.failedField}</span> },
    { key: 'errorMessage', header: 'Error Details', accessor: (r) => <span className="text-slate-300">{r.errorMessage}</span> },
    { key: 'ruleName', header: 'Rule Triggered', accessor: (r) => <Badge variant="warning">{r.ruleName}</Badge> },
    { key: 'rejectedAt', header: 'Timestamp', sortable: true },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2">
          <XCircle className="w-5 h-5 text-rose-400" /> Rejected Records Quarantine
        </h1>
        <p className="text-xs text-slate-400 mt-1">Inspect records quarantined by quality checks and schema contract gates.</p>
      </div>

      <DataGrid data={rejectedRecords} columns={columns} keyField="id" title="Quarantined Record Log" />
    </div>
  );
}
