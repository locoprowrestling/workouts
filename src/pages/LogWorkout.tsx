import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import type { WorkoutType, WorkoutTemplate, Exercise } from '../types';
import { useApp } from '../context/AppContext';
import { calculateXP } from '../lib/xp';
import { WORKOUT_TEMPLATES } from '../constants/workoutTemplates';
import WorkoutTypeSelector from '../components/workout/WorkoutTypeSelector';
import ExerciseList from '../components/workout/ExerciseList';
import { ChevronLeft } from 'lucide-react';

function templateToExercises(templateId: WorkoutTemplate): Exercise[] {
  const tmpl = WORKOUT_TEMPLATES.find((t) => t.id === templateId);
  if (!tmpl) return [];
  return tmpl.exercises.map((ex) => ({
    id: crypto.randomUUID(),
    name: ex.name,
    sets: ex.sets,
    reps: ex.targetMinReps,
    targetMinReps: ex.targetMinReps,
    targetMaxReps: ex.targetMaxReps,
    weight: 0,
    weightUnit: 'lbs' as const,
    progressionUnlocked: false,
  }));
}

export default function LogWorkout() {
  const { state, addWorkout } = useApp();
  const navigate = useNavigate();

  const [templateId, setTemplateId] = useState<WorkoutTemplate>('A');
  const [type, setType] = useState<WorkoutType>('strength');
  const [duration, setDuration] = useState(45);
  const [exercises, setExercises] = useState<Exercise[]>(() => templateToExercises('A'));
  const [conditioning, setConditioning] = useState('');
  const [notes, setNotes] = useState('');

  function handleTemplateChange(id: WorkoutTemplate) {
    setTemplateId(id);
    if (id === 'custom') {
      setExercises([]);
    } else {
      const tmpl = WORKOUT_TEMPLATES.find((t) => t.id === id);
      if (tmpl) {
        setType(tmpl.type);
        setExercises(templateToExercises(id));
        setConditioning(tmpl.conditioning);
      }
    }
  }

  const previewXP = useMemo(() => {
    const draft = { date: new Date().toISOString().split('T')[0], type, templateId, durationMinutes: duration, exercises, conditioningNotes: conditioning, notes };
    return calculateXP(draft, state.profile);
  }, [type, duration, exercises, conditioning, notes, state.profile, templateId]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    addWorkout({
      date: new Date().toISOString().split('T')[0],
      type,
      templateId,
      durationMinutes: duration,
      exercises,
      conditioningNotes: conditioning,
      notes,
    });
    navigate('/');
  }

  const currentTemplate = WORKOUT_TEMPLATES.find((t) => t.id === templateId);

  return (
    <form onSubmit={handleSubmit} className="px-4 py-6 max-w-lg mx-auto flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button type="button" onClick={() => navigate(-1)} className="text-gray-400 hover:text-white">
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-2xl font-bold text-white">Log Workout</h1>
      </div>

      {/* Template Picker */}
      <div>
        <label className="text-sm font-semibold text-gray-300 mb-2 block">Choose Template</label>
        <div className="grid grid-cols-3 gap-3">
          {[...WORKOUT_TEMPLATES.map((t) => t.id as WorkoutTemplate), 'custom' as WorkoutTemplate].map((id) => {
            const tmpl = WORKOUT_TEMPLATES.find((t) => t.id === id);
            return (
              <button
                key={id}
                type="button"
                onClick={() => handleTemplateChange(id)}
                className={`rounded-xl p-3 text-sm font-semibold border-2 transition-all ${
                  templateId === id
                    ? 'border-indigo-500 bg-indigo-950 text-white'
                    : 'border-gray-700 bg-gray-900 text-gray-400 hover:border-gray-600'
                }`}
              >
                {tmpl ? (
                  <>
                    <div className="font-bold">{tmpl.name}</div>
                    <div className="text-xs font-normal text-gray-500 mt-0.5">{tmpl.focus.split(' · ')[0]}</div>
                  </>
                ) : (
                  <div>Custom</div>
                )}
              </button>
            );
          })}
        </div>
        {currentTemplate && (
          <p className="text-xs text-gray-500 mt-2">{currentTemplate.conditioning}</p>
        )}
      </div>

      {/* Workout Type (for custom) */}
      {templateId === 'custom' && (
        <div>
          <label className="text-sm font-semibold text-gray-300 mb-2 block">Workout Type</label>
          <WorkoutTypeSelector value={type} onChange={setType} />
        </div>
      )}

      {/* Duration */}
      <div>
        <label className="text-sm font-semibold text-gray-300 mb-2 block flex-shrink-0">
          Duration: <span className="text-indigo-400">{duration} min</span>
        </label>
        <input
          type="range"
          min={15}
          max={180}
          step={5}
          value={duration}
          onChange={(e) => setDuration(parseInt(e.target.value))}
          className="w-full accent-indigo-500"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>15 min</span><span>3 hrs</span>
        </div>
      </div>

      {/* Exercises */}
      {(type === 'strength' || templateId !== 'custom') && (
        <div>
          <label className="text-sm font-semibold text-gray-300 mb-2 block">Exercises</label>
          <ExerciseList exercises={exercises} onChange={setExercises} />
        </div>
      )}

      {/* Conditioning */}
      <div>
        <label className="text-sm font-semibold text-gray-300 mb-2 block">
          Conditioning <span className="text-gray-500 font-normal">(optional — +25 XP)</span>
        </label>
        <textarea
          className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 outline-none focus:ring-1 focus:ring-indigo-500 resize-none"
          rows={2}
          placeholder={currentTemplate?.conditioning ?? 'e.g. 15 min treadmill walk'}
          value={conditioning}
          onChange={(e) => setConditioning(e.target.value)}
        />
      </div>

      {/* Notes */}
      <div>
        <label className="text-sm font-semibold text-gray-300 mb-2 block">Notes</label>
        <textarea
          className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 outline-none focus:ring-1 focus:ring-indigo-500 resize-none"
          rows={2}
          placeholder="How did it feel? Any PRs?"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </div>

      {/* XP Preview + Submit */}
      <div className="bg-indigo-950 border border-indigo-800 rounded-xl p-4 flex items-center justify-between">
        <div>
          <div className="text-xs text-indigo-400">This workout will earn</div>
          <div className="text-2xl font-bold text-white">+{previewXP} XP</div>
        </div>
        <button
          type="submit"
          className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-6 py-3 rounded-xl transition-colors text-sm"
        >
          Log Workout 💪
        </button>
      </div>
    </form>
  );
}
