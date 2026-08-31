// Data Quality Check Engine & Quality Score Calculator

import { ValidationRule, QualityCheckResult, RejectedRecord } from '../../types/quality';

export class QualityEngine {
  /**
   * Run validation rules on dataset records and compute overall Quality Score %
   */
  static runQualityChecks(
    suiteId: string,
    suiteName: string,
    datasetId: string,
    datasetName: string,
    records: Record<string, unknown>[],
    rules: ValidationRule[]
  ): { result: QualityCheckResult; rejectedRecords: RejectedRecord[] } {
    const totalRecords = records.length;
    const rejectedRecords: RejectedRecord[] = [];
    const ruleResults: QualityCheckResult['ruleResults'] = [];

    let totalRuleEvaluations = 0;
    let totalRulePassed = 0;

    rules.forEach((rule) => {
      let passedCount = 0;
      let failedCount = 0;

      records.forEach((rec) => {
        totalRuleEvaluations++;
        const val = rec[rule.field];
        let isValid = true;
        let errorMsg = '';

        if (rule.type === 'not_null') {
          if (val === null || val === undefined || val === '') {
            isValid = false;
            errorMsg = `Field '${rule.field}' is required but was null/empty.`;
          }
        } else if (rule.type === 'min_value') {
          const min = Number(rule.params.min ?? 0);
          if (Number(val) < min) {
            isValid = false;
            errorMsg = `Field '${rule.field}' value ${val} is less than minimum ${min}.`;
          }
        } else if (rule.type === 'range') {
          const min = Number(rule.params.min ?? 0);
          const max = Number(rule.params.max ?? 100);
          const num = Number(val);
          if (num < min || num > max) {
            isValid = false;
            errorMsg = `Field '${rule.field}' value ${val} is outside valid range [${min}, ${max}].`;
          }
        }

        if (isValid) {
          passedCount++;
          totalRulePassed++;
        } else {
          failedCount++;
          rejectedRecords.push({
            id: `rej-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
            projectId: 'proj-nexus-game',
            datasetId,
            rawPayload: rec,
            failedField: rule.field,
            errorMessage: errorMsg,
            ruleName: rule.name,
            rejectedAt: new Date().toISOString(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          });
        }
      });

      const passPct = totalRecords > 0 ? Math.round((passedCount / totalRecords) * 1000) / 10 : 100;
      ruleResults.push({
        ruleId: rule.id,
        ruleName: rule.name,
        field: rule.field,
        passedCount,
        failedCount,
        passPct,
        status: passPct >= 98 ? 'PASS' : passPct >= 90 ? 'WARN' : 'FAIL',
      });
    });

    const overallScorePct =
      totalRuleEvaluations > 0 ? Math.round((totalRulePassed / totalRuleEvaluations) * 1000) / 10 : 100;

    const result: QualityCheckResult = {
      id: `qres-${Date.now()}`,
      suiteId,
      suiteName,
      datasetId,
      datasetName,
      executedAt: new Date().toISOString(),
      totalRecordsScanned: totalRecords,
      passedRecords: totalRecords - rejectedRecords.length,
      failedRecords: rejectedRecords.length,
      overallScorePct,
      ruleResults,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return { result, rejectedRecords };
  }
}
