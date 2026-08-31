'use client';

import React, { useState } from 'react';
import { DownloadCloud, Plus, FileText, CheckCircle2 } from 'lucide-react';
import { Card } from '../../../components/ui/Card';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import { useProject } from '../../../context/ProjectContext';

export default function ExportJobsPage() {
  const { addToast } = useProject();

  const handleExportCSV = () => {
    const sampleData = 'player_id,level,score,created_at\nply_1001,42,15400,2026-08-30\nply_1002,18,8900,2026-08-31\n';
    const blob = new Blob([sampleData], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `datastream_export_${Date.now()}.csv`;
    a.click();
    addToast('Dataset Exported', 'Downloaded CSV dataset file to local storage', 'success');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <DownloadCloud className="w-5 h-5 text-brand-400" /> Export Jobs & Backup Manager
          </h1>
          <p className="text-xs text-slate-400 mt-1">Export datasets, pipeline specs, schemas, and full project backups (CSV, JSON, NDJSON).</p>
        </div>
        <Button variant="primary" size="sm" icon={<DownloadCloud className="w-4 h-4" />} onClick={handleExportCSV}>
          Export CSV Dataset
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card title="Player Features CSV Export" subtitle="Format: CSV | Records: 14,500" action={<Badge variant="success">COMPLETED</Badge>}>
          <div className="space-y-3 font-mono text-xs text-slate-300">
            <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-400 text-[10px]">FILE SIZE:</span>
                <span className="text-brand-400 font-bold">4.2 MB</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 text-[10px]">COMPLETED AT:</span>
                <span className="text-slate-200">2026-08-31 22:00:04 UTC</span>
              </div>
            </div>
            <Button variant="secondary" size="sm" className="w-full" icon={<DownloadCloud className="w-4 h-4" />} onClick={handleExportCSV}>
              Download Exported File
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
