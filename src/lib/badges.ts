import type { UserProfile, WorkoutSession } from '../types';

interface BadgeCondition {
  id: string;
  check: (profile: UserProfile, sessions: WorkoutSession[], completedQuestCount: number) => boolean;
}

const CONDITIONS: BadgeCondition[] = [
  { id: 'streak_2',  check: (p) => p.currentStreak >= 2 },
  { id: 'streak_5',  check: (p) => p.currentStreak >= 5 },
  { id: 'streak_10', check: (p) => p.currentStreak >= 10 },
  { id: 'streak_20', check: (p) => p.currentStreak >= 20 },

  { id: 'workouts_1',   check: (p) => p.totalWorkouts >= 1 },
  { id: 'workouts_10',  check: (p) => p.totalWorkouts >= 10 },
  { id: 'workouts_25',  check: (p) => p.totalWorkouts >= 25 },
  { id: 'workouts_50',  check: (p) => p.totalWorkouts >= 50 },
  { id: 'workouts_100', check: (p) => p.totalWorkouts >= 100 },

  { id: 'first_strength',    check: (p) => p.workoutTypeCounts.strength >= 1 },
  { id: 'first_cardio',      check: (p) => p.workoutTypeCounts.cardio >= 1 },
  { id: 'first_flexibility', check: (p) => p.workoutTypeCounts.flexibility >= 1 },
  { id: 'all_rounder', check: (p) =>
    p.workoutTypeCounts.strength >= 1 &&
    p.workoutTypeCounts.cardio >= 1 &&
    p.workoutTypeCounts.flexibility >= 1
  },

  { id: 'level_10', check: (p) => p.level >= 10 },
  { id: 'level_25', check: (p) => p.level >= 25 },
  { id: 'level_50', check: (p) => p.level >= 50 },

  { id: 'quest_5', check: (_p, _s, count) => count >= 5 },
];

export function recomputeBadges(
  profile: UserProfile,
  sessions: WorkoutSession[],
  completedQuestCount: number
): UserProfile['badges'] {
  return profile.badges.map((badge) => {
    if (!badge.unlockedAt) return badge;
    const condition = CONDITIONS.find((c) => c.id === badge.id);
    if (condition && !condition.check(profile, sessions, completedQuestCount)) {
      return { ...badge, unlockedAt: null };
    }
    return badge;
  });
}

export function evaluateBadges(
  profile: UserProfile,
  sessions: WorkoutSession[],
  completedQuestCount: number
): string[] {
  const now = new Date().toISOString();
  const newlyUnlocked: string[] = [];

  const updatedBadges = profile.badges.map((badge) => {
    if (badge.unlockedAt) return badge;
    const condition = CONDITIONS.find((c) => c.id === badge.id);
    if (condition && condition.check(profile, sessions, completedQuestCount)) {
      newlyUnlocked.push(badge.id);
      return { ...badge, unlockedAt: now };
    }
    return badge;
  });

  profile.badges = updatedBadges;
  return newlyUnlocked;
}
