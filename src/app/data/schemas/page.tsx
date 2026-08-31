'use client';

import React, { useState } from 'react';
import { CheckCircle2, GitBranch, AlertTriangle, ShieldCheck, Plus } from 'lucide-react';
import { INITIAL_SCHEMAS } from '../../../providers/local/initialData';
import { Card } from '../../../components/ui/Card';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';

export default function SchemasPage() {
  const [schemas] = useState(INITIAL_SCHEMAS);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-brand-400" /> Schema Registry & Evolution Detector
          </h1>
          <p className="text-xs text-slate-400 mt-1">Schema definitions, field types, constraints, and backward compatibility checks.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {schemas.map((sch) => (
          <Card
            key={sch.id}
            title={sch.name}
            subtitle={sch.description}
            action={<Badge variant="success">Mode: {sch.compatibilityMode}</Badge>}
          >
            <div className="space-y-4 text-xs font-mono">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span>Version History: v{sch.currentVersion}</span>
                <span className="text-emerald-400">Evolution Status: COMPATIBLE</span>
              </div>

              <div className="space-y-1.5">
                <span className="text-[10px] text-slate-500 uppercase block">Schema Fields</span>
                {sch.fields.map((f) => (
                  <div key={f.name} className="p-2 bg-slate-950 border border-slate-800 rounded flex items-center justify-between">
                    <span className="text-slate-200 font-bold">{f.name}</span>
                    <Badge variant="purple">{f.type}</Badge>
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
