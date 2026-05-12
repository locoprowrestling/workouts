import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { getRecentPRs } from '../lib/pr';
import { getLevelProgress } from '../lib/levelUtils';
import { INTERMEDIATE_UNLOCK_LEVEL } from '../constants/intermediatePlan';

export default function Dashboard() {
  const { state, setName, dismissIntermediateUnlock } = useApp();
  const navigate = useNavigate();
  const { profile, sessions, seenIntermediatePlanUnlock } = state;

  const [editingName, setEditingName] = useState(false);
  const [draft, setDraft] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editingName) inputRef.current?.focus();
  }, [editingName]);

  function startEdit() {
    setDraft(profile.name);
    setEditingName(true);
  }

  function commitEdit() {
    const trimmed = draft.trim();
    setName(trimmed);
    setEditingName(false);
  }

  const recentPRs = getRecentPRs(sessions, 3);
  const { current: xpInLevel, ceiling, floor, percent } = getLevelProgress(profile.totalXP);
  const xpNeeded = ceiling - floor;

  const showIntermediateUnlock =
    profile.level >= INTERMEDIATE_UNLOCK_LEVEL && !seenIntermediatePlanUnlock;

  return (
    <div className="flex flex-col items-center px-4 py-6 max-w-sm mx-auto gap-4">
      <div className="w-full text-2xl font-extrabold text-white flex items-center gap-2">
        {editingName ? (
          <input
            ref={inputRef}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onBlur={commitEdit}
            onKeyDown={(e) => { if (e.key === 'Enter') commitEdit(); if (e.key === 'Escape') setEditingName(false); }}
            placeholder="Your name"
            className="bg-transparent border-b border-indigo-500 outline-none text-white text-2xl font-extrabold w-40 placeholder-gray-600"
          />
        ) : (
          <button onClick={startEdit} className="flex items-center gap-2 group">
            <span>
              Hey{profile.name ? `, ${profile.name}` : ''}! 💪
            </span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-600 group-hover:text-gray-400 transition-colors mt-0.5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
            </svg>
          </button>
        )}
      </div>

      {/* Intermediate plan unlock banner */}
      {showIntermediateUnlock && (
        <div className="w-full bg-gradient-to-br from-indigo-950 to-purple-950 border border-indigo-600 rounded-2xl p-5">
          <div className="text-xs font-bold text-indigo-400 tracking-widest mb-2">🏆 LEVEL {INTERMEDIATE_UNLOCK_LEVEL} UNLOCKED</div>
          <div className="text-xl font-extrabold text-white mb-1">Intermediate Plan</div>
          <div className="text-sm text-indigo-200 mb-4">
            You've built the habit. Time to level up to 4 days/week — Upper/Lower A&B with strength and volume days. Your new workouts are ready.
          </div>
          <div className="grid grid-cols-2 gap-2 mb-4 text-xs font-bold text-indigo-300">
            <div className="bg-indigo-900/50 rounded-lg px-3 py-2">MON · Upper A<br/><span className="text-indigo-500 font-normal">Strength Focus</span></div>
            <div className="bg-indigo-900/50 rounded-lg px-3 py-2">TUE · Lower A<br/><span className="text-indigo-500 font-normal">Strength Focus</span></div>
            <div className="bg-indigo-900/50 rounded-lg px-3 py-2">THU · Upper B<br/><span className="text-indigo-500 font-normal">Volume Focus</span></div>
            <div className="bg-indigo-900/50 rounded-lg px-3 py-2">FRI · Lower B<br/><span className="text-indigo-500 font-normal">Volume Focus</span></div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => { dismissIntermediateUnlock(); navigate('/log'); }}
              className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold py-3 rounded-xl transition-colors text-sm"
            >
              Start New Plan →
            </button>
            <button
              onClick={dismissIntermediateUnlock}
              className="px-4 bg-indigo-900/50 text-indigo-400 font-bold py-3 rounded-xl text-sm"
            >
              Got it
            </button>
          </div>
        </div>
      )}

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
          {profile.level < INTERMEDIATE_UNLOCK_LEVEL && (
            <span className="ml-2 text-indigo-500">· Level {INTERMEDIATE_UNLOCK_LEVEL} unlocks Intermediate Plan</span>
          )}
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
