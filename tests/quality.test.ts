import { describe, it, expect } from 'vitest';
import { QualityEngine } from '../src/lib/quality/qualityEngine';
import { SchemaEvolutionDetector } from '../src/lib/quality/schemaEvolution';
import { ValidationRule, SchemaField } from '../src/types/quality';

describe('Quality Engine & Schema Evolution Tests', () => {
  it('should calculate data quality score and catch null violations', () => {
    const rules: ValidationRule[] = [
      { id: 'r-1', name: 'player_id NOT NULL', description: '', field: 'player_id', type: 'not_null', params: {}, severity: 'error' },
      { id: 'r-2', name: 'score >= 0', description: '', field: 'score', type: 'min_value', params: { min: 0 }, severity: 'error' },
    ];

    const records = [
      { player_id: 'ply_1', score: 100 },
      { player_id: null, score: 50 }, // Violation!
      { player_id: 'ply_3', score: -10 }, // Violation!
    ];

    const { result, rejectedRecords } = QualityEngine.runQualityChecks(
      'suite-1',
      'Suite 1',
      'ds-1',
      'Dataset 1',
      records,
      rules
    );

    expect(result.totalRecordsScanned).toBe(3);
    expect(rejectedRecords.length).toBe(2);
    expect(result.overallScorePct).toBe(66.7);
  });

  it('should detect breaking schema evolution when required field added', () => {
    const oldFields: SchemaField[] = [{ name: 'id', type: 'String' }];
    const newFields: SchemaField[] = [
      { name: 'id', type: 'String' },
      { name: 'email', type: 'String', constraint: { required: true } },
    ];

    const analysis = SchemaEvolutionDetector.analyzeEvolution(oldFields, newFields);
    expect(analysis.compatibility).toBe('Breaking');
    expect(analysis.addedFields.length).toBe(1);
  });
});
