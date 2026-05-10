import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { getRecentPRs } from '../lib/pr';
import { getLevelProgress } from '../lib/levelUtils';

export default function Dashboard() {
  const { state } = useApp();
  const navigate = useNavigate();
  const { profile, sessions } = state;

  const recentPRs = getRecentPRs(sessions, 3);

  const { current: xpInLevel, ceiling, floor, percent } = getLevelProgress(profile.totalXP);
  const xpNeeded = ceiling - floor;

  return (
    <div className="flex flex-col items-center px-4 py-6 max-w-sm mx-auto gap-4">
      <div className="w-full text-2xl font-extrabold text-white">Hey! 💪</div>

      {/* Streak */}
      <div className="w-full bg-gray-900 rounded-2xl p-4 flex items-center justify-between">
        <div>
          <div className="text-xs font-bold text-gray-500 tracking-widest mb-1">CURRENT STREAK</div>
          <div className="text-3xl font-extrabold text-white">🔥 {profile.currentStreak} weeks</div>
        </div>
        <div className="text-right">
          <div className="text-xs font-semibold text-gray-500">BEST</div>
          <div className="text-lg font-bold text-gray-400">{profile.longestStreak} wks</div>
        </div>
      </div>

      {/* Recent PRs */}
      {recentPRs.length > 0 && (
        <div className="w-full">
          <div className="text-xs font-bold text-gray-500 tracking-widest mb-2">RECENT PRs</div>
          <div className="flex flex-col gap-2">
            {recentPRs.map((pr) => (
              <div key={pr.exerciseName} className="bg-stone-900 border border-amber-900 rounded-xl px-4 py-3">
                <div className="text-amber-400 text-base font-extrabold">🏆 {pr.weight} lbs × {pr.reps}</div>
                <div className="text-stone-400 text-sm font-medium mt-0.5">{pr.exerciseName}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Level / XP */}
      <div className="w-full bg-gray-900 rounded-2xl p-4">
        <div className="text-3xl font-black text-white leading-none">Level {profile.level}</div>
        <div className="text-sm font-semibold text-gray-500 mt-1 mb-3">
          {xpInLevel.toLocaleString()} / {xpNeeded.toLocaleString()} XP
        </div>
        <div className="w-full bg-gray-800 rounded-full h-2 overflow-hidden">
          <div
            className="h-2 rounded-full bg-indigo-500 transition-all duration-700"
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>

      {/* CTA */}
      <div className="flex justify-center w-full mt-2">
        <button
          onClick={() => navigate('/log')}
          className="bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xl px-10 py-5 rounded-2xl transition-colors"
        >
          Start Workout 💪
        </button>
      </div>
    </div>
  );
}
