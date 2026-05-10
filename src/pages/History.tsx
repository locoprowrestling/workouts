import { useState } from 'react';
import { useApp } from '../context/AppContext';
import type { WorkoutType } from '../types';
import WorkoutCard from '../components/ui/WorkoutCard';

type Filter = WorkoutType | 'all';

const FILTERS: { value: Filter; label: string }[] = [
  { value: 'all',         label: 'All'         },
  { value: 'strength',    label: 'Strength'    },
  { value: 'cardio',      label: 'Cardio'      },
  { value: 'flexibility', label: 'Flexibility' },
];

export default function History() {
  const { state } = useApp();
  const [filter, setFilter] = useState<Filter>('all');

  const filtered = filter === 'all'
    ? state.sessions
    : state.sessions.filter((s) => s.type === filter);

  return (
    <div className="px-4 py-6 max-w-lg mx-auto flex flex-col gap-5">
      <h1 className="text-2xl font-bold text-white">History</h1>

      {/* Filter tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              filter === f.value
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-500">
          <div className="text-4xl mb-3">📋</div>
          <p>{filter === 'all' ? 'No workouts logged yet.' : `No ${filter} sessions yet.`}</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map((s) => <WorkoutCard key={s.id} session={s} />)}
        </div>
      )}
    </div>
  );
}
