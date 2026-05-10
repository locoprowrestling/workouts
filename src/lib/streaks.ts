import type { WorkoutSession, UserProfile } from '../types';

export function getISOWeekKey(date: Date): string {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  d.setDate(diff);
  d.setHours(0, 0, 0, 0);
  const year = d.getFullYear();
  const startOfYear = new Date(year, 0, 1);
  const weekNum = Math.ceil(((d.getTime() - startOfYear.getTime()) / 86400000 + startOfYear.getDay() + 1) / 7);
  return `${year}-W${String(weekNum).padStart(2, '0')}`;
}

function getMondayOf(weekKey: string): Date {
  const [year, wStr] = weekKey.split('-W');
  const week = parseInt(wStr);
  const jan1 = new Date(parseInt(year), 0, 1);
  const dayOfWeek = jan1.getDay() || 7;
  const firstMonday = new Date(jan1);
  firstMonday.setDate(jan1.getDate() + (8 - dayOfWeek) % 7);
  const monday = new Date(firstMonday);
  monday.setDate(firstMonday.getDate() + (week - 1) * 7);
  return monday;
}

function getPrevWeekKey(weekKey: string): string {
  const monday = getMondayOf(weekKey);
  monday.setDate(monday.getDate() - 7);
  return getISOWeekKey(monday);
}

export function evaluateStreak(
  profile: UserProfile,
  sessions: WorkoutSession[],
  now: Date = new Date()
): Partial<UserProfile> {
  const currentWeekKey = getISOWeekKey(now);
  const prevWeekKey = getPrevWeekKey(currentWeekKey);

  // Count sessions in previous full week
  const prevWeekSessions = sessions.filter(
    (s) => getISOWeekKey(new Date(s.date)) === prevWeekKey
  );

  // If previous week has 0 sessions and it's fully in the past, break streak
  let currentStreak = profile.currentStreak;
  if (prevWeekSessions.length === 0 && profile.lastStreakWeek !== currentWeekKey) {
    // Previous week passed with no workouts
    const prevMonday = getMondayOf(prevWeekKey);
    if (prevMonday < now) {
      currentStreak = 0;
    }
  }

  // Count sessions in current week
  const currentWeekSessions = sessions.filter(
    (s) => getISOWeekKey(new Date(s.date)) === currentWeekKey
  );

  // Increment streak if this week qualifies (>=2 sessions) and not already counted
  let lastStreakWeek = profile.lastStreakWeek;
  if (currentWeekSessions.length >= 2 && lastStreakWeek !== currentWeekKey) {
    currentStreak += 1;
    lastStreakWeek = currentWeekKey;
  }

  const longestStreak = Math.max(profile.longestStreak, currentStreak);

  return { currentStreak, longestStreak, lastStreakWeek };
}
