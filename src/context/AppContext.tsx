import React, { createContext, useContext, useReducer, useCallback, useEffect } from 'react';
import type { AppStorage, WorkoutSession, UserProfile } from '../types';
import { loadStorage, saveStorage } from '../lib/storage';
import { BADGE_DEFINITIONS } from '../constants/badges';
import { generateQuests } from '../constants/quests';
import { calculateXP } from '../lib/xp';
import { evaluateStreak } from '../lib/streaks';
import { evaluateBadges } from '../lib/badges';
import { updateQuestProgress, shouldResetQuests, resetAndRegenerateQuests } from '../lib/quests';
import { getLevelFromXP } from '../lib/levelUtils';

interface AppState extends AppStorage {
  badgeQueue: string[];
}

type Action =
  | { type: 'ADD_WORKOUT'; session: Omit<WorkoutSession, 'id' | 'xpEarned'>; xpPenalty?: number }
  | { type: 'DISMISS_BADGE' }
  | { type: 'DISMISS_INTERMEDIATE_UNLOCK' }
  | { type: 'RESET_QUESTS_IF_NEEDED' }
  | { type: 'IMPORT_STORAGE'; data: AppStorage };

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'RESET_QUESTS_IF_NEEDED': {
      if (!shouldResetQuests(state.lastQuestResetDate)) return state;
      const now = new Date();
      const quests = resetAndRegenerateQuests(state.quests, now);
      const next: AppState = { ...state, quests, lastQuestResetDate: now.toISOString() };
      saveStorage(next);
      return next;
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

      const next: AppState = {
        ...state,
        profile: updatedProfile,
        sessions,
        quests: updatedQuests,
        completedQuestCount,
        badgeQueue: [...state.badgeQueue, ...newBadges],
      };
      saveStorage(next);
      return next;
    }

    case 'DISMISS_BADGE':
      return { ...state, badgeQueue: state.badgeQueue.slice(1) };

    case 'DISMISS_INTERMEDIATE_UNLOCK': {
      const next: AppState = { ...state, seenIntermediatePlanUnlock: true };
      saveStorage(next);
      return next;
    }

    case 'IMPORT_STORAGE': {
      const imported = action.data;
      // Patch any missing fields that might not exist in older backups
      if (!imported.seenIntermediatePlanUnlock) imported.seenIntermediatePlanUnlock = false;
      if (!imported.quests || imported.quests.length === 0) {
        imported.quests = generateQuests(new Date());
        imported.lastQuestResetDate = new Date().toISOString();
      }
      if (!imported.profile.badges || imported.profile.badges.length === 0) {
        imported.profile.badges = BADGE_DEFINITIONS.map((b) => ({ id: b.id, unlockedAt: null }));
      }
      const next: AppState = { ...imported, badgeQueue: [] };
      saveStorage(next);
      return next;
    }

    default:
      return state;
  }
}

interface AppContextValue {
  state: AppState;
  addWorkout: (session: Omit<WorkoutSession, 'id' | 'xpEarned'>, xpPenalty?: number) => void;
  dismissBadge: () => void;
  dismissIntermediateUnlock: () => void;
  importStorage: (data: AppStorage) => void;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, () => {
    const stored = loadStorage();
    // Patch existing stored data missing the new field
    if (stored.seenIntermediatePlanUnlock === undefined) {
      stored.seenIntermediatePlanUnlock = false;
    }
    return { ...stored, badgeQueue: [] };
  });

  useEffect(() => {
    dispatch({ type: 'RESET_QUESTS_IF_NEEDED' });
  }, []);

  const addWorkout = useCallback((session: Omit<WorkoutSession, 'id' | 'xpEarned'>, xpPenalty?: number) => {
    dispatch({ type: 'ADD_WORKOUT', session, xpPenalty });
  }, []);

  const dismissBadge = useCallback(() => dispatch({ type: 'DISMISS_BADGE' }), []);
  const dismissIntermediateUnlock = useCallback(() => dispatch({ type: 'DISMISS_INTERMEDIATE_UNLOCK' }), []);
  const importStorage = useCallback((data: AppStorage) => dispatch({ type: 'IMPORT_STORAGE', data }), []);

  return (
    <AppContext.Provider value={{ state, addWorkout, dismissBadge, dismissIntermediateUnlock, importStorage }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
