export type WorkoutType = 'strength' | 'cardio' | 'flexibility';
export type BadgeCategory = 'consistency' | 'volume' | 'type' | 'milestone' | 'quest';
export type QuestCategory = 'strength' | 'stamina' | 'flexibility' | 'consistency';
export type QuestPeriod = 'weekly' | 'monthly';
export type WorkoutTemplate = 'A' | 'B' | 'custom';

export interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: number;
  targetMinReps: number;
  targetMaxReps: number;
  weight: number;
  weightUnit: 'lbs' | 'kg';
  progressionUnlocked: boolean;
  setLogs?: { weight: number; reps: number }[];
}

export interface WorkoutSession {
  id: string;
  date: string;
  type: WorkoutType;
  templateId: WorkoutTemplate | null;
  durationMinutes: number;
  exercises: Exercise[];
  conditioningNotes: string;
  notes: string;
  xpEarned: number;
}

export interface UserProfile {
  level: number;
  totalXP: number;
  currentStreak: number;
  longestStreak: number;
  totalWorkouts: number;
  lastStreakWeek: string | null;
  workoutTypeCounts: Record<WorkoutType, number>;
  badges: { id: string; unlockedAt: string | null }[];
  createdAt: string;
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  period: QuestPeriod;
  category: QuestCategory;
  goalCount: number;
  currentCount: number;
  deadline: string;
  rewardXP: number;
  completed: boolean;
  startDate: string;
}

export interface BadgeDefinition {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: BadgeCategory;
}

export interface TemplateExercise {
  name: string;
  sets: number;
  targetMinReps: number;
  targetMaxReps: number;
  note?: string;
}

export interface WorkoutTemplateDefinition {
  id: WorkoutTemplate;
  name: string;
  focus: string;
  type: WorkoutType;
  exercises: TemplateExercise[];
  conditioning: string;
}

export interface AppStorage {
  profile: UserProfile;
  sessions: WorkoutSession[];
  quests: Quest[];
  lastQuestResetDate: string;
  completedQuestCount: number;
  seenIntermediatePlanUnlock: boolean;
}
