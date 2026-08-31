'use client';

import React, { useState } from 'react';
import { BookOpen, Search, Zap, Layers, Workflow, Radio, ShieldCheck, Code2, BrainCircuit, Activity } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';

const DOC_TOPICS = [
  { id: 'getting-started', title: '1. Getting Started', desc: 'Overview of DataStream local-first architecture, 100% credential-free design, and quick start guide.' },
  { id: 'architecture', title: '2. Local-First Architecture', desc: 'Provider abstraction pattern (DataSourceProvider, StorageProvider, StreamingProvider) with IndexedDB & LocalStorage.' },
  { id: 'streaming', title: '3. Streaming Engine & Simulators', desc: 'Pub/Sub topics, partitions, consumer group lag simulation, tumbling/sliding/session windows, and event-time watermarks.' },
  { id: 'pipeline-builder', title: '4. Visual Pipeline Builder & DAG Execution', desc: '20+ visual node executors, topological DAG planner, cycle detection, and local execution engine.' },
  { id: 'governance', title: '5. Schema Registry & Evolution', desc: 'Detecting compatible, warning, and breaking schema changes with strict Data Contract SLAs.' },
  { id: 'quality', title: '6. Data Quality & Quarantines', desc: 'Completeness, uniqueness, null checks, range rules, quality score computation, and rejected record inspection.' },
  { id: 'sql-ml', title: '7. Controlled SQL & ML Feature Store', desc: 'Safe AST SQL parser (SELECT, WHERE, GROUP BY, LIMIT), 7d/30d rolling feature store, and ML dataset 80/20 train/test splitter.' },
  { id: 'observability', title: '8. Observability & Compliance', desc: 'Log explorer, alert triggers, synthetic cost simulator, compliance checker script, and audit logging.' },
];

export default function DocumentationPage() {
  const [selectedTopic, setSelectedTopic] = useState('getting-started');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-brand-400" /> DataStream Platform Documentation & Architecture Guide
        </h1>
        <p className="text-xs text-slate-400 mt-1">Comprehensive guides, design patterns, API interfaces, and operation manuals.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-2">
          <span className="text-[10px] font-mono font-bold uppercase text-slate-500 block mb-2">Documentation Sitemap</span>
          {DOC_TOPICS.map((topic) => (
            <button
              key={topic.id}
              onClick={() => setSelectedTopic(topic.id)}
              className={`w-full text-left p-3 rounded-lg border transition-colors ${
                selectedTopic === topic.id
                  ? 'bg-brand-950/80 border-brand-800 text-brand-300 font-semibold'
                  : 'bg-slate-950/50 border-slate-800 text-slate-300 hover:bg-slate-800'
              }`}
            >
              <h4 className="text-xs">{topic.title}</h4>
              <p className="text-[10px] text-slate-400 mt-0.5">{topic.desc}</p>
            </button>
          ))}
        </div>

        <div className="lg:col-span-8">
          <Card title="Documentation Detail" subtitle="Technical specs and operational instructions">
            <div className="prose prose-invert max-w-none text-xs text-slate-300 space-y-4">
              <h3 className="text-sm font-bold text-slate-100">DataStream Architectural Standard</h3>
              <p>
                DataStream is built as a zero-dependency, local-first data engineering IDE and pipeline orchestrator.
                It requires zero external cloud keys (no OpenAI, AWS, Supabase, or Redis credentials) and zero `.env` environment files.
              </p>

              <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl font-mono text-[11px] space-y-2 text-slate-200">
                <div className="text-brand-400 font-bold">// Execution Pipeline Architecture</div>
                <div>Visual Node Canvas → Topological DAG Planner → Node Executors → Data Quality Gate → Dataset Sink</div>
              </div>

              <h4 className="text-xs font-bold text-slate-200">Key Features Checklist</h4>
              <ul className="list-disc pl-5 space-y-1">
                <li>Local-First Storage Provider Abstraction (LocalStorage & IndexedDB)</li>
                <li>Real-Time In-Memory Streaming Topics, Partitions, and Consumer Lag</li>
                <li>Interactive 20-Node Type DAG Builder & Topological Execution Engine</li>
                <li>Data Quality Engine with Rule Checks & Quarantined Rejected Records</li>
                <li>Interactive SVG Dataset & Column Lineage Graph with Impact Analysis</li>
                <li>Controlled AST SQL Parser (SELECT, WHERE, GROUP BY, LIMIT)</li>
                <li>Deterministic Synthetic Game Telemetry Generator (Players, Sessions, Economy)</li>
                <li>Feature Store & 80/20 Train/Test ML Dataset Splitter</li>
                <li>Automated Compliance Checker (`npm run compliance`)</li>
              </ul>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
