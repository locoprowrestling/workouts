import type { AppStorage } from '../types';
import { BADGE_DEFINITIONS } from '../constants/badges';
import { generateQuests } from '../constants/quests';
import { supabase } from './supabase';

export function defaultStorage(): AppStorage {
  const now = new Date();
  return {
    profile: {
      level: 1,
      totalXP: 0,
      currentStreak: 0,
      longestStreak: 0,
      totalWorkouts: 0,
      lastStreakWeek: null,
      workoutTypeCounts: { strength: 0, cardio: 0, flexibility: 0 },
      badges: BADGE_DEFINITIONS.map((b) => ({ id: b.id, unlockedAt: null })),
      createdAt: now.toISOString(),
    },
    sessions: [],
    quests: generateQuests(now),
    lastQuestResetDate: now.toISOString(),
    completedQuestCount: 0,
    seenIntermediatePlanUnlock: false,
  };
}

export async function loadUserData(userId: string): Promise<AppStorage> {
  const { data, error } = await supabase
    .from('user_data')
    .select('data')
    .eq('id', userId)
    .maybeSingle();

  if (error || !data) return defaultStorage();

  const stored = data.data as AppStorage;
  if (stored.seenIntermediatePlanUnlock === undefined) {
    stored.seenIntermediatePlanUnlock = false;
  }
  return stored;
}

export async function saveUserData(userId: string, data: AppStorage): Promise<void> {
  await supabase
    .from('user_data')
    .upsert({ id: userId, data, updated_at: new Date().toISOString() });
}
