/* =========================================================
   CreateRequest.jsx — Create Request Page
   Bridge between Earn Credits and Buy Credit Growth
   ========================================================= */

import { useState, useMemo, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Rocket, Lock, Unlock, Sparkles, Crown, CheckCircle2,
  ArrowRight, ShoppingBag, Cpu, Dumbbell, Home, Heart, Gamepad2,
  TrendingUp, Zap,
} from 'lucide-react';
import { useEconomy } from '../../context/EconomyContext';
import { useAnimatedCounter } from '../../hooks/useAnimatedCounter';
import { getRequestTiersWithEligibility } from '../../utils/economy';
import { formatCurrency, formatNumber } from '../../utils/formatters';
import { ROUTES } from '../../utils/constants';
import ProgressBar from '../../components/ui/ProgressBar';
import { useToast } from '../../components/ui/Toast';
import './CreateRequest.css';

/* ─── Data ─────────────────────────────────────────────── */

const CATEGORIES = [
  { id: 'fashion', name: 'Fashion', icon: ShoppingBag, color: '#f472b6' },
  { id: 'electronics', name: 'Electronics', icon: Cpu, color: '#3b82f6' },
  { id: 'sports', name: 'Sports', icon: Dumbbell, color: '#10b981' },
  { id: 'home', name: 'Home', icon: Home, color: '#f59e0b' },
  { id: 'lifestyle', name: 'Lifestyle', icon: Heart, color: '#ef4444' },
  { id: 'gaming', name: 'Gaming', icon: Gamepad2, color: '#8b5cf6' },
];

const BRANDS = [
  { id: 'nike', name: 'Nike', tagline: 'Just Do It', categories: ['fashion', 'sports'], color: '#f97316', initial: 'N', range: '₹1K–₹20K' },
  { id: 'adidas', name: 'Adidas', tagline: 'Impossible Is Nothing', categories: ['fashion', 'sports'], color: '#6366f1', initial: 'A', range: '₹1K–₹20K' },
  { id: 'puma', name: 'Puma', tagline: 'Forever Faster', categories: ['fashion', 'sports'], color: '#e11d48', initial: 'P', range: '₹1K–₹15K' },
  { id: 'boat', name: 'boAt', tagline: 'Plug Into Nirvana', categories: ['electronics', 'lifestyle'], color: '#0ea5e9', initial: 'B', range: '₹500–₹10K' },
  { id: 'amazon', name: 'Amazon', tagline: 'A to Z', categories: ['electronics', 'home', 'lifestyle', 'gaming'], color: '#f59e0b', initial: 'A', range: '₹500–₹20K' },
  { id: 'flipkart', name: 'Flipkart', tagline: 'Ab Har Wish Hogi Poori', categories: ['electronics', 'fashion', 'home'], color: '#2563eb', initial: 'F', range: '₹500–₹20K' },
  { id: 'decathlon', name: 'Decathlon', tagline: 'Sport for All', categories: ['sports'], color: '#059669', initial: 'D', range: '₹1K–₹15K' },
  { id: 'ikea', name: 'IKEA', tagline: 'The Wonderful Everyday', categories: ['home'], color: '#eab308', initial: 'I', range: '₹2K–₹20K' },
  { id: 'steam', name: 'Steam', tagline: 'Power to the Players', categories: ['gaming'], color: '#1e3a5f', initial: 'S', range: '₹500–₹10K' },
  { id: 'myntra', name: 'Myntra', tagline: 'Be Fashionable', categories: ['fashion', 'lifestyle'], color: '#ec4899', initial: 'M', range: '₹1K–₹15K' },
];

