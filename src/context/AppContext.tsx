import React, { createContext, useContext, useReducer, useCallback, useEffect, useRef, useState } from 'react';
import type { AppStorage, WorkoutSession, UserProfile } from '../types';
import { defaultStorage, loadUserData, saveUserData } from '../lib/storage';
import { calculateXP } from '../lib/xp';
import { evaluateStreak } from '../lib/streaks';
import { evaluateBadges, recomputeBadges } from '../lib/badges';
import { updateQuestProgress, recomputeQuestProgress, shouldResetQuests, resetAndRegenerateQuests } from '../lib/quests';
import { getLevelFromXP } from '../lib/levelUtils';

interface AppState extends AppStorage {
  badgeQueue: string[];
}

type Action =
  | { type: 'LOAD_DATA'; data: AppStorage }
  | { type: 'ADD_WORKOUT'; session: Omit<WorkoutSession, 'id' | 'xpEarned'>; xpPenalty?: number }
  | { type: 'DELETE_WORKOUT'; id: string }
  | { type: 'SET_NAME'; name: string }
  | { type: 'DISMISS_BADGE' }
  | { type: 'DISMISS_INTERMEDIATE_UNLOCK' }
  | { type: 'RESET_QUESTS_IF_NEEDED' };

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'LOAD_DATA': {
      const { quests, completedQuestCount } = recomputeQuestProgress(action.data.quests, action.data.sessions);
      const badges = recomputeBadges(action.data.profile, action.data.sessions, completedQuestCount);
      return {
        ...action.data,
        profile: { ...action.data.profile, badges },
        quests,
        completedQuestCount,
        badgeQueue: [],
      };
    }

    case 'RESET_QUESTS_IF_NEEDED': {
      if (!shouldResetQuests(state.lastQuestResetDate)) return state;
      const now = new Date();
      const quests = resetAndRegenerateQuests(state.quests, now);
      return { ...state, quests, lastQuestResetDate: now.toISOString() };
    }

    case 'ADD_WORKOUT': {
      const xpEarned = Math.max(0, calculateXP(action.session, state.profile) - (action.xpPenalty ?? 0));
      const newSession: WorkoutSession = {
        ...action.session,
        id: crypto.randomUUID(),
        xpEarned,
      };
      const sessions = [newSession, ...state.sessions];

      const newTypeCounts = { ...state.profile.workoutTypeCounts };
      newTypeCounts[action.session.type] += 1;

      const newTotalXP = state.profile.totalXP + xpEarned;
      const newLevel = getLevelFromXP(newTotalXP);
      const totalWorkouts = state.profile.totalWorkouts + 1;

      let updatedProfile: UserProfile = {
        ...state.profile,
        totalXP: newTotalXP,
        level: newLevel,
        totalWorkouts,
        workoutTypeCounts: newTypeCounts,
      };

      const streakUpdate = evaluateStreak(updatedProfile, sessions);
      updatedProfile = { ...updatedProfile, ...streakUpdate };

      const { quests: updatedQuests, newlyCompleted } = updateQuestProgress(state.quests, sessions);
      const completedQuestCount = state.completedQuestCount + newlyCompleted.length;

      const newBadges = evaluateBadges(updatedProfile, sessions, completedQuestCount);

      return {
        ...state,
        profile: updatedProfile,
        sessions,
        quests: updatedQuests,
        completedQuestCount,
        badgeQueue: [...state.badgeQueue, ...newBadges],
      };
    }

    case 'DELETE_WORKOUT': {
      const sessions = state.sessions.filter((s) => s.id !== action.id);

      const totalXP = sessions.reduce((sum, s) => sum + s.xpEarned, 0);
      const newLevel = getLevelFromXP(totalXP);
      const totalWorkouts = sessions.length;
      const workoutTypeCounts = sessions.reduce(
        (acc, s) => ({ ...acc, [s.type]: (acc[s.type] ?? 0) + 1 }),
        { strength: 0, cardio: 0, flexibility: 0 } as Record<string, number>
      );

      let updatedProfile: UserProfile = {
        ...state.profile,
        totalXP,
        level: newLevel,
        totalWorkouts,
        workoutTypeCounts,
      };
      const streakUpdate = evaluateStreak(updatedProfile, sessions);
      updatedProfile = { ...updatedProfile, ...streakUpdate };

      const { quests: updatedQuests, completedQuestCount } = recomputeQuestProgress(state.quests, sessions);
      const updatedBadges = recomputeBadges(updatedProfile, sessions, completedQuestCount);
      updatedProfile = { ...updatedProfile, badges: updatedBadges };

      return { ...state, profile: updatedProfile, sessions, quests: updatedQuests, completedQuestCount };
    }

    case 'SET_NAME':
      return { ...state, profile: { ...state.profile, name: action.name } };

    case 'DISMISS_BADGE':
      return { ...state, badgeQueue: state.badgeQueue.slice(1) };

    case 'DISMISS_INTERMEDIATE_UNLOCK':
      return { ...state, seenIntermediatePlanUnlock: true };

    default:
      return state;
  }
}

interface AppContextValue {
  state: AppState;
  addWorkout: (session: Omit<WorkoutSession, 'id' | 'xpEarned'>, xpPenalty?: number) => void;
  deleteWorkout: (id: string) => void;
  setName: (name: string) => void;
  dismissBadge: () => void;
  dismissIntermediateUnlock: () => void;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children, userId }: { children: React.ReactNode; userId: string }) {
  const [dataLoading, setDataLoading] = useState(true);
  const [state, dispatch] = useReducer(reducer, { ...defaultStorage(), badgeQueue: [] });
  const skipNextSaveRef = useRef(true);

  useEffect(() => {
    setDataLoading(true);
    skipNextSaveRef.current = true;
    loadUserData(userId).then((data) => {
      dispatch({ type: 'LOAD_DATA', data });
      dispatch({ type: 'RESET_QUESTS_IF_NEEDED' });
      setDataLoading(false);
    });
  }, [userId]);

  useEffect(() => {
    if (dataLoading) return;
    if (skipNextSaveRef.current) {
      skipNextSaveRef.current = false;
      return;
    }
    saveUserData(userId, state);
  }, [state, userId, dataLoading]);

  const addWorkout = useCallback((session: Omit<WorkoutSession, 'id' | 'xpEarned'>, xpPenalty?: number) => {
    dispatch({ type: 'ADD_WORKOUT', session, xpPenalty });
  }, []);

  const deleteWorkout = useCallback((id: string) => {
    dispatch({ type: 'DELETE_WORKOUT', id });
  }, []);

  const setName = useCallback((name: string) => {
    dispatch({ type: 'SET_NAME', name });
  }, []);

  const dismissBadge = useCallback(() => dispatch({ type: 'DISMISS_BADGE' }), []);
  const dismissIntermediateUnlock = useCallback(() => dispatch({ type: 'DISMISS_INTERMEDIATE_UNLOCK' }), []);

  if (dataLoading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-gray-500 text-sm">Loading your data…</div>
      </div>
    );
  }

  return (
    <AppContext.Provider value={{ state, addWorkout, deleteWorkout, setName, dismissBadge, dismissIntermediateUnlock }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
