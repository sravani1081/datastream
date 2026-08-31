'use client';

import React, { useState } from 'react';
import { Settings, Save, ShieldCheck, HardDrive, Bell } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { useProject } from '../../context/ProjectContext';

export default function SettingsPage() {
  const { addToast } = useProject();
  const [retention, setRetention] = useState(30);
  const [maxThroughput, setMaxThroughput] = useState(5000);
  const [autoSave, setAutoSave] = useState(true);

  const handleSave = () => {
    addToast('Settings Saved', 'Platform environment preferences updated in local storage', 'success');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <Settings className="w-5 h-5 text-brand-400" /> Platform & Project Settings
          </h1>
          <p className="text-xs text-slate-400 mt-1">Configure local retention limits, watermark bounds, and UI preferences.</p>
        </div>
        <Button variant="primary" size="sm" icon={<Save className="w-4 h-4" />} onClick={handleSave}>
          Save Preferences
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card title="Local Storage & Stream Engine Settings">
          <div className="space-y-4 font-mono text-xs text-slate-300">
            <div>
              <span className="text-slate-400 block mb-1">Storage Retention Days ({retention} Days)</span>
              <input
                type="number"
                value={retention}
                onChange={(e) => setRetention(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-slate-200"
              />
            </div>

            <div>
              <span className="text-slate-400 block mb-1">Max Stream Throughput ({maxThroughput} msg/s)</span>
              <input
                type="number"
                value={maxThroughput}
                onChange={(e) => setMaxThroughput(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-slate-200"
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={autoSave}
                onChange={(e) => setAutoSave(e.target.checked)}
                className="rounded border-slate-800 bg-slate-950 text-brand-600"
              />
              <span>Enable Automatic DAG Auto-Save (Every 10s)</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