/* ─── Stagger config ───────────────────────────────────── */

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
    const colors = ['#7c6cf0', '#00d2c6', '#f4c430', '#f472b6', '#3b82f6', '#10b981'];
    return Array.from({ length: 50 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      color: colors[Math.floor(Math.random() * colors.length)],
      delay: `${Math.random() * 1.5}s`,
      size: 6 + Math.random() * 10,
      rotation: Math.random() * 360,
      shape: Math.random() > 0.5 ? 'circle' : 'rect',
    }));
  }, []);

  return (
    <div className="cr-confetti">
      {pieces.map(p => (
        <div
          key={p.id}
          className="cr-confetti__piece"
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

/* ═══════════════════════════════════════════════════════════
   CreateRequest Component
   ═══════════════════════════════════════════════════════════ */

export default function CreateRequest() {
  const economy = useEconomy();
  const navigate = useNavigate();
  const toast = useToast();

  const [selectedTierId, setSelectedTierId] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [launchState, setLaunchState] = useState('idle'); // idle | loading | success
  const [showConfetti, setShowConfetti] = useState(false);

  const animatedCredits = useAnimatedCounter(economy.earnCredits, 1200);
  const tiersWithEligibility = useMemo(
    () => getRequestTiersWithEligibility(economy.earnCredits),
    [economy.earnCredits]
  );

  const selectedTier = useMemo(
    () => tiersWithEligibility.find(t => t.id === selectedTierId),
    [tiersWithEligibility, selectedTierId]
  );

  const filteredBrands = useMemo(() => {
    if (!selectedCategory) return BRANDS;
    return BRANDS.filter(b => b.categories.includes(selectedCategory));
  }, [selectedCategory]);

  const brandCountByCategory = useMemo(() => {
    const counts = {};
    CATEGORIES.forEach(c => {
      counts[c.id] = BRANDS.filter(b => b.categories.includes(c.id)).length;
    });
    return counts;
  }, []);

  const canLaunch = selectedTierId && selectedTier?.isUnlocked && !economy.activeRequest;

  /* ── Auto-select highest unlocked tier ── */
  useEffect(() => {
    if (!selectedTierId) {
      const highest = [...tiersWithEligibility].reverse().find(t => t.isUnlocked);
      if (highest) setSelectedTierId(highest.id);
    }
  }, [tiersWithEligibility, selectedTierId]);

  /* ── Launch handler ── */
  const handleLaunch = useCallback(async () => {
    if (!canLaunch || launchState !== 'idle') return;

    setLaunchState('loading');

    // Simulate processing
    await new Promise(r => setTimeout(r, 2200));

    const result = economy.createRequest(selectedTierId);

    if (result.success) {
      setLaunchState('success');
      setShowConfetti(true);
      toast.success('🚀 Request Card launched successfully!');

      // Navigate to Buy Credits after celebration
      setTimeout(() => {
        navigate(ROUTES.BUY_CREDITS);
      }, 2800);
    } else {
      setLaunchState('idle');
      toast.error(result.error);
    }
  }, [canLaunch, launchState, economy, selectedTierId, toast, navigate]);

  /* ── If active request exists ── */
  if (economy.activeRequest) {
    return (
      <motion.div className="create-request" variants={container} initial="hidden" animate="show">
        <HeroSection />
        <StatusCards economy={economy} animatedCredits={animatedCredits} />
        <motion.div className="cr-blocker" variants={item}>
          <span className="cr-blocker__icon">🚀</span>
          <h2 className="cr-blocker__title">Request Already Active</h2>
          <p className="cr-blocker__desc">
            You have an active request card growing right now.
            Only one request can be active at a time.
          </p>
          <div className="cr-blocker__tier">
            <TrendingUp size={14} />
            {formatCurrency(economy.activeRequest.requestAmount)} • {economy.activeRequest.status === 'growing' ? 'Growing' : 'Ready'}
          </div>
          <br />
          <motion.button
            className="cr-blocker__btn"
            onClick={() => navigate(ROUTES.BUY_CREDITS)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
          >
            Go to Buy Credits <ArrowRight size={18} />
          </motion.button>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div className="create-request" variants={container} initial="hidden" animate="show">
      {showConfetti && <Confetti />}

      <HeroSection />
      <StatusCards economy={economy} animatedCredits={animatedCredits} />

      {/* ── Tier Selection ── */}
      <motion.section variants={item}>
        <h2 className="cr-section-title">Select Request Tier</h2>
        <div className="cr-tiers__grid">
          {tiersWithEligibility.map((tier, i) => (
            <TierCard
              key={tier.id}
              tier={tier}
              selected={selectedTierId === tier.id}
              onSelect={() => tier.isUnlocked && setSelectedTierId(tier.id)}
              index={i}
            />
          ))}
        </div>
      </motion.section>

      {/* ── Category + Brands + Preview ── */}
      <div className="cr-bottom">
        <div className="cr-bottom__left">
          {/* Category Selection */}
          <motion.section variants={item}>
            <h2 className="cr-section-title">Choose Category</h2>
            <div className="cr-categories__grid">
              {CATEGORIES.map((cat) => (
                <CategoryCard
                  key={cat.id}
                  category={cat}
                  selected={selectedCategory === cat.id}
                  count={brandCountByCategory[cat.id]}
                  onSelect={() => setSelectedCategory(selectedCategory === cat.id ? null : cat.id)}
                />
              ))}
            </div>
          </motion.section>

          {/* Brand Preview */}
          <motion.section variants={item}>
            <h2 className="cr-section-title">
              {selectedCategory
                ? `${CATEGORIES.find(c => c.id === selectedCategory)?.name} Brands`
                : 'All Partner Brands'}
            </h2>
            <div className="cr-brands__grid">
              <AnimatePresence mode="popLayout">
                {filteredBrands.length > 0 ? (
                  filteredBrands.map(brand => (
                    <BrandCard key={brand.id} brand={brand} />
                  ))
                ) : (
                  <motion.div className="cr-brands__empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    No brands in this category yet
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.section>
        </div>

        {/* Request Preview Card */}
        <motion.section variants={item}>
          <h2 className="cr-section-title" style={{ textAlign: 'center' }}>Request Preview</h2>
          <RequestPreview
            tier={selectedTier}
            category={selectedCategory ? CATEGORIES.find(c => c.id === selectedCategory) : null}
          />
        </motion.section>
      </div>

      {/* ── Launch Button ── */}
      <motion.div className="cr-launch-wrap" variants={item}>
        <motion.button
          className={[
            'cr-launch',
            launchState === 'loading' && 'cr-launch--loading',
            launchState === 'success' && 'cr-launch--success',
          ].filter(Boolean).join(' ')}
          disabled={!canLaunch || launchState !== 'idle'}
          onClick={handleLaunch}
          whileHover={canLaunch && launchState === 'idle' ? { scale: 1.04 } : {}}
          whileTap={canLaunch && launchState === 'idle' ? { scale: 0.97 } : {}}
        >
          {launchState === 'loading' && <span className="cr-launch__spinner" />}
          {launchState === 'loading' && 'Launching...'}
          {launchState === 'success' && <><CheckCircle2 size={22} /> Request Launched!</>}
          {launchState === 'idle' && <><Rocket size={20} /> Launch Request</>}
        </motion.button>
      </motion.div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════
   Sub-Components
   ═══════════════════════════════════════════════════════════ */

function HeroSection() {
  return (
    <motion.section className="cr-hero" variants={item}>
      <div className="cr-hero__orb cr-hero__orb--1" />
      <div className="cr-hero__orb cr-hero__orb--2" />
      <motion.h1
        className="cr-hero__title"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <span className="text-gradient">Create Request</span> Card
      </motion.h1>
      <motion.p
        className="cr-hero__desc"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        Turn your earned credits into purchasing power. Select a tier, choose a category,
        and launch your request card to start growing Buy Credits.
      </motion.p>
    </motion.section>
  );
}

function StatusCards({ economy, animatedCredits }) {
  const levelInfo = economy.contributorLevel;
  const hasEligibility = economy.earnCredits >= 500;

  return (
    <motion.div className="cr-status" variants={container}>
      <motion.div className="cr-status__card cr-status__card--earn" variants={item} whileHover={{ y: -3 }}>
        <span className="cr-status__icon">✨</span>
        <div className="cr-status__label">Earn Credits</div>
        <div className="cr-status__value cr-status__value--gradient">{formatNumber(animatedCredits)}</div>
      </motion.div>
      <motion.div className="cr-status__card cr-status__card--level" variants={item} whileHover={{ y: -3 }}>
        <span className="cr-status__icon">{levelInfo.icon}</span>
        <div className="cr-status__label">Contributor Level</div>
        <div className="cr-status__value">{levelInfo.name}</div>
      </motion.div>
      <motion.div className="cr-status__card cr-status__card--eligible" variants={item} whileHover={{ y: -3 }}>
        <span className="cr-status__icon">{hasEligibility ? '🟢' : '🔴'}</span>
        <div className="cr-status__label">Request Eligibility</div>
        <div className="cr-status__value" style={{ color: hasEligibility ? 'var(--success-light)' : 'var(--danger-light)', fontSize: 'var(--text-lg)' }}>
          {hasEligibility ? 'Eligible' : 'Need 500 Credits'}
        </div>
      </motion.div>
    </motion.div>
  );
}

function TierCard({ tier, selected, onSelect, index }) {
  const tierEmojis = { Bronze: '🥉', Silver: '🥈', Gold: '🥇', Platinum: '💎' };

  return (
    <motion.div
      className={[
        'cr-tier',
        tier.isUnlocked ? 'cr-tier--unlocked' : 'cr-tier--locked',
        selected && 'cr-tier--selected',
      ].filter(Boolean).join(' ')}
      onClick={onSelect}
      variants={item}
      whileHover={tier.isUnlocked ? { y: -4 } : {}}
      whileTap={tier.isUnlocked ? { scale: 0.98 } : {}}
      style={{ '--tier-color': tier.color }}
    >
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, ${tier.color}, ${tier.color}88)` }} />

      {tier.isUnlocked ? (
        <div className="cr-tier__badge" style={{ background: `${tier.color}18`, color: tier.color }}>
          {tierEmojis[tier.label] || '🏆'} {tier.label}
        </div>
      ) : (
        <div className="cr-tier__lock">🔒</div>
      )}

      <div className="cr-tier__amount">{formatCurrency(tier.requestAmount)}</div>
      <div className="cr-tier__sublabel">Request Amount</div>

      <div className="cr-tier__req">
        {tier.isUnlocked ? (
          <><Unlock size={10} /> Unlocked</>
        ) : (
          <>{formatNumber(tier.earnCreditsRequired)} credits needed</>
        )}
      </div>

      {!tier.isUnlocked && (
        <div className="cr-tier__progress-wrap">
          <ProgressBar
            value={tier.progress * 100}
            max={100}
            showValue
            variant="primary"
            size="sm"
          />
        </div>
      )}
    </motion.div>
  );
}

function CategoryCard({ category, selected, count, onSelect }) {
  const Icon = category.icon;
  return (
    <motion.div
      className={['cr-category', selected && 'cr-category--selected'].filter(Boolean).join(' ')}
      onClick={onSelect}
      variants={item}
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.97 }}
    >
      <span className="cr-category__icon"><Icon size={28} color={category.color} /></span>
      <div className="cr-category__name">{category.name}</div>
      <div className="cr-category__count">{count} brands</div>
    </motion.div>
  );
}

function BrandCard({ brand }) {
  return (
    <motion.div
      className="cr-brand"
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.3 }}
    >
      <div className="cr-brand__logo" style={{ background: brand.color }}>
        {brand.initial}
      </div>
      <div className="cr-brand__name">{brand.name}</div>
      <div className="cr-brand__tagline">"{brand.tagline}"</div>
      <div className="cr-brand__range">{brand.range}</div>
    </motion.div>
  );
}

function RequestPreview({ tier, category }) {
  if (!tier) {
    return (
      <div className="cr-preview">
        <div className="cr-preview__placeholder">
          <span className="cr-preview__placeholder-icon">🎴</span>
          <span className="cr-preview__placeholder-text">Select a tier to preview your request card</span>
        </div>
      </div>
    );
  }

  return (
    <div className="cr-preview">
      <motion.div
        className="cr-preview__card"
        initial={{ opacity: 0, rotateY: -10 }}
        animate={{ opacity: 1, rotateY: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="cr-preview__chip">
          <Sparkles size={12} /> {tier.label} Tier
        </div>
        <div className="cr-preview__amount">{formatCurrency(tier.requestAmount)}</div>
        <div className="cr-preview__label">Request Card Value</div>

        <div className="cr-preview__details">
          <div className="cr-preview__detail">
            <span className="cr-preview__detail-label">Buy Credits Target</span>
            <span className="cr-preview__detail-value">{formatNumber(tier.buyCreditsTarget)}</span>
          </div>
          <div className="cr-preview__detail">
            <span className="cr-preview__detail-label">Growth Bonus</span>
            <span className="cr-preview__detail-value">{tier.growthBonus}x</span>
          </div>
          <div className="cr-preview__detail">
            <span className="cr-preview__detail-label">Category</span>
            <span className="cr-preview__detail-value">
              {category ? category.name : 'All Categories'}
            </span>
          </div>
        </div>

        <div className="cr-preview__status">
          <span className="cr-preview__status-dot" />
          <span className="cr-preview__status-text">Ready to Launch</span>
        </div>
      </motion.div>
    </div>
  );
}
