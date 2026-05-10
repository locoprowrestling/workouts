import type { Exercise } from '../../types';
import { Trash2 } from 'lucide-react';

interface Props {
  exercise: Exercise;
  onChange: (updated: Exercise) => void;
  onRemove: () => void;
}

export default function ExerciseRow({ exercise, onChange, onRemove }: Props) {
  const atTop = exercise.reps >= exercise.targetMaxReps;
  const progressionUnlocked = atTop;

  function update(patch: Partial<Exercise>) {
    const updated = { ...exercise, ...patch };
    updated.progressionUnlocked = updated.reps >= updated.targetMaxReps;
    onChange(updated);
  }

  return (
    <div className="bg-gray-800 rounded-xl p-3 flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <input
          className="flex-1 bg-gray-700 rounded-lg px-3 py-1.5 text-sm text-white placeholder-gray-500 outline-none focus:ring-1 focus:ring-indigo-500"
          value={exercise.name}
          onChange={(e) => update({ name: e.target.value })}
          placeholder="Exercise name"
        />
        <button type="button" onClick={onRemove} className="text-gray-500 hover:text-red-400 transition-colors p-1">
          <Trash2 size={15} />
        </button>
      </div>

      {exercise.targetMinReps > 0 && (
        <div className="text-xs text-gray-500">
          Target: {exercise.sets} sets × {exercise.targetMinReps}–{exercise.targetMaxReps} reps
          {exercise.targetMinReps === exercise.targetMaxReps && exercise.targetMaxReps === 1 ? '' : ''}
        </div>
      )}

      <div className="grid grid-cols-4 gap-2">
        <label className="flex flex-col gap-1">
          <span className="text-xs text-gray-400">Sets</span>
          <input
            type="number"
            min={1}
            max={10}
            className="bg-gray-700 rounded-lg px-2 py-1.5 text-sm text-white text-center outline-none focus:ring-1 focus:ring-indigo-500"
            value={exercise.sets}
            onChange={(e) => update({ sets: parseInt(e.target.value) || 1 })}
          />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-xs text-gray-400">Reps</span>
          <input
            type="number"
            min={1}
            max={100}
            className="bg-gray-700 rounded-lg px-2 py-1.5 text-sm text-white text-center outline-none focus:ring-1 focus:ring-indigo-500"
            value={exercise.reps}
            onChange={(e) => update({ reps: parseInt(e.target.value) || 1 })}
          />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-xs text-gray-400">Weight</span>
          <input
            type="number"
            min={0}
            step={2.5}
            className="bg-gray-700 rounded-lg px-2 py-1.5 text-sm text-white text-center outline-none focus:ring-1 focus:ring-indigo-500"
            value={exercise.weight}
            onChange={(e) => update({ weight: parseFloat(e.target.value) || 0 })}
          />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-xs text-gray-400">Unit</span>
          <select
            className="bg-gray-700 rounded-lg px-1 py-1.5 text-sm text-white outline-none focus:ring-1 focus:ring-indigo-500"
            value={exercise.weightUnit}
            onChange={(e) => update({ weightUnit: e.target.value as 'lbs' | 'kg' })}
          >
            <option value="lbs">lbs</option>
            <option value="kg">kg</option>
          </select>
        </label>
      </div>

      {progressionUnlocked && (
        <div className="flex items-center gap-1 text-green-400 text-xs font-semibold">
          <span>⬆</span> Add 2.5–5 lbs next session!
        </div>
      )}
    </div>
  );
}
