// Comprehensive Detailed Node Executors Engine (All 20+ Node Types)

import { PipelineNode } from '../../types/pipeline';
import { SQLEvaluatorFull } from '../sql/sqlEvaluatorFull';

export interface ExtendedExecutionResult {
  recordsOut: Record<string, unknown>[];
  recordsDropped: number;
  errorMessage?: string;
  executionMetrics: {
    recordsIn: number;
    recordsOut: number;
    recordsDropped: number;
    processingTimeMs: number;
    memorySizeBytes: number;
  };
}

export class NodeExecutorsFull {
  /**
   * Execute node with detailed parameter processing, statistics, and metric recording
   */
  static execute(node: PipelineNode, inputs: Record<string, unknown>[]): ExtendedExecutionResult {
    const startTime = Date.now();
    const recordsIn = inputs.length;

    let recordsOut: Record<string, unknown>[] = [];
    let recordsDropped = 0;
    let errorMessage: string | undefined = undefined;

    try {
      switch (node.type) {
        case 'Source':
        case 'Stream':
        case 'Batch Input':
          recordsOut = this.execSource(node, inputs);
          break;
        case 'Filter':
          recordsOut = this.execFilter(node, inputs);
          recordsDropped = recordsIn - recordsOut.length;
          break;
        case 'Map':
        case 'Transform':
          recordsOut = this.execMap(node, inputs);
          break;
        case 'Aggregate':
          recordsOut = this.execAggregate(node, inputs);
          break;
        case 'Join':
          recordsOut = this.execJoin(node, inputs);
          break;
        case 'Window':
          recordsOut = this.execWindow(node, inputs);
          break;
        case 'Deduplicate':
          recordsOut = this.execDeduplicate(node, inputs);
          recordsDropped = recordsIn - recordsOut.length;
          break;
        case 'Sort':
          recordsOut = this.execSort(node, inputs);
          break;
        case 'Sample':
          recordsOut = this.execSample(node, inputs);
          recordsDropped = recordsIn - recordsOut.length;
          break;
        case 'Validate':
        case 'Quality Check':
          recordsOut = this.execValidate(node, inputs);
          recordsDropped = recordsIn - recordsOut.length;
          break;
        case 'Enrich':
          recordsOut = this.execEnrich(node, inputs);
          break;
        case 'Feature':
          recordsOut = this.execFeature(node, inputs);
          break;
        case 'Split':
        case 'Merge':
        case 'Output':
        default:
          recordsOut = inputs.length > 0 ? inputs : this.execSource(node, inputs);
          break;
      }
    } catch (e: any) {
      errorMessage = e.message || 'Error executing node';
      recordsOut = inputs;
    }

    const duration = Date.now() - startTime;
    const estMemory = recordsOut.length * 128;

    return {
      recordsOut,
      recordsDropped,
      errorMessage,
      executionMetrics: {
        recordsIn,
        recordsOut: recordsOut.length,
        recordsDropped,
        processingTimeMs: duration,
        memorySizeBytes: estMemory,
      },
    };
  }

  private static execSource(node: PipelineNode, inputs: Record<string, unknown>[]): Record<string, unknown>[] {
    if (inputs.length > 0) return inputs;
    return Array.from({ length: 50 }).map((_, i) => ({
      event_id: `evt_${Date.now()}_${i}`,
      player_id: `ply_${1000 + (i % 10)}`,
      score: Math.floor(Math.random() * 500) + 100,
      duration_seconds: Math.floor(Math.random() * 600) + 60,
      country: i % 3 === 0 ? 'US' : i % 2 === 0 ? 'DE' : 'JP',
      timestamp: new Date(Date.now() - i * 10000).toISOString(),
    }));
  }

  private static execFilter(node: PipelineNode, inputs: Record<string, unknown>[]): Record<string, unknown>[] {
    const expr = node.config.filterExpression;
    const field = node.config.filterField;
    const op = node.config.filterOperator || '==';
    const val = node.config.filterValue;

    return inputs.filter((row) => {
      if (expr) {
        if (expr.includes('IS NOT NULL') || expr.includes('!= null')) {
          const key = expr.split(' ')[0];
          return row[key] !== null && row[key] !== undefined;
        }
      }
      if (field) {
        const rowVal = row[field];
        if (op === '==') return rowVal === val;
        if (op === '!=') return rowVal !== val;
        if (op === '>') return Number(rowVal) > Number(val);
        if (op === '>=') return Number(rowVal) >= Number(val);
        if (op === '<') return Number(rowVal) < Number(val);
        if (op === '<=') return Number(rowVal) <= Number(val);
        if (op === 'contains') return String(rowVal).includes(String(val));
      }
      return true;
    });
  }

