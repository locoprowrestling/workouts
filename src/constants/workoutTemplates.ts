import type { WorkoutTemplateDefinition } from '../types';

export const WORKOUT_TEMPLATES: WorkoutTemplateDefinition[] = [
  {
    id: 'A',
    name: 'Workout A',
    focus: 'Chest · Quads · Biceps',
    type: 'strength',
    exercises: [
      { name: 'Goblet Squat',            sets: 3, targetMinReps: 8,  targetMaxReps: 12 },
      { name: 'Reverse Lunge',           sets: 2, targetMinReps: 10, targetMaxReps: 10, note: 'each leg' },
      { name: 'Dumbbell Flat Bench Press', sets: 3, targetMinReps: 8, targetMaxReps: 12 },
      { name: 'Lat Pulldown',            sets: 3, targetMinReps: 10, targetMaxReps: 12 },
      { name: 'Dumbbell Flyes',          sets: 2, targetMinReps: 12, targetMaxReps: 15 },
      { name: 'Dumbbell Bicep Curls',    sets: 3, targetMinReps: 10, targetMaxReps: 15 },
    ],
    conditioning: 'Incline Treadmill Walk — 10–15 min @ 8–12% incline',
  },
  {
    id: 'B',
    name: 'Workout B',
    focus: 'Shoulders · Hamstrings · Triceps',
    type: 'strength',
    exercises: [
      { name: 'Romanian Deadlift',       sets: 3, targetMinReps: 8,  targetMaxReps: 12 },
      { name: 'Bulgarian Split Squat',   sets: 2, targetMinReps: 10, targetMaxReps: 10, note: 'each leg' },
      { name: 'Incline DB Press',        sets: 3, targetMinReps: 8,  targetMaxReps: 12 },
      { name: 'Seated Cable Row',        sets: 3, targetMinReps: 10, targetMaxReps: 12 },
      { name: 'Overhead Dumbbell Press', sets: 3, targetMinReps: 10, targetMaxReps: 12 },
      { name: 'Tricep Cable Pushdowns',  sets: 3, targetMinReps: 12, targetMaxReps: 15 },
      { name: "Farmer's Carries",        sets: 3, targetMinReps: 1,  targetMaxReps: 1,  note: '30 meters' },
    ],
    conditioning: 'Rower or Bike Intervals — 10 min (30s hard / 30s easy)',
  },
];
