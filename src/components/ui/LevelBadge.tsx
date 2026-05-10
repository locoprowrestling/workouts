import { getLevelTier, TIER_COLORS } from '../../constants/levels';

interface Props {
  level: number;
  size?: 'sm' | 'md' | 'lg';
}

const SIZES = {
  sm: 'w-8 h-8 text-xs border-2',
  md: 'w-12 h-12 text-sm border-2',
  lg: 'w-20 h-20 text-2xl border-4',
};

export default function LevelBadge({ level, size = 'md' }: Props) {
  const tier = getLevelTier(level);
  const colors = TIER_COLORS[tier];
  return (
    <div className={`rounded-full flex items-center justify-center font-bold border ${SIZES[size]} ${colors.ring} ${colors.text}`}>
      {level === 50 ? '👑' : level}
    </div>
  );
}
