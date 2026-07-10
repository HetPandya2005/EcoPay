/* =========================================================
   PartnerBrands.jsx — Premium Partner Brands Catalog
   Browse-only page showcasing ecosystem brand partners
   ========================================================= */

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Store, Sparkles, ShoppingBag, Headphones,
  ChevronRight, Info, TrendingUp, Award,
  Zap, Package, ShieldCheck, CreditCard,
} from 'lucide-react';
import { PARTNER_BRANDS } from '../../utils/constants';
import { formatNumber } from '../../utils/formatters';
import './PartnerBrands.css';

/* ─── Stagger config ───────────────────────────────────── */

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

/* ─── Brand descriptions & metadata ────────────────────── */

const BRAND_META = {
  nike: {
    description: 'Premium sportswear and lifestyle products from the world\'s leading athletic brand.',
    icon: '👟',
    gradient: 'linear-gradient(135deg, #f5f5f5, #b0b0b0)',
    color: '#f5f5f5',
    bg: 'rgba(245, 245, 245, 0.06)',
    glow: 'rgba(245, 245, 245, 0.08)',
  },
  adidas: {
    description: 'Iconic sportswear, sneakers, and performance gear for athletes and style enthusiasts.',
    icon: '⚽',
    gradient: 'linear-gradient(135deg, #ffffff, #a0a0a0)',
    color: '#e0e0e0',
    bg: 'rgba(255, 255, 255, 0.04)',
    glow: 'rgba(255, 255, 255, 0.06)',
  },
  puma: {
    description: 'Sport-inspired lifestyle footwear, apparel, and accessories with bold design.',
    icon: '🐆',
    gradient: 'linear-gradient(135deg, #e3000b, #ff6b6b)',
    color: '#e3000b',
    bg: 'rgba(227, 0, 11, 0.06)',
    glow: 'rgba(227, 0, 11, 0.1)',
  },
  boat: {
    description: 'Audio products and smart accessories — headphones, earbuds, speakers, and smartwatches.',
    icon: '🎧',
    gradient: 'linear-gradient(135deg, #e63946, #ff8fa3)',
    color: '#e63946',
    bg: 'rgba(230, 57, 70, 0.06)',
    glow: 'rgba(230, 57, 70, 0.1)',
  },
  amazon: {
    description: 'Everything from A to Z — electronics, fashion, home essentials, and millions more products.',
    icon: '📦',
    gradient: 'linear-gradient(135deg, #ff9900, #ffb84d)',
    color: '#ff9900',
    bg: 'rgba(255, 153, 0, 0.06)',
    glow: 'rgba(255, 153, 0, 0.1)',
  },
};

/* ─── Category chips ────────────────────────────────────── */

const CATEGORIES = [
  { id: 'all', label: 'All', icon: '✦' },
  { id: 'sports', label: 'Sports', icon: '🏆' },
  { id: 'fashion', label: 'Fashion', icon: '👗' },
  { id: 'electronics', label: 'Electronics', icon: '🔌' },
  { id: 'marketplace', label: 'Marketplace', icon: '🛒' },
  { id: 'lifestyle', label: 'Lifestyle', icon: '✨' },
];

/* ─── Category mapping for brands ──────────────────────── */

const BRAND_CATEGORIES = {
  nike: ['sports', 'fashion', 'lifestyle'],
  adidas: ['sports', 'fashion', 'lifestyle'],
  puma: ['sports', 'fashion'],
  boat: ['electronics', 'lifestyle'],
  amazon: ['marketplace'],
};

/* ─── Ecosystem stats ──────────────────────────────────── */

const ECOSYSTEM_STATS = [
  { value: '5+', label: 'Partner Brands', icon: '🏪', variant: 'purple' },
  { value: '50,000+', label: 'Products Available', icon: '📦', variant: 'teal' },
  { value: '20,000', label: 'Max Buy Credits', icon: '💳', variant: 'gold' },
  { value: '100%', label: 'Simulation Ready', icon: '🚀', variant: 'green' },
];

