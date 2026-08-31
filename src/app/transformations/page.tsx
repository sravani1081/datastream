'use client';

import React from 'react';
import { Code2, Sliders, Layers } from 'lucide-react';
import { TransformationLibrary } from '../../lib/catalog/transformLibrary';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';

export default function TransformationsPage() {
  const transforms = TransformationLibrary.getAll();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2">
          <Code2 className="w-5 h-5 text-brand-400" /> Transformation Library Catalog
        </h1>
        <p className="text-xs text-slate-400 mt-1">Built-in functional data transformation algorithms and expression functions.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {transforms.map((t) => (
          <Card key={t.id} title={t.name} subtitle={t.description} action={<Badge variant="purple">{t.category}</Badge>}>
            <div className="space-y-2 font-mono text-xs text-slate-300">
              <span className="text-[10px] text-slate-500 uppercase block">Config Parameters</span>
              <div className="flex flex-wrap gap-1">
                {t.paramsSchema.map((p) => (
                  <span key={p.name} className="px-2 py-0.5 bg-slate-950 border border-slate-800 rounded text-[10px]">
                    {p.name}: {p.type}
                  </span>
                ))}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
