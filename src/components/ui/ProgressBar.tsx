interface Props {
  percent: number;
  colorClass?: string;
  height?: string;
}

export default function ProgressBar({ percent, colorClass = 'bg-indigo-500', height = 'h-2' }: Props) {
  return (
    <div className={`w-full bg-gray-700 rounded-full overflow-hidden ${height}`}>
      <div
        className={`${colorClass} ${height} rounded-full transition-all duration-700 ease-out`}
        style={{ width: `${Math.min(100, percent)}%` }}
      />
    </div>
  );
}