/* ═══════════════════════════════════════════════════════════
   PartnerBrands Component
   ═══════════════════════════════════════════════════════════ */

export default function PartnerBrands() {
  const [activeCategory, setActiveCategory] = useState('all');

  const filteredBrands = useMemo(() => {
    if (activeCategory === 'all') return PARTNER_BRANDS;
    return PARTNER_BRANDS.filter(brand =>
      BRAND_CATEGORIES[brand.id]?.includes(activeCategory)
    );
  }, [activeCategory]);

  return (
    <motion.div className="partners" variants={container} initial="hidden" animate="show">

      {/* ════════════════════════════════════════════════════
          1. PAGE HEADER
          ════════════════════════════════════════════════════ */}
      <motion.section className="partners-hero" variants={item}>
        <div className="partners-hero__orb partners-hero__orb--1" />
        <div className="partners-hero__orb partners-hero__orb--2" />
        <div className="partners-hero__orb partners-hero__orb--3" />
        <div className="partners-hero__content">
          <motion.h1
            className="partners-hero__title"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <span className="text-gradient">Partner Brands</span>
          </motion.h1>
          <motion.p
            className="partners-hero__desc"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            Explore the trusted brands that are part of the EcoPay ecosystem and accept Buy Credits for future redemptions.
          </motion.p>
        </div>
      </motion.section>

      {/* ════════════════════════════════════════════════════
          2. ECOSYSTEM STATISTICS
          ════════════════════════════════════════════════════ */}
      <motion.section variants={item}>
        <h2 className="partners-section-title">Ecosystem Overview</h2>
        <div className="partners-stats__grid">
          {ECOSYSTEM_STATS.map((stat, i) => (
            <EcosystemStat key={stat.label} stat={stat} index={i} />
          ))}
        </div>
      </motion.section>

      {/* ════════════════════════════════════════════════════
          3. CATEGORY CHIPS
          ════════════════════════════════════════════════════ */}
      <motion.section variants={item}>
        <h2 className="partners-section-title">Browse by Category</h2>
        <div className="partners-chips">
          {CATEGORIES.map(cat => (
            <motion.button
              key={cat.id}
              className={`partners-chip ${activeCategory === cat.id ? 'partners-chip--active' : ''}`}
              onClick={() => setActiveCategory(cat.id)}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
            >
              <span className="partners-chip__icon">{cat.icon}</span>
              {cat.label}
            </motion.button>
          ))}
        </div>
      </motion.section>

      {/* ════════════════════════════════════════════════════
          4. FEATURED BRANDS GRID
          ════════════════════════════════════════════════════ */}
      <motion.section variants={item}>
        <h2 className="partners-section-title">
          {activeCategory === 'all' ? 'Featured Brands' : `${CATEGORIES.find(c => c.id === activeCategory)?.label} Brands`}
        </h2>
        <motion.div
          className="partners-grid"
          variants={container}
          initial="hidden"
          animate="show"
          key={activeCategory}
        >
          {filteredBrands.map(brand => (
            <BrandCard key={brand.id} brand={brand} />
          ))}
        </motion.div>
      </motion.section>

      {/* ════════════════════════════════════════════════════
          5. HOW PARTNER BRANDS WORK
          ════════════════════════════════════════════════════ */}
      <motion.section className="partners-how" variants={item}>
        <div className="partners-how__orb partners-how__orb--1" />
        <div className="partners-how__orb partners-how__orb--2" />
        <h2 className="partners-how__title">How Partner Brands Work</h2>
        <p className="partners-how__subtitle">
          These brands represent the EcoPay ecosystem and demonstrate where Buy Credits can be used for future redemptions.
        </p>
        <div className="partners-how__flow">
          <HowStep num="1" icon="💰" label="Earn Credits" desc="Contribute & Earn" />
          <ChevronRight size={20} className="partners-how__arrow" />
          <HowStep num="2" icon="🚀" label="Create Request" desc="Launch Growth" />
          <ChevronRight size={20} className="partners-how__arrow" />
          <HowStep num="3" icon="📈" label="Buy Credits Grow" desc="Auto Growth" />
          <ChevronRight size={20} className="partners-how__arrow" />
          <HowStep num="4" icon="🎁" label="Redeem" desc="Partner Brands" />
        </div>
      </motion.section>

      {/* ════════════════════════════════════════════════════
          6. ECOSYSTEM NOTE
          ════════════════════════════════════════════════════ */}
      <motion.section className="partners-note" variants={item}>
        <div className="partners-note__content">
          <div className="partners-note__icon">
            <Info size={22} />
          </div>
          <div className="partners-note__text">
            <div className="partners-note__title">About the EcoPay Ecosystem</div>
            <div className="partners-note__desc">
              The partner brands listed above are part of the EcoPay simulation ecosystem. They represent real-world brands where Buy Credits could be redeemed in the future. This catalog is for demonstration purposes and showcases the potential of the micro-contribution powered purchasing model.
            </div>
          </div>
        </div>
      </motion.section>

    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════
   Sub-Components
   ═══════════════════════════════════════════════════════════ */

function BrandCard({ brand }) {
  const meta = BRAND_META[brand.id] || {};

  return (
    <motion.div
      className="brand-card"
      style={{
        '--brand-color': meta.color || brand.color,
        '--brand-bg': meta.bg || 'rgba(124, 108, 240, 0.08)',
        '--brand-glow': meta.glow || 'rgba(124, 108, 240, 0.1)',
        '--brand-accent': meta.gradient || 'var(--gradient-primary)',
      }}
      variants={item}
      whileHover={{ y: -6, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Logo Area */}
      <div className="brand-card__logo-area">
        <span className="brand-card__logo-text">{meta.icon || '🏷️'}</span>
      </div>

      {/* Brand Info */}
      <div className="brand-card__name">{brand.name}</div>
      <div className="brand-card__tagline">{brand.tagline}</div>

      {/* Category */}
      <div className="brand-card__category">
        <Store size={11} />
        {brand.category}
      </div>

      {/* Description */}
      <div className="brand-card__description">{meta.description}</div>

      {/* Credit Range */}
      <div className="brand-card__credits">
        <div className="brand-card__credits-icon">
          <CreditCard size={16} />
        </div>
        <div className="brand-card__credits-info">
          <div className="brand-card__credits-label">Accepts</div>
          <div className="brand-card__credits-range">
            {formatNumber(brand.minCredits)} – {formatNumber(brand.maxCredits)} Buy Credits
          </div>
        </div>
      </div>

      {/* Glow */}
      <div
        className="brand-card__glow"
        style={{
          boxShadow: `0 0 30px ${meta.glow || 'rgba(124,108,240,0.1)'}, inset 0 0 0 1px ${meta.color || 'rgba(124,108,240,0.2)'}33`,
        }}
      />
    </motion.div>
  );
}

function EcosystemStat({ stat, index }) {
  return (
    <motion.div
      className={`partners-stat partners-stat--${stat.variant}`}
      variants={item}
      whileHover={{ y: -4 }}
    >
      <div className="partners-stat__icon">{stat.icon}</div>
      <motion.div
        className="partners-stat__value"
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.3 + index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      >
        {stat.value}
      </motion.div>
      <div className="partners-stat__label">{stat.label}</div>
    </motion.div>
  );
}

function HowStep({ num, icon, label, desc }) {
  return (
    <motion.div
      className="partners-how__step"
      variants={item}
      whileHover={{ y: -3, scale: 1.04 }}
    >
      <span className="partners-how__step-num">{num}</span>
      <span className="partners-how__step-icon">{icon}</span>
      <span className="partners-how__step-label">{label}</span>
      <span className="partners-how__step-desc">{desc}</span>
    </motion.div>
  );
}
