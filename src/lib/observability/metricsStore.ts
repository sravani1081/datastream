// Time-Series Metrics Store & Rollup Calculator

import { SystemMetrics } from '../../types/observability';

export class MetricsStore {
  private metricsHistory: SystemMetrics[] = [];

  recordMetrics(metrics: Omit<SystemMetrics, 'timestamp'>): SystemMetrics {
    const entry: SystemMetrics = {
      ...metrics,
      timestamp: new Date().toISOString(),
    };
    this.metricsHistory.unshift(entry);
    if (this.metricsHistory.length > 500) {
      this.metricsHistory.pop();
    }
    return entry;
  }

  getMetricsHistory(limit = 60): SystemMetrics[] {
    if (this.metricsHistory.length === 0) {
      // Seed default synthetic history
      const now = Date.now();
      return Array.from({ length: limit }).map((_, i) => ({
        timestamp: new Date(now - i * 60000).toISOString(),
        eventsProcessedPerSec: 250 + Math.floor(Math.sin(i) * 40),
        recordsProcessedPerSec: 250 + Math.floor(Math.sin(i) * 40),
        avgLatencyMs: 35 + Math.floor(Math.cos(i) * 10),
        p95LatencyMs: 80 + Math.floor(Math.sin(i) * 15),
        p99LatencyMs: 135 + Math.floor(Math.cos(i) * 20),
        activePipelinesCount: 3,
        failedPipelinesCount: 0,
        totalDataVolumeMB: 482.4 + i * 0.5,
        overallQualityScorePct: 98.8,
        consumerLagEvents: 30 + Math.floor(Math.sin(i) * 20),
        activeAlertsCount: 0,
      }));
    }
    return this.metricsHistory.slice(0, limit);
  }
}
