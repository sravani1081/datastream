// Observability, Metrics, Logs, Alerts, Cost Simulator & Export Types

import { EntityId, BaseEntity } from './domain';

export type LogSeverity = 'TRACE' | 'DEBUG' | 'INFO' | 'WARN' | 'ERROR' | 'FATAL';

export interface SystemLog extends BaseEntity {
  projectId: EntityId;
  pipelineId?: EntityId;
  pipelineName?: string;
  runId?: EntityId;
  nodeId?: EntityId;
  severity: LogSeverity;
  source: 'pipeline' | 'node' | 'stream' | 'validation' | 'scheduler' | 'system';
  message: string;
  timestamp: string;
  details?: Record<string, unknown>;
}

export type AlertType =
  | 'Pipeline Failure'
  | 'High Latency'
  | 'Low Throughput'
  | 'Data Freshness Breach'
  | 'Quality Below Threshold'
  | 'Schema Change'
  | 'Contract Violation'
  | 'Consumer Lag'
  | 'Backpressure';

export interface AlertRule extends BaseEntity {
  projectId: EntityId;
  name: string;
  type: AlertType;
  description: string;
  pipelineId?: EntityId;
  datasetId?: EntityId;
  metricField: string;
  operator: '>' | '>=' | '<' | '<=' | '==';
  thresholdValue: number;
  evaluationWindowMinutes: number;
  severity: 'low' | 'medium' | 'high' | 'critical';
  enabled: boolean;
  notificationChannels: string[]; // e.g. ["Local Desktop Toast", "Audit Log", "System Alert Center"]
  lastTriggeredAt?: string;
}

export interface SystemAlert extends BaseEntity {
  projectId: EntityId;
  ruleId: EntityId;
  ruleName: string;
  type: AlertType;
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  triggeredAt: string;
  status: 'active' | 'acknowledged' | 'resolved';
  resolvedAt?: string;
  resolvedBy?: string;
  metricValue: number;
  thresholdValue: number;
}

export interface SystemMetrics {
  timestamp: string;
  eventsProcessedPerSec: number;
  recordsProcessedPerSec: number;
  avgLatencyMs: number;
  p95LatencyMs: number;
  p99LatencyMs: number;
  activePipelinesCount: number;
  failedPipelinesCount: number;
  totalDataVolumeMB: number;
  overallQualityScorePct: number;
  consumerLagEvents: number;
  activeAlertsCount: number;
}

export interface CostEstimateModel {
  syntheticMonthlyComputeUsd: number;
  syntheticMonthlyStorageUsd: number;
  syntheticMonthlyNetworkUsd: number;
  syntheticMonthlyTotalUsd: number;
  computeHoursPerMonth: number;
  storageGB: number;
  networkGBTransferred: number;
  costBreakdownByPipeline: Array<{
    pipelineId: EntityId;
    pipelineName: string;
    estimatedCostUsd: number;
    dataProcessedGB: number;
  }>;
}

export interface ExportJob extends BaseEntity {
  projectId: EntityId;
  name: string;
  targetType: 'dataset' | 'pipeline_metadata' | 'schema' | 'project_full';
  targetId?: EntityId;
  format: 'CSV' | 'JSON' | 'NDJSON';
  status: 'queued' | 'processing' | 'completed' | 'failed';
  downloadUrl?: string;
  fileSizeBytes?: number;
  recordCount?: number;
  startedAt: string;
  completedAt?: string;
}
