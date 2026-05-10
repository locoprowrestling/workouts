import type { Exercise } from '../../types';
import ExerciseRow from './ExerciseRow';
import { Plus } from 'lucide-react';

interface Props {
  exercises: Exercise[];
  onChange: (exercises: Exercise[]) => void;
}

function newExercise(): Exercise {
  return {
    id: crypto.randomUUID(),
    name: '',
    sets: 3,
    reps: 8,
    targetMinReps: 0,
    targetMaxReps: 0,
    weight: 0,
    weightUnit: 'lbs',
    progressionUnlocked: false,
  };
}

export default function ExerciseList({ exercises, onChange }: Props) {
  return (
    <div className="flex flex-col gap-3">
      {exercises.map((ex, i) => (
        <ExerciseRow
          key={ex.id}
          exercise={ex}
          onChange={(updated) => {
            const next = [...exercises];
            next[i] = updated;
            onChange(next);
          }}
          onRemove={() => onChange(exercises.filter((_, j) => j !== i))}
        />
      ))}
      <button
        type="button"
        onClick={() => onChange([...exercises, newExercise()])}
        className="flex items-center justify-center gap-2 border-2 border-dashed border-gray-700 rounded-xl py-3 text-gray-400 hover:border-indigo-600 hover:text-indigo-400 transition-colors text-sm"
      >
        <Plus size={16} /> Add Exercise
      </button>
    </div>
  );
}
