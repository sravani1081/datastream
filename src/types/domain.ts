// DataStream Core Domain Types

export type EntityId = string;

export interface BaseEntity extends Record<string, unknown> {
  id: EntityId;
  createdAt: string;
  updatedAt: string;
}

export interface User extends BaseEntity {
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  department: string;
  status: 'active' | 'inactive';
}

export type UserRole =
  | 'Data Engineer'
  | 'Analytics Engineer'
  | 'ML Engineer'
  | 'Data Scientist'
  | 'Game Analyst'
  | 'Platform Engineer'
  | 'Administrator'
  | 'Viewer';

export interface Team extends BaseEntity {
  name: string;
  description: string;
  members: TeamMember[];
  projectCount: number;
}

export interface TeamMember {
  userId: EntityId;
  role: UserRole;
  joinedAt: string;
}

export interface Project extends BaseEntity {
  name: string;
  slug: string;
  description: string;
  ownerId: EntityId;
  teamId?: EntityId;
  status: 'active' | 'archived' | 'draft';
  tags: string[];
  settings: ProjectSettings;
  stats: ProjectStats;
}

export interface ProjectSettings {
  defaultStorageRetentionDays: number;
  enableQualityAlerts: boolean;
  maxStreamThroughputMsgPerSec: number;
  watermarkLatenessMs: number;
  autoSaveIntervalMs: number;
}

export interface ProjectStats {
  sourcesCount: number;
  pipelinesCount: number;
  datasetsCount: number;
  activeJobsCount: number;
  totalRecordsProcessed: number;
  avgLatencyMs: number;
  qualityScorePct: number;
}

export type DataSourceType =
  | 'CSV'
  | 'JSON'
  | 'NDJSON'
  | 'Local Database Simulation'
  | 'Synthetic Generator'
  | 'Game Telemetry'
  | 'Log Generator'
  | 'Event Generator'
  | 'Batch Dataset'
  | 'Stream Generator';

export type DataSourceStatus = 'active' | 'paused' | 'ingesting' | 'error' | 'idle';

export interface DataSourceConfig {
  filePath?: string;
  rawContent?: string;
  generatorSeed?: number;
  eventRatePerSec?: number;
  batchSize?: number;
  autoSchemaDetect?: boolean;
  dateFormat?: string;
  delimiter?: string;
  hasHeader?: boolean;
}

export interface DataSource extends BaseEntity {
  projectId: EntityId;
  name: string;
  type: DataSourceType;
  status: DataSourceStatus;
  description: string;
  config: DataSourceConfig;
  schemaId?: EntityId;
  recordCount: number;
  lastIngestedAt?: string;
  eventRate: number; // events/sec
  bytesSize: number;
}

export interface AuditEvent extends BaseEntity {
  userId: EntityId;
  userName: string;
  userRole: UserRole;
  action: string;
  resourceType: string;
  resourceId: EntityId;
  resourceName: string;
  previousState?: Record<string, unknown>;
  newState?: Record<string, unknown>;
  timestamp: string;
  ipAddress?: string;
}

export interface TaskItem extends BaseEntity {
  projectId: EntityId;
  title: string;
  description: string;
  assigneeId?: EntityId;
  creatorId: EntityId;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'todo' | 'in_progress' | 'review' | 'done';
  dueDate?: string;
  pipelineId?: EntityId;
  datasetId?: EntityId;
  subtasks: Subtask[];
  labels: string[];
}

export interface Subtask {
  id: EntityId;
  title: string;
  completed: boolean;
}
