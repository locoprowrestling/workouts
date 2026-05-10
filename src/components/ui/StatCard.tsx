interface Props {
  label: string;
  value: string | number;
  icon: string;
  sub?: string;
}

export default function StatCard({ label, value, icon, sub }: Props) {
  return (
    <div className="bg-gray-900 rounded-xl p-4 flex flex-col gap-1">
      <div className="text-xl">{icon}</div>
      <div className="text-2xl font-bold text-white">{value}</div>
      <div className="text-xs text-gray-400">{label}</div>
      {sub && <div className="text-xs text-gray-500">{sub}</div>}
    </div>
  );
}
