import { describe, it, expect } from 'vitest';
import { SQLEngine } from '../src/lib/sql/sqlParser';

describe('AST SQL Engine Tests', () => {
  it('should parse and execute SELECT WHERE and LIMIT query', () => {
    const dataset = [
      { player_id: 'ply_1', score: 50, country: 'US' },
      { player_id: 'ply_2', score: 150, country: 'US' },
      { player_id: 'ply_3', score: 200, country: 'DE' },
    ];

    const result = SQLEngine.executeQuery(
      'SELECT player_id, score FROM dataset WHERE country = US LIMIT 1',
      dataset
    );

    expect(result.rows.length).toBe(1);
    expect(result.rows[0].player_id).toBe('ply_1');
  });
});
