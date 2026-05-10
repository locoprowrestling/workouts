export type Split = 'upper' | 'lower';
export type MuscleGroup = 'chest' | 'back' | 'shoulders' | 'arms' | 'quads' | 'hamstrings' | 'glutes' | 'calves';

export interface MuscleGroupDef {
  label: string;
  split: Split;
  exercises: { name: string; sets: number }[];
}

export const MUSCLE_GROUPS: Record<MuscleGroup, MuscleGroupDef> = {
  chest: {
    label: 'Chest',
    split: 'upper',
    exercises: [
      { name: 'Bench Press', sets: 3 },
      { name: 'Incline DB Press', sets: 3 },
      { name: 'Dumbbell Flyes', sets: 2 },
    ],
  },
  back: {
    label: 'Back',
    split: 'upper',
    exercises: [
      { name: 'Lat Pulldown', sets: 3 },
      { name: 'Seated Cable Row', sets: 3 },
    ],
  },
  shoulders: {
    label: 'Shoulders',
    split: 'upper',
    exercises: [
      { name: 'Overhead Dumbbell Press', sets: 3 },
      { name: 'Lateral Raises', sets: 3 },
    ],
  },
  arms: {
    label: 'Arms',
    split: 'upper',
    exercises: [
      { name: 'Dumbbell Bicep Curls', sets: 3 },
      { name: 'Tricep Cable Pushdowns', sets: 3 },
    ],
  },
  quads: {
    label: 'Quads',
    split: 'lower',
    exercises: [
      { name: 'Goblet Squat', sets: 3 },
      { name: 'Reverse Lunge', sets: 2 },
    ],
  },
  hamstrings: {
    label: 'Hamstrings',
    split: 'lower',
    exercises: [
      { name: 'Romanian Deadlift', sets: 3 },
      { name: 'Bulgarian Split Squat', sets: 2 },
    ],
  },
  glutes: {
    label: 'Glutes',
    split: 'lower',
    exercises: [
      { name: 'Hip Thrust', sets: 3 },
      { name: 'Glute Bridge', sets: 3 },
    ],
  },
  calves: {
    label: 'Calves',
    split: 'lower',
    exercises: [
      { name: 'Standing Calf Raise', sets: 3 },
      { name: 'Seated Calf Raise', sets: 3 },
    ],
  },
};

export const UPPER_GROUPS: MuscleGroup[] = ['chest', 'back', 'shoulders', 'arms'];
export const LOWER_GROUPS: MuscleGroup[] = ['quads', 'hamstrings', 'glutes', 'calves'];
