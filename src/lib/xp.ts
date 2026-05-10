import type { WorkoutSession, UserProfile } from '../types';

export function calculateXP(session: Omit<WorkoutSession, 'id' | 'xpEarned'>, profile: UserProfile): number {
  const base = session.type === 'strength' ? 50 : session.type === 'cardio' ? 40 : 30;

  // Duration bonus: +10 XP per full 15 min beyond first 15, cap +50
  const extraTiers = Math.floor(Math.max(0, session.durationMinutes - 15) / 15);
  const durationBonus = Math.min(extraTiers * 10, 50);

  // Streak bonus
  const streakBonus = profile.currentStreak >= 2 ? Math.min(profile.currentStreak * 5, 50) : 0;

  // Type variety bonus
  const counts = profile.workoutTypeCounts;
  const allTypesLogged = counts.strength > 0 && counts.cardio > 0 && counts.flexibility > 0;
  const varietyBonus = allTypesLogged ? 20 : 0;

  // Volume bonus (strength only): +2 per exercise, cap +20
  const volumeBonus = session.type === 'strength'
    ? Math.min(session.exercises.length * 2, 20)
    : 0;

  // Conditioning bonus
  const conditioningBonus = session.conditioningNotes.trim() ? 25 : 0;

  // Double progression bonus: +15 per exercise with progressionUnlocked
  const progressionBonus = session.exercises.reduce(
    (sum, ex) => sum + (ex.progressionUnlocked ? 15 : 0),
    0
  );

  // Completion bonus: all template exercises logged (6+ exercises)
  const completionBonus = session.exercises.length >= 6 ? 50 : 0;

  return base + durationBonus + streakBonus + varietyBonus + volumeBonus + conditioningBonus + progressionBonus + completionBonus;
}
