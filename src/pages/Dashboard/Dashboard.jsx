/* =========================================================
   Dashboard.jsx — Hero Experience & Overview Section
   The visual centerpiece of the EcoPay ecosystem
   ========================================================= */

import { useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Zap, ShoppingBag, ArrowUpRight, Plus,
  Wallet, FileText, Gift, Trophy,
  Sparkles, TrendingUp,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useEconomy } from '../../context/EconomyContext';
import { useAnimatedCounter } from '../../hooks/useAnimatedCounter';
import { getLevelProgress } from '../../utils/economy';
import { formatCurrency, formatNumber } from '../../utils/formatters';
import { ACHIEVEMENTS } from '../../utils/constants';
import ProgressBar from '../../components/ui/ProgressBar';
import { useToast } from '../../components/ui/Toast';
import './Dashboard.css';

/* ─── Helpers ──────────────────────────────────────────── */

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 5) return 'Good Night';
  if (hour < 12) return 'Good Morning';
  if (hour < 17) return 'Good Afternoon';
  return 'Good Evening';
}

/* ─── Stagger config ───────────────────────────────────── */

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

/* ─── Credit Counter Sub-component ─────────────────────── */

function CreditCounter({ label, value, icon: Icon, gradient, glowClass }) {
  const animated = useAnimatedCounter(value, 1200);
  return (
    <div className={`hero__credit ${glowClass}`}>
      <div className="hero__credit-icon-wrap" style={{ background: gradient }}>
        <Icon size={22} />
      </div>
      <span className="hero__credit-label">{label}</span>
      <span className="hero__credit-value">{formatNumber(animated)}</span>
    </div>
  );
}

/* ─── Quick Action Button ──────────────────────────────── */

