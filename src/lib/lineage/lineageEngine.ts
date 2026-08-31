// Lineage Graph Generator & Impact Analysis Engine

import { LineageNode, LineageEdge, ImpactAnalysisResult } from '../../types/quality';

export class LineageEngine {
  static getSampleGraph(): { nodes: LineageNode[]; edges: LineageEdge[] } {
    const nodes: LineageNode[] = [
      { id: 'n-src', name: 'Game Client Live Telemetry', type: 'source', recordCount: 840200 },
      { id: 'n-pipe', name: 'Player Session Pipeline', type: 'pipeline', status: 'running' },
      { id: 'n-ds1', name: 'Raw Telemetry Events', type: 'dataset', recordCount: 840200 },
      { id: 'n-ds2', name: 'Aggregated Player Features (7D)', type: 'dataset', recordCount: 14500 },
      { id: 'n-feat', name: 'Player Churn Feature Set', type: 'feature', recordCount: 14500 },
      { id: 'n-ml', name: 'Player Churn ML Dataset v1', type: 'ml_dataset', recordCount: 11600 },
    ];

    const edges: LineageEdge[] = [
      { id: 'e-1', sourceId: 'n-src', targetId: 'n-ds1', transformationType: 'Ingestion' },
      { id: 'e-2', sourceId: 'n-ds1', targetId: 'n-pipe', transformationType: 'Stream Consumer' },
      { id: 'e-3', sourceId: 'n-pipe', targetId: 'n-ds2', transformationType: '5m Tumbling Window Agg' },
      { id: 'e-4', sourceId: 'n-ds2', targetId: 'n-feat', transformationType: 'Feature Extraction' },
      { id: 'e-5', sourceId: 'n-feat', targetId: 'n-ml', transformationType: '80/20 Train/Test Split' },
    ];

    return { nodes, edges };
  }

  static analyzeImpact(targetEntityId: string, targetName: string): ImpactAnalysisResult {
    return {
      targetEntityId,
      targetEntityName: targetName,
      targetType: 'schema_field',
      affectedPipelines: [
        { id: 'pipe-player-session-agg', name: 'Player Session & Churn Predictor Pipeline', risk: 'high' },
      ],
      affectedDatasets: [
        { id: 'ds-player-features', name: 'Aggregated Player Features (7D)', risk: 'medium' },
      ],
      affectedFeatures: [
        { id: 'feat-churn', name: 'avg_session_duration_7d', risk: 'high' },
      ],
      affectedReports: [
        { name: 'Daily Active Players Cohort Report', risk: 'medium' },
        { name: 'VIP Retention Executive Dashboard', risk: 'low' },
      ],
      totalImpactedCount: 5,
    };
  }
}
