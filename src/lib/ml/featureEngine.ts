// ML Feature Engineering & ML Dataset Builder Engine

import { MLFeature, MLDataset, MLDatasetConfig } from '../../types/ml';

export class MLFeatureEngine {
  /**
   * Calculate rolling & aggregated ML features for player cohort dataset
   */
  static extractFeatures(records: Record<string, unknown>[]): Record<string, unknown>[] {
    return records.map((r) => {
      const dur = Number(r.avg_duration_sec || r.duration_seconds || 300);
      const sess = Number(r.session_count || 1);
      const score = Number(r.score || 100);

      return {
        ...r,
        // Rolling features
        sessions_7d: sess,
        sessions_30d: sess * 4,
        avg_session_duration_7d: dur,
        total_score_30d: score * 4,
        // Ratio feature
        score_per_minute: Number((score / (dur / 60)).toFixed(2)),
        // Categorical engagement tier
        engagement_tier: sess > 20 ? 'High' : sess > 5 ? 'Medium' : 'Low',
        // Target label for churn prediction model
        is_churned: sess < 3,
      };
    });
  }

  /**
   * Split dataset into Train and Test subsets by ratio (e.g. 80/20)
   */
  static createMLDataset(
    name: string,
    description: string,
    records: Record<string, unknown>[],
    config: MLDatasetConfig
  ): { dataset: MLDataset; trainRows: Record<string, unknown>[]; testRows: Record<string, unknown>[] } {
    const total = records.length;
    const trainCount = Math.floor(total * (config.trainSplitPct / 100));
    const trainRows = records.slice(0, trainCount);
    const testRows = records.slice(trainCount);

    const featureCols = Object.keys(records[0] || {}).filter((k) => k !== config.labelColumn);

    const dataset: MLDataset = {
      id: `mlds-${Date.now()}`,
      projectId: 'proj-nexus-game',
      name,
      description,
      version: 1,
      config,
      totalRecords: total,
      trainRecordsCount: trainRows.length,
      testRecordsCount: testRows.length,
      featureColumns: featureCols,
      labelColumn: config.labelColumn,
      status: 'ready',
      sampleData: records.slice(0, 5),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return { dataset, trainRows, testRows };
  }
}
