// Real-time Streaming, Pub/Sub, Topics, Partitions, Consumers & Windows

import { EntityId, BaseEntity } from './domain';

export interface StreamEvent {
  id: EntityId;
  topic: string;
  partitionId: number;
  offset: number;
  key?: string;
  payload: Record<string, unknown>;
  eventTimestamp: number; // Unix Epoch MS (Event Time)
  processingTimestamp: number; // Unix Epoch MS (Processing Time)
  headers?: Record<string, string>;
}

export interface PartitionStats {
  partitionId: number;
  currentOffset: number;
  recordCount: number;
  throughputMsgPerSec: number;
  consumerLag: number;
  sizeBytes: number;
}

export interface Topic extends BaseEntity {
  projectId: EntityId;
  name: string;
  description: string;
  partitionsCount: number;
  totalEvents: number;
  throughputMsgPerSec: number;
  retentionHours: number;
  partitions: PartitionStats[];
  status: 'active' | 'paused' | 'archived';
  schemaId?: EntityId;
}

export interface ConsumerGroupMember {
  consumerId: EntityId;
  consumerName: string;
  assignedPartitions: number[];
  clientIp?: string;
}

export interface ConsumerGroup extends BaseEntity {
  projectId: EntityId;
  name: string;
  topicName: string;
  members: ConsumerGroupMember[];
  totalLag: number;
  processingRateMsgPerSec: number;
  status: 'active' | 'rebalancing' | 'stopped';
}

export interface StreamWindow {
  windowId: EntityId;
  type: 'tumbling' | 'sliding' | 'session';
  startTimeMs: number;
  endTimeMs: number;
  recordCount: number;
  aggregatedResults: Record<string, unknown>;
  isClosed: boolean;
  closedAtMs?: number;
}

export interface WatermarkState {
  currentWatermarkMs: number;
  maxEventTimeMs: number;
  allowedLatenessMs: number;
  lateEventsCount: number;
  droppedLateEventsCount: number;
}

export interface BackpressureState {
  producerRateMsgPerSec: number;
  consumerRateMsgPerSec: number;
  bufferCapacity: number;
  currentBufferUsage: number;
  bufferUsagePct: number;
  isBackpressureActive: boolean;
  droppedRecordsCount: number;
  recoveryEstimatedSec: number;
}
