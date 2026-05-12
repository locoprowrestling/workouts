import type { Quest, WorkoutSession } from '../types';
import { generateQuests } from '../constants/quests';

function getMonday(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  d.setDate(diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

export function shouldResetQuests(lastResetDate: string, now: Date = new Date()): boolean {
  const last = new Date(lastResetDate);
  const thisMonday = getMonday(now);
  return last < thisMonday;
}

function countMatchingSessions(quest: Quest, sessions: WorkoutSession[]): number {
  const start = new Date(quest.startDate);
  const relevant = sessions.filter((s) => new Date(s.date) >= start);

  switch (quest.id) {
    case 'wq_strength_3':   return relevant.filter((s) => s.type === 'strength').length;
    case 'wq_cardio_2':     return relevant.filter((s) => s.type === 'cardio').length;
    case 'wq_flex_2':       return relevant.filter((s) => s.type === 'flexibility').length;
    case 'wq_any_3':        return relevant.length;
    case 'wq_full_week': {
      const hasA = relevant.some((s) => s.templateId === 'A');
      const hasB = relevant.some((s) => s.templateId === 'B');
      return (hasA ? 1 : 0) + (hasB ? 1 : 0);
    }
    case 'mq_strength_12':  return relevant.filter((s) => s.type === 'strength').length;
    case 'mq_variety': {
      const types = new Set(relevant.map((s) => s.type));
      return types.size;
    }
    case 'mq_cardio_8':     return relevant.filter((s) => s.type === 'cardio').length;
    case 'mq_flex_8':       return relevant.filter((s) => s.type === 'flexibility').length;
    case 'mq_total_12':     return relevant.length;
    default: return 0;
  }
}

export function updateQuestProgress(quests: Quest[], sessions: WorkoutSession[]): {
  quests: Quest[];
  newlyCompleted: string[];
} {
  const newlyCompleted: string[] = [];

  const updated = quests.map((quest) => {
    if (quest.completed) return quest;
    const currentCount = countMatchingSessions(quest, sessions);
    const completed = currentCount >= quest.goalCount;
    if (completed && !quest.completed) newlyCompleted.push(quest.id);
    return { ...quest, currentCount: Math.min(currentCount, quest.goalCount), completed };
  });

  return { quests: updated, newlyCompleted };
}

export function recomputeQuestProgress(quests: Quest[], sessions: WorkoutSession[]): {
  quests: Quest[];
  completedQuestCount: number;
} {
  const updated = quests.map((quest) => {
    const currentCount = countMatchingSessions(quest, sessions);
    const completed = currentCount >= quest.goalCount;
    return { ...quest, currentCount: Math.min(currentCount, quest.goalCount), completed };
  });
  return { quests: updated, completedQuestCount: updated.filter((q) => q.completed).length };
}

export function resetAndRegenerateQuests(
  existingQuests: Quest[],
  now: Date = new Date()
): Quest[] {
  const fresh = generateQuests(now);
  return fresh.map((newQ) => {
    const old = existingQuests.find((q) => q.id === newQ.id);
    // Keep monthly quests if still in same month
    if (old && old.period === 'monthly') {
      const oldDeadline = new Date(old.deadline);
      if (oldDeadline >= now) return old;
    }
    return newQ;
  });
}
