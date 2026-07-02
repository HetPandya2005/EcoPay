/* =========================================================
   constants.js — Single source of truth for all config data
   Architecture V2 compliant
   ========================================================= */

// ─── Contribution Tiers ───────────────────────────────────
export const CONTRIBUTION_TIERS = [
  { id: 'tier_10', amount: 10, earnCredits: 100, multiplier: 1.0, label: 'Starter', color: '#00b894' },
  { id: 'tier_20', amount: 20, earnCredits: 250, multiplier: 1.25, label: 'Plus', color: '#6c5ce7' },
  { id: 'tier_50', amount: 50, earnCredits: 700, multiplier: 1.4, label: 'Pro', color: '#e17055' },
  { id: 'tier_100', amount: 100, earnCredits: 1600, multiplier: 1.6, label: 'Elite', color: '#f4c430' },
];

// ─── Request Card Tiers ──────────────────────────────────
export const REQUEST_TIERS = [
  { id: 'req_2000', earnCreditsRequired: 500, requestAmount: 2000, buyCreditsTarget: 2000, label: 'Bronze', color: '#cd7f32', growthBonus: 1.0 },
  { id: 'req_5000', earnCreditsRequired: 1500, requestAmount: 5000, buyCreditsTarget: 5000, label: 'Silver', color: '#c0c0c0', growthBonus: 1.1 },
  { id: 'req_10000', earnCreditsRequired: 3000, requestAmount: 10000, buyCreditsTarget: 10000, label: 'Gold', color: '#f4c430', growthBonus: 1.2 },
  { id: 'req_20000', earnCreditsRequired: 6000, requestAmount: 20000, buyCreditsTarget: 20000, label: 'Platinum', color: '#e5e4e2', growthBonus: 1.3 },
];

// ─── Contributor Levels ──────────────────────────────────
export const CONTRIBUTOR_LEVELS = [
  { level: 1, name: 'Seedling', threshold: 0, color: '#00b894', icon: '🌱', gradient: 'linear-gradient(135deg, #00b894, #00cec9)' },
  { level: 2, name: 'Grower', threshold: 500, color: '#0984e3', icon: '🌿', gradient: 'linear-gradient(135deg, #0984e3, #74b9ff)' },
  { level: 3, name: 'Builder', threshold: 1500, color: '#6c5ce7', icon: '🏗️', gradient: 'linear-gradient(135deg, #6c5ce7, #a29bfe)' },
  { level: 4, name: 'Accelerator', threshold: 3000, color: '#f4c430', icon: '🚀', gradient: 'linear-gradient(135deg, #f4c430, #f39c12)' },
  { level: 5, name: 'Titan', threshold: 6000, color: '#dfe6e9', icon: '💎', gradient: 'linear-gradient(135deg, #dfe6e9, #b2bec3)' },
];

// ─── Achievements ────────────────────────────────────────
export const ACHIEVEMENTS = [
  { id: 'first_contribution', name: 'First Contribution', description: 'Complete your first contribution', icon: '🏅' },
  { id: 'request_unlocked', name: 'Request Unlocked', description: 'Reach 500 Earn Credits', icon: '🔓' },
  { id: 'first_request', name: 'First Request Launch', description: 'Create your first Request Card', icon: '🚀' },
  { id: 'first_redemption', name: 'First Redemption', description: 'Complete your first redemption', icon: '🎁' },
  { id: 'hundred_contributed', name: '₹100 Contributed', description: 'Total contributions reach ₹100', icon: '💯' },
  { id: 'elite_contributor', name: 'Elite Contributor', description: 'Reach Titan level (6,000 credits)', icon: '👑' },
  { id: 'consistent_contributor', name: 'Consistent Contributor', description: 'Make 5+ contributions', icon: '🔥' },
];

// ─── Partner Brands ──────────────────────────────────────
export const PARTNER_BRANDS = [
  { id: 'nike', name: 'Nike', category: 'Fashion / Sports', minCredits: 1000, maxCredits: 20000, color: '#f5f5f5', tagline: 'Just Do It' },
  { id: 'adidas', name: 'Adidas', category: 'Fashion / Sports', minCredits: 1000, maxCredits: 20000, color: '#000000', tagline: 'Impossible Is Nothing' },
  { id: 'puma', name: 'Puma', category: 'Fashion / Sports', minCredits: 1000, maxCredits: 15000, color: '#e3000b', tagline: 'Forever Faster' },
  { id: 'boat', name: 'boAt', category: 'Electronics / Audio', minCredits: 500, maxCredits: 10000, color: '#e63946', tagline: 'Plug Into Nirvana' },
  { id: 'amazon', name: 'Amazon', category: 'General / Everything', minCredits: 500, maxCredits: 20000, color: '#ff9900', tagline: 'A to Z' },
];

// ─── Economy Rules ───────────────────────────────────────
export const ECONOMY = {
  BASE_CREDIT_RATE: 10,                 // Base credits per ₹1
  GROWTH_TICK_INTERVAL: 5000,           // ms between growth ticks (normal mode)
  DEMO_GROWTH_TICK_INTERVAL: 500,       // ms between growth ticks (demo mode)
  GROWTH_RATE_PER_TICK: 0.005,          // 0.5% of target per tick
  MAX_ACTIVE_REQUESTS: 1,              // Only ONE active request at a time
  PAYMENT_SIMULATION_DURATION: 3000,   // ms for fake payment processing
  KYC_VERIFICATION_DURATION: 3000,     // ms for fake KYC verification
};

// ─── Route Paths ─────────────────────────────────────────
export const ROUTES = {
  // Public
  LANDING: '/',
  LOGIN: '/login',
  SIGNUP: '/signup',
  PARTNERS: '/partners',
  // Private
  ONBOARDING: '/onboarding',
  KYC: '/kyc',
  DASHBOARD: '/dashboard',
  EARN: '/earn',
  BUY_CREDITS: '/buy-credits',
  CREATE_REQUEST: '/create-request',
  PROFILE: '/profile',
  SETTINGS: '/settings',
};

// ─── Navigation Items ────────────────────────────────────
export const NAV_ITEMS = [
  { label: 'Dashboard', path: ROUTES.DASHBOARD, icon: 'LayoutDashboard' },
  { label: 'Earn Credits', path: ROUTES.EARN, icon: 'Coins' },
  { label: 'Buy Credits', path: ROUTES.BUY_CREDITS, icon: 'TrendingUp' },
  { label: 'Create Request', path: ROUTES.CREATE_REQUEST, icon: 'PlusCircle' },
  { label: 'Partner Brands', path: ROUTES.PARTNERS, icon: 'Store' },
  { label: 'Profile', path: ROUTES.PROFILE, icon: 'User' },
  { label: 'Settings', path: ROUTES.SETTINGS, icon: 'Settings' },
];
