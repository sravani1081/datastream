'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useProject } from '../../../context/ProjectContext';
import { Table, Plus, Search, ShieldCheck, Download, Sparkles } from 'lucide-react';
import { INITIAL_DATASETS } from '../../../providers/local/initialData';
import { DataGrid, DataGridColumn } from '../../../components/ui/DataGrid';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';

export default function DatasetsPage() {
  const { addToast } = useProject();
  const [datasets] = useState(INITIAL_DATASETS);

  const columns: DataGridColumn<(typeof datasets)[0]>[] = [
    { key: 'name', header: 'Dataset Name', sortable: true, accessor: (r) => <span className="font-bold text-slate-100">{r.name}</span> },
    { key: 'ownerName', header: 'Owner', sortable: true },
    { key: 'recordCount', header: 'Records', sortable: true, accessor: (r) => r.recordCount.toLocaleString() },
    { key: 'qualityScorePct', header: 'Quality Score', sortable: true, accessor: (r) => <Badge variant={r.qualityScorePct >= 98 ? 'success' : 'warning'}>{r.qualityScorePct}%</Badge> },
    { key: 'freshnessMinutesAgo', header: 'Freshness', accessor: (r) => `${r.freshnessMinutesAgo} mins ago` },
    { key: 'version', header: 'Version', accessor: (r) => `v${r.version}` },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <Table className="w-5 h-5 text-brand-400" /> Dataset Catalog
          </h1>
          <p className="text-xs text-slate-400 mt-1">Managed local datasets, schemas, versioning, and quality metrics.</p>
        </div>
        <Link href="/data/explorer">
          <Button variant="primary" size="sm" icon={<Plus className="w-4 h-4" />}>
            Explore Records
          </Button>
        </Link>
      </div>

      <DataGrid data={datasets} columns={columns} keyField="id" title="Managed Datasets" />
    </div>
  );
}
