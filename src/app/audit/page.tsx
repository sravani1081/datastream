'use client';

import React, { useState } from 'react';
import { ShieldCheck, Clock, User, FileText } from 'lucide-react';
import { INITIAL_AUDIT_EVENTS } from '../../providers/local/initialData';
import { DataGrid, DataGridColumn } from '../../components/ui/DataGrid';
import { Badge } from '../../components/ui/Badge';

export default function AuditLogsPage() {
  const [logs] = useState(INITIAL_AUDIT_EVENTS);

  const columns: DataGridColumn<(typeof logs)[0]>[] = [
    { key: 'timestamp', header: 'Timestamp', sortable: true, width: '180px', accessor: (r) => <span className="font-mono text-slate-400">{r.timestamp}</span> },
    { key: 'userName', header: 'User', sortable: true, accessor: (r) => <span className="font-bold text-slate-200">{r.userName}</span> },
    { key: 'userRole', header: 'Role', accessor: (r) => <Badge variant="purple">{r.userRole}</Badge> },
    { key: 'action', header: 'Action', sortable: true, accessor: (r) => <span className="font-semibold text-brand-400">{r.action}</span> },
    { key: 'resourceType', header: 'Resource Type', accessor: (r) => <span className="font-mono text-xs text-slate-400">{r.resourceType}</span> },
    { key: 'resourceName', header: 'Target Resource', accessor: (r) => <span className="text-slate-100">{r.resourceName}</span> },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-400" /> Platform Security Audit Trail
        </h1>
        <p className="text-xs text-slate-400 mt-1">Immutable audit logs tracking user actions, pipeline mutations, schema changes, and dataset exports.</p>
      </div>

      <DataGrid data={logs} columns={columns} keyField="id" title="Security Audit Log History" />
    </div>
  );
}
