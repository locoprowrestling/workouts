// XP required to REACH each level (index = level - 1)
// Level 1 = 0 XP. Each level costs 50 XP more than the previous.
export const LEVEL_THRESHOLDS: number[] = (() => {
  const thresholds = [0]; // Level 1 starts at 0
  let cost = 100;
  for (let i = 1; i < 50; i++) {
    thresholds.push(thresholds[i - 1] + cost);
    cost += 50;
  }
  return thresholds;
})();

export const MAX_LEVEL = 50;

export type LevelTier = 'gray' | 'green' | 'blue' | 'purple' | 'orange' | 'gold';

export function getLevelTier(level: number): LevelTier {
  if (level >= 50) return 'gold';
  if (level >= 40) return 'orange';
  if (level >= 30) return 'purple';
  if (level >= 20) return 'blue';
  if (level >= 10) return 'green';
  return 'gray';
}

export const TIER_COLORS: Record<LevelTier, { ring: string; text: string; bg: string }> = {
  gray:   { ring: 'border-gray-500',   text: 'text-gray-400',   bg: 'from-gray-600 to-gray-500' },
  green:  { ring: 'border-green-500',  text: 'text-green-400',  bg: 'from-green-600 to-emerald-500' },
  blue:   { ring: 'border-blue-500',   text: 'text-blue-400',   bg: 'from-blue-600 to-indigo-500' },
  purple: { ring: 'border-purple-500', text: 'text-purple-400', bg: 'from-purple-600 to-violet-500' },
  orange: { ring: 'border-orange-500', text: 'text-orange-400', bg: 'from-orange-600 to-amber-500' },
  gold:   { ring: 'border-yellow-400', text: 'text-yellow-300', bg: 'from-yellow-500 to-amber-400' },
};
