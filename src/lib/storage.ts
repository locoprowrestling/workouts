import type { AppStorage, UserProfile } from '../types';
import { BADGE_DEFINITIONS } from '../constants/badges';
import { generateQuests } from '../constants/quests';

const KEY = 'workout_tracker_v1';

function defaultProfile(): UserProfile {
  return {
    level: 1,
    totalXP: 0,
    currentStreak: 0,
    longestStreak: 0,
    totalWorkouts: 0,
    lastStreakWeek: null,
    workoutTypeCounts: { strength: 0, cardio: 0, flexibility: 0 },
    badges: BADGE_DEFINITIONS.map((b) => ({ id: b.id, unlockedAt: null })),
    createdAt: new Date().toISOString(),
  };
}

export function loadStorage(): AppStorage {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return JSON.parse(raw) as AppStorage;
  } catch {}
  const now = new Date();
  return {
    profile: defaultProfile(),
    sessions: [],
    quests: generateQuests(now),
    lastQuestResetDate: now.toISOString(),
    completedQuestCount: 0,
  };
}

export function saveStorage(data: AppStorage): void {
  localStorage.setItem(KEY, JSON.stringify(data));
}
