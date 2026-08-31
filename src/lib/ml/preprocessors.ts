// ML Preprocessors & Feature Transformer Algorithms

export class MLPreprocessors {
  /**
   * One-Hot Encode categorical field values
   */
  static oneHotEncode(records: Record<string, unknown>[], field: string): Record<string, unknown>[] {
    const categories = Array.from(new Set(records.map((r) => String(r[field] ?? 'NULL'))));

    return records.map((row) => {
      const result = { ...row };
      const currentVal = String(row[field] ?? 'NULL');

      categories.forEach((cat) => {
        const colName = `${field}_is_${cat.replace(/\s+/g, '_')}`;
        result[colName] = currentVal === cat ? 1 : 0;
      });

      return result;
    });
  }

  /**
   * Standard Scale (Z-Score Normalization) numeric column
   */
  static standardScale(records: Record<string, unknown>[], field: string): Record<string, unknown>[] {
    const nums = records.map((r) => Number(r[field]) || 0);
    const mean = nums.reduce((a, b) => a + b, 0) / (nums.length || 1);
    const varSum = nums.reduce((a, b) => a + Math.pow(b - mean, 2), 0);
    const stdDev = Math.sqrt(varSum / (nums.length || 1)) || 1;

    return records.map((row) => {
      const val = Number(row[field]) || 0;
      const zScore = Number(((val - mean) / stdDev).toFixed(4));
      return {
        ...row,
        [`${field}_zscore`]: zScore,
      };
    });
  }

  /**
   * Impute missing null values with Mean or Median
   */
  static imputeNulls(records: Record<string, unknown>[], field: string, strategy: 'mean' | 'mode' = 'mean'): Record<string, unknown>[] {
    const validNums = records.map((r) => Number(r[field])).filter((n) => !isNaN(n));
    const fallbackMean = validNums.length > 0 ? validNums.reduce((a, b) => a + b, 0) / validNums.length : 0;

    return records.map((row) => {
      const result = { ...row };
      if (result[field] === null || result[field] === undefined || result[field] === '') {
        result[field] = fallbackMean;
      }
      return result;
    });
  }
}
