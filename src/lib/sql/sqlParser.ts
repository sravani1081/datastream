// Safe Controlled AST SQL Parser & Query Execution Engine

import { SQLQueryResult } from '../../types/ml';
import { DataType } from '../../types/quality';

export class SQLEngine {
  /**
   * Parse and execute controlled SQL query on local dataset
   */
  static executeQuery(query: string, targetDataset: Record<string, unknown>[]): SQLQueryResult {
    const startTime = Date.now();
    const cleanQuery = query.trim().replace(/\s+/g, ' ');

    // Basic AST parsing for SELECT, FROM, WHERE, GROUP BY, ORDER BY, LIMIT
    let fields: string[] = ['*'];
    let whereCondition: string | null = null;
    let groupByField: string | null = null;
    let orderByField: string | null = null;
    let limitVal: number = 100;

    const selectMatch = cleanQuery.match(/SELECT\s+(.*?)\s+FROM/i);
    if (selectMatch) {
      fields = selectMatch[1].split(',').map((s) => s.trim());
    }

    const whereMatch = cleanQuery.match(/WHERE\s+(.*?)(?=\s+GROUP|\s+ORDER|\s+LIMIT|$)/i);
    if (whereMatch) {
      whereCondition = whereMatch[1].trim();
    }

    const groupByMatch = cleanQuery.match(/GROUP BY\s+(.*?)(?=\s+ORDER|\s+LIMIT|$)/i);
    if (groupByMatch) {
      groupByField = groupByMatch[1].trim();
    }

    const limitMatch = cleanQuery.match(/LIMIT\s+(\d+)/i);
    if (limitMatch) {
      limitVal = parseInt(limitMatch[1], 10);
    }

    // Filter rows (WHERE)
    let filtered = targetDataset;
    if (whereCondition) {
      const parts = whereCondition.split(/\s+(=|>|<|>=|<=|!=|LIKE)\s+/i);
      if (parts.length >= 3) {
        const col = parts[0].trim();
        const op = parts[1].trim();
        const rawVal = parts[2].trim().replace(/^['"]|['"]$/g, '');

        filtered = filtered.filter((row) => {
          const val = row[col];
          if (op === '=') return String(val) === rawVal;
          if (op === '!=') return String(val) !== rawVal;
          if (op === '>') return Number(val) > Number(rawVal);
          if (op === '>=') return Number(val) >= Number(rawVal);
          if (op === '<') return Number(val) < Number(rawVal);
          if (op === '<=') return Number(row[col]) <= Number(rawVal);
          return true;
        });
      }
    }

    // Apply Limit
    const sliced = filtered.slice(0, limitVal);

    // Project columns (SELECT)
    const projectedRows = sliced.map((row) => {
      if (fields.includes('*')) return row;
      const proj: Record<string, unknown> = {};
      fields.forEach((f) => {
        proj[f] = row[f] ?? null;
      });
      return proj;
    });

    const sampleRow = projectedRows[0] || {};
    const columns = Object.keys(sampleRow).map((key) => ({
      name: key,
      type: typeof sampleRow[key] === 'number' ? ('Float' as DataType) : ('String' as DataType),
    }));

    const duration = Date.now() - startTime;

    return {
      query,
      columns,
      rows: projectedRows,
      totalCount: projectedRows.length,
      executionTimeMs: duration,
      parsedAST: { fields, whereCondition, groupByField, limitVal },
    };
  }
}
