import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MUSCLE_GROUPS, UPPER_GROUPS, LOWER_GROUPS } from '../constants/muscleGroups';
import type { Split, MuscleGroup } from '../constants/muscleGroups';

type Step = 'split' | 'muscle' | 'exercise';

export default function LogWorkout() {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>('split');
  const [split, setSplit] = useState<Split | null>(null);
  const [muscleGroup, setMuscleGroup] = useState<MuscleGroup | null>(null);

  function handleSplitSelect(s: Split) {
    setSplit(s);
    setStep('muscle');
  }

  function handleMuscleSelect(mg: MuscleGroup) {
    setMuscleGroup(mg);
    setStep('exercise');
  }

  const groups = split === 'upper' ? UPPER_GROUPS : LOWER_GROUPS;

  if (step === 'split') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen px-6 gap-4">
        <div className="text-2xl font-extrabold text-white mb-4">Today's Workout</div>
        <button
          onClick={() => handleSplitSelect('upper')}
          className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-3xl py-14 rounded-2xl transition-colors tracking-wide"
        >
          UPPER
        </button>
        <button
          onClick={() => handleSplitSelect('lower')}
          className="w-full bg-gray-900 hover:bg-gray-800 text-gray-400 border-2 border-gray-700 font-extrabold text-3xl py-14 rounded-2xl transition-colors tracking-wide"
        >
          LOWER
        </button>
      </div>
    );
  }

  if (step === 'muscle') {
    return (
      <div className="flex flex-col items-center px-6 py-10 gap-3 max-w-sm mx-auto">
        <div className="text-xs font-bold text-gray-500 tracking-widest">{split?.toUpperCase()}</div>
        <div className="text-2xl font-extrabold text-white mb-4">What are you training?</div>
        {groups.map((mg) => (
          <button
            key={mg}
            onClick={() => handleMuscleSelect(mg)}
            className="w-full bg-gray-900 hover:bg-gray-800 text-gray-300 border-2 border-gray-700 font-bold text-xl py-5 rounded-2xl transition-colors"
          >
            {MUSCLE_GROUPS[mg].label}
          </button>
        ))}
      </div>
    );
  }

  // Step 'exercise' — placeholder until Task 7
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6">
      <div className="text-white text-xl font-bold">
        {muscleGroup ? MUSCLE_GROUPS[muscleGroup].label : ''} exercises coming in Task 7
      </div>
      <button onClick={() => navigate('/')} className="mt-6 text-indigo-400 text-sm">← Back to Dashboard</button>
    </div>
  );
}
