'use client';

import React, { useState } from 'react';
import { Database, Plus, Radio, FileText } from 'lucide-react';
import { INITIAL_DATA_SOURCES } from '../../providers/local/initialData';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';

export default function DataSourcesPage() {
  const [sources] = useState(INITIAL_DATA_SOURCES);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <Database className="w-5 h-5 text-brand-400" /> Active Data Sources
          </h1>
          <p className="text-xs text-slate-400 mt-1">Configured inbound CSV, JSON, NDJSON, Game Telemetry, and Stream sources.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {sources.map((s) => (
          <Card key={s.id} title={s.name} subtitle={s.description} action={<Badge variant="success" dot>ACTIVE</Badge>}>
            <div className="space-y-3 font-mono text-xs text-slate-300">
              <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-400 text-[10px]">SOURCE TYPE:</span>
                  <span className="text-brand-400 font-bold">{s.type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 text-[10px]">EVENT RATE:</span>
                  <span className="text-emerald-400 font-bold">{s.eventRate} events/s</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 text-[10px]">RECORD COUNT:</span>
                  <span>{s.recordCount.toLocaleString()} recs</span>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
