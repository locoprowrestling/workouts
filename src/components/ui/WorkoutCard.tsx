import type { WorkoutSession } from '../../types';

const TYPE_ICONS: Record<string, string> = {
  strength:    '🏋️',
  cardio:      '🏃',
  flexibility: '🧘',
};

interface Props {
  session: WorkoutSession;
}

export default function WorkoutCard({ session }: Props) {
  const progressionCount = session.exercises.filter((e) => e.progressionUnlocked).length;
  const date = new Date(session.date);

  return (
    <div className="bg-gray-900 rounded-xl p-4 flex items-center gap-4">
      <div className="text-3xl">{TYPE_ICONS[session.type] ?? '💪'}</div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-semibold text-sm text-white capitalize">{session.type}</span>
          {session.templateId && session.templateId !== 'custom' && (
            <span className="text-xs bg-gray-800 text-gray-400 px-2 py-0.5 rounded-full">
              Workout {session.templateId}
            </span>
          )}
        </div>
        <div className="text-xs text-gray-400 mt-0.5">
          {date.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })} · {session.durationMinutes} min
          {session.exercises.length > 0 && ` · ${session.exercises.length} exercises`}
        </div>
        {progressionCount > 0 && (
          <div className="text-xs text-green-400 mt-0.5">
            ⬆ {progressionCount} progression{progressionCount > 1 ? 's' : ''} unlocked
          </div>
        )}
      </div>
      <div className="text-right">
        <div className="text-indigo-400 font-bold text-sm">+{session.xpEarned}</div>
        <div className="text-xs text-gray-500">XP</div>
      </div>
    </div>
  );
}
