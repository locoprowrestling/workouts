import React, { createContext, useContext, useReducer, useCallback, useEffect } from 'react';
import type { AppStorage, WorkoutSession, Quest, UserProfile } from '../types';
import { loadStorage, saveStorage } from '../lib/storage';
import { calculateXP } from '../lib/xp';
import { evaluateStreak } from '../lib/streaks';
import { evaluateBadges } from '../lib/badges';
import { updateQuestProgress, shouldResetQuests, resetAndRegenerateQuests } from '../lib/quests';
import { getLevelFromXP } from '../lib/levelUtils';

interface AppState extends AppStorage {
  badgeQueue: string[];
}

type Action =
  | { type: 'ADD_WORKOUT'; session: Omit<WorkoutSession, 'id' | 'xpEarned'> }
  | { type: 'DISMISS_BADGE' }
  | { type: 'RESET_QUESTS_IF_NEEDED' };

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
      const xpEarned = calculateXP(action.session, state.profile);
      const newSession: WorkoutSession = {
        ...action.session,
        id: crypto.randomUUID(),
        xpEarned,
      };
      const sessions = [newSession, ...state.sessions];

      // Update profile
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

      // Evaluate streak
      const streakUpdate = evaluateStreak(updatedProfile, sessions);
      updatedProfile = { ...updatedProfile, ...streakUpdate };

      // Evaluate quests
      const { quests: updatedQuests, newlyCompleted } = updateQuestProgress(state.quests, sessions);
      const completedQuestCount = state.completedQuestCount + newlyCompleted.length;

      // Evaluate badges (mutates updatedProfile.badges in place)
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

    case 'DISMISS_BADGE': {
      return { ...state, badgeQueue: state.badgeQueue.slice(1) };
    }

    default:
      return state;
  }
}

interface AppContextValue {
  state: AppState;
  addWorkout: (session: Omit<WorkoutSession, 'id' | 'xpEarned'>) => void;
  dismissBadge: () => void;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, () => ({
    ...loadStorage(),
    badgeQueue: [],
  }));

  useEffect(() => {
    dispatch({ type: 'RESET_QUESTS_IF_NEEDED' });
  }, []);

  const addWorkout = useCallback((session: Omit<WorkoutSession, 'id' | 'xpEarned'>) => {
    dispatch({ type: 'ADD_WORKOUT', session });
  }, []);

  const dismissBadge = useCallback(() => {
    dispatch({ type: 'DISMISS_BADGE' });
  }, []);

  return (
    <AppContext.Provider value={{ state, addWorkout, dismissBadge }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
