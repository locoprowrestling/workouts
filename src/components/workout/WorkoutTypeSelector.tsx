import type { WorkoutType } from '../../types';

interface Props {
  value: WorkoutType;
  onChange: (type: WorkoutType) => void;
}

const OPTIONS: { type: WorkoutType; icon: string; label: string; desc: string }[] = [
  { type: 'strength',    icon: '🏋️', label: 'Strength',    desc: 'Weights & resistance' },
  { type: 'cardio',      icon: '🏃', label: 'Cardio',      desc: 'Running, bike, row'   },
  { type: 'flexibility', icon: '🧘', label: 'Flexibility', desc: 'Yoga & stretching'    },
];

export default function WorkoutTypeSelector({ value, onChange }: Props) {
  return (
    <div className="grid grid-cols-3 gap-3">
      {OPTIONS.map((opt) => (
        <button
          key={opt.type}
          type="button"
          onClick={() => onChange(opt.type)}
          className={`rounded-xl p-3 flex flex-col items-center gap-1 border-2 transition-all ${
            value === opt.type
              ? 'border-indigo-500 bg-indigo-950 text-white'
              : 'border-gray-700 bg-gray-900 text-gray-400 hover:border-gray-600'
          }`}
        >
          <span className="text-2xl">{opt.icon}</span>
          <span className="text-xs font-semibold">{opt.label}</span>
          <span className="text-xs text-gray-500">{opt.desc}</span>
        </button>
      ))}
    </div>
  );
}
