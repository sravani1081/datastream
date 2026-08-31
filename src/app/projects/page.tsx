'use client';

import React, { useState } from 'react';
import { FolderKanban, Plus, Folder, Users, Activity, Play } from 'lucide-react';
import { useProject } from '../../context/ProjectContext';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';

export default function ProjectsPage() {
  const { projects, activeProject, setActiveProjectId, addToast } = useProject();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <FolderKanban className="w-5 h-5 text-brand-400" /> All DataStream Projects
          </h1>
          <p className="text-xs text-slate-400 mt-1">Manage data streaming workspaces, teams, pipelines, and local data persistence.</p>
        </div>
        <Button variant="primary" size="sm" icon={<Plus className="w-4 h-4" />} onClick={() => addToast('Project Created', 'Created new workspace project', 'success')}>
          Create Project
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {projects.map((p) => {
          const isActive = activeProject?.id === p.id;
          return (
            <Card
              key={p.id}
              title={p.name}
              subtitle={p.description}
              action={<Badge variant={isActive ? 'success' : 'default'} dot={isActive}>{isActive ? 'ACTIVE WORKSPACE' : 'INACTIVE'}</Badge>}
              footer={
                <div className="flex items-center justify-between font-mono text-slate-400">
                  <span>Sources: {p.stats.sourcesCount} | Pipelines: {p.stats.pipelinesCount}</span>
                  {!isActive && (
                    <Button variant="outline" size="sm" onClick={() => setActiveProjectId(p.id)}>
                      Switch to Project
                    </Button>
                  )}
                </div>
              }
            >
              <div className="space-y-3 font-mono text-xs text-slate-300">
                <div className="grid grid-cols-3 gap-2 p-3 bg-slate-950 border border-slate-800 rounded-lg">
                  <div>
                    <span className="text-[10px] text-slate-500 block">RECORDS</span>
                    <span className="font-bold text-slate-100">{p.stats.totalRecordsProcessed.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block">LATENCY</span>
                    <span className="font-bold text-brand-400">{p.stats.avgLatencyMs} ms</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block">QUALITY</span>
                    <span className="font-bold text-emerald-400">{p.stats.qualityScorePct}%</span>
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
