import { LEVEL_THRESHOLDS, MAX_LEVEL } from '../constants/levels';

export function getLevelFromXP(totalXP: number): number {
  let level = 1;
  for (let i = 1; i < LEVEL_THRESHOLDS.length; i++) {
    if (totalXP >= LEVEL_THRESHOLDS[i]) level = i + 1;
    else break;
  }
  return Math.min(level, MAX_LEVEL);
}

export function getXPFloorForLevel(level: number): number {
  return LEVEL_THRESHOLDS[Math.max(0, level - 1)] ?? 0;
}

export function getXPCeilingForLevel(level: number): number {
  if (level >= MAX_LEVEL) return LEVEL_THRESHOLDS[LEVEL_THRESHOLDS.length - 1];
  return LEVEL_THRESHOLDS[level] ?? LEVEL_THRESHOLDS[LEVEL_THRESHOLDS.length - 1];
}

export function getLevelProgress(totalXP: number): { current: number; floor: number; ceiling: number; percent: number } {
  const level = getLevelFromXP(totalXP);
  const floor = getXPFloorForLevel(level);
  const ceiling = getXPCeilingForLevel(level);
  const span = ceiling - floor;
  const percent = span > 0 ? Math.min(100, Math.round(((totalXP - floor) / span) * 100)) : 100;
  return { current: totalXP - floor, floor, ceiling, percent };
}
