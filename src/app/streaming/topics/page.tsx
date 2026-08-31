'use client';

import React, { useState } from 'react';
import { useProject } from '../../../context/ProjectContext';
import { Radio, Plus, Layers, Database } from 'lucide-react';
import { INITIAL_TOPICS } from '../../../providers/local/initialData';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { Badge } from '../../../components/ui/Badge';

export default function TopicsPage() {
  const { addToast } = useProject();
  const [topics] = useState(INITIAL_TOPICS);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <Radio className="w-5 h-5 text-brand-400" /> Pub/Sub Topic Management
          </h1>
          <p className="text-xs text-slate-400 mt-1">Manage event streaming topics, partitions, and message retention policy.</p>
        </div>
        <Button variant="primary" size="sm" icon={<Plus className="w-4 h-4" />} onClick={() => addToast('Topic Created', 'Created new local topic match-events', 'success')}>
          Create Topic
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {topics.map((t) => (
          <Card
            key={t.id}
            title={t.name}
            subtitle={t.description}
            action={<Badge variant="success" dot>ACTIVE</Badge>}
            footer={
              <div className="flex items-center justify-between font-mono text-slate-400">
                <span>Retention: {t.retentionHours} Hours</span>
                <span>Partitions: {t.partitionsCount}</span>
              </div>
            }
          >
            <div className="grid grid-cols-2 gap-3 text-xs font-mono">
              <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg">
                <span className="text-[10px] text-slate-500 block">TOTAL EVENTS</span>
                <span className="text-sm font-bold text-slate-100">{t.totalEvents.toLocaleString()}</span>
              </div>
              <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg">
                <span className="text-[10px] text-slate-500 block">THROUGHPUT</span>
                <span className="text-sm font-bold text-emerald-400">{t.throughputMsgPerSec} msg/s</span>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
