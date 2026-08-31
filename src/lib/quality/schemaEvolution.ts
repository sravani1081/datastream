// Schema Evolution Detector & Compatibility Engine

import { SchemaField, SchemaVersion } from '../../types/quality';

export interface EvolutionAnalysis {
  compatibility: 'Compatible' | 'Warning' | 'Breaking';
  addedFields: SchemaField[];
  removedFields: SchemaField[];
  typeChangedFields: Array<{ fieldName: string; oldType: string; newType: string }>;
  constraintChangedFields: Array<{ fieldName: string; change: string }>;
  details: string[];
}

export class SchemaEvolutionDetector {
  /**
   * Compare two schema versions and classify compatibility
   */
  static analyzeEvolution(oldFields: SchemaField[], newFields: SchemaField[]): EvolutionAnalysis {
    const oldMap = new Map<string, SchemaField>();
    oldFields.forEach((f) => oldMap.set(f.name, f));

    const newMap = new Map<string, SchemaField>();
    newFields.forEach((f) => newMap.set(f.name, f));

    const addedFields: SchemaField[] = [];
    const removedFields: SchemaField[] = [];
    const typeChangedFields: Array<{ fieldName: string; oldType: string; newType: string }> = [];
    const constraintChangedFields: Array<{ fieldName: string; change: string }> = [];
    const details: string[] = [];

    let compatibility: 'Compatible' | 'Warning' | 'Breaking' = 'Compatible';

    // Check new fields
    newFields.forEach((nf) => {
      if (!oldMap.has(nf.name)) {
        addedFields.push(nf);
        details.push(`Added field '${nf.name}' (${nf.type})`);
        if (nf.constraint?.required) {
          compatibility = 'Breaking';
          details.push(`[BREAKING] New required field '${nf.name}' added without default value.`);
        }
      } else {
        const of = oldMap.get(nf.name)!;
        if (of.type !== nf.type) {
          typeChangedFields.push({ fieldName: nf.name, oldType: of.type, newType: nf.type });
          compatibility = 'Breaking';
          details.push(`[BREAKING] Field '${nf.name}' type changed from ${of.type} to ${nf.type}.`);
        }
      }
    });

    // Check removed fields
    oldFields.forEach((of) => {
      if (!newMap.has(of.name)) {
        removedFields.push(of);
        if (compatibility !== 'Breaking') compatibility = 'Warning';
        details.push(`[WARNING] Removed field '${of.name}'. Existing consumers may need updating.`);
      }
    });

    return {
      compatibility,
      addedFields,
      removedFields,
      typeChangedFields,
      constraintChangedFields,
      details,
    };
  }
}
