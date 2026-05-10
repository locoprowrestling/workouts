import { BADGE_DEFINITIONS } from '../../constants/badges';

interface Props {
  id: string;
  unlockedAt: string | null;
}

export default function BadgeCard({ id, unlockedAt }: Props) {
  const def = BADGE_DEFINITIONS.find((b) => b.id === id);
  if (!def) return null;
  const unlocked = !!unlockedAt;

  return (
    <div className={`rounded-xl p-4 flex flex-col items-center gap-2 text-center border transition-all ${
      unlocked
        ? 'bg-gray-900 border-gray-700'
        : 'bg-gray-950 border-gray-800 opacity-50'
    }`}>
      <div className={`text-3xl ${unlocked ? '' : 'grayscale'}`}>{def.icon}</div>
      <div className="font-semibold text-sm text-white leading-tight">
        {unlocked ? def.name : '???'}
      </div>
      <div className="text-xs text-gray-400 leading-snug">
        {unlocked ? def.description : 'Keep going to unlock'}
      </div>
      {unlocked && unlockedAt && (
        <div className="text-xs text-indigo-400">
          {new Date(unlockedAt).toLocaleDateString()}
        </div>
      )}
    </div>
  );
}
