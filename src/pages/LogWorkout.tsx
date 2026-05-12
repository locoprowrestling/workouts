import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { MUSCLE_GROUPS, UPPER_GROUPS, LOWER_GROUPS } from '../constants/muscleGroups';
import type { Split, MuscleGroup } from '../constants/muscleGroups';
import { INTERMEDIATE_DAYS, INTERMEDIATE_UNLOCK_LEVEL } from '../constants/intermediatePlan';
import type { IntermediateDayId } from '../constants/intermediatePlan';
import { useApp } from '../context/AppContext';
import { getPR } from '../lib/pr';
import type { PRRecord } from '../lib/pr';
import NewPRToast from '../components/ui/NewPRToast';

interface SetLog { weight: string; reps: string; }
interface ExerciseState {
  name: string;
  sets: number;
  logs: (SetLog | null)[];
  skipped: boolean;
}

interface UnifiedExerciseDef {
  name: string;
  sets: number;
  beginnerWeight: number;
  beginnerNote?: string;
  targetMinReps: number;
  targetMaxReps: number;
}

type Step = 'split' | 'muscle' | 'order' | 'exercise' | 'simple';
type SimpleMode = 'cardio' | 'stretching';

export default function LogWorkout() {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>('split');
  const [split, setSplit] = useState<Split | null>(null);
  const [muscleGroup, setMuscleGroup] = useState<MuscleGroup | null>(null);
  const [intermediateDay, setIntermediateDay] = useState<IntermediateDayId | null>(null);
  const [orderedExercises, setOrderedExercises] = useState<UnifiedExerciseDef[]>([]);
  const [simpleMode, setSimpleMode] = useState<SimpleMode | null>(null);
  const [simpleDuration, setSimpleDuration] = useState('30');
  const [simpleNotes, setSimpleNotes] = useState('');
  const { state, addWorkout } = useApp();
  const [exerciseIndex, setExerciseIndex] = useState(0);
  const [exerciseStates, setExerciseStates] = useState<ExerciseState[]>([]);
  const [skipConfirming, setSkipConfirming] = useState(false);
  const [skipCount, setSkipCount] = useState(0);
  const [newPR, setNewPR] = useState<{ exerciseName: string; weight: number; reps: number } | null>(null);
  const sessionBestRef = useRef<Map<string, { weight: number; reps: number }>>(new Map());

  const { profile } = state;
  const isIntermediate = profile.level >= INTERMEDIATE_UNLOCK_LEVEL;

  useEffect(() => {
    if (muscleGroup) {
      const unified: UnifiedExerciseDef[] = MUSCLE_GROUPS[muscleGroup].exercises.map((ex) => ({
        name: ex.name,
        sets: ex.sets,
        beginnerWeight: ex.beginnerWeight,
        beginnerNote: ex.beginnerNote,
        targetMinReps: ex.beginnerReps,
        targetMaxReps: ex.beginnerReps,
      }));
      setOrderedExercises(unified);
      setStep('order');
    }
  }, [muscleGroup]);

  function startWorkout() {
    setExerciseStates(
      orderedExercises.map((ex) => ({
        name: ex.name,
        sets: ex.sets,
        logs: Array(ex.sets).fill(null),
        skipped: false,
      }))
    );
    setExerciseIndex(0);
    setStep('exercise');
  }

  function moveExercise(index: number, direction: -1 | 1) {
    const next = [...orderedExercises];
    const swapIdx = index + direction;
    if (swapIdx < 0 || swapIdx >= next.length) return;
    [next[index], next[swapIdx]] = [next[swapIdx], next[index]];
    setOrderedExercises(next);
  }

  function handleSplitSelect(s: Split) {
    setSplit(s);
    setStep('muscle');
  }

  function handleIntermediateDaySelect(dayId: IntermediateDayId) {
    const day = INTERMEDIATE_DAYS.find((d) => d.id === dayId)!;
    const unified: UnifiedExerciseDef[] = day.exercises.map((ex) => ({
      name: ex.name,
      sets: ex.sets,
      beginnerWeight: ex.beginnerWeight,
      beginnerNote: ex.beginnerNote,
      targetMinReps: ex.targetMinReps,
      targetMaxReps: ex.targetMaxReps,
    }));
    setIntermediateDay(dayId);
    setOrderedExercises(unified);
    setStep('order');
  }

  function handleMuscleSelect(mg: MuscleGroup) {
    setMuscleGroup(mg);
  }

  function handleSimpleModeSelect(mode: SimpleMode) {
    setSimpleMode(mode);
    setStep('simple');
  }

  function saveSimpleWorkout() {
    addWorkout({
      date: new Date().toISOString().split('T')[0],
      type: simpleMode === 'cardio' ? 'cardio' : 'flexibility',
      templateId: null,
      durationMinutes: parseInt(simpleDuration) || 30,
      exercises: [],
      conditioningNotes: '',
      notes: simpleNotes,
    });
    navigate('/');
  }

  const groups = split === 'upper' ? UPPER_GROUPS : LOWER_GROUPS;

  // ── Split / Day picker screen ──────────────────────────────────────────────
  if (step === 'split') {
    if (isIntermediate) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen px-6 gap-3">
          <button onClick={() => navigate('/')} className="absolute top-5 left-5 text-gray-400 hover:text-white text-2xl leading-none">←</button>
          <div className="text-2xl font-extrabold text-white mb-1">Today's Workout</div>
          <div className="text-xs font-bold text-indigo-400 tracking-widest mb-3">INTERMEDIATE PLAN</div>
          {INTERMEDIATE_DAYS.map((day) => (
            <button
              key={day.id}
              onClick={() => handleIntermediateDaySelect(day.id)}
              className="w-full bg-gray-900 hover:bg-gray-800 border-2 border-gray-700 hover:border-indigo-700 rounded-2xl px-6 py-5 text-left transition-colors"
            >
              <div className="text-xs font-bold text-indigo-400 tracking-widest">{day.tag}</div>
              <div className="text-white font-extrabold text-xl">{day.name}</div>
              <div className="text-gray-500 text-sm">{day.focus}</div>
            </button>
          ))}
          <div className="w-full flex gap-3 mt-1">
            <button
              onClick={() => handleSimpleModeSelect('cardio')}
              className="flex-1 bg-gray-900 hover:bg-gray-800 text-emerald-400 border-2 border-gray-700 hover:border-emerald-700 font-extrabold text-lg py-5 rounded-2xl transition-colors"
            >
              🏃 CARDIO
            </button>
            <button
              onClick={() => handleSimpleModeSelect('stretching')}
              className="flex-1 bg-gray-900 hover:bg-gray-800 text-sky-400 border-2 border-gray-700 hover:border-sky-700 font-extrabold text-lg py-5 rounded-2xl transition-colors"
            >
              🧘 STRETCH
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="flex flex-col items-center justify-center min-h-screen px-6 gap-4">
        <button onClick={() => navigate('/')} className="absolute top-5 left-5 text-gray-400 hover:text-white text-2xl leading-none">←</button>
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
        <div className="w-full flex gap-3">
          <button
            onClick={() => handleSimpleModeSelect('cardio')}
            className="flex-1 bg-gray-900 hover:bg-gray-800 text-emerald-400 border-2 border-gray-700 hover:border-emerald-700 font-extrabold text-xl py-8 rounded-2xl transition-colors"
          >
            🏃 CARDIO
          </button>
          <button
            onClick={() => handleSimpleModeSelect('stretching')}
            className="flex-1 bg-gray-900 hover:bg-gray-800 text-sky-400 border-2 border-gray-700 hover:border-sky-700 font-extrabold text-xl py-8 rounded-2xl transition-colors"
          >
            🧘 STRETCH
          </button>
        </div>
      </div>
    );
  }

  // ── Muscle group screen (beginner only) ───────────────────────────────────
  if (step === 'muscle') {
    return (
      <div className="flex flex-col items-center px-6 py-10 gap-3 max-w-sm mx-auto">
        <button onClick={() => setStep('split')} className="self-start text-gray-400 hover:text-white text-2xl leading-none mb-2">←</button>
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

  // ── Order screen ──────────────────────────────────────────────────────────
  if (step === 'order' && (muscleGroup || intermediateDay)) {
    const displayLabel = intermediateDay
      ? (INTERMEDIATE_DAYS.find((d) => d.id === intermediateDay)?.name ?? '')
      : (muscleGroup ? MUSCLE_GROUPS[muscleGroup].label : '');

    return (
      <div className="flex flex-col px-6 py-10 max-w-sm mx-auto gap-4">
        <button
          onClick={() => setStep(intermediateDay ? 'split' : 'muscle')}
          className="self-start text-gray-400 hover:text-white text-2xl leading-none"
        >←</button>
        <div>
          <div className="text-xs font-bold text-gray-500 tracking-widest">{displayLabel.toUpperCase()}</div>
          <div className="text-2xl font-extrabold text-white mt-1">Exercise Order</div>
          <div className="text-sm text-gray-500 mt-1">Drag to reorder, or tap ↑↓ for variety</div>
        </div>
        <div className="flex flex-col gap-2">
          {orderedExercises.map((ex, i) => (
            <div key={ex.name} className="bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 flex items-center gap-3">
              <div className="flex flex-col gap-0.5">
                <button
                  onClick={() => moveExercise(i, -1)}
                  disabled={i === 0}
                  className="text-gray-500 hover:text-white disabled:opacity-20 leading-none text-lg"
                >↑</button>
                <button
                  onClick={() => moveExercise(i, 1)}
                  disabled={i === orderedExercises.length - 1}
                  className="text-gray-500 hover:text-white disabled:opacity-20 leading-none text-lg"
                >↓</button>
              </div>
              <div className="flex-1">
                <div className="font-bold text-white text-sm">{ex.name}</div>
                <div className="text-xs text-gray-500">{ex.sets} sets · {ex.targetMinReps}{ex.targetMinReps !== ex.targetMaxReps ? `–${ex.targetMaxReps}` : ''} reps</div>
              </div>
              <div className="text-xs text-gray-600 font-mono">{i + 1}</div>
            </div>
          ))}
        </div>
        <button
          onClick={startWorkout}
          className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-lg py-5 rounded-2xl transition-colors mt-2"
        >
          Start Workout →
        </button>
      </div>
    );
  }

  // ── Exercise screen ───────────────────────────────────────────────────────
  if (step === 'exercise' && (muscleGroup || intermediateDay)) {
    const ex = exerciseStates[exerciseIndex];
    if (!ex) return null;

    const exDef = orderedExercises[exerciseIndex];
    const pr: PRRecord | null = getPR(ex.name, state.sessions);
    const nextEx = exerciseStates[exerciseIndex + 1] ?? null;
    const nextPR: PRRecord | null = nextEx ? getPR(nextEx.name, state.sessions) : null;
    const isLast = exerciseIndex === exerciseStates.length - 1;

    const displayLabel = intermediateDay
      ? (INTERMEDIATE_DAYS.find((d) => d.id === intermediateDay)?.name ?? '')
      : (muscleGroup ? MUSCLE_GROUPS[muscleGroup].label : '');

    const activeSetIndex = ex.logs.findIndex((l) => l === null || l.weight === '' || l.reps === '');

    const repRange = exDef.targetMinReps === exDef.targetMaxReps
      ? String(exDef.targetMinReps)
      : `${exDef.targetMinReps}–${exDef.targetMaxReps}`;

    const beginnerSuggestion = exDef.beginnerNote === 'bodyweight'
      ? `Bodyweight × ${repRange}`
      : `${exDef.beginnerWeight} lbs × ${repRange}`;

    const beginnerNoteText = exDef.beginnerNote && exDef.beginnerNote !== 'bodyweight'
      ? exDef.beginnerNote
      : null;

    function updateSetLog(setIdx: number, field: 'weight' | 'reps', value: string) {
      setExerciseStates((prev) => {
        const updated = prev.map((e, i) => {
          if (i !== exerciseIndex) return e;
          const logs = e.logs.map((l, li) => {
            if (li !== setIdx) return l;
            return { ...(l ?? { weight: '', reps: '' }), [field]: value };
          });
          return { ...e, logs };
        });

        const updatedEx = updated[exerciseIndex];
        const log = updatedEx.logs[setIdx];
        if (log && log.weight !== '' && log.reps !== '') {
          const w = parseFloat(log.weight);
          const r = parseInt(log.reps);
          if (w > 0 && r > 0) {
            const histPR = getPR(updatedEx.name, state.sessions);
            const sessionBest = sessionBestRef.current.get(updatedEx.name.toLowerCase());
            const beatsHistorical = !histPR || w > histPR.weight || (w === histPR.weight && r > histPR.reps);
            const beatsSession = !sessionBest || w > sessionBest.weight || (w === sessionBest.weight && r > sessionBest.reps);
            if (beatsHistorical && beatsSession) {
              sessionBestRef.current.set(updatedEx.name.toLowerCase(), { weight: w, reps: r });
              setTimeout(() => setNewPR({ exerciseName: updatedEx.name, weight: w, reps: r }), 0);
            }
          }
        }

        return updated;
      });
    }

    function saveWorkout(penalty = 0) {
      const exercises = exerciseStates.map((e) => {
        const filledLogs = e.logs.filter((l): l is SetLog => l !== null);
        const exD = orderedExercises.find((o) => o.name === e.name);
        return {
          id: crypto.randomUUID(),
          name: e.name,
          sets: e.sets,
          reps: filledLogs.length > 0 ? Math.max(...filledLogs.map((l) => parseInt(l.reps) || 0)) : 0,
          weight: filledLogs.length > 0 ? Math.max(...filledLogs.map((l) => parseFloat(l.weight) || 0)) : 0,
          targetMinReps: exD?.targetMinReps ?? 8,
          targetMaxReps: exD?.targetMaxReps ?? 12,
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

    function handleSkipConfirm() {
      setExerciseStates((prev) =>
        prev.map((e, i) => (i === exerciseIndex ? { ...e, skipped: true } : e))
      );
      const newSkipCount = skipCount + 1;
      setSkipCount(newSkipCount);
      setSkipConfirming(false);
      if (isLast) {
        saveWorkout(newSkipCount * 10);
      } else {
        setExerciseIndex((i) => i + 1);
      }
    }

    function handleDone() {
      if (isLast) {
        saveWorkout(skipCount * 10);
      } else {
        setExerciseIndex((i) => i + 1);
      }
    }

    return (
      <div className="flex flex-col px-5 py-8 max-w-sm mx-auto min-h-screen">
        {newPR && (
          <NewPRToast
            exerciseName={newPR.exerciseName}
            weight={newPR.weight}
            reps={newPR.reps}
            onDismiss={() => setNewPR(null)}
          />
        )}

        {/* Skip confirmation overlay */}
        {skipConfirming && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-6">
            <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 w-full max-w-sm">
              <div className="text-white font-extrabold text-lg mb-2">Skip {ex.name}?</div>
              <div className="text-gray-400 text-sm mb-6">This will cost you 10 XP.</div>
              <div className="flex gap-3">
                <button
                  onClick={() => setSkipConfirming(false)}
                  className="flex-1 bg-gray-800 text-gray-300 font-bold py-3 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSkipConfirm}
                  className="flex-1 bg-red-900 hover:bg-red-800 text-red-300 font-bold py-3 rounded-xl transition-colors"
                >
                  Skip (−10 XP)
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Back button */}
        <button
          onClick={() => exerciseIndex === 0 ? setStep('order') : setExerciseIndex((i) => i - 1)}
          className="self-start text-gray-400 hover:text-white text-2xl leading-none mb-4"
        >←</button>

        {/* Header */}
        <div className="text-xs font-bold text-gray-500 tracking-widest text-center mb-1">
          {displayLabel.toUpperCase()} · Exercise {exerciseIndex + 1} of {exerciseStates.length}
        </div>
        <div className="text-xl font-extrabold text-white text-center mb-3">{ex.name}</div>

        {/* YouTube form link */}
        <a
          href={`https://www.youtube.com/results?search_query=${encodeURIComponent(ex.name + ' proper form tutorial')}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 bg-red-950 border border-red-800 hover:bg-red-900 text-red-400 font-bold text-sm py-2.5 rounded-xl transition-colors mb-4"
        >
          <span>▶</span> Watch Form on YouTube
        </a>

        {/* PR Badge or Beginner Suggestion */}
        {pr ? (
          <div className="bg-stone-900 border border-amber-800 rounded-xl px-4 py-3 flex items-center justify-between mb-5">
            <div className="text-xs font-bold text-stone-500 tracking-widest">🏆 PR</div>
            <div className="text-amber-400 text-lg font-extrabold">{pr.weight} lbs × {pr.reps}</div>
          </div>
        ) : (
          <div className="bg-gray-900 border border-indigo-900 rounded-xl px-4 py-3 mb-5">
            <div className="text-xs font-bold text-indigo-500 tracking-widest mb-1">💡 BEGINNER START</div>
            <div className="text-white font-extrabold text-lg">{beginnerSuggestion}</div>
            {beginnerNoteText && (
              <div className="text-gray-500 text-xs mt-0.5">{beginnerNoteText}</div>
            )}
            <div className="text-gray-600 text-xs mt-0.5">Good starting point — adjust as needed</div>
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
            const isDone = log !== null && log.weight !== '' && log.reps !== '';
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
                    placeholder={pr ? String(pr.weight) : exDef.beginnerNote === 'bodyweight' ? '0' : String(exDef.beginnerWeight)}
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
                    placeholder={pr ? String(pr.reps) : String(exDef.targetMinReps)}
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

        {/* Skip link */}
        <button
          onClick={() => setSkipConfirming(true)}
          className="text-gray-600 text-sm font-medium mt-3 text-center w-full hover:text-gray-400 transition-colors"
        >
          Skip this exercise
        </button>
      </div>
    );
  }

  // ── Cardio / Stretching screen ────────────────────────────────────────────
  if (step === 'simple' && simpleMode) {
    const isCardio = simpleMode === 'cardio';
    const accentColor = isCardio ? 'emerald' : 'sky';
    const label = isCardio ? 'Cardio' : 'Stretching';
    const emoji = isCardio ? '🏃' : '🧘';
    const xpNote = isCardio ? '40 base XP' : '30 base XP';

    return (
      <div className="flex flex-col px-6 py-10 max-w-sm mx-auto min-h-screen">
        <button onClick={() => setStep('split')} className="self-start text-gray-400 hover:text-white text-2xl leading-none mb-6">←</button>

        <div className={`text-xs font-bold tracking-widest mb-1 ${isCardio ? 'text-emerald-400' : 'text-sky-400'}`}>
          {emoji} {label.toUpperCase()}
        </div>
        <div className="text-2xl font-extrabold text-white mb-1">Log Your Session</div>
        <div className="text-xs text-gray-500 mb-8">{xpNote} + duration bonuses</div>

        <div className="mb-6">
          <label className="text-xs font-bold text-gray-500 tracking-widest block mb-2">DURATION (MINUTES)</label>
          <input
            type="number"
            inputMode="numeric"
            value={simpleDuration}
            onChange={(e) => setSimpleDuration(e.target.value)}
            className={`w-full bg-gray-900 border-2 ${isCardio ? 'border-emerald-700 focus:border-emerald-500' : 'border-sky-700 focus:border-sky-500'} rounded-2xl text-white text-center text-4xl font-extrabold py-6 outline-none`}
          />
        </div>

        <div className="mb-8">
          <label className="text-xs font-bold text-gray-500 tracking-widest block mb-2">NOTES (OPTIONAL)</label>
          <textarea
            value={simpleNotes}
            onChange={(e) => setSimpleNotes(e.target.value)}
            placeholder={isCardio ? 'e.g. 5k run, 150 bpm avg' : 'e.g. full body stretch, hip flexors'}
            rows={3}
            className="w-full bg-gray-900 border-2 border-gray-700 rounded-2xl text-white px-4 py-3 text-sm outline-none resize-none placeholder-gray-600"
          />
        </div>

        <button
          onClick={saveSimpleWorkout}
          className={`w-full ${isCardio ? 'bg-emerald-700 hover:bg-emerald-600' : 'bg-sky-700 hover:bg-sky-600'} text-white font-extrabold text-lg py-5 rounded-2xl transition-colors mt-auto`}
        >
          Log {label} ✓
        </button>
      </div>
    );
  }

  return null;
}
