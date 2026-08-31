'use client';

import React from 'react';
import { Radio, Users, Activity, Layers } from 'lucide-react';
import { INITIAL_CONSUMER_GROUPS } from '../../../providers/local/initialData';
import { Card } from '../../../components/ui/Card';
import { Badge } from '../../../components/ui/Badge';

export default function ConsumersPage() {
  const groups = INITIAL_CONSUMER_GROUPS;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2">
          <Users className="w-5 h-5 text-brand-400" /> Consumer Groups & Lag
        </h1>
        <p className="text-xs text-slate-400 mt-1">Consumer group rebalancing, assigned partition offsets, and processing rates.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {groups.map((cg) => (
          <Card key={cg.id} title={cg.name} subtitle={`Target Topic: ${cg.topicName}`} action={<Badge variant="success" dot>ACTIVE</Badge>}>
            <div className="space-y-4 text-xs font-mono">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg">
                  <span className="text-[10px] text-slate-500 block">TOTAL CONSUMER LAG</span>
                  <span className="text-sm font-bold text-amber-400">{cg.totalLag} messages</span>
                </div>
                <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg">
                  <span className="text-[10px] text-slate-500 block">PROCESSING RATE</span>
                  <span className="text-sm font-bold text-emerald-400">{cg.processingRateMsgPerSec} msg/s</span>
                </div>
              </div>

              <div className="space-y-2">
                <span className="text-[10px] uppercase text-slate-500 font-bold block">Assigned Consumer Workers</span>
                {cg.members.map((m) => (
                  <div key={m.consumerId} className="p-2.5 bg-slate-950 border border-slate-800 rounded-lg flex items-center justify-between">
                    <div>
                      <span className="font-bold text-slate-200 block">{m.consumerName}</span>
                      <span className="text-[10px] text-slate-500">Partitions: [{m.assignedPartitions.join(', ')}]</span>
                    </div>
                    <Badge variant="purple">Worker Active</Badge>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
