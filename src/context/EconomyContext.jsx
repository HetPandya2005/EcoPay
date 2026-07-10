/* =========================================================
   EconomyContext.jsx — Economy state management
   Handles contributions, requests, redemptions, achievements
   Per-user data isolation: each user has independent state
   ========================================================= */

import { createContext, useContext, useReducer, useEffect, useCallback, useRef } from 'react';
import { getStoredEconomy, setStoredEconomy, resetStoredEconomy } from '../services/storage';
import { calculateEarnCredits, checkAchievements, getContributorLevel, simulateGrowthTick } from '../utils/economy';
import { generateId } from '../utils/formatters';
import { REQUEST_TIERS, ECONOMY } from '../utils/constants';
import { useAuth } from './AuthContext';

const EconomyContext = createContext(null);

// ─── Reducer ─────────────────────────────────────────────

function economyReducer(state, action) {
  switch (action.type) {
    case 'INIT':
      return { ...state, ...action.payload, isLoading: false };

    case 'CONTRIBUTE': {
      const { amount, earnCredits } = action.payload;
      const entry = {
        id: generateId('contrib_'),
        amount,
        earnCreditsEarned: earnCredits,
        timestamp: Date.now(),
      };
      return {
        ...state,
        earnCredits: state.earnCredits + earnCredits,
        totalContributed: state.totalContributed + amount,
        contributionHistory: [entry, ...state.contributionHistory],
      };
    }

    case 'CREATE_REQUEST': {
      const tier = REQUEST_TIERS.find(t => t.id === action.payload.tierId);
      if (!tier) return state;
      const request = {
        id: generateId('req_'),
        tier: tier.id,
        requestAmount: tier.requestAmount,
        buyCreditsTarget: tier.buyCreditsTarget,
        buyCreditsAccumulated: 0,
        status: 'growing',
        createdAt: Date.now(),
      };
      return {
        ...state,
        earnCredits: state.earnCredits - tier.earnCreditsRequired,
        activeRequest: request,
      };
    }

    case 'GROWTH_TICK': {
      if (!state.activeRequest || state.activeRequest.status !== 'growing') return state;
      const { buyCreditsAccumulated, isReady } = simulateGrowthTick(state.activeRequest);
      return {
        ...state,
        activeRequest: {
          ...state.activeRequest,
          buyCreditsAccumulated,
          status: isReady ? 'ready' : 'growing',
        },
      };
    }

    case 'REDEEM': {
      if (!state.activeRequest || state.activeRequest.status !== 'ready') return state;
      const { brandId, brandName } = action.payload;
      const redemption = {
        id: generateId('redeem_'),
        requestCardId: state.activeRequest.id,
        brandId,
        brandName,
        amount: state.activeRequest.requestAmount,
        timestamp: Date.now(),
      };
      const closedRequest = {
        ...state.activeRequest,
        status: 'redeemed',
        brandId,
        redeemedAt: Date.now(),
      };
      return {
        ...state,
        activeRequest: null,
        pastRequests: [closedRequest, ...state.pastRequests],
        redemptionHistory: [redemption, ...state.redemptionHistory],
      };
    }

    case 'UNLOCK_ACHIEVEMENT':
      return {
        ...state,
        achievements: [...state.achievements, ...action.payload],
      };

    case 'ADD_NOTIFICATION': {
      const notification = {
        id: generateId('notif_'),
        ...action.payload,
        read: false,
        timestamp: Date.now(),
      };
      return {
        ...state,
        notifications: [notification, ...state.notifications].slice(0, 50),
      };
    }

    case 'MARK_NOTIFICATION_READ':
      return {
        ...state,
        notifications: state.notifications.map(n =>
          n.id === action.payload ? { ...n, read: true } : n
        ),
      };

    case 'MARK_ALL_NOTIFICATIONS_READ':
      return {
        ...state,
        notifications: state.notifications.map(n => ({ ...n, read: true })),
      };

    case 'RESET':
      return { ...getDefaultState(), isLoading: false };

    case 'LOAD_DEMO_DATA':
      return { ...state, ...action.payload, isLoading: false };

    default:
      return state;
  }
}

function getDefaultState() {
  return {
    earnCredits: 0,
    totalContributed: 0,
    contributionHistory: [],
    activeRequest: null,
    pastRequests: [],
    redemptionHistory: [],
    achievements: [],
    notifications: [],
    isLoading: true,
  };
}

// ─── Provider ────────────────────────────────────────────

