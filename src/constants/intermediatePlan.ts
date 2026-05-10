export const INTERMEDIATE_UNLOCK_LEVEL = 15;

export type IntermediateDayId = 'UA' | 'LA' | 'UB' | 'LB';

export interface IntermediateExerciseDef {
  name: string;
  sets: number;
  targetMinReps: number;
  targetMaxReps: number;
  beginnerWeight: number;
  beginnerNote?: string;
}

export interface IntermediateDayDef {
  id: IntermediateDayId;
  name: string;
  focus: string;
  tag: string;
  exercises: IntermediateExerciseDef[];
  conditioning?: string;
}

export const INTERMEDIATE_DAYS: IntermediateDayDef[] = [
  {
    id: 'UA',
    name: 'Upper A',
    focus: 'Strength Focus',
    tag: 'MON',
    exercises: [
      { name: 'Bench Press',                sets: 4, targetMinReps: 5,  targetMaxReps: 8,  beginnerWeight: 95  },
      { name: 'Barbell Row',                sets: 4, targetMinReps: 5,  targetMaxReps: 8,  beginnerWeight: 95  },
      { name: 'Overhead Press',             sets: 3, targetMinReps: 6,  targetMaxReps: 10, beginnerWeight: 35  },
      { name: 'Lat Pulldown',               sets: 3, targetMinReps: 8,  targetMaxReps: 10, beginnerWeight: 80  },
      { name: 'Incline DB Press',           sets: 3, targetMinReps: 10, targetMaxReps: 12, beginnerWeight: 30  },
      { name: 'Dumbbell Bicep Curl',        sets: 2, targetMinReps: 12, targetMaxReps: 12, beginnerWeight: 25  },
      { name: 'Tricep Overhead Extension',  sets: 2, targetMinReps: 12, targetMaxReps: 12, beginnerWeight: 30  },
    ],
  },
  {
    id: 'LA',
    name: 'Lower A',
    focus: 'Strength Focus',
    tag: 'TUE',
    exercises: [
      { name: 'Barbell Back Squat',   sets: 4, targetMinReps: 5,  targetMaxReps: 8,  beginnerWeight: 95  },
      { name: 'Romanian Deadlift',    sets: 4, targetMinReps: 6,  targetMaxReps: 10, beginnerWeight: 95  },
      { name: 'Bulgarian Split Squat',sets: 3, targetMinReps: 8,  targetMaxReps: 10, beginnerWeight: 20  },
      { name: 'Leg Curl (Machine)',   sets: 3, targetMinReps: 10, targetMaxReps: 12, beginnerWeight: 60  },
      { name: 'Calf Raises',          sets: 3, targetMinReps: 15, targetMaxReps: 15, beginnerWeight: 0, beginnerNote: 'bodyweight' },
      { name: 'Ab Wheel Rollout',     sets: 3, targetMinReps: 8,  targetMaxReps: 10, beginnerWeight: 0, beginnerNote: 'bodyweight' },
      { name: 'Side Plank',           sets: 2, targetMinReps: 1,  targetMaxReps: 1,  beginnerWeight: 0, beginnerNote: '30–45 sec each side' },
    ],
  },
  {
    id: 'UB',
    name: 'Upper B',
    focus: 'Volume Focus',
    tag: 'THU',
    exercises: [
      { name: 'Incline DB Press',          sets: 4, targetMinReps: 10, targetMaxReps: 12, beginnerWeight: 30 },
      { name: 'Seated Cable Row',          sets: 4, targetMinReps: 10, targetMaxReps: 12, beginnerWeight: 60 },
      { name: 'Lateral Raises',            sets: 3, targetMinReps: 15, targetMaxReps: 15, beginnerWeight: 12 },
      { name: 'Cable Flyes',               sets: 3, targetMinReps: 12, targetMaxReps: 15, beginnerWeight: 20 },
      { name: 'Face Pulls',                sets: 3, targetMinReps: 15, targetMaxReps: 15, beginnerWeight: 30 },
      { name: 'Hammer Curls',              sets: 3, targetMinReps: 12, targetMaxReps: 12, beginnerWeight: 20 },
      { name: 'Tricep Cable Pushdowns',    sets: 3, targetMinReps: 12, targetMaxReps: 15, beginnerWeight: 35 },
    ],
  },
  {
    id: 'LB',
    name: 'Lower B',
    focus: 'Volume Focus',
    tag: 'FRI',
    conditioning: 'Rower or Bike Intervals — 12 min (30s hard / 30s easy)',
    exercises: [
      { name: 'Leg Press',       sets: 4, targetMinReps: 10, targetMaxReps: 15, beginnerWeight: 90  },
      { name: 'Deadlift',        sets: 3, targetMinReps: 5,  targetMaxReps: 6,  beginnerWeight: 135 },
      { name: 'Reverse Lunge',   sets: 3, targetMinReps: 12, targetMaxReps: 12, beginnerWeight: 0, beginnerNote: 'bodyweight' },
      { name: 'Leg Extension',   sets: 3, targetMinReps: 12, targetMaxReps: 15, beginnerWeight: 50  },
      { name: "Farmer's Carries",sets: 3, targetMinReps: 1,  targetMaxReps: 1,  beginnerWeight: 35, beginnerNote: '40 meters' },
    ],
  },
];
