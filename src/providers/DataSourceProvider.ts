// DataSourceProvider Interface

import { DataSource, DataSourceConfig, EntityId } from '../types/domain';

export interface DataSourceProvider {
  listSources(projectId: EntityId): Promise<DataSource[]>;
  getSourceById(sourceId: EntityId): Promise<DataSource | null>;
  createSource(source: Omit<DataSource, 'id' | 'createdAt' | 'updatedAt'>): Promise<DataSource>;
  updateSource(sourceId: EntityId, updates: Partial<DataSource>): Promise<DataSource>;
  deleteSource(sourceId: EntityId): Promise<boolean>;
  previewSourceRecords(sourceId: EntityId, limit?: number): Promise<Record<string, unknown>[]>;
}
