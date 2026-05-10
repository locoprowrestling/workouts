import { useState } from 'react';
import { useApp } from '../context/AppContext';
import BadgeCard from '../components/ui/BadgeCard';
import { BADGE_DEFINITIONS } from '../constants/badges';
import type { BadgeCategory } from '../types';

type Filter = BadgeCategory | 'all';

const FILTERS: { value: Filter; label: string }[] = [
  { value: 'all',         label: 'All'         },
  { value: 'consistency', label: 'Consistency' },
  { value: 'volume',      label: 'Volume'      },
  { value: 'type',        label: 'Type'        },
  { value: 'milestone',   label: 'Milestone'   },
  { value: 'quest',       label: 'Quest'       },
];

export default function Achievements() {
  const { state } = useApp();
  const [filter, setFilter] = useState<Filter>('all');

  const badgeMap = new Map(state.profile.badges.map((b) => [b.id, b.unlockedAt]));
  const unlockedCount = state.profile.badges.filter((b) => b.unlockedAt).length;
  const total = state.profile.badges.length;

  const displayed = BADGE_DEFINITIONS.filter(
    (b) => filter === 'all' || b.category === filter
  );

  return (
    <div className="px-4 py-6 max-w-lg mx-auto flex flex-col gap-5">
      <div>
        <h1 className="text-2xl font-bold text-white">Achievements</h1>
        <p className="text-sm text-gray-400 mt-1">{unlockedCount} / {total} badges unlocked</p>
      </div>

      {/* Progress bar */}
      <div className="w-full bg-gray-800 rounded-full h-2">
        <div
          className="h-2 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-700"
          style={{ width: `${Math.round((unlockedCount / total) * 100)}%` }}
        />
      </div>

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

      {/* Badge grid */}
      <div className="grid grid-cols-3 gap-3">
        {displayed.map((def) => (
          <BadgeCard key={def.id} id={def.id} unlockedAt={badgeMap.get(def.id) ?? null} />
        ))}
      </div>
    </div>
  );
}
