/* =========================================================
   BuyCredits.jsx — Buy Credits Growth & Redemption Page
   Watch purchasing power grow until ready for redemption
   ========================================================= */

import { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  TrendingUp, Zap, Clock, Target, Award,
  Sparkles, CheckCircle2, Gift, PlusCircle,
  Timer, CreditCard, BarChart3, Layers,
} from 'lucide-react';
import { useEconomy } from '../../context/EconomyContext';
import { useAnimatedCounter } from '../../hooks/useAnimatedCounter';
import { useGrowthSimulation } from '../../hooks/useGrowthSimulation';
import {
  getBuyCreditsProgress,
  estimateTimeToCompletion,
  getContributorLevel,
  calculateGrowthPerTick,
} from '../../utils/economy';
import {
  formatCurrency,
  formatNumber,
  formatDateTime,
  formatDuration,
} from '../../utils/formatters';
import { ROUTES, REQUEST_TIERS } from '../../utils/constants';
import { useToast } from '../../components/ui/Toast';
import './BuyCredits.css';

/* ─── Framer Motion Variants ─────────────────────────────── */

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.07, delayChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

/* ─── Confetti Component ───────────────────────────────── */

function Confetti() {
  const pieces = useMemo(() => {
    const colors = ['#7c6cf0', '#00d2c6', '#f4c430', '#f472b6', '#3b82f6', '#10b981', '#f59e0b'];
    return Array.from({ length: 80 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      color: colors[Math.floor(Math.random() * colors.length)],
      delay: `${Math.random() * 2}s`,
      size: 6 + Math.random() * 12,
      rotation: Math.random() * 360,
      shape: Math.random() > 0.5 ? 'circle' : 'rect',
    }));
  }, []);

  return (
    <div className="bc-confetti">
      {pieces.map(p => (
        <div
          key={p.id}
          className="bc-confetti__piece"
          style={{
            left: p.left,
            width: p.size,
            height: p.shape === 'rect' ? p.size * 0.6 : p.size,
            background: p.color,
            borderRadius: p.shape === 'circle' ? '50%' : '2px',
            animationDelay: p.delay,
            transform: `rotate(${p.rotation}deg)`,
          }}
        />
      ))}
    </div>
  );
}

/* ─── Celebration Overlay ──────────────────────────────── */

function CelebrationOverlay({ onComplete, amount }) {
  useEffect(() => {
    const timer = setTimeout(onComplete, 3500);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      className="bc-celebration"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Confetti />
      <motion.div
        className="bc-celebration__content"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
      >
        <div className="bc-celebration__glow" />
        <motion.span
          className="bc-celebration__emoji"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 0.8, ease: [0.34, 1.56, 0.64, 1], delay: 0.4 }}
        >
          🎉
        </motion.span>
        <motion.h2
          className="bc-celebration__title"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <span className="text-gradient">Redemption Complete!</span>
        </motion.h2>
        <motion.p
          className="bc-celebration__subtitle"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.5 }}
        >
          {formatCurrency(amount)} successfully redeemed
        </motion.p>
        <motion.p
          className="bc-celebration__desc"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0, duration: 0.5 }}
        >
          Redirecting to Partner Brands...
        </motion.p>
      </motion.div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════
   BuyCredits Component
   ═══════════════════════════════════════════════════════════ */

