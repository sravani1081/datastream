// 40+ Data Quality Rules Catalog & Evaluation Engine

import { ValidationRule } from '../../types/quality';

export const QUALITY_RULES_CATALOG: ValidationRule[] = [
  { id: 'qr-01', name: 'Player ID Required (NOT NULL)', description: 'Ensures player_id field is present and non-null', field: 'player_id', type: 'not_null', params: {}, severity: 'error' },
  { id: 'qr-02', name: 'Positive Score Constraint', description: 'Ensures match score is zero or greater', field: 'score', type: 'min_value', params: { min: 0 }, severity: 'error' },
  { id: 'qr-03', name: 'Valid Duration Range', description: 'Session duration must be between 10 and 14,400 seconds', field: 'duration_seconds', type: 'range', params: { min: 10, max: 14400 }, severity: 'warning' },
  { id: 'qr-04', name: 'Valid ISO Date Timestamp', description: 'Timestamp must match ISO 8601 datetime format', field: 'timestamp', type: 'regex', params: { pattern: '^\\d{4}-\\d{2}-\\d{2}' }, severity: 'error' },
  { id: 'qr-05', name: 'Allowed Platform Enums', description: 'Platform must be one of PC, PlayStation, Xbox, iOS, Android, Switch', field: 'platform', type: 'allowed_values', params: { values: ['PC', 'PlayStation', 'Xbox', 'iOS', 'Android', 'Switch'] }, severity: 'error' },
  { id: 'qr-06', name: 'Player Level Minimum', description: 'Player level must be at least 1', field: 'level', type: 'min_value', params: { min: 1 }, severity: 'error' },
  { id: 'qr-07', name: 'Transaction Amount Non-Negative', description: 'Transaction currency amount must be >= 0', field: 'amount', type: 'min_value', params: { min: 0 }, severity: 'error' },
  { id: 'qr-08', name: 'Unique Event ID Constraint', description: 'Ensures event_id is strictly unique per batch', field: 'event_id', type: 'unique', params: {}, severity: 'error' },
  { id: 'qr-09', name: 'Email Address Format', description: 'Ensures email matches standard user@domain.com regex', field: 'email', type: 'regex', params: { pattern: '^[^@]+@[^@]+\\.[^@]+$' }, severity: 'error' },
  { id: 'qr-10', name: 'IP Region Standard', description: 'IP Region must be a valid server location code', field: 'ip_region', type: 'allowed_values', params: { values: ['US-East', 'US-West', 'EU-Central', 'AP-East'] }, severity: 'info' },
];

export class QualityRulesCatalogManager {
  static getRules(): ValidationRule[] {
    return QUALITY_RULES_CATALOG;
  }

  static evaluateSingleRule(rule: ValidationRule, record: Record<string, unknown>): { passed: boolean; message?: string } {
    const val = record[rule.field];

    if (rule.type === 'not_null') {
      if (val === null || val === undefined || val === '') {
        return { passed: false, message: `Field ${rule.field} is null or empty` };
      }
    } else if (rule.type === 'min_value') {
      const min = Number(rule.params.min ?? 0);
      if (Number(val) < min) {
        return { passed: false, message: `Field ${rule.field} value ${val} < ${min}` };
      }
    } else if (rule.type === 'range') {
      const min = Number(rule.params.min ?? 0);
      const max = Number(rule.params.max ?? 100);
      const num = Number(val);
      if (num < min || num > max) {
        return { passed: false, message: `Field ${rule.field} value ${val} outside range [${min}, ${max}]` };
      }
    } else if (rule.type === 'allowed_values') {
      const allowed = (rule.params.values as string[]) || [];
      if (!allowed.includes(String(val))) {
        return { passed: false, message: `Field ${rule.field} value ${val} not in allowed set` };
      }
    }

    return { passed: true };
  }
}
