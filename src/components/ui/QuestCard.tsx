import type { Quest } from '../../types';
import ProgressBar from './ProgressBar';

const CATEGORY_COLORS: Record<string, { border: string; bar: string; icon: string }> = {
  strength:    { border: 'border-blue-800',   bar: 'bg-blue-500',   icon: '🏋️' },
  stamina:     { border: 'border-orange-800', bar: 'bg-orange-500', icon: '🏃' },
  flexibility: { border: 'border-green-800',  bar: 'bg-green-500',  icon: '🧘' },
  consistency: { border: 'border-purple-800', bar: 'bg-purple-500', icon: '🎯' },
};

function daysUntil(deadline: string): number {
  const diff = new Date(deadline).getTime() - Date.now();
  return Math.max(0, Math.ceil(diff / 86400000));
}

interface Props {
  quest: Quest;
}

export default function QuestCard({ quest }: Props) {
  const colors = CATEGORY_COLORS[quest.category] ?? CATEGORY_COLORS.consistency;
  const percent = Math.round((quest.currentCount / quest.goalCount) * 100);
  const days = daysUntil(quest.deadline);

  return (
    <div className={`bg-gray-900 rounded-xl p-4 border-l-4 ${colors.border}`}>
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex items-center gap-2">
          <span>{colors.icon}</span>
          <span className="font-semibold text-sm text-white">{quest.title}</span>
        </div>
        <span className="text-xs bg-indigo-900 text-indigo-300 px-2 py-0.5 rounded-full whitespace-nowrap">
          +{quest.rewardXP} XP
        </span>
      </div>
      <p className="text-xs text-gray-400 mb-3">{quest.description}</p>
      {quest.completed ? (
        <div className="flex items-center gap-2 text-green-400 text-sm font-semibold">
          <span>✅</span> Completed!
        </div>
      ) : (
        <>
          <ProgressBar percent={percent} colorClass={colors.bar} />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>{quest.currentCount} / {quest.goalCount}</span>
            <span>{days === 0 ? 'Resets today' : `${days}d left`}</span>
          </div>
        </>
      )}
    </div>
  );
}
