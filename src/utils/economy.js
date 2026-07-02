/* =========================================================
   economy.js — Economy simulation calculations
   All credit math, tier logic, and growth formulas
   ========================================================= */

import { CONTRIBUTION_TIERS, REQUEST_TIERS, CONTRIBUTOR_LEVELS, ACHIEVEMENTS, ECONOMY } from './constants';

// ─── Contribution → Earn Credits ─────────────────────────
/**
 * Calculate Earn Credits for a given contribution amount.
 * Uses non-linear scaling: higher contributions earn disproportionately more.
 */
export function calculateEarnCredits(amount) {
  const tier = CONTRIBUTION_TIERS.find(t => t.amount === amount);
  if (tier) return tier.earnCredits;
  // Fallback for custom amounts: base rate only
  return Math.floor(amount * ECONOMY.BASE_CREDIT_RATE);
}

/**
 * Get the contribution tier object for a given amount.
 */
export function getContributionTier(amount) {
  return CONTRIBUTION_TIERS.find(t => t.amount === amount) || null;
}

// ─── Tier Eligibility ────────────────────────────────────
/**
 * Get all request tiers with their unlock status based on current Earn Credits.
 */
export function getRequestTiersWithEligibility(earnCredits) {
  return REQUEST_TIERS.map(tier => ({
    ...tier,
    isUnlocked: earnCredits >= tier.earnCreditsRequired,
    progress: Math.min(1, earnCredits / tier.earnCreditsRequired),
  }));
}

/**
 * Get the highest unlocked request tier.
 */
export function getHighestUnlockedTier(earnCredits) {
  const unlocked = REQUEST_TIERS.filter(t => earnCredits >= t.earnCreditsRequired);
  return unlocked.length > 0 ? unlocked[unlocked.length - 1] : null;
}

/**
 * Check if a specific request tier is unlocked.
 */
export function isTierUnlocked(tierId, earnCredits) {
  const tier = REQUEST_TIERS.find(t => t.id === tierId);
  return tier ? earnCredits >= tier.earnCreditsRequired : false;
}

/**
 * Get the next tier to unlock (or null if all unlocked).
 */
export function getNextTierToUnlock(earnCredits) {
  return REQUEST_TIERS.find(t => earnCredits < t.earnCreditsRequired) || null;
}

// ─── Buy Credit Growth ──────────────────────────────────
/**
 * Calculate Buy Credits growth per tick for a request card.
 * Growth = target × baseRate × tierBonus
 */
export function calculateGrowthPerTick(requestCard) {
  const tier = REQUEST_TIERS.find(t => t.id === requestCard.tier);
  const growthBonus = tier ? tier.growthBonus : 1.0;
  return Math.ceil(requestCard.buyCreditsTarget * ECONOMY.GROWTH_RATE_PER_TICK * growthBonus);
}

/**
 * Simulate one growth tick. Returns updated Buy Credits (capped at target).
 */
export function simulateGrowthTick(requestCard) {
  const growth = calculateGrowthPerTick(requestCard);
  const newAccumulated = Math.min(
    requestCard.buyCreditsAccumulated + growth,
    requestCard.buyCreditsTarget
  );
  return {
    buyCreditsAccumulated: newAccumulated,
    isReady: newAccumulated >= requestCard.buyCreditsTarget,
  };
}

/**
 * Get the progress percentage of a request card's Buy Credits.
 */
export function getBuyCreditsProgress(requestCard) {
  if (!requestCard || requestCard.buyCreditsTarget === 0) return 0;
  return Math.min(1, requestCard.buyCreditsAccumulated / requestCard.buyCreditsTarget);
}

/**
 * Estimate time remaining until Buy Credits reach target.
 * Returns seconds.
 */
export function estimateTimeToCompletion(requestCard, isDemoMode = false) {
  const remaining = requestCard.buyCreditsTarget - requestCard.buyCreditsAccumulated;
  const growthPerTick = calculateGrowthPerTick(requestCard);
  if (growthPerTick === 0) return Infinity;
  const ticksRemaining = Math.ceil(remaining / growthPerTick);
  const intervalMs = isDemoMode ? ECONOMY.DEMO_GROWTH_TICK_INTERVAL : ECONOMY.GROWTH_TICK_INTERVAL;
  return (ticksRemaining * intervalMs) / 1000;
}

// ─── Contributor Level ───────────────────────────────────
/**
 * Get the current contributor level based on total Earn Credits.
 */
export function getContributorLevel(earnCredits) {
  let currentLevel = CONTRIBUTOR_LEVELS[0];
  for (const level of CONTRIBUTOR_LEVELS) {
    if (earnCredits >= level.threshold) {
      currentLevel = level;
    }
  }
  return currentLevel;
}

/**
 * Get progress toward the next contributor level.
 * Returns { current, next, progress (0-1) }
 */
export function getLevelProgress(earnCredits) {
  const current = getContributorLevel(earnCredits);
  const nextIndex = CONTRIBUTOR_LEVELS.findIndex(l => l.level === current.level) + 1;
  const next = nextIndex < CONTRIBUTOR_LEVELS.length ? CONTRIBUTOR_LEVELS[nextIndex] : null;

  if (!next) {
    return { current, next: null, progress: 1 };
  }

  const progressRange = next.threshold - current.threshold;
  const userProgress = earnCredits - current.threshold;
  return {
    current,
    next,
    progress: Math.min(1, userProgress / progressRange),
  };
}

// ─── Achievement Checks ─────────────────────────────────
/**
 * Check which achievements should be unlocked based on current state.
 * Returns array of newly unlocked achievement IDs.
 */
export function checkAchievements(state, currentAchievements = []) {
  const newlyUnlocked = [];

  const checks = {
    first_contribution: () => state.contributionHistory.length >= 1,
    request_unlocked: () => state.earnCredits >= 500,
    first_request: () => state.pastRequests.length >= 1 || state.activeRequest !== null,
    first_redemption: () => state.redemptionHistory.length >= 1,
    hundred_contributed: () => state.totalContributed >= 100,
    elite_contributor: () => state.earnCredits >= 6000,
    consistent_contributor: () => state.contributionHistory.length >= 5,
  };

  for (const [id, check] of Object.entries(checks)) {
    if (!currentAchievements.includes(id) && check()) {
      newlyUnlocked.push(id);
    }
  }

  return newlyUnlocked;
}

/**
 * Get achievement details with unlock status.
 */
export function getAchievementsWithStatus(unlockedIds = []) {
  return ACHIEVEMENTS.map(a => ({
    ...a,
    isUnlocked: unlockedIds.includes(a.id),
  }));
}
