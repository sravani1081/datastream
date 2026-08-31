// Statistical Data Profiler & Distribution Engine

import { DatasetProfile } from '../../types/quality';

export class DataProfilerEngine {
  /**
   * Calculate detailed column-level statistical profile for a dataset
   */
  static profileDataset(records: Record<string, unknown>[]): DatasetProfile {
    const totalRows = records.length;
    const columnStats: DatasetProfile['columnStats'] = {};

    if (totalRows === 0) {
      return {
        rowCount: 0,
        totalSizeBytes: 0,
        columnStats: {},
        lastProfiledAt: new Date().toISOString(),
      };
    }

    const columns = Object.keys(records[0] || {});

    columns.forEach((col) => {
      const values = records.map((r) => r[col]);
      const nulls = values.filter((v) => v === null || v === undefined || v === '');
      const nonNulls = values.filter((v) => v !== null && v !== undefined && v !== '');

      const distinctSet = new Set(nonNulls.map(String));
      const distinctCount = distinctSet.size;

      // Frequency map for top values
      const freqMap = new Map<string, number>();
      nonNulls.forEach((v) => {
        const s = String(v);
        freqMap.set(s, (freqMap.get(s) || 0) + 1);
      });

      const topValues = Array.from(freqMap.entries())
        .map(([value, count]) => ({ value, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

      // Check numeric stats
      const nums = nonNulls.map(Number).filter((n) => !isNaN(n));
      let minVal: number | string | undefined = undefined;
      let maxVal: number | string | undefined = undefined;
      let avgVal: number | undefined = undefined;
      let p50: number | undefined = undefined;
      let p90: number | undefined = undefined;
      let p99: number | undefined = undefined;

      if (nums.length > 0) {
        nums.sort((a, b) => a - b);
        minVal = nums[0];
        maxVal = nums[nums.length - 1];
        avgVal = Number((nums.reduce((a, b) => a + b, 0) / nums.length).toFixed(2));
        p50 = nums[Math.floor(nums.length * 0.5)];
        p90 = nums[Math.floor(nums.length * 0.9)];
        p99 = nums[Math.floor(nums.length * 0.99)];
      } else if (nonNulls.length > 0) {
        minVal = String(nonNulls[0]);
        maxVal = String(nonNulls[nonNulls.length - 1]);
      }

      columnStats[col] = {
        nullCount: nulls.length,
        nullPct: Number(((nulls.length / totalRows) * 100).toFixed(2)),
        distinctCount,
        min: minVal,
        max: maxVal,
        avg: avgVal,
        p50,
        p90,
        p99,
        topValues,
      };
    });

    const estBytes = totalRows * columns.length * 16;

    return {
      rowCount: totalRows,
      totalSizeBytes: estBytes,
      columnStats,
      lastProfiledAt: new Date().toISOString(),
    };
  }
}
