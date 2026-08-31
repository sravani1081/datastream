'use client';

import React from 'react';
import { Layers, Radio, Activity } from 'lucide-react';
import { INITIAL_TOPICS } from '../../../providers/local/initialData';
import { DataGrid, DataGridColumn } from '../../../components/ui/DataGrid';
import { Badge } from '../../../components/ui/Badge';

export default function PartitionsPage() {
  const topic = INITIAL_TOPICS[0];
  const partitionRows = topic.partitions.map((p) => ({
    id: `P-${p.partitionId}`,
    partitionId: p.partitionId,
    currentOffset: p.currentOffset,
    recordCount: p.recordCount,
    throughputMsgPerSec: p.throughputMsgPerSec,
    consumerLag: p.consumerLag,
    sizeMB: (p.sizeBytes / 1024 / 1024).toFixed(1),
  }));

  const columns: DataGridColumn<(typeof partitionRows)[0]>[] = [
    { key: 'id', header: 'Partition ID', sortable: true },
    { key: 'currentOffset', header: 'Current Offset', sortable: true, accessor: (r) => r.currentOffset.toLocaleString() },
    { key: 'recordCount', header: 'Record Count', sortable: true, accessor: (r) => r.recordCount.toLocaleString() },
    { key: 'throughputMsgPerSec', header: 'Throughput', accessor: (r) => `${r.throughputMsgPerSec} msg/s` },
    { key: 'consumerLag', header: 'Consumer Lag', accessor: (r) => <Badge variant={r.consumerLag > 10 ? 'warning' : 'success'}>{r.consumerLag} msg</Badge> },
    { key: 'sizeMB', header: 'Size (MB)', accessor: (r) => `${r.sizeMB} MB` },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2">
          <Layers className="w-5 h-5 text-brand-400" /> Topic Partition Inspector
        </h1>
        <p className="text-xs text-slate-400 mt-1">Offset watermarks, message count distribution, and partition consumer lag for topic: {topic.name}</p>
      </div>

      <DataGrid data={partitionRows} columns={columns} keyField="id" title="Partition Offsets & Metrics" />
    </div>
  );
}