export function EconomyProvider({ children }) {
  const { user, isLoading: authLoading } = useAuth();
  const [state, dispatch] = useReducer(economyReducer, getDefaultState());
  const currentUserIdRef = useRef(null);

  // Load user-scoped economy data when user changes
  useEffect(() => {
    if (authLoading) return;

    const newUserId = user?.id || null;

    // Save current user's data before switching (if switching users)
    if (currentUserIdRef.current && currentUserIdRef.current !== newUserId && !state.isLoading) {
      const { isLoading, ...data } = state;
      setStoredEconomy(data, currentUserIdRef.current);
    }

    currentUserIdRef.current = newUserId;

    if (newUserId) {
      // Load this user's economy data
      const stored = getStoredEconomy(newUserId);
      dispatch({ type: 'INIT', payload: stored });
    } else {
      // Logged out — reset to default
      dispatch({ type: 'RESET' });
    }
  }, [user?.id, authLoading]); // eslint-disable-line react-hooks/exhaustive-deps

  // Persist economy changes (user-scoped)
  useEffect(() => {
    if (!state.isLoading && currentUserIdRef.current) {
      const { isLoading, ...data } = state;
      setStoredEconomy(data, currentUserIdRef.current);
    }
  }, [state]);

  // Check achievements after every state change
  useEffect(() => {
    if (state.isLoading) return;
    const newAchievements = checkAchievements(state, state.achievements);
    if (newAchievements.length > 0) {
      dispatch({ type: 'UNLOCK_ACHIEVEMENT', payload: newAchievements });
      newAchievements.forEach(id => {
        dispatch({
          type: 'ADD_NOTIFICATION',
          payload: { type: 'achievement', message: `Achievement unlocked: ${id}` },
        });
      });
    }
  }, [state.earnCredits, state.totalContributed, state.contributionHistory.length, state.pastRequests.length, state.redemptionHistory.length, state.activeRequest]);

  // ─── Actions ───────────────────────────────────────────

  const contribute = useCallback((amount) => {
    const earnCredits = calculateEarnCredits(amount);
    dispatch({ type: 'CONTRIBUTE', payload: { amount, earnCredits } });
    dispatch({
      type: 'ADD_NOTIFICATION',
      payload: { type: 'contribution', message: `Contributed ₹${amount} — earned ${earnCredits} credits!` },
    });
    return earnCredits;
  }, []);

  const createRequest = useCallback((tierId) => {
    if (state.activeRequest) {
      return { success: false, error: 'You already have an active request card.' };
    }
    const tier = REQUEST_TIERS.find(t => t.id === tierId);
    if (!tier) {
      return { success: false, error: 'Invalid tier.' };
    }
    if (state.earnCredits < tier.earnCreditsRequired) {
      return { success: false, error: 'Not enough Earn Credits.' };
    }
    dispatch({ type: 'CREATE_REQUEST', payload: { tierId } });
    dispatch({
      type: 'ADD_NOTIFICATION',
      payload: { type: 'request', message: `Request Card launched for ₹${tier.requestAmount}!` },
    });
    return { success: true };
  }, [state.activeRequest, state.earnCredits]);

  const tickGrowth = useCallback(() => {
    dispatch({ type: 'GROWTH_TICK' });
  }, []);

  const redeem = useCallback((brandId, brandName) => {
    if (!state.activeRequest || state.activeRequest.status !== 'ready') {
      return { success: false, error: 'No request card ready for redemption.' };
    }
    dispatch({ type: 'REDEEM', payload: { brandId, brandName } });
    dispatch({
      type: 'ADD_NOTIFICATION',
      payload: { type: 'redemption', message: `Redeemed ₹${state.activeRequest.requestAmount} with ${brandName}!` },
    });
    return { success: true };
  }, [state.activeRequest]);

  const markNotificationRead = useCallback((id) => {
    dispatch({ type: 'MARK_NOTIFICATION_READ', payload: id });
  }, []);

  const markAllNotificationsRead = useCallback(() => {
    dispatch({ type: 'MARK_ALL_NOTIFICATIONS_READ' });
  }, []);

  const resetEconomy = useCallback(() => {
    if (currentUserIdRef.current) {
      resetStoredEconomy(currentUserIdRef.current);
    }
    dispatch({ type: 'RESET' });
  }, []);

  const loadDemoData = useCallback(() => {
    const demoData = {
      earnCredits: 3500,
      totalContributed: 270,
      contributionHistory: [
        { id: 'demo_c1', amount: 100, earnCreditsEarned: 1600, timestamp: Date.now() - 86400000 },
        { id: 'demo_c2', amount: 50, earnCreditsEarned: 700, timestamp: Date.now() - 172800000 },
        { id: 'demo_c3', amount: 20, earnCreditsEarned: 250, timestamp: Date.now() - 259200000 },
        { id: 'demo_c4', amount: 100, earnCreditsEarned: 1600, timestamp: Date.now() - 345600000 },
      ],
      activeRequest: null,
      pastRequests: [
        {
          id: 'demo_r1', tier: 'req_2000', requestAmount: 2000, buyCreditsTarget: 2000,
          buyCreditsAccumulated: 2000, status: 'redeemed', brandId: 'nike',
          createdAt: Date.now() - 604800000, redeemedAt: Date.now() - 432000000,
        },
      ],
      redemptionHistory: [
        { id: 'demo_red1', requestCardId: 'demo_r1', brandId: 'nike', brandName: 'Nike', amount: 2000, timestamp: Date.now() - 432000000 },
      ],
      achievements: ['first_contribution', 'request_unlocked', 'first_request', 'first_redemption', 'hundred_contributed', 'consistent_contributor'],
      notifications: [],
    };
    dispatch({ type: 'LOAD_DEMO_DATA', payload: demoData });
  }, []);

  const value = {
    ...state,
    contributorLevel: getContributorLevel(state.earnCredits),
    unreadNotifications: state.notifications.filter(n => !n.read).length,
    contribute,
    createRequest,
    tickGrowth,
    redeem,
    markNotificationRead,
    markAllNotificationsRead,
    resetEconomy,
    loadDemoData,
  };

  return (
    <EconomyContext.Provider value={value}>
      {children}
    </EconomyContext.Provider>
  );
}

// ─── Hook ────────────────────────────────────────────────

export function useEconomy() {
  const context = useContext(EconomyContext);
  if (!context) {
    throw new Error('useEconomy must be used within an EconomyProvider');
  }
  return context;
}
