// AnalyticsProvider, MonitoringProvider, ExportProvider & SchedulerProvider Interfaces

import { SystemMetrics, SystemLog, AlertRule, SystemAlert, CostEstimateModel, ExportJob } from '../types/observability';
import { JobSchedule, BatchWorkerState } from '../types/ml';
import { EntityId } from '../types/domain';

export interface AnalyticsProvider {
  getMetrics(projectId?: EntityId): Promise<SystemMetrics>;
  getCostEstimate(projectId?: EntityId): Promise<CostEstimateModel>;
}

export interface MonitoringProvider {
  getLogs(filter?: {
    projectId?: EntityId;
    pipelineId?: EntityId;
    severity?: string;
    search?: string;
    limit?: number;
  }): Promise<SystemLog[]>;
  logSystemEvent(log: Omit<SystemLog, 'id' | 'createdAt' | 'updatedAt'>): Promise<SystemLog>;

  getAlertRules(projectId?: EntityId): Promise<AlertRule[]>;
  saveAlertRule(rule: AlertRule): Promise<AlertRule>;
  getSystemAlerts(projectId?: EntityId): Promise<SystemAlert[]>;
  resolveAlert(alertId: EntityId, resolvedBy: string): Promise<boolean>;
}

export interface ExportProvider {
  getExportJobs(projectId?: EntityId): Promise<ExportJob[]>;
  createExportJob(job: Omit<ExportJob, 'id' | 'createdAt' | 'updatedAt'>): Promise<ExportJob>;
  executeExport(jobId: EntityId): Promise<string>; // Returns formatted string content
}

export interface SchedulerProvider {
  getSchedules(projectId?: EntityId): Promise<JobSchedule[]>;
  saveSchedule(schedule: JobSchedule): Promise<JobSchedule>;
  toggleSchedule(scheduleId: EntityId, enabled: boolean): Promise<boolean>;
  getBatchWorkers(): Promise<BatchWorkerState[]>;
}
