export type Split = 'upper' | 'lower';
export type MuscleGroup = 'chest' | 'back' | 'shoulders' | 'arms' | 'quads' | 'hamstrings' | 'glutes' | 'calves';

export interface ExerciseDef {
  name: string;
  sets: number;
  beginnerWeight: number;  // lbs; 0 = bodyweight
  beginnerReps: number;
  beginnerNote?: string;
}

export interface MuscleGroupDef {
  label: string;
  split: Split;
  exercises: ExerciseDef[];
}

export const MUSCLE_GROUPS: Record<MuscleGroup, MuscleGroupDef> = {
  chest: {
    label: 'Chest',
    split: 'upper',
    exercises: [
      { name: 'Bench Press',      sets: 3, beginnerWeight: 45,  beginnerReps: 8  },
      { name: 'Incline DB Press', sets: 3, beginnerWeight: 15,  beginnerReps: 10 },
      { name: 'Dumbbell Flyes',   sets: 2, beginnerWeight: 10,  beginnerReps: 12 },
    ],
  },
  back: {
    label: 'Back',
    split: 'upper',
    exercises: [
      { name: 'Lat Pulldown',     sets: 3, beginnerWeight: 50, beginnerReps: 10 },
      { name: 'Seated Cable Row', sets: 3, beginnerWeight: 40, beginnerReps: 10 },
    ],
  },
  shoulders: {
    label: 'Shoulders',
    split: 'upper',
    exercises: [
      { name: 'Overhead Dumbbell Press', sets: 3, beginnerWeight: 15, beginnerReps: 10 },
      { name: 'Lateral Raises',          sets: 3, beginnerWeight: 8,  beginnerReps: 12 },
    ],
  },
  arms: {
    label: 'Arms',
    split: 'upper',
    exercises: [
      { name: 'Dumbbell Bicep Curls',   sets: 3, beginnerWeight: 15, beginnerReps: 10 },
      { name: 'Tricep Cable Pushdowns', sets: 3, beginnerWeight: 30, beginnerReps: 12 },
    ],
  },
  quads: {
    label: 'Quads',
    split: 'lower',
    exercises: [
      { name: 'Goblet Squat',   sets: 3, beginnerWeight: 20, beginnerReps: 10 },
      { name: 'Reverse Lunge',  sets: 2, beginnerWeight: 0,  beginnerReps: 10, beginnerNote: 'bodyweight' },
    ],
  },
  hamstrings: {
    label: 'Hamstrings',
    split: 'lower',
    exercises: [
      { name: 'Romanian Deadlift',     sets: 3, beginnerWeight: 40, beginnerReps: 10 },
      { name: 'Bulgarian Split Squat', sets: 2, beginnerWeight: 0,  beginnerReps: 8, beginnerNote: 'bodyweight' },
    ],
  },
  glutes: {
    label: 'Glutes',
    split: 'lower',
    exercises: [
      { name: 'Hip Thrust',    sets: 3, beginnerWeight: 45, beginnerReps: 12 },
      { name: 'Glute Bridge',  sets: 3, beginnerWeight: 0,  beginnerReps: 15, beginnerNote: 'bodyweight' },
    ],
  },
  calves: {
    label: 'Calves',
    split: 'lower',
    exercises: [
      { name: 'Standing Calf Raise', sets: 3, beginnerWeight: 0,  beginnerReps: 15, beginnerNote: 'bodyweight' },
      { name: 'Seated Calf Raise',   sets: 3, beginnerWeight: 25, beginnerReps: 15 },
    ],
  },
};

export const UPPER_GROUPS: MuscleGroup[] = ['chest', 'back', 'shoulders', 'arms'];
export const LOWER_GROUPS: MuscleGroup[] = ['quads', 'hamstrings', 'glutes', 'calves'];
