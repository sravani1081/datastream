// Node Executors for Pipeline DAG Processing

import { PipelineNode } from '../../types/pipeline';

export interface ExecutorResult {
  recordsOut: Record<string, unknown>[];
  recordsDropped: number;
  errorMessage?: string;
}

export class NodeExecutors {
  static executeNode(
    node: PipelineNode,
    inputRecords: Record<string, unknown>[]
  ): ExecutorResult {
    switch (node.type) {
      case 'Source':
      case 'Stream':
      case 'Batch Input':
        return this.executeSource(node, inputRecords);

      case 'Filter':
        return this.executeFilter(node, inputRecords);

      case 'Map':
      case 'Transform':
        return this.executeMap(node, inputRecords);

      case 'Aggregate':
        return this.executeAggregate(node, inputRecords);

      case 'Join':
        return this.executeJoin(node, inputRecords);

      case 'Window':
        return this.executeWindow(node, inputRecords);

      case 'Deduplicate':
        return this.executeDeduplicate(node, inputRecords);

      case 'Sort':
        return this.executeSort(node, inputRecords);

      case 'Sample':
        return this.executeSample(node, inputRecords);

      case 'Validate':
      case 'Quality Check':
        return this.executeValidate(node, inputRecords);

      case 'Enrich':
        return this.executeEnrich(node, inputRecords);

      case 'Split':
      case 'Merge':
      case 'Feature':
      case 'Output':
      default:
        return { recordsOut: inputRecords, recordsDropped: 0 };
    }
  }

  private static executeSource(node: PipelineNode, inputs: Record<string, unknown>[]): ExecutorResult {
    if (inputs.length > 0) return { recordsOut: inputs, recordsDropped: 0 };
    // Generate synthetic initial input if empty
    const mock = Array.from({ length: 100 }).map((_, i) => ({
      event_id: `evt_${Date.now()}_${i}`,
      player_id: `ply_${(i % 15) + 100}`,
      session_id: `sess_${(i % 5) + 10}`,
      event_name: i % 4 === 0 ? 'quest_complete' : i % 3 === 0 ? 'level_up' : 'match_end',
      score: Math.floor(Math.random() * 500) + 50,
      duration_seconds: Math.floor(Math.random() * 600) + 60,
      timestamp: new Date(Date.now() - i * 15000).toISOString(),
    }));
    return { recordsOut: mock, recordsDropped: 0 };
  }

