// Observability Engine, Cost Calculator & Alert Trigger Evaluator

import { SystemMetrics, SystemLog, AlertRule, SystemAlert, CostEstimateModel } from '../../types/observability';

export class ObservabilityEngine {
  /**
   * Calculate synthetic cost model estimates
   */
  static calculateCostEstimate(dataVolumeGB: number, activePipelinesCount: number): CostEstimateModel {
    const computeUsd = Math.round(activePipelinesCount * 45.0 * 10) / 10;
    const storageUsd = Math.round(dataVolumeGB * 0.20 * 10) / 10;
    const networkUsd = Math.round(dataVolumeGB * 2.5 * 0.05 * 10) / 10;
    const totalUsd = Math.round((computeUsd + storageUsd + networkUsd) * 10) / 10;

    return {
      syntheticMonthlyComputeUsd: computeUsd,
      syntheticMonthlyStorageUsd: storageUsd,
      syntheticMonthlyNetworkUsd: networkUsd,
      syntheticMonthlyTotalUsd: totalUsd,
      computeHoursPerMonth: activePipelinesCount * 720,
      storageGB: dataVolumeGB,
      networkGBTransferred: dataVolumeGB * 2.5,
      costBreakdownByPipeline: [
        { pipelineId: 'pipe-player-session-agg', pipelineName: 'Player Session & Churn Predictor Pipeline', estimatedCostUsd: computeUsd * 0.6, dataProcessedGB: dataVolumeGB * 0.7 },
        { pipelineId: 'pipe-financial-audit', pipelineName: 'Financial Real-Time Audit Pipeline', estimatedCostUsd: computeUsd * 0.4, dataProcessedGB: dataVolumeGB * 0.3 },
      ],
    };
  }

  /**
   * Evaluate Alert Rule thresholds against metrics
   */
  static evaluateAlertRule(rule: AlertRule, currentMetricVal: number): SystemAlert | null {
    let triggered = false;
    if (rule.operator === '>' && currentMetricVal > rule.thresholdValue) triggered = true;
    if (rule.operator === '>=' && currentMetricVal >= rule.thresholdValue) triggered = true;
    if (rule.operator === '<' && currentMetricVal < rule.thresholdValue) triggered = true;
    if (rule.operator === '<=' && currentMetricVal <= rule.thresholdValue) triggered = true;

    if (!triggered) return null;

    return {
      id: `alt-${Date.now()}`,
      projectId: rule.projectId,
      ruleId: rule.id,
      ruleName: rule.name,
      type: rule.type,
      severity: rule.severity,
      message: `Alert triggered: ${rule.metricField} (${currentMetricVal}) ${rule.operator} threshold (${rule.thresholdValue})`,
      triggeredAt: new Date().toISOString(),
      status: 'active',
      metricValue: currentMetricVal,
      thresholdValue: rule.thresholdValue,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }
}
