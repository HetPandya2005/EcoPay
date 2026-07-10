/* =========================================================
   EarnCredits.jsx — Earn Credits Analytics Page
   View credits, contribute, track history & unlock progress
   ========================================================= */

import { useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Sparkles, Zap, TrendingUp, ArrowRight,
  Wallet, Award, Lock, Unlock,
  ChevronRight, Trophy, Crown, BarChart3,
} from 'lucide-react';
import { useEconomy } from '../../context/EconomyContext';
import { useAnimatedCounter } from '../../hooks/useAnimatedCounter';
import { getLevelProgress, getRequestTiersWithEligibility, getHighestUnlockedTier } from '../../utils/economy';
import { formatCurrency, formatNumber, formatDateTime } from '../../utils/formatters';
import { CONTRIBUTION_TIERS, REQUEST_TIERS } from '../../utils/constants';
import ProgressBar from '../../components/ui/ProgressBar';
import { useToast } from '../../components/ui/Toast';
import './EarnCredits.css';

/* ─── Stagger config ───────────────────────────────────── */

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

/* ═══════════════════════════════════════════════════════════
   EarnCredits Component
   ═══════════════════════════════════════════════════════════ */

export default function EarnCredits() {
  const economy = useEconomy();
  const toast = useToast();

  const animatedCredits = useAnimatedCounter(economy.earnCredits, 1200);
  const levelProgress = useMemo(() => getLevelProgress(economy.earnCredits), [economy.earnCredits]);
  const tiersWithStatus = useMemo(() => getRequestTiersWithEligibility(economy.earnCredits), [economy.earnCredits]);
  const highestTier = useMemo(() => getHighestUnlockedTier(economy.earnCredits), [economy.earnCredits]);

  /* ── Contribution handler ── */
  const handleContribute = useCallback((amount) => {
    const earned = economy.contribute(amount);
    toast.success(`Contributed ₹${amount} — earned ${earned} credits!`);
  }, [economy, toast]);

  /* ── Running totals for history ── */
  const historyWithRunning = useMemo(() => {
    const history = [...economy.contributionHistory];
    // contributionHistory is newest-first; compute running totals from oldest
    const reversed = [...history].reverse();
    let running = 0;
    const mapped = reversed.map(entry => {
      running += entry.earnCreditsEarned;
      return { ...entry, runningTotal: running };
    });
    return mapped.reverse(); // back to newest-first
  }, [economy.contributionHistory]);

  return (
    <motion.div className="earn" variants={container} initial="hidden" animate="show">

      {/* ════════════════════════════════════════════════════
          1. PAGE HEADER
          ════════════════════════════════════════════════════ */}
      <motion.section className="earn-hero" variants={item}>
        <div className="earn-hero__orb earn-hero__orb--1" />
        <div className="earn-hero__orb earn-hero__orb--2" />
        <div className="earn-hero__content">
          <motion.h1
            className="earn-hero__title"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <span className="text-gradient">Earn Credits</span>
          </motion.h1>
          <motion.p
            className="earn-hero__desc"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            Contribute to the EcoPay ecosystem and earn credits that unlock Request Cards.
          </motion.p>
        </div>
      </motion.section>

      {/* ════════════════════════════════════════════════════
          2. CURRENT BALANCE
          ════════════════════════════════════════════════════ */}
      <motion.section className="earn-balance" variants={item}>
        <div className="earn-balance__orb earn-balance__orb--1" />
        <div className="earn-balance__orb earn-balance__orb--2" />

        <div className="earn-balance__credits">
          <div className="earn-balance__credits-label">Current Earn Credits</div>
          <div className="earn-balance__credits-value">{formatNumber(animatedCredits)}</div>
          <div className="earn-balance__credits-sub">
            From {economy.contributionHistory.length} contribution{economy.contributionHistory.length !== 1 ? 's' : ''}
          </div>
        </div>

        <div className="earn-balance__divider" />

        <div className="earn-balance__level">
          <div className="earn-balance__level-icon">{levelProgress.current.icon}</div>
          <div className="earn-balance__level-label">Contributor Level</div>
          <div className="earn-balance__level-name">{levelProgress.current.name}</div>
          {levelProgress.next ? (
            <div className="earn-balance__level-next">
              → {levelProgress.next.icon} {levelProgress.next.name}
            </div>
          ) : (
            <div className="earn-balance__level-next">Max Level Reached!</div>
          )}
          <div className="earn-balance__progress-wrap">
            <ProgressBar
              value={levelProgress.progress * 100}
              max={100}
              showValue
              variant="primary"
              size="sm"
            />
          </div>
        </div>
      </motion.section>

      {/* ════════════════════════════════════════════════════
          3. CONTRIBUTION SECTION
          ════════════════════════════════════════════════════ */}
      <motion.section variants={item}>
        <h2 className="earn-section-title">Make a Contribution</h2>
        <div className="earn-contrib__grid">
          {CONTRIBUTION_TIERS.map((tier) => (
            <ContributionCard
              key={tier.id}
              tier={tier}
              onContribute={() => handleContribute(tier.amount)}
            />
          ))}
        </div>
      </motion.section>

      {/* ════════════════════════════════════════════════════
          4. CONTRIBUTION HISTORY
          ════════════════════════════════════════════════════ */}
      <motion.section variants={item}>
        <h2 className="earn-section-title">Contribution History</h2>
        <div className="earn-history">
          <div className="earn-history__header">
            <span className="earn-history__title">Recent Contributions</span>
            <span className="earn-history__count">
              {economy.contributionHistory.length} total
            </span>
          </div>
          {economy.contributionHistory.length > 0 ? (
            <table className="earn-history__table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Contribution</th>
                  <th>Earn Credits</th>
                  <th>Running Total</th>
                </tr>
              </thead>
              <tbody>
                {historyWithRunning.slice(0, 15).map((entry) => (
                  <motion.tr
                    key={entry.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <td>{formatDateTime(entry.timestamp)}</td>
                    <td className="earn-history__amount">₹{entry.amount}</td>
                    <td className="earn-history__earned">+{formatNumber(entry.earnCreditsEarned)}</td>
                    <td>{formatNumber(entry.runningTotal)}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="earn-history__empty">
              <div className="earn-history__empty-icon">📋</div>
              <div>No contributions yet. Make your first contribution above!</div>
            </div>
          )}
        </div>
      </motion.section>

      {/* ════════════════════════════════════════════════════
          5. UNLOCK PROGRESS
          ════════════════════════════════════════════════════ */}
      <motion.section variants={item}>
        <h2 className="earn-section-title">Request Tier Unlock Progress</h2>
        <div className="earn-tiers__grid">
          {tiersWithStatus.map((tier) => (
            <TierProgressCard key={tier.id} tier={tier} />
          ))}
        </div>
      </motion.section>

      {/* ════════════════════════════════════════════════════
          6. INSIGHTS
          ════════════════════════════════════════════════════ */}
      <motion.section variants={container}>
        <motion.h2 className="earn-section-title" variants={item}>Earn Credit Insights</motion.h2>
        <motion.div className="earn-insights__grid" variants={container}>
          <InsightCard
            icon={Wallet}
            label="Total Contributions"
            value={`₹${formatNumber(economy.totalContributed)}`}
            color="primary"
          />
          <InsightCard
            icon={Sparkles}
            label="Total Earn Credits Generated"
            value={formatNumber(
              economy.contributionHistory.reduce((sum, c) => sum + c.earnCreditsEarned, 0)
            )}
            color="secondary"
          />
          <InsightCard
            icon={Crown}
            label="Contributor Level"
            value={`${levelProgress.current.icon} ${levelProgress.current.name}`}
            color="gold"
          />
          <InsightCard
            icon={Trophy}
            label="Highest Tier Unlocked"
            value={highestTier ? `${highestTier.label} (₹${formatNumber(highestTier.requestAmount)})` : 'None'}
            color="success"
          />
        </motion.div>
      </motion.section>

      {/* ════════════════════════════════════════════════════
          7. HOW IT WORKS
          ════════════════════════════════════════════════════ */}
      <motion.section className="earn-how" variants={item}>
        <h2 className="earn-how__title">How It Works</h2>
        <div className="earn-how__flow">
          <HowStep icon="💰" label="Contribute" desc="₹10 – ₹100" />
          <ChevronRight size={20} className="earn-how__arrow" />
          <HowStep icon="✨" label="Earn Credits" desc="100 – 1,600" />
          <ChevronRight size={20} className="earn-how__arrow" />
          <HowStep icon="🚀" label="Unlock Request" desc="₹2K – ₹20K" />
          <ChevronRight size={20} className="earn-how__arrow" />
          <HowStep icon="📈" label="Buy Credits Grow" desc="Auto Growth" />
          <ChevronRight size={20} className="earn-how__arrow" />
          <HowStep icon="🎁" label="Redeem" desc="Partner Brands" />
        </div>
      </motion.section>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════
   Sub-Components
   ═══════════════════════════════════════════════════════════ */

function ContributionCard({ tier, onContribute }) {
  return (
    <motion.div
      className="earn-contrib-card"
      style={{ '--card-accent': tier.color }}
      onClick={onContribute}
      variants={item}
      whileHover={{ y: -6, scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
    >
      <div className="earn-contrib-card__badge">
        <Zap size={12} /> {tier.label}
      </div>
      <div className="earn-contrib-card__amount">₹{tier.amount}</div>
      <div className="earn-contrib-card__credits" style={{ color: tier.color }}>
        +{formatNumber(tier.earnCredits)} Credits
      </div>
      <div className="earn-contrib-card__multiplier">
        {tier.multiplier}x Multiplier
      </div>
      <div
        className="earn-contrib-card__glow"
        style={{ boxShadow: `0 0 30px ${tier.color}22, inset 0 0 0 1px ${tier.color}44` }}
      />
    </motion.div>
  );
}

function TierProgressCard({ tier }) {
  const tierEmojis = { Bronze: '🥉', Silver: '🥈', Gold: '🥇', Platinum: '💎' };

  return (
    <motion.div
      className={`earn-tier ${tier.isUnlocked ? 'earn-tier--unlocked' : 'earn-tier--locked'}`}
      style={{ '--tier-color': tier.color }}
      variants={item}
      whileHover={tier.isUnlocked ? { y: -4 } : {}}
    >
      <div className="earn-tier__status">
        {tier.isUnlocked ? <><Unlock size={10} /> Unlocked</> : <><Lock size={10} /> Locked</>}
      </div>
      <div className="earn-tier__amount">{formatCurrency(tier.requestAmount)}</div>
      <div className="earn-tier__cost">
        {formatNumber(tier.earnCreditsRequired)} Earn Credits
      </div>
      <div className="earn-tier__label">
        {tierEmojis[tier.label] || '🏆'} {tier.label}
      </div>
      {!tier.isUnlocked && (
        <div className="earn-tier__progress-wrap">
          <ProgressBar
            value={tier.progress * 100}
            max={100}
            showValue
            variant="primary"
            size="sm"
          />
        </div>
      )}
      {tier.isUnlocked && (
        <div
          className="earn-tier__glow"
          style={{ boxShadow: `0 0 24px ${tier.color}20, inset 0 0 0 1px ${tier.color}40` }}
        />
      )}
    </motion.div>
  );
}

function InsightCard({ icon: Icon, label, value, color }) {
  return (
    <motion.div
      className={`earn-insight earn-insight--${color}`}
      variants={item}
      whileHover={{ y: -4 }}
    >
      <div className="earn-insight__icon">
        <Icon size={20} />
      </div>
      <div className="earn-insight__value">{value}</div>
      <div className="earn-insight__label">{label}</div>
    </motion.div>
  );
}

function HowStep({ icon, label, desc }) {
  return (
    <motion.div
      className="earn-how__step"
      variants={item}
      whileHover={{ y: -3, scale: 1.04 }}
    >
      <span className="earn-how__step-icon">{icon}</span>
      <span className="earn-how__step-label">{label}</span>
      <span className="earn-how__step-desc">{desc}</span>
    </motion.div>
  );
}
