'use client';

import React, { useState } from 'react';
import { Bell, Plus, AlertTriangle, CheckCircle2, ShieldCheck, Play } from 'lucide-react';
import { INITIAL_ALERT_RULES } from '../../../providers/local/initialData';
import { Card } from '../../../components/ui/Card';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import { useProject } from '../../../context/ProjectContext';

export default function AlertsPage() {
  const { addToast } = useProject();
  const [rules] = useState(INITIAL_ALERT_RULES);

  const handleSimulateTrigger = (ruleName: string) => {
    addToast('Alert Triggered', `Triggered simulation alert for rule: ${ruleName}`, 'warning');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <Bell className="w-5 h-5 text-amber-400" /> Alert Rules & Trigger Engine
          </h1>
          <p className="text-xs text-slate-400 mt-1">Configure threshold rules for latency, quality breach, consumer lag, and backpressure.</p>
        </div>
        <Button variant="primary" size="sm" icon={<Plus className="w-4 h-4" />} onClick={() => addToast('Alert Created', 'Added new system alert rule', 'success')}>
          Create Alert Rule
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {rules.map((r) => (
          <Card
            key={r.id}
            title={r.name}
            subtitle={r.description}
            action={<Badge variant={r.enabled ? 'success' : 'default'}>{r.enabled ? 'ENABLED' : 'DISABLED'}</Badge>}
            footer={
              <div className="flex items-center justify-between">
                <span className="font-mono text-slate-400 text-xs">Severity: {r.severity.toUpperCase()}</span>
                <Button variant="outline" size="sm" icon={<Play className="w-3.5 h-3.5" />} onClick={() => handleSimulateTrigger(r.name)}>
                  Test Trigger
                </Button>
              </div>
            }
          >
            <div className="space-y-3 font-mono text-xs text-slate-300">
              <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-400 text-[10px]">ALERT TYPE:</span>
                  <span className="text-amber-400 font-bold">{r.type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 text-[10px]">CONDITION THRESHOLD:</span>
                  <span className="text-slate-100 font-bold">{r.metricField} {r.operator} {r.thresholdValue}</span>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
