import type { WorkoutSession, Exercise } from '../types';

type ExerciseWithSetLogs = Exercise & { setLogs?: { weight: number; reps: number }[] };

export interface PRRecord {
  weight: number;
  reps: number;
}

export interface RecentPR {
  exerciseName: string;
  weight: number;
  reps: number;
  date: string;
}

export function getPR(exerciseName: string, sessions: WorkoutSession[]): PRRecord | null {
  const key = exerciseName.toLowerCase();
  let best: PRRecord | null = null;

  for (const session of sessions) {
    for (const exercise of session.exercises) {
      if (exercise.name.toLowerCase() !== key) continue;
      const ex = exercise as ExerciseWithSetLogs;
      const candidates = ex.setLogs ?? [{ weight: exercise.weight, reps: exercise.reps }];
      for (const { weight, reps } of candidates) {
        if (weight === 0) continue;
        if (!best || weight > best.weight || (weight === best.weight && reps > best.reps)) {
          best = { weight, reps };
        }
      }
    }
  }

  return best;
}

export function getRecentPRs(sessions: WorkoutSession[], limit = 3): RecentPR[] {
  const prMap = new Map<string, RecentPR>();

  const sorted = [...sessions].sort((a, b) => a.date.localeCompare(b.date));

  for (const session of sorted) {
    for (const exercise of session.exercises) {
      const key = exercise.name.toLowerCase();
      const ex = exercise as ExerciseWithSetLogs;
      const candidates = ex.setLogs ?? [{ weight: exercise.weight, reps: exercise.reps }];
      for (const { weight, reps } of candidates) {
        if (weight === 0) continue;
        const current = prMap.get(key);
        if (!current || weight > current.weight || (weight === current.weight && reps > current.reps)) {
          prMap.set(key, { exerciseName: exercise.name, weight, reps, date: session.date });
        }
      }
    }
  }

  return [...prMap.values()]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, limit);
}
