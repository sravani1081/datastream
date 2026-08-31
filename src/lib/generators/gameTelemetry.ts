// Deterministic Synthetic Game Telemetry Data Generator

import {
  GamePlayerRecord,
  GameSessionRecord,
  GameMatchRecord,
  GameEventRecord,
  GameEconomyRecord,
} from '../../types/game';

export class GameTelemetryGenerator {
  private static pseudoRandom(seed: number): number {
    const x = Math.sin(seed++) * 10000;
    return x - Math.floor(x);
  }

  /**
   * Generate Players dataset deterministically by seed
   */
  static generatePlayers(count = 50, seed = 42): GamePlayerRecord[] {
    const countries = ['US', 'CA', 'DE', 'FR', 'JP', 'KR', 'UK', 'BR'];
    const platforms = ['PC', 'PlayStation', 'Xbox', 'iOS', 'Android', 'Switch'] as const;

    return Array.from({ length: count }).map((_, i) => {
      const s = seed + i * 7;
      const countryIdx = Math.floor(this.pseudoRandom(s) * countries.length);
      const platIdx = Math.floor(this.pseudoRandom(s + 1) * platforms.length);
      const level = Math.floor(this.pseudoRandom(s + 2) * 100) + 1;
      const spent = Math.floor(this.pseudoRandom(s + 3) * 500);

      return {
        player_id: `ply_${1000 + i}`,
        country: countries[countryIdx],
        platform: platforms[platIdx],
        level,
        created_at: new Date(Date.now() - Math.floor(this.pseudoRandom(s + 4) * 90 * 86400000)).toISOString(),
        total_spent_usd: spent,
        vip_status: spent > 100,
      };
    });
  }

  /**
   * Generate Sessions dataset deterministically by seed
   */
  static generateSessions(count = 100, seed = 42): GameSessionRecord[] {
    return Array.from({ length: count }).map((_, i) => {
      const s = seed + i * 13;
      const plyId = `ply_${1000 + (i % 50)}`;
      const dur = Math.floor(this.pseudoRandom(s) * 1800) + 120;
      const startMs = Date.now() - Math.floor(this.pseudoRandom(s + 1) * 7 * 86400000);

      return {
        session_id: `sess_${5000 + i}`,
        player_id: plyId,
        start_time: new Date(startMs).toISOString(),
        end_time: new Date(startMs + dur * 1000).toISOString(),
        duration_seconds: dur,
        device_model: i % 2 === 0 ? 'iPhone 15 Pro' : 'Alienware Desktop',
        ip_region: 'US-East',
      };
    });
  }

  /**
   * Generate Economy transactions deterministically
   */
  static generateEconomy(count = 80, seed = 42): GameEconomyRecord[] {
    const items = ['BattlePass Pass', '1000 Gems', 'Legendary Skin', 'XP Booster 24h'];
    const currencies = ['Gems', 'Gold', 'USD'] as const;

    return Array.from({ length: count }).map((_, i) => {
      const s = seed + i * 19;
      const itemIdx = Math.floor(this.pseudoRandom(s) * items.length);
      const currIdx = Math.floor(this.pseudoRandom(s + 1) * currencies.length);

      return {
        transaction_id: `tx_${9000 + i}`,
        player_id: `ply_${1000 + (i % 50)}`,
        item: items[itemIdx],
        currency: currencies[currIdx],
        amount: Math.floor(this.pseudoRandom(s + 2) * 50) + 5,
        timestamp: new Date(Date.now() - i * 120000).toISOString(),
      };
    });
  }
}
