'use client';

import React from 'react';
import { CheckCircle2, ShieldCheck, AlertTriangle } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { MetricCard } from '../../components/ui/MetricCard';

export default function QualityDashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" /> Data Quality Governance Dashboard
        </h1>
        <p className="text-xs text-slate-400 mt-1">Rule execution status, completeness scores, freshness SLAs, and quarantine stats.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <MetricCard title="Overall Quality Score" value="98.8%" change="+0.4%" isPositive={true} icon={<ShieldCheck className="w-5 h-5 text-emerald-400" />} />
        <MetricCard title="Passed Rules" value="14 / 14" change="100% Pass" isPositive={true} icon={<CheckCircle2 className="w-5 h-5 text-brand-400" />} />
        <MetricCard title="Quarantined Records" value="2" change="Quarantined" isPositive={true} icon={<AlertTriangle className="w-5 h-5 text-amber-400" />} />
      </div>
    </div>
  );
}
