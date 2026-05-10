import { useEffect, useState } from 'react';
import { getLevelProgress } from '../../lib/levelUtils';
import { getLevelTier, TIER_COLORS } from '../../constants/levels';

interface Props {
  totalXP: number;
  level: number;
}

export default function XPBar({ totalXP, level }: Props) {
  const { current, ceiling, floor, percent } = getLevelProgress(totalXP);
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setAnimated(true), 50);
    return () => clearTimeout(t);
  }, []);

  const tier = getLevelTier(level);
  const colors = TIER_COLORS[tier];

  return (
    <div className="w-full">
      <div className="flex justify-between text-xs text-gray-400 mb-1">
        <span>Level {level}</span>
        <span>{current.toLocaleString()} / {(ceiling - floor).toLocaleString()} XP</span>
      </div>
      <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
        <div
          className={`h-3 rounded-full bg-gradient-to-r ${colors.bg} transition-all duration-700 ease-out`}
          style={{ width: animated ? `${percent}%` : '0%' }}
        />
      </div>
    </div>
  );
}
