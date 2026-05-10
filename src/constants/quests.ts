import type { Quest, QuestCategory, QuestPeriod } from '../types';

interface QuestTemplate {
  id: string;
  title: string;
  description: string;
  period: QuestPeriod;
  category: QuestCategory;
  goalCount: number;
  rewardXP: number;
}

export const QUEST_TEMPLATES: QuestTemplate[] = [
  // Weekly
  { id: 'wq_strength_3',  title: 'Strength Week',    description: 'Log 3 strength workouts this week',  period: 'weekly',  category: 'strength',    goalCount: 3,  rewardXP: 200  },
  { id: 'wq_cardio_2',    title: 'Cardio Burst',      description: 'Log 2 cardio sessions this week',    period: 'weekly',  category: 'stamina',     goalCount: 2,  rewardXP: 150  },
  { id: 'wq_flex_2',      title: 'Stay Limber',       description: 'Log 2 flexibility sessions this week', period: 'weekly', category: 'flexibility', goalCount: 2,  rewardXP: 150  },
  { id: 'wq_any_3',       title: 'Gym Rat',           description: 'Log 3 workouts of any type this week', period: 'weekly', category: 'consistency', goalCount: 3,  rewardXP: 250  },
  { id: 'wq_full_week',   title: 'Full Program Week', description: 'Complete both Workout A and B this week', period: 'weekly', category: 'consistency', goalCount: 2, rewardXP: 300 },

  // Monthly
  { id: 'mq_strength_12', title: 'Iron Month',         description: 'Log 12 strength workouts this month',   period: 'monthly', category: 'strength',    goalCount: 12, rewardXP: 1000 },
  { id: 'mq_variety',     title: 'Well Rounded',       description: 'Log all 3 workout types this month',    period: 'monthly', category: 'consistency', goalCount: 3,  rewardXP: 500  },
  { id: 'mq_cardio_8',    title: 'Endurance Month',    description: 'Log 8 cardio sessions this month',      period: 'monthly', category: 'stamina',     goalCount: 8,  rewardXP: 800  },
  { id: 'mq_flex_8',      title: 'Flexibility Focus',  description: 'Log 8 flexibility sessions this month', period: 'monthly', category: 'flexibility', goalCount: 8,  rewardXP: 800  },
  { id: 'mq_total_12',    title: 'Month Warrior',      description: 'Log 12 total workouts this month',      period: 'monthly', category: 'consistency', goalCount: 12, rewardXP: 1500 },
];

function getMonday(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  d.setDate(diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

function getSunday(date: Date): Date {
  const monday = getMonday(date);
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  sunday.setHours(23, 59, 59, 999);
  return sunday;
}

function getMonthEnd(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59, 999);
}

function getMonthStart(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

export function generateQuests(now: Date = new Date()): Quest[] {
  const monday = getMonday(now);
  const sunday = getSunday(now);
  const monthStart = getMonthStart(now);
  const monthEnd = getMonthEnd(now);

  return QUEST_TEMPLATES.map((t) => ({
    id: t.id,
    title: t.title,
    description: t.description,
    period: t.period,
    category: t.category,
    goalCount: t.goalCount,
    currentCount: 0,
    deadline: t.period === 'weekly' ? sunday.toISOString() : monthEnd.toISOString(),
    startDate: t.period === 'weekly' ? monday.toISOString() : monthStart.toISOString(),
    rewardXP: t.rewardXP,
    completed: false,
  }));
}
