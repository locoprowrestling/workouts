import { describe, it, expect } from 'vitest';
import { getPR, getRecentPRs } from './pr';
import type { WorkoutSession } from '../types';

function makeSession(overrides: Partial<WorkoutSession> = {}): WorkoutSession {
  return {
    id: crypto.randomUUID(),
    date: '2026-01-01',
    type: 'strength',
    templateId: null,
    durationMinutes: 60,
    conditioningNotes: '',
    notes: '',
    xpEarned: 100,
    exercises: [],
    ...overrides,
  };
}

const sessions: WorkoutSession[] = [
  makeSession({
    date: '2026-01-01',
    exercises: [{
      id: '1', name: 'Bench Press', sets: 3, reps: 10, weight: 135,
      targetMinReps: 8, targetMaxReps: 12, weightUnit: 'lbs', progressionUnlocked: false,
      setLogs: [{ weight: 135, reps: 10 }, { weight: 135, reps: 9 }, { weight: 135, reps: 8 }],
    } as any],
  }),
  makeSession({
    date: '2026-02-01',
    exercises: [{
      id: '2', name: 'Bench Press', sets: 3, reps: 8, weight: 155,
      targetMinReps: 8, targetMaxReps: 12, weightUnit: 'lbs', progressionUnlocked: false,
      setLogs: [{ weight: 155, reps: 8 }, { weight: 155, reps: 7 }, { weight: 145, reps: 10 }],
    } as any],
  }),
];

describe('getPR', () => {
  it('returns null for unknown exercise', () => {
    expect(getPR('Squat', sessions)).toBeNull();
  });

  it('returns highest weight and reps at that weight', () => {
    const pr = getPR('Bench Press', sessions);
    expect(pr).toEqual({ weight: 155, reps: 8 });
  });

  it('is case-insensitive', () => {
    const pr = getPR('bench press', sessions);
    expect(pr?.weight).toBe(155);
  });

  it('falls back to weight/reps when setLogs absent', () => {
    const s = [makeSession({
      exercises: [{
        id: '3', name: 'Squat', sets: 3, reps: 12, weight: 200,
        targetMinReps: 8, targetMaxReps: 12, weightUnit: 'lbs', progressionUnlocked: false,
      }],
    })];
    expect(getPR('Squat', s)).toEqual({ weight: 200, reps: 12 });
  });

  it('skips sets with weight 0', () => {
    const s = [makeSession({
      exercises: [{
        id: '4', name: 'Squat', sets: 1, reps: 0, weight: 0,
        targetMinReps: 8, targetMaxReps: 12, weightUnit: 'lbs', progressionUnlocked: false,
        setLogs: [{ weight: 0, reps: 0 }],
      } as any],
    })];
    expect(getPR('Squat', s)).toBeNull();
  });
});

describe('getRecentPRs', () => {
  it('returns at most limit entries', () => {
    expect(getRecentPRs(sessions, 1)).toHaveLength(1);
  });

  it('returns most recently achieved PR first', () => {
    const results = getRecentPRs(sessions, 3);
    expect(results[0].exerciseName).toBe('Bench Press');
    expect(results[0].weight).toBe(155);
    expect(results[0].date).toBe('2026-02-01');
  });

  it('returns empty array for no sessions', () => {
    expect(getRecentPRs([], 3)).toEqual([]);
  });
});
