// Schemas, Data Quality, Contracts, Profiling & Lineage Types

import { EntityId, BaseEntity } from './domain';

export type DataType =
  | 'String'
  | 'Integer'
  | 'Float'
  | 'Boolean'
  | 'Date'
  | 'Datetime'
  | 'Array'
  | 'Object';

export interface SchemaConstraint {
  required?: boolean;
  nullable?: boolean;
  min?: number;
  max?: number;
  minLength?: number;
  maxLength?: number;
  regexPattern?: string;
  allowedValues?: (string | number)[];
}

export interface SchemaField {
  name: string;
  type: DataType;
  description?: string;
  constraint?: SchemaConstraint;
  isPrimaryKey?: boolean;
}

export interface SchemaVersion {
  versionNumber: number;
  createdAt: string;
  author: string;
  fields: SchemaField[];
  compatibility: 'Compatible' | 'Warning' | 'Breaking';
  changeNotes: string;
}

export interface SchemaRegistryEntry extends BaseEntity {
  projectId: EntityId;
  name: string;
  description: string;
  currentVersion: number;
  fields: SchemaField[];
  versions: SchemaVersion[];
  compatibilityMode: 'BACKWARD' | 'FORWARD' | 'FULL' | 'NONE';
}

export interface DatasetColumn {
  name: string;
  type: DataType;
  nullable: boolean;
  description?: string;
  sampleValues?: string[];
}

export interface DatasetProfile {
  rowCount: number;
  totalSizeBytes: number;
  columnStats: Record<
    string,
    {
      nullCount: number;
      nullPct: number;
      distinctCount: number;
      min?: number | string;
      max?: number | string;
      avg?: number;
      p50?: number;
      p90?: number;
      p99?: number;
      topValues?: Array<{ value: string; count: number }>;
    }
  >;
  lastProfiledAt: string;
}

export interface Dataset extends BaseEntity {
  projectId: EntityId;
  name: string;
  description: string;
  ownerId: EntityId;
  ownerName: string;
  schemaId?: EntityId;
  columns: DatasetColumn[];
  recordCount: number;
  sizeBytes: number;
  qualityScorePct: number;
  freshnessMinutesAgo: number;
  version: number;
  sourcePipelineId?: EntityId;
  tags: string[];
  sampleData?: Record<string, unknown>[];
  profile?: DatasetProfile;
}

export interface ValidationRule {
  id: EntityId;
  name: string;
  description: string;
  field: string;
  type:
    | 'not_null'
    | 'min_value'
    | 'max_value'
    | 'range'
    | 'regex'
    | 'unique'
    | 'allowed_values'
    | 'custom_sql';
  params: Record<string, unknown>;
  severity: 'error' | 'warning' | 'info';
}

export interface QualityCheckSuite extends BaseEntity {
  projectId: EntityId;
  name: string;
  targetDatasetId: EntityId;
  rules: ValidationRule[];
  minAcceptableScorePct: number;
}

export interface QualityCheckResult extends BaseEntity {
  suiteId: EntityId;
  suiteName: string;
  datasetId: EntityId;
  datasetName: string;
  executedAt: string;
  totalRecordsScanned: number;
  passedRecords: number;
  failedRecords: number;
  overallScorePct: number;
  ruleResults: Array<{
    ruleId: EntityId;
    ruleName: string;
    field: string;
    passedCount: number;
    failedCount: number;
    passPct: number;
    status: 'PASS' | 'WARN' | 'FAIL';
  }>;
}

export interface RejectedRecord extends BaseEntity {
  projectId: EntityId;
  pipelineId?: EntityId;
  pipelineName?: string;
  nodeId?: EntityId;
  nodeName?: string;
  datasetId?: EntityId;
  rawPayload: Record<string, unknown>;
  failedField: string;
  errorMessage: string;
  ruleName: string;
  rejectedAt: string;
}

export interface DataContract extends BaseEntity {
  projectId: EntityId;
  name: string;
  datasetId: EntityId;
  datasetName: string;
  ownerName: string;
  slaMaxLatencyMinutes: number;
  minQualityScorePct: number;
  maxNullPct: number;
  schemaId: EntityId;
  status: 'compliant' | 'warning' | 'breached';
  lastCheckedAt: string;
  activeViolationsCount: number;
}

export interface LineageNode {
  id: EntityId;
  name: string;
  type: 'source' | 'pipeline' | 'dataset' | 'feature' | 'ml_dataset';
  description?: string;
  recordCount?: number;
  status?: string;
}

export interface LineageEdge {
  id: EntityId;
  sourceId: EntityId;
  targetId: EntityId;
  transformationType?: string;
  transferredColumns?: string[];
}

export interface ColumnLineage {
  targetColumn: string;
  targetDataset: string;
  sourceColumns: Array<{
    dataset: string;
    column: string;
    transformation: string;
  }>;
}

export interface ImpactAnalysisResult {
  targetEntityId: EntityId;
  targetEntityName: string;
  targetType: 'schema_field' | 'dataset' | 'pipeline';
  affectedPipelines: Array<{ id: EntityId; name: string; risk: 'low' | 'medium' | 'high' }>;
  affectedDatasets: Array<{ id: EntityId; name: string; risk: 'low' | 'medium' | 'high' }>;
  affectedFeatures: Array<{ id: EntityId; name: string; risk: 'low' | 'medium' | 'high' }>;
  affectedReports: Array<{ name: string; risk: 'low' | 'medium' | 'high' }>;
  totalImpactedCount: number;
}
