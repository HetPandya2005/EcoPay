/* =========================================================
   Landing.jsx — Public Landing Page
   Premium hero, features, ecosystem showcase, partner brands
   ========================================================= */

import React, { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import {
  Zap, ArrowRight, ChevronRight, Coins, TrendingUp,
  FileText, ShoppingBag, Award, Users, Shield, Eye,
  Handshake, Sparkles, Layers, Trophy, Star, Gift,
  BarChart3, Target, Rocket
} from 'lucide-react';
import Button from '../../components/ui/Button';
import { ROUTES, PARTNER_BRANDS } from '../../utils/constants';
import './Landing.css';

/* ─── Animation helpers ──────────────────────────────────── */
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.6, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }
  }),
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
};

/* ─── Animated Counter ───────────────────────────────────── */
function AnimatedCounter({ end, suffix = '', duration = 2000 }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-50px' });

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const step = Math.ceil(end / (duration / 16));
    const timer = setInterval(() => {
      start += step;
      if (start >= end) { setCount(end); clearInterval(timer); }
      else setCount(start);
    }, 16);
    return () => clearInterval(timer);
  }, [inView, end, duration]);

  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
}

/* ─── Section Wrapper ────────────────────────────────────── */
function Section({ id, tag, title, desc, children, full = false }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section id={id} className={`landing-section ${full ? 'landing-section--full' : ''}`} ref={ref}>
      {(tag || title) && (
        <motion.div
          className="landing-section__header"
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          variants={staggerContainer}
        >
          {tag && <motion.div className="landing-section__tag" variants={fadeUp}>{tag}</motion.div>}
          {title && <motion.h2 className="landing-section__title" variants={fadeUp}>{title}</motion.h2>}
          {desc && <motion.p className="landing-section__desc" variants={fadeUp}>{desc}</motion.p>}
        </motion.div>
      )}
      {children}
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════
   LANDING PAGE
   ═══════════════════════════════════════════════════════════ */
export default function Landing() {
  const navigate = useNavigate();
  const heroRef = useRef(null);
  const heroInView = useInView(heroRef, { once: true });

  /* ── How it Works data ── */
  const steps = [
    { icon: Coins,       title: 'Contribute',         desc: 'Start with micro-contributions as small as ₹10' },
    { icon: TrendingUp,  title: 'Earn Credits',        desc: 'Earn multiplied credits based on your tier' },
    { icon: FileText,    title: 'Create Request',      desc: 'Launch a growth request with your earned credits' },
    { icon: BarChart3,   title: 'Buy Credits Grow',    desc: 'Watch your buy credits grow in real time' },
    { icon: Gift,        title: 'Redeem',              desc: 'Redeem with partner brands when ready' },
  ];

  /* ── Why EcoPay data ── */
  const features = [
    { icon: Users,      title: 'Community Powered',        desc: 'A collective economy where every contribution fuels the ecosystem forward.' },
    { icon: Shield,     title: 'Fair Credit Economy',      desc: 'Transparent credit calculations with tier-based multipliers you can trust.' },
    { icon: Eye,        title: 'Transparent Progress',     desc: 'Real-time dashboards let you track every credit earned and spent.' },
    { icon: Handshake,  title: 'Partner Ecosystem',        desc: 'Redeem with top brands like Nike, Adidas, Amazon, and more.' },
    { icon: Sparkles,   title: 'Simulation First',         desc: 'Experience the full ecosystem flow before any real money is involved.' },
    { icon: Layers,     title: 'Modern User Experience',   desc: 'Premium dark UI with smooth animations and intuitive navigation.' },
  ];

  /* ── Live Ecosystem data ── */
  const ecoCards = [
    { title: 'Earn Credits',       value: '2,400',   color: '#10b981', pct: 72, badge: 'Active',   badgeBg: 'rgba(16,185,129,0.15)', badgeColor: '#10b981', meta: 'Tier: Pro · Multiplier 1.4×' },
    { title: 'Buy Credits',        value: '₹8,560',  color: '#7c6cf0', pct: 43, badge: 'Growing',  badgeBg: 'rgba(124,108,240,0.15)', badgeColor: '#7c6cf0', meta: 'Target: ₹20,000 · Gold' },
    { title: 'Request Card',       value: 'Gold',     color: '#f4c430', pct: 85, badge: 'Live',     badgeBg: 'rgba(244,196,48,0.15)',  badgeColor: '#f4c430', meta: '₹10,000 Request · 85% filled' },
    { title: 'Contributor Level',  value: 'Builder',  color: '#6c5ce7', pct: 60, badge: 'Lv 3',     badgeBg: 'rgba(108,92,231,0.15)',  badgeColor: '#6c5ce7', meta: '1,500 / 3,000 to next level' },
    { title: 'Achievements',       value: '5 / 7',    color: '#f0883e', pct: 71, badge: 'Earned',   badgeBg: 'rgba(240,136,62,0.15)',  badgeColor: '#f0883e', meta: 'Latest: Elite Contributor 👑' },
  ];

  /* ── Stats data ── */
  const stats = [
    { value: 5,     suffix: '+', label: 'Partner Brands' },
    { value: 10000, suffix: '+', label: 'Community Contributions' },
    { value: 50000, suffix: '+', label: 'Credits Generated' },
    { value: 1000,  suffix: '+', label: 'Successful Simulations' },
  ];

  return (
    <div className="landing-page">

      {/* ════════ NAVBAR ════════ */}
      <nav className="landing-nav" id="landing-nav">
        <div className="landing-nav__logo">
          <div className="landing-nav__logo-icon"><Zap size={20} color="#fff" /></div>
          <span className="text-gradient">EcoPay</span>
        </div>
        <div className="landing-nav__links">
          <a className="landing-nav__link" href="#how-it-works">How It Works</a>
          <a className="landing-nav__link" href="#features">Features</a>
          <a className="landing-nav__link" href="#partners">Partners</a>
          <Button variant="ghost" size="sm" onClick={() => navigate(ROUTES.LOGIN)}>Login</Button>
          <Button variant="primary" size="sm" onClick={() => navigate(ROUTES.SIGNUP)} icon={ArrowRight} iconPosition="right">
            Get Started
          </Button>
        </div>
      </nav>

      {/* ════════ HERO ════════ */}
      <section className="landing-hero" ref={heroRef}>
        <div className="landing-hero__glow landing-hero__glow--1" />
        <div className="landing-hero__glow landing-hero__glow--2" />
        <div className="landing-hero__glow landing-hero__glow--3" />

        <motion.div
          className="landing-hero__inner"
          initial="hidden"
          animate={heroInView ? 'visible' : 'hidden'}
          variants={staggerContainer}
        >
          <motion.div className="landing-hero__badge" variants={fadeUp}>
            <span className="landing-hero__badge-dot" />
            Micro-Contribution Ecosystem
          </motion.div>

          <motion.h1 className="landing-hero__title" variants={fadeUp} custom={1}>
            Small Contributions.<br />
            <span className="text-gradient">Big Purchasing Power.</span>
          </motion.h1>

          <motion.p className="landing-hero__subtitle" variants={fadeUp} custom={2}>
            EcoPay transforms small community contributions into a transparent purchasing ecosystem powered by Earn Credits and Buy Credits.
          </motion.p>

          <motion.div className="landing-hero__actions" variants={fadeUp} custom={3}>
            <Button variant="primary" size="lg" onClick={() => navigate(ROUTES.SIGNUP)} icon={ArrowRight} iconPosition="right">
              Get Started
            </Button>
            <Button variant="secondary" size="lg" onClick={() => navigate(ROUTES.LOGIN)}>
              Login
            </Button>
          </motion.div>

          {/* Orbit Graphic */}
          <motion.div
            className="landing-hero__graphic"
            variants={fadeUp}
            custom={4}
          >
            <div className="hero-center-icon"><Zap size={28} color="#fff" /></div>

            <div className="hero-orbit hero-orbit--1">
              <div className="hero-orbit__node" style={{ top: 0, left: '50%', transform: 'translate(-50%, -50%)' }}>💰</div>
              <div className="hero-orbit__node" style={{ bottom: 0, left: '50%', transform: 'translate(-50%, 50%)' }}>📊</div>
            </div>

            <div className="hero-orbit hero-orbit--2">
              <div className="hero-orbit__node" style={{ top: '50%', left: 0, transform: 'translate(-50%, -50%)' }}>🛒</div>
              <div className="hero-orbit__node" style={{ top: 0, left: '50%', transform: 'translate(-50%, -50%)' }}>🏆</div>
              <div className="hero-orbit__node" style={{ top: '50%', right: 0, transform: 'translate(50%, -50%)' }}>🎁</div>
            </div>

            <div className="hero-orbit hero-orbit--3">
              <div className="hero-orbit__node" style={{ top: 0, left: '25%', transform: 'translate(-50%, -50%)' }}>🚀</div>
              <div className="hero-orbit__node" style={{ bottom: 0, right: '25%', transform: 'translate(50%, 50%)' }}>💎</div>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* ════════ HOW IT WORKS ════════ */}
      <Section id="how-it-works" tag="How It Works" title="Your Journey in 5 Simple Steps" desc="From your first contribution to redeeming with top brands — a seamless experience.">
        <HowItWorks steps={steps} />
      </Section>

      {/* ════════ WHY ECOPAY ════════ */}
      <Section id="features" tag="Why EcoPay" title="Built for the Community" desc="Every feature is designed to create a fair, transparent, and rewarding ecosystem.">
        <FeaturesGrid features={features} />
      </Section>

      {/* ════════ LIVE ECOSYSTEM ════════ */}
      <Section id="ecosystem" tag="Live Ecosystem" title="Inside the EcoPay Dashboard" desc="A sneak peek at what your experience looks like once you're in.">
        <EcosystemShowcase cards={ecoCards} />
      </Section>

      {/* ════════ PARTNERS ════════ */}
      <Section id="partners" tag="Partner Ecosystem" title="Trusted Brand Partners" desc="Redeem your earned buy credits with these premium brands.">
        <PartnersRow />
      </Section>

      {/* ════════ STATS ════════ */}
      <Section id="stats" tag="Ecosystem Statistics" title="Growing Every Day">
        <StatsGrid stats={stats} />
      </Section>

      {/* ════════ CTA ════════ */}
      <div className="landing-cta">
        <div className="landing-cta__bg" />
        <motion.div
          className="landing-cta__inner"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <h2 className="landing-cta__title">
            Ready to Experience <span className="text-gradient">EcoPay</span>?
          </h2>
          <p className="landing-cta__desc">
            Join the ecosystem today and turn your micro-contributions into real purchasing power.
          </p>
          <div className="landing-cta__actions">
            <Button variant="primary" size="lg" onClick={() => navigate(ROUTES.SIGNUP)} icon={Rocket} iconPosition="right">
              Create Account
            </Button>
            <Button variant="secondary" size="lg" onClick={() => navigate(ROUTES.LOGIN)}>
              Login
            </Button>
          </div>
        </motion.div>
      </div>

      {/* ════════ FOOTER ════════ */}
      <Footer navigate={navigate} />
    </div>
  );
}

