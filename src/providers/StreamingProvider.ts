// StreamingProvider Interface

import { Topic, ConsumerGroup, StreamEvent, WatermarkState, BackpressureState } from '../types/streaming';
import { EntityId } from '../types/domain';

export interface StreamingProvider {
  getTopics(projectId: EntityId): Promise<Topic[]>;
  getTopicByName(projectId: EntityId, name: string): Promise<Topic | null>;
  createTopic(topic: Omit<Topic, 'id' | 'createdAt' | 'updatedAt'>): Promise<Topic>;
  publishEvents(topicName: string, events: Omit<StreamEvent, 'id'>[]): Promise<number>;
  getConsumerGroups(projectId: EntityId): Promise<ConsumerGroup[]>;
  getWatermarkState(topicName: string): Promise<WatermarkState>;
  getBackpressureState(): Promise<BackpressureState>;
}
