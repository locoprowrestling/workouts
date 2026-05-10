import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import LevelBadge from '../components/ui/LevelBadge';
import XPBar from '../components/ui/XPBar';
import StreakCounter from '../components/ui/StreakCounter';
import StatCard from '../components/ui/StatCard';
import QuestCard from '../components/ui/QuestCard';
import WorkoutCard from '../components/ui/WorkoutCard';
import { WORKOUT_TEMPLATES } from '../constants/workoutTemplates';

function getNextTemplate(sessions: { templateId: string | null }[]): string {
  const last = sessions.find((s) => s.templateId === 'A' || s.templateId === 'B');
  if (!last) return 'A';
  return last.templateId === 'A' ? 'B' : 'A';
}

function getMotivation(totalWorkouts: number, streak: number): string {
  if (totalWorkouts === 0) return "Log your first workout to start your journey! 💪";
  if (streak === 0) return "Get back on track — your streak is waiting to be rebuilt!";
  if (streak >= 10) return `${streak} weeks strong — you're unstoppable! ⚡`;
  if (streak >= 5) return `${streak}-week streak — you're building a real habit! 🌊`;
  return `${streak}-week streak — keep it going! 🔥`;
}

export default function Dashboard() {
  const { state } = useApp();
  const { profile, sessions, quests } = state;

  const nextTemplate = getNextTemplate(sessions);
  const nextWorkout = WORKOUT_TEMPLATES.find((t) => t.id === nextTemplate);
  const activeQuests = quests.filter((q) => !q.completed).slice(0, 3);
  const recentSessions = sessions.slice(0, 5);

  return (
    <div className="px-4 py-6 max-w-lg mx-auto flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Workout Tracker</h1>
          <p className="text-sm text-gray-400">{getMotivation(profile.totalWorkouts, profile.currentStreak)}</p>
        </div>
        <LevelBadge level={profile.level} size="lg" />
      </div>

      {/* XP Bar */}
      <XPBar totalXP={profile.totalXP} level={profile.level} />

      {/* Up Next */}
      {nextWorkout && (
        <Link to="/log" className="bg-indigo-950 border border-indigo-800 rounded-xl p-4 flex items-center gap-4 hover:bg-indigo-900 transition-colors">
          <div className="text-3xl">{'A' === nextTemplate ? '💪' : '🔥'}</div>
          <div className="flex-1">
            <div className="text-xs text-indigo-400 font-semibold uppercase tracking-wider mb-0.5">Up Next</div>
            <div className="font-bold text-white">{nextWorkout.name}</div>
            <div className="text-xs text-gray-400">{nextWorkout.focus}</div>
          </div>
          <div className="text-indigo-400 text-lg">→</div>
        </Link>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3">
        <StatCard icon="🔥" label="Current Streak" value={profile.currentStreak} sub="weeks" />
        <StatCard icon="💪" label="Total Workouts" value={profile.totalWorkouts} />
        <StatCard icon="⚡" label="Longest Streak" value={profile.longestStreak} sub="weeks" />
        <StatCard icon="⭐" label="Total XP" value={profile.totalXP.toLocaleString()} />
      </div>

      {/* Streak display */}
      <div className="flex items-center gap-2">
        <StreakCounter streak={profile.currentStreak} />
      </div>

      {/* Active Quests */}
      {activeQuests.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold text-white">Active Quests</h2>
            <Link to="/quests" className="text-xs text-indigo-400 hover:text-indigo-300">See all →</Link>
          </div>
          <div className="flex flex-col gap-3">
            {activeQuests.map((q) => <QuestCard key={q.id} quest={q} />)}
          </div>
        </div>
      )}

      {/* Recent Activity */}
      {recentSessions.length > 0 ? (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold text-white">Recent Activity</h2>
            <Link to="/history" className="text-xs text-indigo-400 hover:text-indigo-300">See all →</Link>
          </div>
          <div className="flex flex-col gap-3">
            {recentSessions.map((s) => <WorkoutCard key={s.id} session={s} />)}
          </div>
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          <div className="text-4xl mb-3">🏋️</div>
          <p>No workouts yet. Hit the gym and log your first session!</p>
          <Link to="/log" className="mt-4 inline-block bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2 rounded-full text-sm font-semibold transition-colors">
            Log Workout
          </Link>
        </div>
      )}
    </div>
  );
}
