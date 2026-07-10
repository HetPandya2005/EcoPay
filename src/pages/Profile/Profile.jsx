/* =========================================================
   Profile.jsx — Contributor Profile Page
   Showcases user journey, achievements, and contribution data
   Read-only display of existing EconomyContext / AuthContext
   ========================================================= */

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Sparkles, TrendingUp, Wallet, FileText,
  Gift, Trophy, ArrowRight, Shield,
  CheckCircle, Lock, Clock, ChevronRight,
  User, Mail, Phone, Calendar, Award,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useEconomy } from '../../context/EconomyContext';
import { useAnimatedCounter } from '../../hooks/useAnimatedCounter';
import { getLevelProgress, getHighestUnlockedTier, getAchievementsWithStatus } from '../../utils/economy';
import { formatCurrency, formatNumber, formatRelativeTime, formatDateTime } from '../../utils/formatters';
import { CONTRIBUTOR_LEVELS, REQUEST_TIERS } from '../../utils/constants';
import ProgressBar from '../../components/ui/ProgressBar';
import './Profile.css';

/* ─── Framer Motion config ────────────────────────────── */

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

/* ─── Animated Stat Sub-component ─────────────────────── */

function AnimatedStat({ icon: Icon, label, value, prefix = '', suffix = '', color = 'primary', delay = 0 }) {
  const animated = useAnimatedCounter(typeof value === 'number' ? value : 0, 1000);
  return (
    <motion.div
      className={`profile-stat profile-stat--${color}`}
      variants={item}
      whileHover={{ y: -3 }}
    >
      <div className="profile-stat__icon">
        <Icon size={20} />
      </div>
      <div className="profile-stat__value">
        {prefix}{typeof value === 'number' ? formatNumber(animated) : value}{suffix}
      </div>
      <div className="profile-stat__label">{label}</div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════
   Profile Component
   ═══════════════════════════════════════════════════════════ */

export default function Profile() {
  const { user } = useAuth();
  const economy = useEconomy();

  /* ── Derived data ────────────────────────────────────── */

  const levelProgress = useMemo(
    () => getLevelProgress(economy.earnCredits),
    [economy.earnCredits]
  );

  const highestTier = useMemo(
    () => getHighestUnlockedTier(economy.earnCredits),
    [economy.earnCredits]
  );

  const achievementsWithStatus = useMemo(
    () => getAchievementsWithStatus(economy.achievements),
    [economy.achievements]
  );

  const totalRequests = useMemo(
    () => economy.pastRequests.length + (economy.activeRequest ? 1 : 0),
    [economy.pastRequests, economy.activeRequest]
  );

  const totalRedemptions = economy.redemptionHistory.length;

  const creditsRemaining = useMemo(() => {
    if (!levelProgress.next) return 0;
    return levelProgress.next.threshold - economy.earnCredits;
  }, [levelProgress, economy.earnCredits]);

  /* ── Activity timeline ──────────────────────────────── */

  const activityTimeline = useMemo(() => {
    const items = [];

    economy.contributionHistory.forEach(c => {
      items.push({
        id: c.id,
        type: 'contribution',
        title: `Contributed ${formatCurrency(c.amount)}`,
        detail: `Earned ${formatNumber(c.earnCreditsEarned)} credits`,
        timestamp: c.timestamp,
      });
    });

    economy.pastRequests.forEach(r => {
      items.push({
        id: r.id + '_created',
        type: 'request',
        title: `Request Created — ${formatCurrency(r.requestAmount)}`,
        detail: `${r.tier} tier`,
        timestamp: r.createdAt,
      });
    });

    if (economy.activeRequest) {
      items.push({
        id: economy.activeRequest.id + '_active',
        type: 'request',
        title: `Request Active — ${formatCurrency(economy.activeRequest.requestAmount)}`,
        detail: `Status: ${economy.activeRequest.status}`,
        timestamp: economy.activeRequest.createdAt,
      });
    }

    economy.redemptionHistory.forEach(r => {
      items.push({
        id: r.id,
        type: 'redemption',
        title: `Redeemed ${formatCurrency(r.amount)}`,
        detail: `via ${r.brandName}`,
        timestamp: r.timestamp,
      });
    });

    // Sort newest first
    items.sort((a, b) => b.timestamp - a.timestamp);
    return items.slice(0, 15);
  }, [economy.contributionHistory, economy.pastRequests, economy.activeRequest, economy.redemptionHistory]);

  /* ── Ecosystem journey stages ───────────────────────── */

  const journeyStages = useMemo(() => {
    const hasContributed = economy.contributionHistory.length > 0;
    const hasRequest = economy.pastRequests.length > 0 || economy.activeRequest !== null;
    const hasBuyCredits = economy.pastRequests.some(r => r.status === 'redeemed');
    const hasRedeemed = economy.redemptionHistory.length > 0;

    return [
      { label: 'Signup', icon: '👤', completed: true },
      { label: 'KYC Verified', icon: '✅', completed: user?.kycStatus === 'verified' },
      { label: 'Earn Credits', icon: '⚡', completed: hasContributed },
      { label: 'Create Request', icon: '📋', completed: hasRequest },
      { label: 'Buy Credits', icon: '📈', completed: hasBuyCredits },
      { label: 'Redeem', icon: '🎁', completed: hasRedeemed },
    ];
  }, [user, economy]);

  /* ── Helpers ─────────────────────────────────────────── */

  const avatarLetter = user?.name ? user.name.charAt(0).toUpperCase() : '?';
  const joinDate = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
    : 'N/A';
  const kycVerified = user?.kycStatus === 'verified';

  /* ── Render ──────────────────────────────────────────── */

  return (
    <motion.div
      className="profile"
      variants={container}
      initial="hidden"
      animate="show"
    >
      {/* ══════════════════════════════════════════════════════
          PAGE HEADER
          ══════════════════════════════════════════════════════ */}
      <motion.div className="profile__header" variants={item}>
        <h1 className="profile__header-title">Profile</h1>
        <p className="profile__header-subtitle">
          Track your EcoPay journey, achievements, and contributor progress.
        </p>
      </motion.div>

      {/* ══════════════════════════════════════════════════════
          HERO CARD
          ══════════════════════════════════════════════════════ */}
      <motion.section className="profile-hero" variants={item}>
        <div className="profile-hero__orb profile-hero__orb--1" />
        <div className="profile-hero__orb profile-hero__orb--2" />
        <div className="profile-hero__orb profile-hero__orb--3" />

        <div className="profile-hero__content">
          <motion.div
            className="profile-hero__avatar"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.3 }}
          >
            {avatarLetter}
          </motion.div>

          <div className="profile-hero__info">
            <motion.h2
              className="profile-hero__name"
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.35 }}
            >
              {user?.name || 'EcoPay User'}
            </motion.h2>
            <motion.p
              className="profile-hero__email"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.45 }}
            >
              {user?.email || 'No email'}
            </motion.p>
            <motion.div
              className="profile-hero__badges"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.5 }}
            >
              <span className={`profile-hero__badge ${kycVerified ? 'profile-hero__badge--kyc' : 'profile-hero__badge--kyc-pending'}`}>
                {kycVerified ? '✓ KYC Verified' : '⏳ KYC Pending'}
              </span>
              <span className="profile-hero__badge profile-hero__badge--level">
                {levelProgress.current.icon} {levelProgress.current.name}
              </span>
              <span className="profile-hero__badge profile-hero__badge--rank">
                Lv. {levelProgress.current.level}
              </span>
            </motion.div>
          </div>
        </div>

        <motion.div
          className="profile-hero__meta"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.55 }}
        >
          <div className="profile-hero__meta-item">
            <span className="profile-hero__meta-label">Member Since</span>
            <span className="profile-hero__meta-value">{joinDate}</span>
          </div>
          <div className="profile-hero__meta-item">
            <span className="profile-hero__meta-label">Contributor Level</span>
            <span className="profile-hero__meta-value">{levelProgress.current.icon} {levelProgress.current.name}</span>
          </div>
          <div className="profile-hero__meta-item">
            <span className="profile-hero__meta-label">Achievements</span>
            <span className="profile-hero__meta-value">{economy.achievements.length} / {achievementsWithStatus.length}</span>
          </div>
        </motion.div>
      </motion.section>

      {/* ══════════════════════════════════════════════════════
          CONTRIBUTOR STATISTICS
          ══════════════════════════════════════════════════════ */}
      <motion.section variants={container}>
        <motion.h2 className="profile__section-title" variants={item}>Contributor Statistics</motion.h2>
        <motion.div className="profile-stats__grid" variants={container}>
          <AnimatedStat
            icon={Sparkles}
            label="Earn Credits"
            value={economy.earnCredits}
            color="primary"
          />
          <AnimatedStat
            icon={TrendingUp}
            label="Buy Credits"
            value={economy.activeRequest?.buyCreditsAccumulated || 0}
            color="secondary"
          />
          <AnimatedStat
            icon={Wallet}
            label="Total Contributed"
            value={economy.totalContributed}
            prefix="₹"
            color="gold"
          />
          <AnimatedStat
            icon={FileText}
            label="Requests Created"
            value={totalRequests}
            color="info"
          />
          <AnimatedStat
            icon={Gift}
            label="Total Redemptions"
            value={totalRedemptions}
            color="success"
          />
          <AnimatedStat
            icon={Award}
            label="Highest Tier"
            value={highestTier ? highestTier.label : 'None'}
            color="danger"
          />
        </motion.div>
      </motion.section>

      {/* ══════════════════════════════════════════════════════
          LEVEL PROGRESS
          ══════════════════════════════════════════════════════ */}
      <motion.section variants={item}>
        <motion.h2 className="profile__section-title" variants={item}>Level Progress</motion.h2>
        <div className="profile-level">
          <div className="profile-level__header">
            <div className="profile-level__current">
              <span className="profile-level__icon">{levelProgress.current.icon}</span>
              <div className="profile-level__details">
                <span className="profile-level__name">{levelProgress.current.name}</span>
                <span className="profile-level__sublabel">Level {levelProgress.current.level}</span>
              </div>
            </div>
            {levelProgress.next && (
              <div className="profile-level__next">
                <span className="profile-level__next-label">Next Level</span>
                <span className="profile-level__next-name">{levelProgress.next.icon} {levelProgress.next.name}</span>
                <span className="profile-level__remaining">{formatNumber(creditsRemaining)} credits to go</span>
              </div>
            )}
            {!levelProgress.next && (
              <div className="profile-level__next">
                <span className="profile-level__next-name">🏆 Max Level</span>
              </div>
            )}
          </div>

          <div className="profile-level__progress">
            <ProgressBar
              value={levelProgress.progress * 100}
              max={100}
              showValue={true}
              variant="primary"
              size="md"
              animated={true}
            />
          </div>

          <div className="profile-level__ladder">
            {CONTRIBUTOR_LEVELS.map((level) => {
              const isActive = level.level === levelProgress.current.level;
              const isUnlocked = economy.earnCredits >= level.threshold;
              return (
                <motion.div
                  key={level.level}
                  className={`profile-level__step ${isActive ? 'profile-level__step--active' : ''} ${!isUnlocked ? 'profile-level__step--locked' : ''}`}
                  whileHover={{ y: -2 }}
                >
                  <span className="profile-level__step-icon">{level.icon}</span>
                  <span className="profile-level__step-name">{level.name}</span>
                  <span className="profile-level__step-threshold">
                    {isUnlocked ? '✓' : `${formatNumber(level.threshold)} credits`}
                  </span>
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.section>

      {/* ══════════════════════════════════════════════════════
          ACHIEVEMENTS
          ══════════════════════════════════════════════════════ */}
      <motion.section variants={container}>
        <motion.h2 className="profile__section-title" variants={item}>Achievements</motion.h2>
        <motion.div className="profile-achievements__grid" variants={container}>
          {achievementsWithStatus.map((achievement, i) => (
            <motion.div
              key={achievement.id}
              className={`profile-achievement ${achievement.isUnlocked ? 'profile-achievement--unlocked' : 'profile-achievement--locked'}`}
              variants={item}
              whileHover={{ y: -3, scale: 1.02 }}
            >
              <div className="profile-achievement__icon">
                {achievement.isUnlocked ? achievement.icon : <Lock size={18} />}
              </div>
              <div className="profile-achievement__info">
                <div className="profile-achievement__name">{achievement.name}</div>
                <div className="profile-achievement__desc">{achievement.description}</div>
              </div>
              {achievement.isUnlocked && (
                <span className="profile-achievement__check">✓</span>
              )}
            </motion.div>
          ))}
        </motion.div>
      </motion.section>

      {/* ══════════════════════════════════════════════════════
          ACTIVITY TIMELINE
          ══════════════════════════════════════════════════════ */}
      <motion.section variants={container}>
        <motion.h2 className="profile__section-title" variants={item}>Activity Summary</motion.h2>
        {activityTimeline.length === 0 ? (
          <motion.div className="profile-timeline__empty" variants={item}>
            No activity yet. Start contributing to see your timeline!
          </motion.div>
        ) : (
          <div className="profile-timeline">
            {activityTimeline.map((activity, i) => (
              <motion.div
                key={activity.id}
                className="profile-timeline__item"
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.1 + i * 0.06, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className={`profile-timeline__dot profile-timeline__dot--${activity.type}`} />
                <div className="profile-timeline__card">
                  <div className="profile-timeline__title">{activity.title}</div>
                  <div className="profile-timeline__detail">{activity.detail}</div>
                  <div className="profile-timeline__time">{formatRelativeTime(activity.timestamp)}</div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.section>

      {/* ══════════════════════════════════════════════════════
          ECOSYSTEM JOURNEY
          ══════════════════════════════════════════════════════ */}
      <motion.section variants={item}>
        <motion.h2 className="profile__section-title" variants={item}>Contribution Journey</motion.h2>
        <div className="profile-journey">
          <div className="profile-journey__flow">
            {journeyStages.map((stage, i) => (
              <motion.div key={stage.label} style={{ display: 'contents' }}>
                <motion.div
                  className={`profile-journey__step ${stage.completed ? 'profile-journey__step--completed' : 'profile-journey__step--pending'}`}
                  whileHover={{ y: -2, scale: 1.03 }}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: 0.1 + i * 0.08 }}
                >
                  <div className="profile-journey__step-icon">
                    {stage.completed ? stage.icon : <Lock size={16} />}
                  </div>
                  <span className="profile-journey__step-label">{stage.label}</span>
                </motion.div>
                {i < journeyStages.length - 1 && (
                  <ChevronRight size={16} className="profile-journey__arrow" />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* ══════════════════════════════════════════════════════
          ACCOUNT INFORMATION
          ══════════════════════════════════════════════════════ */}
      <motion.section variants={item}>
        <motion.h2 className="profile__section-title" variants={item}>Account Information</motion.h2>
        <div className="profile-account">
          <div className="profile-account__grid">
            <div className="profile-account__field">
              <span className="profile-account__field-label">Full Name</span>
              <span className="profile-account__field-value">{user?.name || 'N/A'}</span>
            </div>
            <div className="profile-account__field">
              <span className="profile-account__field-label">Email Address</span>
              <span className="profile-account__field-value">{user?.email || 'N/A'}</span>
            </div>
            <div className="profile-account__field">
              <span className="profile-account__field-label">Phone Number</span>
              <span className="profile-account__field-value">
                {user?.kycData?.phone || 'Not provided'}
              </span>
            </div>
            <div className="profile-account__field">
              <span className="profile-account__field-label">KYC Status</span>
              <span className="profile-account__field-value">
                {kycVerified ? '✓ Verified' : '⏳ Pending'}
              </span>
            </div>
            <div className="profile-account__field">
              <span className="profile-account__field-label">Member Since</span>
              <span className="profile-account__field-value">{joinDate}</span>
            </div>
            <div className="profile-account__field">
              <span className="profile-account__field-label">User ID</span>
              <span className="profile-account__field-value" style={{ fontSize: 'var(--text-xs)', wordBreak: 'break-all' }}>
                {user?.id || 'N/A'}
              </span>
            </div>
          </div>
        </div>
      </motion.section>
    </motion.div>
  );
}
