'use client';

import React, { useState, useEffect } from 'react';
import { useProject } from '../../../context/ProjectContext';
import { Radio, Play, Pause, RotateCcw, Zap, Activity, AlertTriangle, Layers, Clock } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { Badge } from '../../../components/ui/Badge';
import { MetricCard } from '../../../components/ui/MetricCard';

export default function LiveStreamPage() {
  const { addToast } = useProject();
  const [isRunning, setIsRunning] = useState(true);
  const [eventRate, setEventRate] = useState(250);
  const [consumerRate, setConsumerRate] = useState(240);
  const [totalProcessed, setTotalProcessed] = useState(1420900);
  const [queueSize, setQueueSize] = useState(142);
  const [latencyMs, setLatencyMs] = useState(38);

  useEffect(() => {
    if (!isRunning) return;
    const interval = setInterval(() => {
      setTotalProcessed((prev) => prev + Math.floor(eventRate / 2));
      const diff = eventRate - consumerRate;
      setQueueSize((prev) => Math.max(0, prev + diff / 2));
      setLatencyMs(35 + Math.floor(Math.random() * 10));
    }, 1000);
    return () => clearInterval(interval);
  }, [isRunning, eventRate, consumerRate]);

  const handleReset = () => {
    setQueueSize(0);
    addToast('Simulator Reset', 'Cleared local queue and reset offsets', 'info');
  };

  const isBackpressureActive = queueSize > 1000;

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2">
              <Radio className="w-5 h-5 text-emerald-400 animate-pulse" /> Live Stream Engine Simulator
            </h1>
            <Badge variant={isRunning ? 'success' : 'warning'} dot={isRunning}>
              {isRunning ? 'STREAMING ACTIVE' : 'PAUSED'}
            </Badge>
          </div>
          <p className="text-xs text-slate-400 mt-1">In-memory topic event queue, partition balancer, and watermark generator.</p>
        </div>

        <div className="flex items-center gap-2">
          {isRunning ? (
            <Button variant="outline" size="sm" icon={<Pause className="w-4 h-4" />} onClick={() => setIsRunning(false)}>
              Pause Stream
            </Button>
          ) : (
            <Button variant="success" size="sm" icon={<Play className="w-4 h-4" />} onClick={() => setIsRunning(true)}>
              Resume Stream
            </Button>
          )}
          <Button variant="secondary" size="sm" icon={<RotateCcw className="w-4 h-4" />} onClick={handleReset}>
            Reset Queue
          </Button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard title="Inbound Event Rate" value={`${eventRate} msg/s`} change="Target Rate" isPositive={true} icon={<Zap className="w-5 h-5 text-emerald-400" />} />
        <MetricCard title="Consumer Processing Rate" value={`${consumerRate} msg/s`} change="2 Consumers" isPositive={true} icon={<Activity className="w-5 h-5 text-brand-400" />} />
        <MetricCard title="Queue Buffer Size" value={`${Math.round(queueSize)} msg`} change={isBackpressureActive ? 'BACKPRESSURE' : 'Normal'} isPositive={!isBackpressureActive} icon={<Layers className="w-5 h-5 text-amber-400" />} />
        <MetricCard title="Processing Latency" value={`${latencyMs} ms`} change="P95: 82ms" isPositive={true} icon={<Clock className="w-5 h-5 text-purple-400" />} />
      </div>

      {/* Interactive Backpressure Simulator Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Rate & Backpressure Control Panel" subtitle="Adjust producer and consumer throughput dynamically">
          <div className="space-y-5 text-xs text-slate-300">
            <div>
              <div className="flex justify-between mb-1.5 font-mono">
                <span>Producer Rate (Inbound)</span>
                <span className="font-bold text-emerald-400">{eventRate} msg/s</span>
              </div>
              <input
                type="range"
                min={50}
                max={2000}
                step={50}
                value={eventRate}
                onChange={(e) => setEventRate(Number(e.target.value))}
                className="w-full h-2 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
            </div>

            <div>
              <div className="flex justify-between mb-1.5 font-mono">
                <span>Consumer Rate (Drain Rate)</span>
                <span className="font-bold text-brand-400">{consumerRate} msg/s</span>
              </div>
              <input
                type="range"
                min={50}
                max={2000}
                step={50}
                value={consumerRate}
                onChange={(e) => setConsumerRate(Number(e.target.value))}
                className="w-full h-2 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-brand-500"
              />
            </div>

            <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono text-slate-400">Backpressure Indicator</span>
                <Badge variant={isBackpressureActive ? 'danger' : 'success'}>
                  {isBackpressureActive ? 'BACKPRESSURE ACTIVE' : 'NORMAL BUFFER'}
                </Badge>
              </div>
              <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all ${
                    isBackpressureActive ? 'bg-rose-500 animate-pulse' : 'bg-brand-500'
                  }`}
                  style={{ width: `${Math.min(100, (queueSize / 1000) * 100)}%` }}
                />
              </div>
            </div>
          </div>
        </Card>

        <Card title="Partition Lag Distribution" subtitle="Offset tracking across active partitions">
          <div className="space-y-3 font-mono text-xs">
            {[0, 1, 2, 3].map((pId) => (
              <div key={pId} className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Badge variant="purple">P-{pId}</Badge>
                  <div>
                    <span className="text-slate-200 font-bold">partition_{pId}</span>
                    <span className="block text-[10px] text-slate-500">Offset: {355225 + pId * 100}</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-slate-300 font-bold">Lag: {Math.floor(queueSize / 4)} msg</span>
                  <span className="block text-[10px] text-emerald-400">{(eventRate / 4).toFixed(1)} msg/s</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
