interface Props {
  streak: number;
}

export default function StreakCounter({ streak }: Props) {
  if (streak === 0) {
    return <span className="text-gray-500 text-sm">Start your streak!</span>;
  }
  return (
    <span className="flex items-center gap-1">
      <span className={streak >= 5 ? 'animate-flicker' : ''}>🔥</span>
      <span className="font-bold">{streak}</span>
      <span className="text-gray-400 text-sm">week{streak !== 1 ? 's' : ''}</span>
    </span>
  );
}
