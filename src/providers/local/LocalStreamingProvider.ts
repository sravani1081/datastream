// LocalStreamingProvider Implementation

import { StreamingProvider } from '../StreamingProvider';
import { Topic, ConsumerGroup, StreamEvent, WatermarkState, BackpressureState } from '../../types/streaming';
import { EntityId } from '../../types/domain';
import { INITIAL_TOPICS, INITIAL_CONSUMER_GROUPS } from './initialData';

const TOPIC_KEY = 'datastream_topics_v1';
const CG_KEY = 'datastream_consumer_groups_v1';

export class LocalStreamingProvider implements StreamingProvider {
  private getTopicsRaw(): Topic[] {
    if (typeof window === 'undefined') return INITIAL_TOPICS;
    try {
      const raw = localStorage.getItem(TOPIC_KEY);
      return raw ? JSON.parse(raw) : INITIAL_TOPICS;
    } catch {
      return INITIAL_TOPICS;
    }
  }

  private saveTopicsRaw(topics: Topic[]): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(TOPIC_KEY, JSON.stringify(topics));
    } catch (e) {
      console.warn('Topics write failed', e);
    }
  }

  async getTopics(projectId: EntityId): Promise<Topic[]> {
    const topics = this.getTopicsRaw();
    return topics.filter((t) => t.projectId === projectId);
  }

  async getTopicByName(projectId: EntityId, name: string): Promise<Topic | null> {
    const topics = await this.getTopics(projectId);
    return topics.find((t) => t.name === name) || null;
  }

  async createTopic(topic: Omit<Topic, 'id' | 'createdAt' | 'updatedAt'>): Promise<Topic> {
    const topics = this.getTopicsRaw();
    const now = new Date().toISOString();
    const newTopic: Topic = {
      ...topic,
      id: `top-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      createdAt: now,
      updatedAt: now,
    };
    topics.unshift(newTopic);
    this.saveTopicsRaw(topics);
    return newTopic;
  }

  async publishEvents(topicName: string, events: Omit<StreamEvent, 'id'>[]): Promise<number> {
    const topics = this.getTopicsRaw();
    const idx = topics.findIndex((t) => t.name === topicName);
    if (idx !== -1) {
      topics[idx].totalEvents += events.length;
      topics[idx].updatedAt = new Date().toISOString();
      this.saveTopicsRaw(topics);
    }
    return events.length;
  }

  async getConsumerGroups(projectId: EntityId): Promise<ConsumerGroup[]> {
    if (typeof window === 'undefined') return INITIAL_CONSUMER_GROUPS;
    try {
      const raw = localStorage.getItem(CG_KEY);
      const groups: ConsumerGroup[] = raw ? JSON.parse(raw) : INITIAL_CONSUMER_GROUPS;
      return groups.filter((g) => g.projectId === projectId);
    } catch {
      return INITIAL_CONSUMER_GROUPS;
    }
  }

  async getWatermarkState(topicName: string): Promise<WatermarkState> {
    const now = Date.now();
    return {
      currentWatermarkMs: now - 5000,
      maxEventTimeMs: now,
      allowedLatenessMs: 10000,
      lateEventsCount: 14,
      droppedLateEventsCount: 2,
    };
  }

  async getBackpressureState(): Promise<BackpressureState> {
    return {
      producerRateMsgPerSec: 250,
      consumerRateMsgPerSec: 240,
      bufferCapacity: 10000,
      currentBufferUsage: 1420,
      bufferUsagePct: 14.2,
      isBackpressureActive: false,
      droppedRecordsCount: 0,
      recoveryEstimatedSec: 0,
    };
  }
}