  private static executeFilter(node: PipelineNode, inputs: Record<string, unknown>[]): ExecutorResult {
    const expr = node.config.filterExpression || '';
    const field = node.config.filterField;
    const op = node.config.filterOperator || '==';
    const val = node.config.filterValue;

    const filtered = inputs.filter((row) => {
      if (expr) {
        // Safe evaluation of basic filter expression
        if (expr.includes('!= null') || expr.includes('IS NOT NULL')) {
          const target = expr.split(' ')[0];
          return row[target] !== null && row[target] !== undefined;
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

    return {
      recordsOut: filtered,
      recordsDropped: inputs.length - filtered.length,
    };
  }

  private static executeMap(node: PipelineNode, inputs: Record<string, unknown>[]): ExecutorResult {
    const fieldMap = node.config.transformFieldMap || {};
    const castRules = node.config.castRules || {};

    const mapped = inputs.map((row) => {
      const newRow: Record<string, unknown> = { ...row };

      // Apply field renaming
      Object.entries(fieldMap).forEach(([oldKey, newKey]) => {
        if (oldKey in newRow) {
          newRow[newKey] = newRow[oldKey];
          delete newRow[oldKey];
        }
      });

      // Apply type casting
      Object.entries(castRules).forEach(([key, targetType]) => {
        if (key in newRow) {
          const raw = newRow[key];
          if (targetType === 'number') newRow[key] = Number(raw) || 0;
          else if (targetType === 'string') newRow[key] = String(raw);
          else if (targetType === 'boolean') newRow[key] = Boolean(raw);
          else if (targetType === 'date') newRow[key] = new Date(String(raw)).toISOString();
        }
      });

      return newRow;
    });

    return { recordsOut: mapped, recordsDropped: 0 };
  }

  private static executeAggregate(node: PipelineNode, inputs: Record<string, unknown>[]): ExecutorResult {
    const groupKeys = node.config.groupByFields || ['player_id'];
    const aggs = node.config.aggregations || [
      { field: 'score', op: 'sum', alias: 'total_score' },
      { field: 'session_id', op: 'count', alias: 'session_count' },
    ];

    const groups = new Map<string, Record<string, unknown>[]>();

    inputs.forEach((row) => {
      const gKey = groupKeys.map((k) => String(row[k] ?? 'NULL')).join('::');
      if (!groups.has(gKey)) groups.set(gKey, []);
      groups.get(gKey)!.push(row);
    });

    const result: Record<string, unknown>[] = [];

    groups.forEach((rows, groupKey) => {
      const aggRow: Record<string, unknown> = {};

      // Populate group keys
      const keyVals = groupKey.split('::');
      groupKeys.forEach((k, idx) => {
        aggRow[k] = keyVals[idx];
      });

      // Calculate aggregations
      aggs.forEach((agg) => {
        const values = rows.map((r) => r[agg.field]).filter((v) => v !== null && v !== undefined);
        const nums = values.map(Number).filter((n) => !isNaN(n));

        if (agg.op === 'count') {
          aggRow[agg.alias] = rows.length;
        } else if (agg.op === 'sum') {
          aggRow[agg.alias] = nums.reduce((a, b) => a + b, 0);
        } else if (agg.op === 'avg') {
          aggRow[agg.alias] = nums.length > 0 ? Number((nums.reduce((a, b) => a + b, 0) / nums.length).toFixed(2)) : 0;
        } else if (agg.op === 'min') {
          aggRow[agg.alias] = nums.length > 0 ? Math.min(...nums) : 0;
        } else if (agg.op === 'max') {
          aggRow[agg.alias] = nums.length > 0 ? Math.max(...nums) : 0;
        }
      });

      result.push(aggRow);
    });

    return { recordsOut: result, recordsDropped: 0 };
  }

  private static executeJoin(node: PipelineNode, inputs: Record<string, unknown>[]): ExecutorResult {
    // In-memory Join simulation
    const leftKey = node.config.leftKey || 'player_id';
    const joined = inputs.map((row) => ({
      ...row,
      joined_region: 'US-East',
      vip_tier: 'Gold',
    }));
    return { recordsOut: joined, recordsDropped: 0 };
  }

  private static executeWindow(node: PipelineNode, inputs: Record<string, unknown>[]): ExecutorResult {
    const windowSizeSec = node.config.windowSizeSeconds || 300;
    const windowed = inputs.map((row) => ({
      ...row,
      window_start: new Date(Date.now() - windowSizeSec * 1000).toISOString(),
      window_end: new Date().toISOString(),
    }));
    return { recordsOut: windowed, recordsDropped: 0 };
  }

  private static executeDeduplicate(node: PipelineNode, inputs: Record<string, unknown>[]): ExecutorResult {
    const keys = node.config.dedupKeys || ['event_id'];
    const seen = new Set<string>();
    const deduped: Record<string, unknown>[] = [];

    inputs.forEach((row) => {
      const key = keys.map((k) => String(row[k] ?? '')).join('::');
      if (!seen.has(key)) {
        seen.add(key);
        deduped.push(row);
      }
    });

    return { recordsOut: deduped, recordsDropped: inputs.length - deduped.length };
  }

  private static executeSort(node: PipelineNode, inputs: Record<string, unknown>[]): ExecutorResult {
    const field = node.config.sortField || 'timestamp';
    const dir = node.config.sortDirection || 'asc';

    const sorted = [...inputs].sort((a, b) => {
      const vA = a[field];
      const vB = b[field];
      const cmp = String(vA ?? '').localeCompare(String(vB ?? ''), undefined, { numeric: true });
      return dir === 'asc' ? cmp : -cmp;
    });

    return { recordsOut: sorted, recordsDropped: 0 };
  }

  private static executeSample(node: PipelineNode, inputs: Record<string, unknown>[]): ExecutorResult {
    const fraction = node.config.sampleRateFraction || 0.5;
    const sampled = inputs.filter((_, idx) => (idx % Math.round(1 / fraction)) === 0);
    return { recordsOut: sampled, recordsDropped: inputs.length - sampled.length };
  }

  private static executeValidate(node: PipelineNode, inputs: Record<string, unknown>[]): ExecutorResult {
    const valid = inputs.filter((row) => {
      return row.player_id !== null && row.player_id !== undefined;
    });
    return { recordsOut: valid, recordsDropped: inputs.length - valid.length };
  }

  private static executeEnrich(node: PipelineNode, inputs: Record<string, unknown>[]): ExecutorResult {
    const enriched = inputs.map((row) => ({
      ...row,
      enriched_at: new Date().toISOString(),
      country: row.country || 'US',
    }));
    return { recordsOut: enriched, recordsDropped: 0 };
  }
}
