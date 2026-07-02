/* =========================================================
   AuthContext.jsx — Authentication state management
   Handles signup, login, logout, KYC, onboarding
   Per-user data isolation via user-scoped storage keys
   ========================================================= */

import { createContext, useContext, useReducer, useEffect } from 'react';
import {
  getStoredUser,
  setStoredUser,
  removeStoredUser,
  addUserToRegistry,
  findUserByEmail,
  updateUserInRegistry,
} from '../services/storage';
import { generateId } from '../utils/formatters';

const AuthContext = createContext(null);

// ─── Initial State ───────────────────────────────────────

const initialState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
};

// ─── Reducer ─────────────────────────────────────────────

function authReducer(state, action) {
  switch (action.type) {
    case 'INIT':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: !!action.payload,
        isLoading: false,
      };

    case 'LOGIN':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
      };

    case 'LOGOUT':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
      };

    case 'UPDATE_USER':
      return {
        ...state,
        user: { ...state.user, ...action.payload },
      };

    case 'COMPLETE_KYC':
      return {
        ...state,
        user: {
          ...state.user,
          kycStatus: 'verified',
          kycData: action.payload,
        },
      };

    case 'COMPLETE_ONBOARDING':
      return {
        ...state,
        user: {
          ...state.user,
          onboardingComplete: true,
        },
      };

    default:
      return state;
  }
}

// ─── Provider ────────────────────────────────────────────

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Initialize from localStorage
  useEffect(() => {
    const stored = getStoredUser();
    dispatch({ type: 'INIT', payload: stored });
  }, []);

  // Persist user changes to session storage AND registry
  useEffect(() => {
    if (!state.isLoading) {
      if (state.user) {
        setStoredUser(state.user);
        // Sync profile changes (KYC, onboarding, etc.) back to registry
        updateUserInRegistry(state.user);
      } else {
        removeStoredUser();
      }
    }
  }, [state.user, state.isLoading]);

  // ─── Actions ───────────────────────────────────────────

  function signup({ name, email, password }) {
    const existingUser = findUserByEmail(email);
    if (existingUser) {
      return { success: false, error: 'An account with this email already exists.' };
    }

    const user = {
      id: generateId('usr_'),
      name,
      email,
      password, // simulated — NOT real security
      kycStatus: 'not_started',
      kycData: null,
      onboardingComplete: false,
      contributorLevel: 1,
      createdAt: Date.now(),
    };

    addUserToRegistry(user);
    dispatch({ type: 'LOGIN', payload: user });
    return { success: true };
  }

  function login({ email, password }) {
    const user = findUserByEmail(email);
    if (!user) {
      return { success: false, error: 'No account found with this email.' };
    }
    if (user.password !== password) {
      return { success: false, error: 'Incorrect password.' };
    }

    // Always restore the full user profile from the registry
    // This preserves KYC status, onboarding state, etc. per user
    const fullUser = {
      ...user,
      kycStatus: user.kycStatus || 'not_started',
      kycData: user.kycData || null,
      onboardingComplete: user.onboardingComplete || false,
      contributorLevel: user.contributorLevel || 1,
    };

    dispatch({ type: 'LOGIN', payload: fullUser });
    return { success: true };
  }

  function logout() {
    dispatch({ type: 'LOGOUT' });
  }

  function completeKYC(kycData) {
    dispatch({ type: 'COMPLETE_KYC', payload: kycData });
  }

  function completeOnboarding() {
    dispatch({ type: 'COMPLETE_ONBOARDING' });
  }

  function updateUser(updates) {
    dispatch({ type: 'UPDATE_USER', payload: updates });
  }

  const value = {
    ...state,
    signup,
    login,
    logout,
    completeKYC,
    completeOnboarding,
    updateUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// ─── Hook ────────────────────────────────────────────────

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
