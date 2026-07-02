/* =========================================================
   storage.js — localStorage service layer
   Abstraction for all persistent data operations
   ========================================================= */

const STORAGE_KEYS = {
  AUTH_USER: 'ecopay_auth_user',
  ECONOMY_STATE: 'ecopay_economy_state',       // legacy global key
  ECONOMY_STATE_PREFIX: 'ecopay_economy_',      // per-user prefix
  APP_SETTINGS: 'ecopay_app_settings',
};

// ─── Generic Helpers ─────────────────────────────────────

function getItem(key) {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch (e) {
    console.error(`[Storage] Failed to read ${key}:`, e);
    return null;
  }
}

function setItem(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (e) {
    console.error(`[Storage] Failed to write ${key}:`, e);
    return false;
  }
}

function removeItem(key) {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (e) {
    console.error(`[Storage] Failed to remove ${key}:`, e);
    return false;
  }
}

// ─── Auth User ───────────────────────────────────────────

export function getStoredUser() {
  return getItem(STORAGE_KEYS.AUTH_USER);
}

export function setStoredUser(user) {
  return setItem(STORAGE_KEYS.AUTH_USER, user);
}

export function removeStoredUser() {
  return removeItem(STORAGE_KEYS.AUTH_USER);
}

// ─── Economy State ───────────────────────────────────────

export const DEFAULT_ECONOMY_STATE = {
  earnCredits: 0,
  totalContributed: 0,
  contributionHistory: [],
  activeRequest: null,
  pastRequests: [],
  redemptionHistory: [],
  achievements: [],
  notifications: [],
};

/**
 * Get economy state for a specific user.
 * Falls back to fresh default state if none exists.
 */
export function getStoredEconomy(userId) {
  if (userId) {
    return getItem(STORAGE_KEYS.ECONOMY_STATE_PREFIX + userId) || { ...DEFAULT_ECONOMY_STATE };
  }
  // Legacy fallback (no userId)
  return getItem(STORAGE_KEYS.ECONOMY_STATE) || { ...DEFAULT_ECONOMY_STATE };
}

/**
 * Save economy state for a specific user.
 */
export function setStoredEconomy(state, userId) {
  if (userId) {
    return setItem(STORAGE_KEYS.ECONOMY_STATE_PREFIX + userId, state);
  }
  return setItem(STORAGE_KEYS.ECONOMY_STATE, state);
}

/**
 * Reset economy state for a specific user.
 */
export function resetStoredEconomy(userId) {
  if (userId) {
    return setItem(STORAGE_KEYS.ECONOMY_STATE_PREFIX + userId, { ...DEFAULT_ECONOMY_STATE });
  }
  return setItem(STORAGE_KEYS.ECONOMY_STATE, { ...DEFAULT_ECONOMY_STATE });
}

// ─── App Settings ────────────────────────────────────────

const DEFAULT_SETTINGS = {
  demoMode: false,
};

export function getStoredSettings() {
  return getItem(STORAGE_KEYS.APP_SETTINGS) || { ...DEFAULT_SETTINGS };
}

export function setStoredSettings(settings) {
  return setItem(STORAGE_KEYS.APP_SETTINGS, settings);
}

// ─── Full Reset ──────────────────────────────────────────

export function clearAllData() {
  Object.values(STORAGE_KEYS).forEach(key => removeItem(key));
}

// ─── User Registry (for multi-user simulation) ──────────

const USERS_REGISTRY_KEY = 'ecopay_users_registry';

export function getUsersRegistry() {
  return getItem(USERS_REGISTRY_KEY) || [];
}

export function addUserToRegistry(user) {
  const users = getUsersRegistry();
  const exists = users.find(u => u.email === user.email);
  if (exists) return false;
  users.push({
    id: user.id,
    name: user.name,
    email: user.email,
    password: user.password, // simulated — not real security
    kycStatus: user.kycStatus || 'not_started',
    kycData: user.kycData || null,
    onboardingComplete: user.onboardingComplete || false,
    contributorLevel: user.contributorLevel || 1,
    createdAt: user.createdAt,
  });
  setItem(USERS_REGISTRY_KEY, users);
  return true;
}

/**
 * Update an existing user's profile data in the registry.
 * Syncs KYC status, onboarding state, and other profile fields.
 */
export function updateUserInRegistry(user) {
  if (!user || !user.email) return false;
  const users = getUsersRegistry();
  const index = users.findIndex(u => u.email === user.email);
  if (index === -1) return false;
  users[index] = {
    ...users[index],
    name: user.name,
    kycStatus: user.kycStatus,
    kycData: user.kycData,
    onboardingComplete: user.onboardingComplete,
    contributorLevel: user.contributorLevel,
  };
  setItem(USERS_REGISTRY_KEY, users);
  return true;
}

export function findUserByEmail(email) {
  const users = getUsersRegistry();
  return users.find(u => u.email === email) || null;
}

