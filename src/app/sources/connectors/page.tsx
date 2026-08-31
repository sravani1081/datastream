'use client';

import React from 'react';
import { Database, Zap, Layers, Radio } from 'lucide-react';
import { StreamConnectorManager } from '../../../lib/catalog/streamConnectors';
import { Card } from '../../../components/ui/Card';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';

export default function ConnectorsPage() {
  const connectors = StreamConnectorManager.getConnectors();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2">
          <Database className="w-5 h-5 text-brand-400" /> Stream Connectors & Protocol Registry
        </h1>
        <p className="text-xs text-slate-400 mt-1">Native stream protocol connectors for Kafka, Pulsar, RabbitMQ, MQTT, Kinesis, CDC, and WebSockets.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {connectors.map((c) => (
          <Card key={c.id} title={c.name} subtitle={c.description} action={<Badge variant="purple">{c.category}</Badge>}>
            <div className="space-y-3 font-mono text-xs text-slate-300">
              <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-400 text-[10px]">PROTOCOL & PORT:</span>
                  <span className="text-brand-400 font-bold">{c.protocol} (Port {c.defaultPort})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 text-[10px]">MAX THROUGHPUT:</span>
                  <span className="text-emerald-400 font-bold">{c.capabilities.maxThroughputMsgSec.toLocaleString()} msg/s</span>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