export default function BuyCredits() {
  const economy = useEconomy();
  const navigate = useNavigate();
  const toast = useToast();

  // Activate growth simulation — drives GROWTH_TICK in EconomyContext
  useGrowthSimulation();

  const [showCelebration, setShowCelebration] = useState(false);
  const [isRedeeming, setIsRedeeming] = useState(false);
  const [redemptionAmount, setRedemptionAmount] = useState(0);
  const prevStatusRef = useRef(economy.activeRequest?.status);

  const req = economy.activeRequest;

  // Animated counter for buy credits
  const animatedBuyCredits = useAnimatedCounter(
    req ? req.buyCreditsAccumulated : 0,
    600
  );

  // Progress calculation
  const progress = req ? getBuyCreditsProgress(req) : 0;
  const progressPercent = Math.round(progress * 100);

  // Get tier info
  const tierInfo = useMemo(() => {
    if (!req) return null;
    return REQUEST_TIERS.find(t => t.id === req.tier) || null;
  }, [req]);

  // Growth per tick
  const growthPerTick = req ? calculateGrowthPerTick(req) : 0;

  // Time estimate
  const timeRemaining = req ? estimateTimeToCompletion(req) : 0;

  // Contributor level
  const contributorLevel = getContributorLevel(economy.earnCredits);

  // Detect status change to 'ready'
  useEffect(() => {
    if (
      prevStatusRef.current === 'growing' &&
      req?.status === 'ready'
    ) {
      toast.success('🎉 Buy Credits are complete! Ready for Redemption!');
    }
    prevStatusRef.current = req?.status;
  }, [req?.status]); // eslint-disable-line react-hooks/exhaustive-deps

  // Redeem handler
  const handleRedeem = useCallback(() => {
    if (!req || req.status !== 'ready' || isRedeeming) return;
    setIsRedeeming(true);
    setRedemptionAmount(req.requestAmount);
    setShowCelebration(true);
  }, [req, isRedeeming]);

  // After celebration complete — do the actual redemption and navigate
  const handleCelebrationComplete = useCallback(() => {
    const result = economy.redeem('pending', 'To Be Selected');
    if (result.success) {
      navigate(ROUTES.PARTNERS, {
        state: {
          fromRedemption: true,
          requestAmount: redemptionAmount,
          tier: req?.tier,
        },
      });
    } else {
      toast.error(result.error || 'Redemption failed.');
      setShowCelebration(false);
      setIsRedeeming(false);
    }
  }, [economy, navigate, redemptionAmount, req, toast]);

  /* ── Empty State ── */
  if (!req) {
    return (
      <motion.div className="buy-credits" variants={container} initial="hidden" animate="show">
        <HeroSection />
        <motion.div className="bc-empty" variants={item}>
          <div className="bc-empty__illustration">
            <div className="bc-empty__orb bc-empty__orb--1" />
            <div className="bc-empty__orb bc-empty__orb--2" />
            <span className="bc-empty__icon">📋</span>
          </div>
          <h2 className="bc-empty__title">No Active Request Found</h2>
          <p className="bc-empty__desc">
            Create your first Request Card to begin growing Buy Credits.
          </p>
          <motion.button
            className="bc-empty__btn"
            onClick={() => navigate(ROUTES.CREATE_REQUEST)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
          >
            <PlusCircle size={20} />
            Create Request
          </motion.button>
        </motion.div>
      </motion.div>
    );
  }

  /* ── Main Content ── */
  return (
    <motion.div className="buy-credits" variants={container} initial="hidden" animate="show">
      <AnimatePresence>
        {showCelebration && (
          <CelebrationOverlay
            onComplete={handleCelebrationComplete}
            amount={redemptionAmount}
          />
        )}
      </AnimatePresence>

      {/* 1. Hero Header */}
      <HeroSection />

      {/* 2. Active Request Summary Card */}
      <ActiveRequestCard
        req={req}
        tierInfo={tierInfo}
        contributorLevel={contributorLevel}
      />

      {/* 3. Large Buy Credit Counter */}
      <motion.section className="bc-counter-section" variants={item}>
        <div className="bc-counter__glow" />
        <div className="bc-counter__label">
          <TrendingUp size={18} />
          BUY CREDITS
        </div>
        <motion.div
          className="bc-counter__value"
          key={animatedBuyCredits}
          initial={{ scale: 1 }}
          animate={{ scale: [1, 1.02, 1] }}
          transition={{ duration: 0.3 }}
        >
          {formatNumber(animatedBuyCredits)}
        </motion.div>
        <div className="bc-counter__sublabel">
          of {formatNumber(req.buyCreditsTarget)} target
        </div>
      </motion.section>

      {/* 4. Progress Section */}
      <motion.section className="bc-progress-section" variants={item}>
        <div className="bc-progress__header">
          <div className="bc-progress__values">
            <span className="bc-progress__current">
              {formatNumber(req.buyCreditsAccumulated)}
            </span>
            <span className="bc-progress__separator">/</span>
            <span className="bc-progress__target">
              {formatNumber(req.buyCreditsTarget)}
            </span>
          </div>
          <span className="bc-progress__percent">{progressPercent}%</span>
        </div>
        <div className="bc-progress__bar-wrap">
          <motion.div
            className="bc-progress__bar-fill"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          />
          {progressPercent > 0 && progressPercent < 100 && (
            <div
              className="bc-progress__bar-shimmer"
              style={{ width: `${progressPercent}%` }}
            />
          )}
        </div>
        {req.status === 'growing' && (
          <div className="bc-progress__meta">
            <span className="bc-progress__growth">
              <Zap size={12} /> +{formatNumber(growthPerTick)} / tick
            </span>
            <span className="bc-progress__eta">
              <Timer size={12} /> ~{formatDuration(timeRemaining)} remaining
            </span>
          </div>
        )}
        {req.status === 'ready' && (
          <div className="bc-progress__complete">
            <CheckCircle2 size={14} />
            Target reached — Ready for Redemption!
          </div>
        )}
      </motion.section>

      {/* 5 & 6. Status Card + Request Info Grid */}
      <div className="bc-info-grid">
        <StatusCard status={req.status} />
        <RequestInfoCard
          req={req}
          tierInfo={tierInfo}
          contributorLevel={contributorLevel}
          progress={progressPercent}
        />
      </div>

      {/* 7. Redeem Section */}
      <motion.section className="bc-redeem-section" variants={item}>
        {req.status === 'ready' ? (
          <>
            <div className="bc-redeem__ready-badge">
              <CheckCircle2 size={18} />
              Your purchasing power is ready
            </div>
            <motion.button
              className="bc-redeem__btn bc-redeem__btn--active"
              onClick={handleRedeem}
              disabled={isRedeeming}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
            >
              {isRedeeming ? (
                <>
                  <span className="bc-redeem__spinner" />
                  Redeeming...
                </>
              ) : (
                <>
                  <Gift size={22} />
                  Redeem Now
                </>
              )}
            </motion.button>
          </>
        ) : (
          <>
            <div className="bc-redeem__waiting-info">
              <Clock size={16} />
              <span>
                Your Buy Credits are still growing. Once they reach the target,
                the Redeem button will activate.
              </span>
            </div>
            <button className="bc-redeem__btn bc-redeem__btn--disabled" disabled>
              <Clock size={20} />
              Waiting for Buy Credits...
            </button>
          </>
        )}
      </motion.section>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════
   Sub-Components
   ═══════════════════════════════════════════════════════════ */

function HeroSection() {
  return (
    <motion.section className="bc-hero" variants={item}>
      <div className="bc-hero__orb bc-hero__orb--1" />
      <div className="bc-hero__orb bc-hero__orb--2" />
      <motion.h1
        className="bc-hero__title"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <span className="text-gradient">Buy Credits</span>
      </motion.h1>
      <motion.p
        className="bc-hero__desc"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        Watch your active request grow until it becomes ready for redemption.
      </motion.p>
    </motion.section>
  );
}

function ActiveRequestCard({ req, tierInfo, contributorLevel }) {
  const tierEmojis = { Bronze: '🥉', Silver: '🥈', Gold: '🥇', Platinum: '💎' };
  const statusLabels = {
    growing: 'Growing',
    ready: 'Ready For Redemption',
    redeemed: 'Redeemed',
  };

  return (
    <motion.section className="bc-request-card" variants={item}>
      <div className="bc-request-card__glow" />
      <div className="bc-request-card__top-bar" />

      <div className="bc-request-card__header">
        <div className="bc-request-card__chip">
          <Sparkles size={12} />
          Active Request
        </div>
        <div
          className={`bc-request-card__status-badge bc-request-card__status-badge--${req.status}`}
        >
          <span className="bc-request-card__status-dot" />
          {statusLabels[req.status]}
        </div>
      </div>

      <div className="bc-request-card__grid">
        <div className="bc-request-card__item">
          <span className="bc-request-card__item-label">Request Amount</span>
          <span className="bc-request-card__item-value bc-request-card__item-value--gradient">
            {formatCurrency(req.requestAmount)}
          </span>
        </div>
        <div className="bc-request-card__item">
          <span className="bc-request-card__item-label">Tier</span>
          <span className="bc-request-card__item-value">
            {tierEmojis[tierInfo?.label]} {tierInfo?.label || 'Unknown'}
          </span>
        </div>
        <div className="bc-request-card__item">
          <span className="bc-request-card__item-label">Launch Time</span>
          <span className="bc-request-card__item-value">
            {formatDateTime(req.createdAt)}
          </span>
        </div>
        <div className="bc-request-card__item">
          <span className="bc-request-card__item-label">Contributor Level</span>
          <span className="bc-request-card__item-value">
            {contributorLevel.icon} {contributorLevel.name}
          </span>
        </div>
      </div>
    </motion.section>
  );
}

function StatusCard({ status }) {
  const statusConfig = {
    growing: {
      label: 'Growing',
      description: 'Your Buy Credits are actively increasing every few seconds.',
      emoji: '📈',
      colorClass: 'bc-status-card--growing',
    },
    ready: {
      label: 'Ready for Redemption',
      description: 'Your Buy Credits have reached the target! You can now redeem.',
      emoji: '✅',
      colorClass: 'bc-status-card--ready',
    },
    redeemed: {
      label: 'Redeemed',
      description: 'This request has been successfully redeemed.',
      emoji: '🎁',
      colorClass: 'bc-status-card--redeemed',
    },
  };

  const config = statusConfig[status] || statusConfig.growing;

  return (
    <motion.div
      className={`bc-status-card ${config.colorClass}`}
      variants={item}
      whileHover={{ y: -3 }}
    >
      <div className="bc-status-card__top-bar" />
      <span className="bc-status-card__emoji">{config.emoji}</span>
      <h3 className="bc-status-card__title">Status</h3>
      <div className="bc-status-card__label">{config.label}</div>
      <p className="bc-status-card__desc">{config.description}</p>
      {status === 'growing' && (
        <div className="bc-status-card__pulse-wrap">
          <span className="bc-status-card__pulse-dot" />
          <span className="bc-status-card__pulse-ring" />
        </div>
      )}
    </motion.div>
  );
}

function RequestInfoCard({ req, tierInfo, contributorLevel, progress }) {
  const timeRem = estimateTimeToCompletion(req);
  const estimatedCompletion = req.status === 'ready'
    ? 'Completed'
    : `~${formatDuration(timeRem)} from now`;

  return (
    <motion.div className="bc-info-card" variants={item} whileHover={{ y: -3 }}>
      <div className="bc-info-card__top-bar" />
      <h3 className="bc-info-card__title">
        <BarChart3 size={16} />
        Request Information
      </h3>
      <div className="bc-info-card__rows">
        <div className="bc-info-card__row">
          <span className="bc-info-card__row-label">
            <Layers size={13} /> Tier
          </span>
          <span className="bc-info-card__row-value">{tierInfo?.label || '—'}</span>
        </div>
        <div className="bc-info-card__row">
          <span className="bc-info-card__row-label">
            <CreditCard size={13} /> Request Amount
          </span>
          <span className="bc-info-card__row-value">{formatCurrency(req.requestAmount)}</span>
        </div>
        <div className="bc-info-card__row">
          <span className="bc-info-card__row-label">
            <Clock size={13} /> Launch Date
          </span>
          <span className="bc-info-card__row-value">{formatDateTime(req.createdAt)}</span>
        </div>
        <div className="bc-info-card__row">
          <span className="bc-info-card__row-label">
            <Target size={13} /> Expected Completion
          </span>
          <span className="bc-info-card__row-value">{estimatedCompletion}</span>
        </div>
        <div className="bc-info-card__row">
          <span className="bc-info-card__row-label">
            <BarChart3 size={13} /> Current Progress
          </span>
          <span className="bc-info-card__row-value">{progress}%</span>
        </div>
        <div className="bc-info-card__row">
          <span className="bc-info-card__row-label">
            <Award size={13} /> Contributor Level
          </span>
          <span className="bc-info-card__row-value">
            {contributorLevel.icon} {contributorLevel.name}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
