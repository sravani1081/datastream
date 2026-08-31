// Full Local Pipeline Execution Engine

import { Pipeline, PipelineRun, NodeExecutionResult } from '../../types/pipeline';
import { DAGPlanner } from './dagPlanner';
import { NodeExecutors } from './executors';

export interface EngineExecutionOutput {
  run: PipelineRun;
  finalOutputRecords: Record<string, unknown>[];
}

export class PipelineEngine {
  /**
   * Runs complete local execution of a pipeline definition
   */
  static async runPipeline(pipeline: Pipeline, triggeredBy: PipelineRun['triggeredBy'] = 'manual'): Promise<EngineExecutionOutput> {
    const startTime = Date.now();
    const runId = `run-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const startedAt = new Date().toISOString();

    const plan = DAGPlanner.planExecution(pipeline.nodes, pipeline.edges);

    if (!plan.isValid) {
      const failedRun: PipelineRun = {
        id: runId,
        pipelineId: pipeline.id,
        pipelineName: pipeline.name,
        pipelineVersion: pipeline.currentVersion,
        projectId: pipeline.projectId,
        status: 'Failed',
        startedAt,
        endedAt: new Date().toISOString(),
        durationMs: Date.now() - startTime,
        totalRecordsProcessed: 0,
        totalRecordsDropped: 0,
        throughputRecPerSec: 0,
        errorLog: plan.errors,
        nodeResults: {},
        triggeredBy,
        createdAt: startedAt,
        updatedAt: new Date().toISOString(),
      };
      return { run: failedRun, finalOutputRecords: [] };
    }

    const nodeOutputs = new Map<string, Record<string, unknown>[]>();
    const nodeResults: Record<string, NodeExecutionResult> = {};
    let totalProcessed = 0;
    let totalDropped = 0;
    const errorLogs: string[] = [];

    // Execute in topological order
    for (const node of plan.executionOrder) {
      const nodeStart = Date.now();

      // Gather inputs from parent nodes via incoming edges
      const parentEdges = pipeline.edges.filter((e) => e.targetNodeId === node.id);
      let inputRecords: Record<string, unknown>[] = [];

      if (parentEdges.length > 0) {
        parentEdges.forEach((edge) => {
          const parentData = nodeOutputs.get(edge.sourceNodeId) || [];
          inputRecords = [...inputRecords, ...parentData];
        });
      }

      // Execute node logic
      const execResult = NodeExecutors.executeNode(node, inputRecords);
      const nodeDuration = Date.now() - nodeStart;

      nodeOutputs.set(node.id, execResult.recordsOut);
      totalProcessed += execResult.recordsOut.length;
      totalDropped += execResult.recordsDropped;

      if (execResult.errorMessage) {
        errorLogs.push(`Node [${node.label}] error: ${execResult.errorMessage}`);
      }

      nodeResults[node.id] = {
        nodeId: node.id,
        nodeLabel: node.label,
        status: execResult.errorMessage ? 'failed' : 'succeeded',
        recordsProcessed: execResult.recordsOut.length,
        recordsDropped: execResult.recordsDropped,
        durationMs: nodeDuration,
        errorMessage: execResult.errorMessage,
        sampleOutput: execResult.recordsOut.slice(0, 5),
      };
    }

    const endTime = Date.now();
    const durationMs = Math.max(endTime - startTime, 1);
    const throughput = Math.round((totalProcessed / (durationMs / 1000)) * 10) / 10;

    // Get final output node records
    const outputNodes = pipeline.nodes.filter((n) => n.type === 'Output');
    let finalOutputRecords: Record<string, unknown>[] = [];

    if (outputNodes.length > 0) {
      outputNodes.forEach((outNode) => {
        finalOutputRecords = [...finalOutputRecords, ...(nodeOutputs.get(outNode.id) || [])];
      });
    } else if (plan.executionOrder.length > 0) {
      const lastNode = plan.executionOrder[plan.executionOrder.length - 1];
      finalOutputRecords = nodeOutputs.get(lastNode.id) || [];
    }

    const run: PipelineRun = {
      id: runId,
      pipelineId: pipeline.id,
      pipelineName: pipeline.name,
      pipelineVersion: pipeline.currentVersion,
      projectId: pipeline.projectId,
      status: errorLogs.length > 0 ? 'Failed' : 'Succeeded',
      startedAt,
      endedAt: new Date().toISOString(),
      durationMs,
      totalRecordsProcessed: totalProcessed,
      totalRecordsDropped: totalDropped,
      throughputRecPerSec: throughput,
      errorLog: errorLogs,
      nodeResults,
      triggeredBy,
      createdAt: startedAt,
      updatedAt: new Date().toISOString(),
    };

    return { run, finalOutputRecords };
  }
}
