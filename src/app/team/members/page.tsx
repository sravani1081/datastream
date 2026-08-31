'use client';

import React from 'react';
import { Users, Plus, ShieldCheck, User } from 'lucide-react';
import { INITIAL_USERS } from '../../../providers/local/initialData';
import { Card } from '../../../components/ui/Card';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';

export default function MembersPage() {
  const users = INITIAL_USERS;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <Users className="w-5 h-5 text-brand-400" /> Team Members & RBAC Roles
          </h1>
          <p className="text-xs text-slate-400 mt-1">Data Engineers, Analytics Engineers, ML Engineers, Analysts, and Administrators.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {users.map((u) => (
          <Card key={u.id} title={u.name} subtitle={u.email} action={<Badge variant="purple">{u.role}</Badge>}>
            <div className="space-y-2 font-mono text-xs text-slate-300">
              <div className="flex justify-between">
                <span className="text-slate-400 text-[10px]">DEPARTMENT:</span>
                <span className="text-slate-200">{u.department}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 text-[10px]">STATUS:</span>
                <span className="text-emerald-400 font-bold">Active Member</span>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
