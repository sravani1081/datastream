// ML Feature Engineering, ML Datasets, SQL Engine & Scheduler Types

import { EntityId, BaseEntity } from './domain';
import { DataType } from './quality';

export interface SQLQueryResult {
  columns: Array<{ name: string; type: DataType }>;
  rows: Record<string, unknown>[];
  totalCount: number;
  executionTimeMs: number;
  parsedAST?: Record<string, unknown>;
  query: string;
}

export type FeatureType =
  | 'Numerical'
  | 'Categorical'
  | 'Rolling'
  | 'Lag'
  | 'Aggregated'
  | 'Ratio'
  | 'Time-based';

export interface MLFeature extends BaseEntity {
  projectId: EntityId;
  name: string;
  featureSetId: EntityId;
  type: FeatureType;
  description: string;
  sourceDatasetId: EntityId;
  sourceColumn: string;
  transformationExpression: string; // e.g. "SUM(duration) OVER (PARTITION BY player_id ORDER BY timestamp RANGE BETWEEN 7 PRECEDING AND CURRENT ROW)"
  dataType: DataType;
  sampleValues: (string | number)[];
  freshnessMinutesAgo: number;
}

export interface MLFeatureSet extends BaseEntity {
  projectId: EntityId;
  name: string;
  description: string;
  entityKey: string; // e.g. "player_id"
  featureCount: number;
  features: MLFeature[];
  lastUpdated: string;
}

export interface MLDatasetConfig {
  sourceFeatureSetIds: EntityId[];
  labelColumn: string;
  entityKey: string;
  trainSplitPct: number; // e.g. 80 for 80/20 train/test split
  seed?: number;
  filterCondition?: string;
  sampleSize?: number;
}

export interface MLDataset extends BaseEntity {
  projectId: EntityId;
  name: string;
  description: string;
  version: number;
  config: MLDatasetConfig;
  totalRecords: number;
  trainRecordsCount: number;
  testRecordsCount: number;
  featureColumns: string[];
  labelColumn: string;
  status: 'ready' | 'building' | 'failed';
  sampleData?: Record<string, unknown>[];
  exportUrl?: string;
}

export interface JobSchedule extends BaseEntity {
  projectId: EntityId;
  name: string;
  pipelineId: EntityId;
  pipelineName: string;
  cronExpression: string; // e.g. "0 * * * *" or "hourly", "daily"
  scheduleType: 'Manual' | 'Hourly' | 'Daily' | 'Weekly' | 'Event Trigger';
  enabled: boolean;
  lastRunAt?: string;
  lastRunStatus?: 'Succeeded' | 'Failed';
  nextRunAt: string;
  totalRunsCount: number;
}

export interface BatchWorkerState {
  workerId: string;
  status: 'idle' | 'busy' | 'offline';
  currentJobId?: EntityId;
  currentJobName?: string;
  recordsProcessed: number;
  processingRateRecPerSec: number;
  uptimeSeconds: number;
}