/* ─── Sub-components ─────────────────────────────────────── */

function HowItWorks({ steps }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <motion.div
      className="how-steps"
      ref={ref}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      variants={staggerContainer}
    >
      {steps.map((step, i) => (
        <React.Fragment key={step.title}>
          <motion.div className="how-step" variants={fadeUp} custom={i}>
            <div className="how-step__icon-wrap">
              <step.icon size={28} color="var(--primary-light)" />
              <span className="how-step__num">{i + 1}</span>
            </div>
            <div className="how-step__title">{step.title}</div>
            <div className="how-step__desc">{step.desc}</div>
          </motion.div>
          {i < steps.length - 1 && (
            <motion.div className="how-step__arrow" variants={fadeUp} custom={i + 0.5}>
              <ChevronRight size={20} />
            </motion.div>
          )}
        </React.Fragment>
      ))}
    </motion.div>
  );
}

function FeaturesGrid({ features }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <motion.div
      className="features-grid"
      ref={ref}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      variants={staggerContainer}
    >
      {features.map((f, i) => (
        <motion.div className="feature-card" key={f.title} variants={fadeUp} custom={i}>
          <div className="feature-card__icon"><f.icon size={22} /></div>
          <div className="feature-card__title">{f.title}</div>
          <div className="feature-card__desc">{f.desc}</div>
        </motion.div>
      ))}
    </motion.div>
  );
}

