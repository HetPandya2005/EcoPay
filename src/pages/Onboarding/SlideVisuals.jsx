/* =========================================================
   SlideVisuals.jsx — Animated visuals for each onboarding slide
   Slide 1: Orbiting coins + credit counter
   Slide 2: Request card + progress bar + unlock
   Slide 3: Brand cards + buy credit counter + reward badge
   ========================================================= */

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Coins, Zap, Unlock, Gift, TrendingUp } from 'lucide-react';

/* ─── Shared spring config ────────────────────────────────── */
const spring = { type: 'spring', stiffness: 300, damping: 25 };

/* ═══════════════════════════════════════════════════════════
   Slide 1 — Contribute & Earn
   Orbiting coins around a central icon + animated counter
   ═══════════════════════════════════════════════════════════ */

export function SlideContributeVisual() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const target = 1250;
    const duration = 2000;
    const start = performance.now();

    function tick(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(target * eased));
      if (progress < 1) requestAnimationFrame(tick);
    }

    const timer = setTimeout(() => requestAnimationFrame(tick), 400);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="visual-coins">
      {/* Orbiting coins */}
      <motion.div
        className="visual-coins__orbit"
        initial={{ opacity: 0, scale: 0.5, rotate: -60 }}
        animate={{ opacity: 1, scale: 1, rotate: 0 }}
        transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="visual-coins__coin">₹</div>
        <div className="visual-coins__coin">₹</div>
        <div className="visual-coins__coin">₹</div>
        <div className="visual-coins__coin">₹</div>
      </motion.div>

      {/* Center icon */}
      <div className="visual-coins__center">
        <motion.div
          className="visual-coins__icon-ring"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ ...spring, delay: 0.1 }}
        >
          <Coins size={40} />
        </motion.div>

        <motion.span
          className="visual-coins__counter"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.4 }}
        >
          +{count.toLocaleString()} Credits
        </motion.span>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   Slide 2 — Unlock Request Cards
   Glass card with progress bar filling + unlock badge
   ═══════════════════════════════════════════════════════════ */

export function SlideRequestVisual() {
  const [progress, setProgress] = useState(0);
  const [unlocked, setUnlocked] = useState(false);

  useEffect(() => {
    const timer1 = setTimeout(() => {
      setProgress(100);
    }, 600);

    const timer2 = setTimeout(() => {
      setUnlocked(true);
    }, 1800);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  return (
    <div className="visual-request">
      <motion.div
        className="visual-request__card"
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="visual-request__card-header">
          <div className="visual-request__card-icon">
            <TrendingUp size={20} />
          </div>
          <div>
            <div className="visual-request__card-title">Request Card</div>
            <div className="visual-request__card-tier">Gold Tier</div>
          </div>
        </div>

        <div className="visual-request__progress">
          <div className="visual-request__progress-label">
            <span>Earn Credits</span>
            <span>{progress >= 100 ? '3,000' : '0'} / 3,000</span>
          </div>
          <div className="visual-request__progress-bar">
            <motion.div
              className="visual-request__progress-fill"
              initial={{ width: '0%' }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1.2, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
            />
          </div>
        </div>

        <motion.div
          className="visual-request__amount"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.0 }}
        >
          <span className="visual-request__amount-symbol">₹</span>10,000
        </motion.div>
      </motion.div>

      {/* Unlock badge */}
      {unlocked && (
        <motion.div
          className="visual-request__lock"
          initial={{ scale: 0, rotate: -45 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ ...spring }}
        >
          <Unlock size={28} />
        </motion.div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   Slide 3 — Redeem With Partner Brands
   Brand icons + growing counter + reward badge
   ═══════════════════════════════════════════════════════════ */

const BRANDS = [
  { name: 'Nike', icon: '👟' },
  { name: 'Amazon', icon: '📦' },
  { name: 'boAt', icon: '🎧' },
];

export function SlideRedeemVisual() {
  const [credits, setCredits] = useState(0);
  const [showReward, setShowReward] = useState(false);

  useEffect(() => {
    const target = 5000;
    const duration = 2200;
    const start = performance.now();

    function tick(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCredits(Math.round(target * eased));
      if (progress < 1) requestAnimationFrame(tick);
    }

    const timer1 = setTimeout(() => requestAnimationFrame(tick), 500);
    const timer2 = setTimeout(() => setShowReward(true), 2200);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  return (
    <div className="visual-redeem">
      {/* Brand cards */}
      <div className="visual-redeem__brands">
        {BRANDS.map((brand, i) => (
          <motion.div
            key={brand.name}
            className="visual-redeem__brand"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + i * 0.15, duration: 0.5 }}
          >
            <span className="visual-redeem__brand-icon">{brand.icon}</span>
            <span className="visual-redeem__brand-name">{brand.name}</span>
          </motion.div>
        ))}
      </div>

      {/* Buy Credits counter */}
      <motion.div
        className="visual-redeem__counter"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5, duration: 0.4 }}
      >
        <span className="visual-redeem__counter-value">
          {credits.toLocaleString()}
        </span>
        <span className="visual-redeem__counter-label">Buy Credits</span>
      </motion.div>

      {/* Reward badge */}
      {showReward && (
        <motion.div
          className="visual-redeem__reward"
          initial={{ opacity: 0, scale: 0.8, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ ...spring }}
        >
          <span className="visual-redeem__reward-icon">
            <Gift size={16} />
          </span>
          <span className="visual-redeem__reward-text">Ready to Redeem!</span>
        </motion.div>
      )}
    </div>
  );
}
