// Game Items, Quests, Achievements & Telemetry Schemas Catalog

export interface GameItem {
  itemId: string;
  name: string;
  category: 'Weapon' | 'Armor' | 'Consumable' | 'Cosmetic' | 'Mount' | 'Pass';
  rarity: 'Common' | 'Uncommon' | 'Rare' | 'Epic' | 'Legendary' | 'Mythic';
  basePriceGold: number;
  basePriceGems: number;
  statBonuses: { attack?: number; defense?: number; speed?: number; health?: number };
}

export interface GameQuest {
  questId: string;
  title: string;
  chapter: number;
  minLevelRequired: number;
  rewardXp: number;
  rewardGold: number;
  region: string;
  isDaily: boolean;
}

export const GAME_ITEMS_CATALOG: GameItem[] = [
  { itemId: 'itm_wep_01', name: 'Flameburst Greatsword', category: 'Weapon', rarity: 'Legendary', basePriceGold: 15000, basePriceGems: 250, statBonuses: { attack: 450, speed: 12 } },
  { itemId: 'itm_wep_02', name: 'Frostbite Recurve Bow', category: 'Weapon', rarity: 'Epic', basePriceGold: 8500, basePriceGems: 120, statBonuses: { attack: 320, speed: 25 } },
  { itemId: 'itm_arm_01', name: 'Titanplate Heavy Cuirass', category: 'Armor', rarity: 'Epic', basePriceGold: 9200, basePriceGems: 150, statBonuses: { defense: 520, health: 800 } },
  { itemId: 'itm_arm_02', name: 'Shadowweave Cloak of Haste', category: 'Armor', rarity: 'Rare', basePriceGold: 4500, basePriceGems: 60, statBonuses: { defense: 180, speed: 40 } },
  { itemId: 'itm_con_01', name: 'Elixir of Greater Vitality', category: 'Consumable', rarity: 'Common', basePriceGold: 250, basePriceGems: 0, statBonuses: { health: 1200 } },
  { itemId: 'itm_mount_01', name: 'Celestial Star-Dragon Mount', category: 'Mount', rarity: 'Mythic', basePriceGold: 100000, basePriceGems: 1500, statBonuses: { speed: 150 } },
  { itemId: 'itm_pass_01', name: 'Season 12 Apex BattlePass', category: 'Pass', rarity: 'Legendary', basePriceGold: 0, basePriceGems: 950, statBonuses: {} },
];

export const GAME_QUESTS_CATALOG: GameQuest[] = [
  { questId: 'qst_main_101', title: 'Awakening of the Ancient Flame', chapter: 1, minLevelRequired: 1, rewardXp: 1200, rewardGold: 500, region: 'Sunvale Abbey', isDaily: false },
  { questId: 'qst_main_102', title: 'Siege of Ironclad Fortress', chapter: 1, minLevelRequired: 5, rewardXp: 3500, rewardGold: 1200, region: 'Sunvale Abbey', isDaily: false },
  { questId: 'qst_daily_01', title: 'Daily Extermination: Goblin Raiders', chapter: 0, minLevelRequired: 10, rewardXp: 2500, rewardGold: 800, region: 'Whispering Woods', isDaily: true },
  { questId: 'qst_raid_01', title: 'Raid: Lair of the Abyssal Leviathan', chapter: 3, minLevelRequired: 50, rewardXp: 50000, rewardGold: 25000, region: 'Abyssal Trench', isDaily: false },
];

export class GameCatalogManager {
  static getItems(): GameItem[] {
    return GAME_ITEMS_CATALOG;
  }

  static getQuests(): GameQuest[] {
    return GAME_QUESTS_CATALOG;
  }
}
