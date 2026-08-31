// Local Analytics, Monitoring, Export & Scheduler Implementations

import { AnalyticsProvider, MonitoringProvider, ExportProvider, SchedulerProvider } from '../ProviderInterfaces';
import { SystemMetrics, SystemLog, AlertRule, SystemAlert, CostEstimateModel, ExportJob } from '../../types/observability';
import { JobSchedule, BatchWorkerState } from '../../types/ml';
import { EntityId } from '../../types/domain';
import { INITIAL_ALERT_RULES } from './initialData';

export class LocalAnalyticsProvider implements AnalyticsProvider {
  async getMetrics(projectId?: EntityId): Promise<SystemMetrics> {
    return {
      timestamp: new Date().toISOString(),
      eventsProcessedPerSec: 295,
      recordsProcessedPerSec: 295,
      avgLatencyMs: 38,
      p95LatencyMs: 82,
      p99LatencyMs: 140,
      activePipelinesCount: 3,
      failedPipelinesCount: 0,
      totalDataVolumeMB: 482.4,
      overallQualityScorePct: 98.8,
      consumerLagEvents: 42,
      activeAlertsCount: 0,
    };
  }

  async getCostEstimate(projectId?: EntityId): Promise<CostEstimateModel> {
    return {
      syntheticMonthlyComputeUsd: 142.5,
      syntheticMonthlyStorageUsd: 28.4,
      syntheticMonthlyNetworkUsd: 18.1,
      syntheticMonthlyTotalUsd: 189.0,
      computeHoursPerMonth: 720,
      storageGB: 142,
      networkGBTransferred: 360,
      costBreakdownByPipeline: [
        { pipelineId: 'pipe-player-session-agg', pipelineName: 'Player Session & Churn Predictor Pipeline', estimatedCostUsd: 112.0, dataProcessedGB: 95 },
        { pipelineId: 'pipe-financial-audit', pipelineName: 'Financial Real-Time Audit Pipeline', estimatedCostUsd: 77.0, dataProcessedGB: 47 },
      ],
    };
  }
}

export class LocalMonitoringProvider implements MonitoringProvider {
  private logsKey = 'datastream_logs_v1';
  private alertRulesKey = 'datastream_alert_rules_v1';
  private alertsKey = 'datastream_alerts_v1';

  async getLogs(filter?: { projectId?: EntityId; pipelineId?: EntityId; severity?: string; search?: string; limit?: number }): Promise<SystemLog[]> {
    const defaultLogs: SystemLog[] = Array.from({ length: 25 }).map((_, i) => ({
      id: `log-${i + 1}`,
      projectId: 'proj-nexus-game',
      pipelineId: 'pipe-player-session-agg',
      pipelineName: 'Player Session & Churn Predictor Pipeline',
      severity: i % 10 === 0 ? 'ERROR' : i % 5 === 0 ? 'WARN' : 'INFO',
      source: i % 3 === 0 ? 'stream' : 'pipeline',
      message: i % 10 === 0 ? 'High watermark delay detected in partition 2' : `Processed micro-batch #${1000 - i} (${Math.floor(Math.random() * 200) + 50} recs)`,
      timestamp: new Date(Date.now() - i * 45000).toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }));

    let logs = defaultLogs;
    if (filter?.severity && filter.severity !== 'ALL') {
      logs = logs.filter((l) => l.severity === filter.severity);
    }
    if (filter?.search) {
      const q = filter.search.toLowerCase();
      logs = logs.filter((l) => l.message.toLowerCase().includes(q) || l.source.includes(q));
    }
    return logs.slice(0, filter?.limit || 100);
  }

  async logSystemEvent(log: Omit<SystemLog, 'id' | 'createdAt' | 'updatedAt'>): Promise<SystemLog> {
    const now = new Date().toISOString();
    return {
      ...log,
      id: `log-${Date.now()}`,
      createdAt: now,
      updatedAt: now,
    };
  }

  async getAlertRules(projectId?: EntityId): Promise<AlertRule[]> {
    return INITIAL_ALERT_RULES;
  }

  async saveAlertRule(rule: AlertRule): Promise<AlertRule> {
    return rule;
  }

  async getSystemAlerts(projectId?: EntityId): Promise<SystemAlert[]> {
    return [];
  }

  async resolveAlert(alertId: EntityId, resolvedBy: string): Promise<boolean> {
    return true;
  }
}

export class LocalExportProvider implements ExportProvider {
  async getExportJobs(projectId?: EntityId): Promise<ExportJob[]> {
    return [
      {
        id: 'exp-1',
        projectId: 'proj-nexus-game',
        name: 'Player Features CSV Export',
        targetType: 'dataset',
        format: 'CSV',
        status: 'completed',
        fileSizeBytes: 4200000,
        recordCount: 14500,
        startedAt: '2026-08-31T22:00:00Z',
        completedAt: '2026-08-31T22:00:04Z',
        createdAt: '2026-08-31T22:00:00Z',
        updatedAt: '2026-08-31T22:00:04Z',
      },
    ];
  }

  async createExportJob(job: Omit<ExportJob, 'id' | 'createdAt' | 'updatedAt'>): Promise<ExportJob> {
    const now = new Date().toISOString();
    return {
      ...job,
      id: `exp-${Date.now()}`,
      status: 'completed',
      startedAt: now,
      completedAt: now,
      createdAt: now,
      updatedAt: now,
    };
  }

  async executeExport(jobId: EntityId): Promise<string> {
    return 'player_id,session_count,avg_duration,total_score\nply_1001,42,420,15400\nply_1002,18,310,8900\n';
  }
}

export class LocalSchedulerProvider implements SchedulerProvider {
  async getSchedules(projectId?: EntityId): Promise<JobSchedule[]> {
    return [
      {
        id: 'sch-1',
        projectId: 'proj-nexus-game',
        name: 'Hourly Player Feature Recalculation',
        pipelineId: 'pipe-player-session-agg',
        pipelineName: 'Player Session & Churn Predictor Pipeline',
        cronExpression: '0 * * * *',
        scheduleType: 'Hourly',
        enabled: true,
        lastRunAt: '2026-08-31T23:00:00Z',
        lastRunStatus: 'Succeeded',
        nextRunAt: '2026-09-01T00:00:00Z',
        totalRunsCount: 142,
        createdAt: '2026-02-10T10:00:00Z',
        updatedAt: '2026-08-31T23:00:00Z',
      },
    ];
  }

  async saveSchedule(schedule: JobSchedule): Promise<JobSchedule> {
    return schedule;
  }

  async toggleSchedule(scheduleId: EntityId, enabled: boolean): Promise<boolean> {
    return true;
  }

  async getBatchWorkers(): Promise<BatchWorkerState[]> {
    return [
      { workerId: 'worker-node-1', status: 'busy', currentJobName: 'Hourly Player Feature Recalculation', recordsProcessed: 14500, processingRateRecPerSec: 1200, uptimeSeconds: 84000 },
      { workerId: 'worker-node-2', status: 'idle', recordsProcessed: 89000, processingRateRecPerSec: 0, uptimeSeconds: 84000 },
    ];
  }
}
