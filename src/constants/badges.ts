import type { BadgeDefinition } from '../types';

export const BADGE_DEFINITIONS: BadgeDefinition[] = [
  // Consistency
  { id: 'streak_2',  name: 'On A Roll',    description: 'Maintain a 2-week streak',   icon: '🔥', category: 'consistency' },
  { id: 'streak_5',  name: 'Habit Forming', description: 'Maintain a 5-week streak',  icon: '🌊', category: 'consistency' },
  { id: 'streak_10', name: 'Iron Will',     description: 'Maintain a 10-week streak', icon: '⚡', category: 'consistency' },
  { id: 'streak_20', name: 'Unstoppable',   description: 'Maintain a 20-week streak', icon: '🏆', category: 'consistency' },

  // Volume
  { id: 'workouts_1',   name: 'First Step',       description: 'Log your first workout',    icon: '👟', category: 'volume' },
  { id: 'workouts_10',  name: 'Getting Serious',   description: 'Log 10 total workouts',     icon: '💪', category: 'volume' },
  { id: 'workouts_25',  name: 'Quarter Century',   description: 'Log 25 total workouts',     icon: '🎯', category: 'volume' },
  { id: 'workouts_50',  name: 'Dedicated',         description: 'Log 50 total workouts',     icon: '🏅', category: 'volume' },
  { id: 'workouts_100', name: 'Century Club',      description: 'Log 100 total workouts',    icon: '💯', category: 'volume' },

  // Type
  { id: 'first_strength',    name: 'Iron Initiate',      description: 'Log your first strength workout',    icon: '🏋️', category: 'type' },
  { id: 'first_cardio',      name: 'Pavement Pounder',   description: 'Log your first cardio workout',      icon: '🏃', category: 'type' },
  { id: 'first_flexibility', name: 'Lotus Learner',      description: 'Log your first flexibility workout', icon: '🧘', category: 'type' },
  { id: 'all_rounder',       name: 'All-Rounder',        description: 'Log all 3 workout types',            icon: '🌟', category: 'type' },

  // Milestone
  { id: 'level_10', name: 'Rising Star', description: 'Reach level 10', icon: '⭐', category: 'milestone' },
  { id: 'level_25', name: 'Veteran',     description: 'Reach level 25', icon: '🛡️', category: 'milestone' },
  { id: 'level_50', name: 'Legend',      description: 'Reach level 50', icon: '👑', category: 'milestone' },

  // Quest
  { id: 'quest_5', name: 'Quest Master', description: 'Complete 5 quests', icon: '📜', category: 'quest' },
];