function QuickAction({ icon: Icon, label, sublabel, gradient, onClick, delay = 0 }) {
  return (
    <motion.button
      className="quick-action"
      onClick={onClick}
      variants={item}
      whileHover={{ y: -4, scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
    >
      <div className="quick-action__icon" style={{ background: gradient }}>
        <Icon size={20} />
      </div>
      <div className="quick-action__text">
        <span className="quick-action__label">{label}</span>
        {sublabel && <span className="quick-action__sublabel">{sublabel}</span>}
      </div>
      <ArrowUpRight size={16} className="quick-action__arrow" />
    </motion.button>
  );
}

/* ─── Overview Stat Card ───────────────────────────────── */

function OverviewCard({ icon: Icon, label, value, prefix, suffix, trend, color, delay = 0 }) {
  const animated = useAnimatedCounter(typeof value === 'number' ? value : 0, 1000);
  return (
    <motion.div
      className={`overview-card overview-card--${color}`}
      variants={item}
      whileHover={{ y: -4 }}
    >
      <div className="overview-card__top">
        <div className="overview-card__icon">
          <Icon size={20} />
        </div>
        {trend !== undefined && (
          <span className={`overview-card__trend overview-card__trend--${trend >= 0 ? 'up' : 'down'}`}>
            {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}%
          </span>
        )}
      </div>
      <div className="overview-card__value">
        {prefix}{typeof value === 'number' ? formatNumber(animated) : value}{suffix}
      </div>
      <div className="overview-card__label">{label}</div>
      {/* Animated border glow */}
      <div className="overview-card__glow" />
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════
   Dashboard Component
   ═══════════════════════════════════════════════════════════ */

export default function Dashboard() {
  const { user } = useAuth();
  const economy = useEconomy();
  const toast = useToast();

  const greeting = useMemo(() => getGreeting(), []);
  const levelProgress = useMemo(
    () => getLevelProgress(economy.earnCredits),
    [economy.earnCredits]
  );

  const totalRedeemed = useMemo(
    () => economy.redemptionHistory.reduce((sum, r) => sum + r.amount, 0),
    [economy.redemptionHistory]
  );

  const achievementCount = economy.achievements.length;
  const totalAchievements = ACHIEVEMENTS.length;

  /* ── Quick Action handlers (placeholder) ─────────────── */
  const handleContribute = useCallback((amount) => {
    const earned = economy.contribute(amount);
    toast.success(`Contributed ₹${amount} — earned ${earned} credits!`);
  }, [economy, toast]);

  const handleCreateRequest = useCallback(() => {
    toast.info('Create Request — coming soon!');
  }, [toast]);

  return (
    <motion.div
      className="dashboard"
      variants={container}
      initial="hidden"
      animate="show"
    >
      {/* ════════════════════════════════════════════════════
          HERO CARD
          ════════════════════════════════════════════════════ */}
      <motion.section className="hero" variants={item}>
        {/* Background mesh orbs */}
        <div className="hero__orb hero__orb--1" />
        <div className="hero__orb hero__orb--2" />
        <div className="hero__orb hero__orb--3" />

        {/* ── Top Row: Greeting + Badge ── */}
        <div className="hero__top">
          <div className="hero__greeting">
            <motion.h1
              className="hero__greeting-text"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {greeting},
              <br />
              <span className="hero__name">{user?.name || 'Explorer'} 👋</span>
            </motion.h1>
            <motion.p
              className="hero__welcome"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.45 }}
            >
              Welcome back to <span className="text-gradient">EcoPay</span>
            </motion.p>
          </div>

          {/* KYC Badge */}
          <motion.div
            className="hero__kyc-badge"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.5 }}
          >
            <span className="hero__kyc-check">✓</span>
            <span className="hero__kyc-text">KYC Verified</span>
          </motion.div>
        </div>

        {/* ── User Status ── */}
        <motion.div
          className="hero__status"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.55 }}
        >
          <div className="hero__level">
            <span className="hero__level-icon">{levelProgress.current.icon}</span>
            <span className="hero__level-name">{levelProgress.current.name}</span>
            {levelProgress.next && (
              <span className="hero__level-next">
                → {levelProgress.next.icon} {levelProgress.next.name}
              </span>
            )}
          </div>
          <ProgressBar
            value={levelProgress.progress * 100}
            max={100}
            showValue={true}
            variant="primary"
            size="sm"
            className="hero__progress"
          />
        </motion.div>

        {/* ── Credit Counters ── */}
        <motion.div
          className="hero__credits"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.65 }}
        >
          <CreditCounter
            label="Earn Credits"
            value={economy.earnCredits}
            icon={Sparkles}
            gradient="linear-gradient(135deg, #7c6cf0, #a78bfa)"
            glowClass="hero__credit--earn"
          />
          <div className="hero__credit-divider" />
          <CreditCounter
            label="Buy Credits"
            value={economy.activeRequest?.buyCreditsAccumulated || 0}
            icon={TrendingUp}
            gradient="linear-gradient(135deg, #00d2c6, #22d3ee)"
            glowClass="hero__credit--buy"
          />
        </motion.div>
      </motion.section>

      {/* ════════════════════════════════════════════════════
          QUICK ACTIONS
          ════════════════════════════════════════════════════ */}
      <motion.section className="quick-actions" variants={container}>
        <motion.h2 className="section-title" variants={item}>Quick Actions</motion.h2>
        <motion.div className="quick-actions__grid" variants={container}>
          <QuickAction
            icon={Zap}
            label="Contribute ₹10"
            sublabel="+100 credits"
            gradient="linear-gradient(135deg, #10b981, #34d399)"
            onClick={() => handleContribute(10)}
          />
          <QuickAction
            icon={Zap}
            label="Contribute ₹20"
            sublabel="+250 credits"
            gradient="linear-gradient(135deg, #6c5ce7, #a29bfe)"
            onClick={() => handleContribute(20)}
          />
          <QuickAction
            icon={Zap}
            label="Contribute ₹50"
            sublabel="+700 credits"
            gradient="linear-gradient(135deg, #f0883e, #fbbf24)"
            onClick={() => handleContribute(50)}
          />
          <QuickAction
            icon={Plus}
            label="Create Request"
            sublabel="Launch card"
            gradient="linear-gradient(135deg, #3b82f6, #8b5cf6)"
            onClick={handleCreateRequest}
          />
        </motion.div>
      </motion.section>

      {/* ════════════════════════════════════════════════════
          OVERVIEW CARDS
          ════════════════════════════════════════════════════ */}
      <motion.section className="overview" variants={container}>
        <motion.h2 className="section-title" variants={item}>Overview</motion.h2>
        <motion.div className="overview__grid" variants={container}>
          <OverviewCard
            icon={Wallet}
            label="Total Contributed"
            value={economy.totalContributed}
            prefix="₹"
            trend={12}
            color="primary"
          />
          <OverviewCard
            icon={FileText}
            label="Requests Created"
            value={economy.pastRequests.length + (economy.activeRequest ? 1 : 0)}
            trend={8}
            color="secondary"
          />
          <OverviewCard
            icon={Gift}
            label="Credits Redeemed"
            value={totalRedeemed}
            prefix="₹"
            trend={24}
            color="gold"
          />
          <OverviewCard
            icon={Trophy}
            label="Achievements"
            value={`${achievementCount} / ${totalAchievements}`}
            color="success"
          />
        </motion.div>
      </motion.section>
    </motion.div>
  );
}
