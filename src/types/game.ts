// Game Telemetry Synthetic Dataset Schemas & Event Models

export interface GamePlayerRecord {
  player_id: string;
  country: string;
  platform: 'PC' | 'PlayStation' | 'Xbox' | 'iOS' | 'Android' | 'Switch';
  level: number;
  created_at: string;
  total_spent_usd: number;
  vip_status: boolean;
}

export interface GameSessionRecord {
  session_id: string;
  player_id: string;
  start_time: string;
  end_time: string;
  duration_seconds: number;
  device_model: string;
  ip_region: string;
}

export interface GameMatchRecord {
  match_id: string;
  player_id: string;
  mode: 'Battle Royale' | 'Team Deathmatch' | 'Ranked Arena' | 'Co-op Raid' | 'Casual';
  result: 'Win' | 'Loss' | 'Draw';
  score: number;
  kills: number;
  deaths: number;
  duration_seconds: number;
}

export interface GameEventRecord {
  event_id: string;
  player_id: string;
  event_name: 'login' | 'quest_complete' | 'item_acquired' | 'level_up' | 'match_start' | 'match_end' | 'error_logged';
  timestamp: string;
  properties: Record<string, string | number | boolean>;
}

export interface GameEconomyRecord {
  transaction_id: string;
  player_id: string;
  item: string;
  currency: 'Gold' | 'Gems' | 'USD' | 'BattlePassPoints';
  amount: number;
  timestamp: string;
}
