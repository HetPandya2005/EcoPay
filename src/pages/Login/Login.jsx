/* =========================================================
   Login.jsx — Premium Login Page
   Phase 2 — Authentication Screens
   
   Split layout: Branding (left) + Glassmorphism Login Card (right)
   Uses Phase 1 design system, reusable UI components, AuthContext
   ========================================================= */

import { useState, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, AlertCircle, Zap } from 'lucide-react';

import { useAuth } from '../../context/AuthContext';
import { Button, Input } from '../../components/ui';
import { ROUTES } from '../../utils/constants';
import { useAnimatedCounter } from '../../hooks/useAnimatedCounter';

import FloatingParticles from './FloatingParticles';
import './Login.css';

/* ─── Animation Variants ──────────────────────────────────── */

const pageVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

const brandingVariants = {
  hidden: { opacity: 0, x: -40 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.7,
      ease: [0.22, 1, 0.36, 1],
      staggerChildren: 0.12,
      delayChildren: 0.15,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.7,
      delay: 0.2,
      ease: [0.22, 1, 0.36, 1],
      staggerChildren: 0.08,
      delayChildren: 0.4,
    },
  },
};

const fieldVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
  },
};

/* ─── Validators ──────────────────────────────────────────── */

function validateEmail(email) {
  if (!email.trim()) return 'Email is required';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'Enter a valid email address';
  return '';
}

function validatePassword(password) {
  if (!password) return 'Password is required';
  if (password.length < 4) return 'Password must be at least 4 characters';
  return '';
}

/* ─── Login Component ─────────────────────────────────────── */

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  // Form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Animated stats for branding section
  const activeUsers = useAnimatedCounter(12480, 1200);
  const creditsRedeemed = useAnimatedCounter(8750, 1400);
  const partnerBrands = useAnimatedCounter(52, 1000);

  /* ─── Field change handlers (clear field error on type) ── */
  const handleEmailChange = useCallback((e) => {
    setEmail(e.target.value);
    if (errors.email) setErrors((prev) => ({ ...prev, email: '' }));
    if (formError) setFormError('');
  }, [errors.email, formError]);

  const handlePasswordChange = useCallback((e) => {
    setPassword(e.target.value);
    if (errors.password) setErrors((prev) => ({ ...prev, password: '' }));
    if (formError) setFormError('');
  }, [errors.password, formError]);

  /* ─── Submit ─────────────────────────────────────────────── */
  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();

    // Validate
    const emailErr = validateEmail(email);
    const passErr = validatePassword(password);

    if (emailErr || passErr) {
      setErrors({ email: emailErr, password: passErr });
      return;
    }

    setErrors({});
    setFormError('');
    setIsLoading(true);

    // Simulate network delay for premium feel
    await new Promise((resolve) => setTimeout(resolve, 1200));

    const result = login({ email, password });

    if (result.success) {
      navigate(ROUTES.DASHBOARD, { replace: true });
    } else {
      setFormError(result.error);
      setIsLoading(false);
    }
  }, [email, password, login, navigate]);

  /* ─── Render ─────────────────────────────────────────────── */
  return (
    <motion.div
      className="login-page"
      variants={pageVariants}
      initial="hidden"
      animate="visible"
    >
      {/* ── LEFT: Branding Section ── */}
      <motion.section
        className="login-branding"
        variants={brandingVariants}
        initial="hidden"
        animate="visible"
        aria-label="Product introduction"
      >
        <div className="login-branding__bg" />
        <div className="login-branding__mesh" />
        <FloatingParticles count={16} />

        <div className="login-branding__content">
          <motion.h1 className="login-branding__headline" variants={itemVariants}>
            Unlock{' '}
            <span className="login-branding__headline-gradient">
              Bigger Purchases
            </span>{' '}
            Through Small Contributions
          </motion.h1>

          <motion.p className="login-branding__subtitle" variants={itemVariants}>
            Contribute, earn credits, unlock requests, and redeem rewards
            through a contribution-powered ecosystem.
          </motion.p>

          <motion.div className="login-stats" variants={itemVariants}>
            <div className="login-stat">
              <span className="login-stat__value login-stat__value--primary">
                {activeUsers.toLocaleString()}+
              </span>
              <span className="login-stat__label">Active Users</span>
            </div>
            <div className="login-stat">
              <span className="login-stat__value login-stat__value--secondary">
                {creditsRedeemed.toLocaleString()}+
              </span>
              <span className="login-stat__label">Credits Redeemed</span>
            </div>
            <div className="login-stat">
              <span className="login-stat__value login-stat__value--gold">
                {partnerBrands}+
              </span>
              <span className="login-stat__label">Partner Brands</span>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* ── Divider ── */}
      <div className="login-divider" />

      {/* ── RIGHT: Login Form ── */}
      <section className="login-form-section" aria-label="Login form">
        <motion.div
          className="login-card"
          variants={cardVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Logo */}
          <motion.div className="login-logo" variants={fieldVariants}>
            <div className="login-logo__icon">
              <Zap size={22} />
            </div>
            <span className="login-logo__text">EcoPay</span>
          </motion.div>

          {/* Header */}
          <motion.div className="login-card__header" variants={fieldVariants}>
            <h2 className="login-card__title">Welcome Back</h2>
            <p className="login-card__subtitle">
              Sign in to continue your contribution journey
            </p>
          </motion.div>

          {/* Form */}
          <form className="login-form" onSubmit={handleSubmit} noValidate>
            <div className="login-form__fields">
              <motion.div variants={fieldVariants}>
                <Input
                  id="login-email"
                  label="Email Address"
                  type="email"
                  icon={Mail}
                  value={email}
                  onChange={handleEmailChange}
                  error={errors.email}
                  autoComplete="email"
                  disabled={isLoading}
                />
              </motion.div>

              <motion.div variants={fieldVariants}>
                <Input
                  id="login-password"
                  label="Password"
                  type="password"
                  icon={Lock}
                  value={password}
                  onChange={handlePasswordChange}
                  error={errors.password}
                  autoComplete="current-password"
                  disabled={isLoading}
                />
              </motion.div>
            </div>

            {/* Forgot Password */}
            <motion.div className="login-form__forgot-row" variants={fieldVariants}>
              <button
                type="button"
                className="login-form__forgot"
                tabIndex={0}
              >
                Forgot Password?
              </button>
            </motion.div>

            {/* Form-level error */}
            {formError && (
              <motion.div
                className="login-form__error"
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                role="alert"
              >
                <AlertCircle size={16} />
                <span>{formError}</span>
              </motion.div>
            )}

            {/* Actions */}
            <motion.div className="login-form__actions" variants={fieldVariants}>
              <Button
                type="submit"
                variant="primary"
                size="lg"
                fullWidth
                loading={isLoading}
              >
                Sign In
              </Button>

              <Button
                type="button"
                variant="secondary"
                size="lg"
                fullWidth
                disabled={isLoading}
                onClick={() => navigate(ROUTES.SIGNUP)}
              >
                Create Account
              </Button>
            </motion.div>
          </form>

          {/* Footer */}
          <motion.div className="login-card__footer" variants={fieldVariants}>
            <p className="login-card__footer-text">
              Don&apos;t have an account?{' '}
              <Link to={ROUTES.SIGNUP} className="login-card__footer-link">
                Sign up for free
              </Link>
            </p>
          </motion.div>
        </motion.div>
      </section>
    </motion.div>
  );
}