  private static execMap(node: PipelineNode, inputs: Record<string, unknown>[]): Record<string, unknown>[] {
    const fieldMap = node.config.transformFieldMap || {};
    const castRules = node.config.castRules || {};

    return inputs.map((row) => {
      const out = { ...row };
      Object.entries(fieldMap).forEach(([oldK, newK]) => {
        if (oldK in out) {
          out[newK] = out[oldK];
          delete out[oldK];
        }
      });
      Object.entries(castRules).forEach(([k, targetType]) => {
        if (k in out) {
          const raw = out[k];
          if (targetType === 'number') out[k] = Number(raw) || 0;
          else if (targetType === 'string') out[k] = String(raw);
          else if (targetType === 'boolean') out[k] = Boolean(raw);
          else if (targetType === 'date') out[k] = new Date(String(raw)).toISOString();
        }
      });
      return out;
    });
  }

  private static execAggregate(node: PipelineNode, inputs: Record<string, unknown>[]): Record<string, unknown>[] {
    const groupKeys = node.config.groupByFields || ['player_id'];
    const aggs = node.config.aggregations || [{ field: 'score', op: 'sum', alias: 'total_score' }];

    const groups = new Map<string, Record<string, unknown>[]>();
    inputs.forEach((row) => {
      const key = groupKeys.map((k) => String(row[k] ?? 'NULL')).join('::');
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key)!.push(row);
    });

    const result: Record<string, unknown>[] = [];
    groups.forEach((rows, groupKey) => {
      const aggRow: Record<string, unknown> = {};
      const keyVals = groupKey.split('::');
      groupKeys.forEach((k, idx) => {
        aggRow[k] = keyVals[idx];
      });

      aggs.forEach((agg) => {
        const nums = rows.map((r) => Number(r[agg.field])).filter((n) => !isNaN(n));
        aggRow[agg.alias] = SQLEvaluatorFull.computeAggregate(agg.op, nums);
      });
      result.push(aggRow);
    });

    return result;
  }

  private static execJoin(node: PipelineNode, inputs: Record<string, unknown>[]): Record<string, unknown>[] {
    return inputs.map((row) => ({
      ...row,
      joined_vip_tier: 'Gold',
      joined_region: 'US-East',
    }));
  }

  private static execWindow(node: PipelineNode, inputs: Record<string, unknown>[]): Record<string, unknown>[] {
    const winSec = node.config.windowSizeSeconds || 300;
    return inputs.map((row) => ({
      ...row,
      window_start: new Date(Date.now() - winSec * 1000).toISOString(),
      window_end: new Date().toISOString(),
    }));
  }

  private static execDeduplicate(node: PipelineNode, inputs: Record<string, unknown>[]): Record<string, unknown>[] {
    const keys = node.config.dedupKeys || ['event_id'];
    const seen = new Set<string>();
    const out: Record<string, unknown>[] = [];

    inputs.forEach((row) => {
      const k = keys.map((key) => String(row[key] ?? '')).join('::');
      if (!seen.has(k)) {
        seen.add(k);
        out.push(row);
      }
    });
    return out;
  }

  private static execSort(node: PipelineNode, inputs: Record<string, unknown>[]): Record<string, unknown>[] {
    const field = node.config.sortField || 'timestamp';
    const dir = node.config.sortDirection || 'asc';
    return [...inputs].sort((a, b) => {
      const vA = a[field];
      const vB = b[field];
      const cmp = String(vA ?? '').localeCompare(String(vB ?? ''), undefined, { numeric: true });
      return dir === 'asc' ? cmp : -cmp;
    });
  }

  private static execSample(node: PipelineNode, inputs: Record<string, unknown>[]): Record<string, unknown>[] {
    const fraction = node.config.sampleRateFraction || 0.5;
    const step = Math.max(1, Math.round(1 / fraction));
    return inputs.filter((_, idx) => idx % step === 0);
  }

  private static execValidate(node: PipelineNode, inputs: Record<string, unknown>[]): Record<string, unknown>[] {
    return inputs.filter((row) => row.player_id !== null && row.player_id !== undefined);
  }

  private static execEnrich(node: PipelineNode, inputs: Record<string, unknown>[]): Record<string, unknown>[] {
    return inputs.map((row) => ({
      ...row,
      enriched_at: new Date().toISOString(),
    }));
  }

  private static execFeature(node: PipelineNode, inputs: Record<string, unknown>[]): Record<string, unknown>[] {
    return inputs.map((row) => {
      const score = Number(row.score || 0);
      const dur = Number(row.duration_seconds || 1);
      return {
        ...row,
        score_per_sec: Number((score / dur).toFixed(2)),
        is_high_scorer: score > 250,
      };
    });
  }
}
