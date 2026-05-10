import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MUSCLE_GROUPS, UPPER_GROUPS, LOWER_GROUPS } from '../constants/muscleGroups';
import type { Split, MuscleGroup } from '../constants/muscleGroups';
import { useApp } from '../context/AppContext';
import { getPR } from '../lib/pr';
import type { PRRecord } from '../lib/pr';

interface SetLog { weight: string; reps: string; }
interface ExerciseState {
  name: string;
  sets: number;
  logs: (SetLog | null)[];
  skipped: boolean;
}

type Step = 'split' | 'muscle' | 'exercise';

export default function LogWorkout() {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>('split');
  const [split, setSplit] = useState<Split | null>(null);
  const [muscleGroup, setMuscleGroup] = useState<MuscleGroup | null>(null);
  const { state, addWorkout } = useApp();
  const [exerciseIndex, setExerciseIndex] = useState(0);
  const [exerciseStates, setExerciseStates] = useState<ExerciseState[]>([]);

  useEffect(() => {
    if (muscleGroup) {
      setExerciseStates(
        MUSCLE_GROUPS[muscleGroup].exercises.map((ex) => ({
          name: ex.name,
          sets: ex.sets,
          logs: Array(ex.sets).fill(null),
          skipped: false,
        }))
      );
      setExerciseIndex(0);
    }
  }, [muscleGroup]);

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

  if (step === 'exercise' && muscleGroup) {
    const ex = exerciseStates[exerciseIndex];
    if (!ex) return null;

    const pr: PRRecord | null = getPR(ex.name, state.sessions);
    const nextEx = exerciseStates[exerciseIndex + 1] ?? null;
    const nextPR: PRRecord | null = nextEx ? getPR(nextEx.name, state.sessions) : null;
    const isLast = exerciseIndex === exerciseStates.length - 1;

    const activeSetIndex = ex.logs.findIndex((l) => l === null);

    function updateSetLog(setIdx: number, field: 'weight' | 'reps', value: string) {
      setExerciseStates((prev) =>
        prev.map((e, i) => {
          if (i !== exerciseIndex) return e;
          const logs = e.logs.map((l, li) => {
            if (li !== setIdx) return l;
            return { ...(l ?? { weight: '', reps: '' }), [field]: value };
          });
          return { ...e, logs };
        })
      );
    }

    function saveWorkout(penalty = 0) {
      if (!split || !muscleGroup) return;
      const exercises = exerciseStates.map((ex) => {
        const filledLogs = ex.logs.filter((l): l is SetLog => l !== null);
        return {
          id: crypto.randomUUID(),
          name: ex.name,
          sets: ex.sets,
          reps: filledLogs.length > 0 ? Math.max(...filledLogs.map((l) => parseInt(l.reps) || 0)) : 0,
          weight: filledLogs.length > 0 ? Math.max(...filledLogs.map((l) => parseFloat(l.weight) || 0)) : 0,
          targetMinReps: 8,
          targetMaxReps: 12,
          weightUnit: 'lbs' as const,
          progressionUnlocked: false,
          setLogs: filledLogs.map((l) => ({ weight: parseFloat(l.weight) || 0, reps: parseInt(l.reps) || 0 })),
        };
      });
      addWorkout({
        date: new Date().toISOString().split('T')[0],
        type: 'strength',
        templateId: null,
        durationMinutes: 60,
        exercises,
        conditioningNotes: '',
        notes: '',
      }, penalty);
      navigate('/');
    }

    function handleDone() {
      if (isLast) {
        saveWorkout(0);
      } else {
        setExerciseIndex((i) => i + 1);
      }
    }

    return (
      <div className="flex flex-col px-5 py-8 max-w-sm mx-auto min-h-screen">
        {/* Header */}
        <div className="text-xs font-bold text-gray-500 tracking-widest text-center mb-1">
          {MUSCLE_GROUPS[muscleGroup].label.toUpperCase()} · Exercise {exerciseIndex + 1} of {exerciseStates.length}
        </div>
        <div className="text-xl font-extrabold text-white text-center mb-3">{ex.name}</div>

        {/* PR Badge */}
        {pr ? (
          <div className="bg-stone-900 border border-amber-800 rounded-xl px-4 py-3 flex items-center justify-between mb-5">
            <div className="text-xs font-bold text-stone-500 tracking-widest">🏆 PR</div>
            <div className="text-amber-400 text-lg font-extrabold">{pr.weight} lbs × {pr.reps}</div>
          </div>
        ) : (
          <div className="bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 text-center text-gray-600 text-sm mb-5">
            No PR yet — set one today!
          </div>
        )}

        {/* Set Grid */}
        <div className="flex flex-col gap-3 mb-5">
          <div className="grid grid-cols-[52px_1fr_1fr] gap-2 items-center">
            <div />
            <div className="text-xs text-center font-bold text-gray-500 tracking-widest">LBS</div>
            <div className="text-xs text-center font-bold text-gray-500 tracking-widest">REPS</div>
          </div>

          {ex.logs.map((log, setIdx) => {
            const isDone = log !== null;
            const isActive = setIdx === activeSetIndex;
            const isPending = !isDone && !isActive;
            const doneLog = isDone ? log : null;

            return (
              <div key={setIdx} className={`grid grid-cols-[52px_1fr_1fr] gap-2 items-center ${isPending ? 'opacity-35' : ''}`}>
                <div className={`text-sm font-bold ${isDone ? 'text-green-400' : 'text-gray-400'}`}>
                  {isDone ? `Set ${setIdx + 1} ✓` : `Set ${setIdx + 1}`}
                </div>

                {doneLog !== null ? (
                  <div className="bg-green-950 border border-green-800 rounded-xl text-green-400 text-center py-3 text-lg font-bold">
                    {doneLog.weight || '—'}
                  </div>
                ) : (
                  <input
                    type="number"
                    inputMode="decimal"
                    placeholder={pr ? String(pr.weight) : '0'}
                    value={log?.weight ?? ''}
                    disabled={isPending}
                    onChange={(e) => updateSetLog(setIdx, 'weight', e.target.value)}
                    className={`bg-gray-900 rounded-xl text-white text-center py-3 text-lg font-bold w-full outline-none border-2 ${
                      isActive ? 'border-indigo-500' : 'border-gray-800'
                    }`}
                  />
                )}

                {doneLog !== null ? (
                  <div className="bg-green-950 border border-green-800 rounded-xl text-green-400 text-center py-3 text-lg font-bold">
                    {doneLog.reps || '—'}
                  </div>
                ) : (
                  <input
                    type="number"
                    inputMode="numeric"
                    placeholder="—"
                    value={log?.reps ?? ''}
                    disabled={isPending}
                    onChange={(e) => updateSetLog(setIdx, 'reps', e.target.value)}
                    className={`bg-gray-900 rounded-xl text-white text-center py-3 text-lg font-bold w-full outline-none border-2 ${
                      isActive ? 'border-indigo-500' : 'border-gray-800'
                    }`}
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* Up Next */}
        {nextEx && (
          <div className="mb-4">
            <div className="text-xs font-bold text-gray-600 tracking-widest mb-1">UP NEXT</div>
            <div className="bg-gray-900 rounded-xl px-4 py-3 flex justify-between items-center">
              <div className="text-gray-400 font-semibold">{nextEx.name}</div>
              {nextPR && (
                <div className="text-gray-500 text-sm font-semibold">🏆 {nextPR.weight} lbs</div>
              )}
            </div>
          </div>
        )}

        {/* Done / Finish button */}
        <button
          onClick={handleDone}
          className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-lg py-5 rounded-2xl transition-colors mt-auto"
        >
          {isLast ? 'Finish Workout ✓' : 'Done with this exercise →'}
        </button>
      </div>
    );
  }

  return null;
}