function EcosystemShowcase({ cards }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <motion.div
      className="ecosystem-showcase"
      ref={ref}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      variants={staggerContainer}
    >
      {cards.map((c, i) => (
        <motion.div className="eco-card" key={c.title} variants={fadeUp} custom={i}>
          <div className="eco-card__header">
            <div className="eco-card__icon" style={{ background: `${c.color}20` }}>
              {i === 0 && <Coins size={20} color={c.color} />}
              {i === 1 && <TrendingUp size={20} color={c.color} />}
              {i === 2 && <Target size={20} color={c.color} />}
              {i === 3 && <Star size={20} color={c.color} />}
              {i === 4 && <Trophy size={20} color={c.color} />}
            </div>
            <span className="eco-card__badge" style={{ background: c.badgeBg, color: c.badgeColor }}>{c.badge}</span>
          </div>
          <div className="eco-card__title">{c.title}</div>
          <div className="eco-card__value" style={{ color: c.color }}>{c.value}</div>
          <div className="eco-card__bar">
            <div className="eco-card__bar-fill" style={{ width: inView ? `${c.pct}%` : '0%', background: c.color }} />
          </div>
          <div className="eco-card__meta">{c.meta}</div>
        </motion.div>
      ))}
    </motion.div>
  );
}

function PartnersRow() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const brandColors = { nike: '#f5f5f5', adidas: '#1a1a2e', puma: '#e3000b', boat: '#e63946', amazon: '#ff9900' };
  const brandInitials = { nike: 'N', adidas: 'A', puma: 'P', boat: 'B', amazon: 'A' };

  return (
    <motion.div
      className="partners-row"
      ref={ref}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      variants={staggerContainer}
    >
      {PARTNER_BRANDS.map((brand, i) => (
        <motion.div className="partner-tile" key={brand.id} variants={fadeUp} custom={i}>
          <div
            className="partner-tile__logo"
            style={{ background: brandColors[brand.id] || '#333', color: brand.id === 'nike' ? '#111' : '#fff' }}
          >
            {brandInitials[brand.id]}
          </div>
          <div className="partner-tile__name">{brand.name}</div>
          <div className="partner-tile__cat">{brand.category}</div>
        </motion.div>
      ))}
    </motion.div>
  );
}

