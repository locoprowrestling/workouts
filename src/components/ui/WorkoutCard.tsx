import { useState } from 'react';
import type { WorkoutSession } from '../../types';
import { useApp } from '../../context/AppContext';

const TYPE_ICONS: Record<string, string> = {
  strength:    '🏋️',
  cardio:      '🏃',
  flexibility: '🧘',
};

interface Props {
  session: WorkoutSession;
}

export default function WorkoutCard({ session }: Props) {
  const { deleteWorkout } = useApp();
  const [confirming, setConfirming] = useState(false);
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
      <div className="flex items-center gap-3">
        <div className="text-right">
          <div className="text-indigo-400 font-bold text-sm">+{session.xpEarned}</div>
          <div className="text-xs text-gray-500">XP</div>
        </div>
        {confirming ? (
          <div className="flex items-center gap-1">
            <button
              onClick={() => deleteWorkout(session.id)}
              className="text-xs bg-red-600 hover:bg-red-500 text-white px-2 py-1 rounded-lg transition-colors"
            >
              Delete
            </button>
            <button
              onClick={() => setConfirming(false)}
              className="text-xs bg-gray-700 hover:bg-gray-600 text-gray-300 px-2 py-1 rounded-lg transition-colors"
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            onClick={() => setConfirming(true)}
            className="text-gray-600 hover:text-red-400 transition-colors p-1"
            aria-label="Delete workout"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
