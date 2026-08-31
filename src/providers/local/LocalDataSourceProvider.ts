// LocalDataSourceProvider Implementation

import { DataSourceProvider } from '../DataSourceProvider';
import { DataSource, EntityId } from '../../types/domain';
import { INITIAL_DATA_SOURCES } from './initialData';

const KEY = 'datastream_datasources_v1';

export class LocalDataSourceProvider implements DataSourceProvider {
  private getStorage(): DataSource[] {
    if (typeof window === 'undefined') return INITIAL_DATA_SOURCES;
    try {
      const raw = localStorage.getItem(KEY);
      return raw ? JSON.parse(raw) : INITIAL_DATA_SOURCES;
    } catch {
      return INITIAL_DATA_SOURCES;
    }
  }

  private saveStorage(sources: DataSource[]): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(KEY, JSON.stringify(sources));
    } catch (e) {
      console.warn('DataSource write failed', e);
    }
  }

  async listSources(projectId: EntityId): Promise<DataSource[]> {
    const sources = this.getStorage();
    return sources.filter((s) => s.projectId === projectId);
  }

  async getSourceById(sourceId: EntityId): Promise<DataSource | null> {
    const sources = this.getStorage();
    return sources.find((s) => s.id === sourceId) || null;
  }

  async createSource(source: Omit<DataSource, 'id' | 'createdAt' | 'updatedAt'>): Promise<DataSource> {
    const sources = this.getStorage();
    const now = new Date().toISOString();
    const newSource = {
      ...source,
      id: `src-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      createdAt: now,
      updatedAt: now,
    } as DataSource;
    sources.unshift(newSource);
    this.saveStorage(sources);
    return newSource;
  }

  async updateSource(sourceId: EntityId, updates: Partial<DataSource>): Promise<DataSource> {
    const sources = this.getStorage();
    const idx = sources.findIndex((s) => s.id === sourceId);
    if (idx === -1) throw new Error(`Source ${sourceId} not found`);

    const updated = {
      ...sources[idx],
      ...updates,
      updatedAt: new Date().toISOString(),
    } as DataSource;
    sources[idx] = updated;
    this.saveStorage(sources);
    return updated;
  }

  async deleteSource(sourceId: EntityId): Promise<boolean> {
    const sources = this.getStorage();
    const filtered = sources.filter((s) => s.id !== sourceId);
    this.saveStorage(filtered);
    return true;
  }

  async previewSourceRecords(sourceId: EntityId, limit = 10): Promise<Record<string, unknown>[]> {
    const source = await this.getSourceById(sourceId);
    if (!source) return [];

    return Array.from({ length: limit }).map((_, i) => ({
      row_id: i + 1,
      player_id: `ply_${1000 + i}`,
      event_type: i % 2 === 0 ? 'quest_complete' : 'match_end',
      timestamp: new Date(Date.now() - i * 60000).toISOString(),
      score: Math.floor(Math.random() * 500) + 100,
      duration: Math.floor(Math.random() * 1200) + 300,
      is_valid: true,
    }));
  }
}
