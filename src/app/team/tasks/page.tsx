'use client';

import React, { useState } from 'react';
import { FolderKanban, Plus, CheckCircle2, Clock } from 'lucide-react';
import { INITIAL_TASKS } from '../../../providers/local/initialData';
import { Card } from '../../../components/ui/Card';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';

export default function TasksPage() {
  const [tasks] = useState(INITIAL_TASKS);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <FolderKanban className="w-5 h-5 text-brand-400" /> Team Task Kanban
          </h1>
          <p className="text-xs text-slate-400 mt-1">Manage data engineering tasks, pipeline assignments, and subtasks.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {['todo', 'in_progress', 'done'].map((status) => {
          const colTasks = tasks.filter((t) => t.status === status);
          return (
            <div key={status} className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-4">
              <div className="flex items-center justify-between font-mono text-xs border-b border-slate-800 pb-2">
                <span className="font-bold text-slate-200 uppercase">{status.replace('_', ' ')}</span>
                <Badge variant="info">{colTasks.length}</Badge>
              </div>

              {colTasks.map((t) => (
                <div key={t.id} className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl space-y-2 text-xs">
                  <h4 className="font-semibold text-slate-100">{t.title}</h4>
                  <p className="text-[11px] text-slate-400">{t.description}</p>
                  <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 pt-2 border-t border-slate-800/60">
                    <span>Priority: {t.priority}</span>
                    <span>Subtasks: {t.subtasks.filter((s) => s.completed).length}/{t.subtasks.length}</span>
                  </div>
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}