function StatsGrid({ stats }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <motion.div
      className="stats-grid"
      ref={ref}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      variants={staggerContainer}
    >
      {stats.map((s, i) => (
        <motion.div className="stat-block" key={s.label} variants={fadeUp} custom={i}>
          <div className="stat-block__number">
            {inView ? <AnimatedCounter end={s.value} suffix={s.suffix} /> : `0${s.suffix}`}
          </div>
          <div className="stat-block__label">{s.label}</div>
        </motion.div>
      ))}
    </motion.div>
  );
}

function Footer({ navigate }) {
  return (
    <footer className="landing-footer" id="landing-footer">
      <div className="landing-footer__inner">
        <div>
          <div className="landing-footer__brand-name">
            <Zap size={20} color="var(--primary)" /> <span className="text-gradient">EcoPay</span>
          </div>
          <p className="landing-footer__brand-desc">
            Micro-contribution powered purchasing ecosystem. Small contributions, big purchasing power.
          </p>
        </div>
        <div>
          <div className="landing-footer__col-title">Product</div>
          <a className="landing-footer__link" href="#how-it-works">How It Works</a>
          <a className="landing-footer__link" href="#features">Features</a>
          <a className="landing-footer__link" href="#ecosystem">Live Ecosystem</a>
        </div>
        <div>
          <div className="landing-footer__col-title">Partners</div>
          {PARTNER_BRANDS.map(b => (
            <a className="landing-footer__link" href="#partners" key={b.id}>{b.name}</a>
          ))}
        </div>
        <div>
          <div className="landing-footer__col-title">Account</div>
          <span className="landing-footer__link" onClick={() => navigate(ROUTES.LOGIN)}>Login</span>
          <span className="landing-footer__link" onClick={() => navigate(ROUTES.SIGNUP)}>Sign Up</span>
        </div>
      </div>
      <div className="landing-footer__bottom">
        <span>© {new Date().getFullYear()} EcoPay. All rights reserved.</span>
        <span>v1.0.0</span>
      </div>
    </footer>
  );
}
