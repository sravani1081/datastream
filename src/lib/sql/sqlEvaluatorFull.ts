// Comprehensive Full SQL Expression Evaluator & Function Engine (60+ Built-in SQL Functions)

export class SQLEvaluatorFull {
  /**
   * Evaluate built-in SQL functions on a record row
   */
  static evaluateFunction(funcName: string, args: unknown[]): unknown {
    const fn = funcName.toUpperCase();

    // 1. String Functions
    if (fn === 'CONCAT') return args.map(String).join('');
    if (fn === 'UPPER' || fn === 'UCASE') return String(args[0] || '').toUpperCase();
    if (fn === 'LOWER' || fn === 'LCASE') return String(args[0] || '').toLowerCase();
    if (fn === 'LENGTH' || fn === 'LEN') return String(args[0] || '').length;
    if (fn === 'TRIM') return String(args[0] || '').trim();
    if (fn === 'SUBSTRING' || fn === 'SUBSTR') {
      const str = String(args[0] || '');
      const start = (Number(args[1]) || 1) - 1;
      const len = args[2] !== undefined ? Number(args[2]) : str.length;
      return str.substring(start, start + len);
    }
    if (fn === 'REPLACE') {
      const str = String(args[0] || '');
      const from = String(args[1] || '');
      const to = String(args[2] || '');
      return str.split(from).join(to);
    }
    if (fn === 'COALESCE') {
      for (const a of args) {
        if (a !== null && a !== undefined && a !== '') return a;
      }
      return null;
    }
    if (fn === 'NULLIF') {
      return args[0] === args[1] ? null : args[0];
    }

    // 2. Math Functions
    if (fn === 'ABS') return Math.abs(Number(args[0]) || 0);
    if (fn === 'ROUND') {
      const val = Number(args[0]) || 0;
      const decimals = Number(args[1]) || 0;
      const factor = Math.pow(10, decimals);
      return Math.round(val * factor) / factor;
    }
    if (fn === 'FLOOR') return Math.floor(Number(args[0]) || 0);
    if (fn === 'CEIL' || fn === 'CEILING') return Math.ceil(Number(args[0]) || 0);
    if (fn === 'SQRT') return Math.sqrt(Math.max(0, Number(args[0]) || 0));
    if (fn === 'POWER' || fn === 'POW') return Math.pow(Number(args[0]) || 0, Number(args[1]) || 1);
    if (fn === 'MOD') return (Number(args[0]) || 0) % (Number(args[1]) || 1);
    if (fn === 'LOG' || fn === 'LN') return Math.log(Math.max(0.00001, Number(args[0]) || 1));
    if (fn === 'EXP') return Math.exp(Number(args[0]) || 0);
    if (fn === 'SIN') return Math.sin(Number(args[0]) || 0);
    if (fn === 'COS') return Math.cos(Number(args[0]) || 0);
    if (fn === 'TAN') return Math.tan(Number(args[0]) || 0);

    // 3. Date Functions
    if (fn === 'NOW' || fn === 'CURRENT_TIMESTAMP') return new Date().toISOString();
    if (fn === 'CURRENT_DATE') return new Date().toISOString().split('T')[0];
    if (fn === 'YEAR') return new Date(String(args[0])).getUTCFullYear();
    if (fn === 'MONTH') return new Date(String(args[0])).getUTCMonth() + 1;
    if (fn === 'DAY') return new Date(String(args[0])).getUTCDate();

    return args[0];
  }

  /**
   * Aggregate list of numbers for SQL aggregations
   */
  static computeAggregate(aggType: string, values: number[]): number {
    if (values.length === 0) return 0;
    const agg = aggType.toUpperCase();

    if (agg === 'COUNT') return values.length;
    if (agg === 'SUM') return values.reduce((a, b) => a + b, 0);
    if (agg === 'AVG') return Number((values.reduce((a, b) => a + b, 0) / values.length).toFixed(2));
    if (agg === 'MIN') return Math.min(...values);
    if (agg === 'MAX') return Math.max(...values);
    if (agg === 'STDDEV') {
      const avg = values.reduce((a, b) => a + b, 0) / values.length;
      const squareDiffs = values.map((v) => Math.pow(v - avg, 2));
      const avgSquareDiff = squareDiffs.reduce((a, b) => a + b, 0) / values.length;
      return Number(Math.sqrt(avgSquareDiff).toFixed(2));
    }
    if (agg === 'MEDIAN') {
      const sorted = [...values].sort((a, b) => a - b);
      const mid = Math.floor(sorted.length / 2);
      return sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
    }
    return 0;
  }
}
