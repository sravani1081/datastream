// Visual Pipeline Builder & Execution Engine Types

import { EntityId, BaseEntity } from './domain';

export type NodeType =
  | 'Source'
  | 'Stream'
  | 'Batch Input'
  | 'Filter'
  | 'Map'
  | 'Transform'
  | 'Join'
  | 'Aggregate'
  | 'Window'
  | 'Deduplicate'
  | 'Sort'
  | 'Sample'
  | 'Validate'
  | 'Enrich'
  | 'Split'
  | 'Merge'
  | 'Feature'
  | 'Quality Check'
  | 'Output';

export interface NodePosition {
  x: number;
  y: number;
}

export interface PipelineNodeConfig {
  filterExpression?: string;
  filterField?: string;
  filterOperator?: '==' | '!=' | '>' | '>=' | '<' | '<=' | 'contains' | 'regex' | 'in';
  filterValue?: string | number | boolean;
  mapScript?: string;
  transformFieldMap?: Record<string, string>;
  castRules?: Record<string, 'string' | 'number' | 'boolean' | 'date'>;
  calculatedFields?: Array<{ name: string; expression: string }>;
  groupByFields?: string[];
  aggregations?: Array<{
    field: string;
    op: 'count' | 'sum' | 'avg' | 'min' | 'max' | 'p50' | 'p90' | 'p99';
    alias: string;
  }>;
  windowType?: 'tumbling' | 'sliding' | 'session';
  windowSizeSeconds?: number;
  slideSizeSeconds?: number;
  sessionGapSeconds?: number;
  timestampField?: string;
  joinType?: 'inner' | 'left' | 'right' | 'full';
  leftKey?: string;
  rightKey?: string;
  rightSourceId?: EntityId;
  dedupKeys?: string[];
  dedupKeep?: 'first' | 'last';
  sortField?: string;
  sortDirection?: 'asc' | 'desc';
  sampleRateFraction?: number;
  sampleSeed?: number;
  validationRulesId?: EntityId;
  rejectAction?: 'drop' | 'quarantine' | 'alert';
  enrichLookupTableId?: EntityId;
  enrichJoinKey?: string;
  enrichFieldsToInclude?: string[];
  outputDatasetId?: EntityId;
  outputTopicId?: EntityId;
  outputFormat?: 'CSV' | 'JSON' | 'NDJSON' | 'Stream';
}

export interface PipelineNode {
  id: EntityId;
  type: NodeType;
  label: string;
  position: NodePosition;
  config: PipelineNodeConfig;
  inputs: EntityId[];
  outputs: EntityId[];
  status?: 'idle' | 'running' | 'completed' | 'error';
  executionMetrics?: {
    recordsIn: number;
    recordsOut: number;
    recordsDropped: number;
    processingTimeMs: number;
    lastRecordTimestamp?: string;
  };
}

export interface PipelineEdge {
  id: EntityId;
  sourceNodeId: EntityId;
  targetNodeId: EntityId;
  sourceHandle?: string;
  targetHandle?: string;
  label?: string;
  recordCountTransferred?: number;
}

export type PipelineStatus = 'draft' | 'published' | 'running' | 'paused' | 'failed' | 'archived';

export interface PipelineParameter {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'date';
  defaultValue: string;
  description?: string;
}

export interface PipelineVersion {
  versionNumber: number;
  publishedAt: string;
  authorId: EntityId;
  nodes: PipelineNode[];
  edges: PipelineEdge[];
  changeDescription: string;
}

export interface Pipeline extends BaseEntity {
  projectId: EntityId;
  name: string;
  description: string;
  status: PipelineStatus;
  currentVersion: number;
  nodes: PipelineNode[];
  edges: PipelineEdge[];
  parameters: PipelineParameter[];
  versions: PipelineVersion[];
  lastRunId?: EntityId;
  lastRunStatus?: PipelineRunStatus;
  lastRunAt?: string;
  tags: string[];
  scheduleCron?: string;
}

export type PipelineRunStatus = 'Queued' | 'Running' | 'Succeeded' | 'Failed' | 'Cancelled';

export interface NodeExecutionResult {
  nodeId: EntityId;
  nodeLabel: string;
  status: 'succeeded' | 'failed' | 'skipped';
  recordsProcessed: number;
  recordsDropped: number;
  durationMs: number;
  errorMessage?: string;
  sampleOutput?: Record<string, unknown>[];
}

export interface PipelineRun extends BaseEntity {
  pipelineId: EntityId;
  pipelineName: string;
  pipelineVersion: number;
  projectId: EntityId;
  status: PipelineRunStatus;
  startedAt: string;
  endedAt?: string;
  durationMs?: number;
  totalRecordsProcessed: number;
  totalRecordsDropped: number;
  throughputRecPerSec: number;
  errorLog?: string[];
  nodeResults: Record<EntityId, NodeExecutionResult>;
  outputDatasetId?: EntityId;
  triggeredBy: 'manual' | 'scheduler' | 'event' | 'api';
}
