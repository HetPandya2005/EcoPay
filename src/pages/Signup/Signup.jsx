/* =========================================================
   Signup.jsx — Premium Signup Page
   Phase 2 — Authentication Screens

   Split layout: Branding (left) + Glassmorphism Signup Card (right)
   Reuses Phase 1 components, AuthContext, FloatingParticles
   ========================================================= */

import { useState, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Mail, Lock, AlertCircle, Zap, Check } from 'lucide-react';

import { useAuth } from '../../context/AuthContext';
import { Button, Input } from '../../components/ui';
import { ROUTES } from '../../utils/constants';
import { useAnimatedCounter } from '../../hooks/useAnimatedCounter';

import FloatingParticles from '../Login/FloatingParticles';
import PasswordStrength from './PasswordStrength';
import './Signup.css';

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
      staggerChildren: 0.06,
      delayChildren: 0.35,
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

const successVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
};

/* ─── Validators ──────────────────────────────────────────── */

function validateName(name) {
  if (!name.trim()) return 'Full name is required';
  if (name.trim().length < 2) return 'Name must be at least 2 characters';
  return '';
}

function validateEmail(email) {
  if (!email.trim()) return 'Email is required';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'Enter a valid email address';
  return '';
}

function validatePassword(password) {
  if (!password) return 'Password is required';
  if (password.length < 6) return 'Password must be at least 6 characters';
  return '';
}

function validateConfirmPassword(password, confirmPassword) {
  if (!confirmPassword) return 'Please confirm your password';
  if (password !== confirmPassword) return 'Passwords do not match';
  return '';
}

/* ─── Redirect delay (ms) after success ───────────────────── */
const SUCCESS_REDIRECT_DELAY = 2500;

/* ─── Signup Component ────────────────────────────────────── */

export default function Signup() {
  const { signup } = useAuth();
  const navigate = useNavigate();

  // Form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Animated stats
  const activeUsers = useAnimatedCounter(12480, 1200);
  const creditsRedeemed = useAnimatedCounter(8750, 1400);
  const partnerBrands = useAnimatedCounter(52, 1000);

  /* ─── Change handlers (clear errors on type) ────────────── */

  const clearError = useCallback((field) => {
    setErrors((prev) => {
      if (!prev[field]) return prev;
      return { ...prev, [field]: '' };
    });
    if (formError) setFormError('');
  }, [formError]);

  const handleNameChange = useCallback((e) => {
    setName(e.target.value);
    clearError('name');
  }, [clearError]);

  const handleEmailChange = useCallback((e) => {
    setEmail(e.target.value);
    clearError('email');
  }, [clearError]);

  const handlePasswordChange = useCallback((e) => {
    setPassword(e.target.value);
    clearError('password');
    // Also clear confirm error if they now match
    if (confirmPassword && e.target.value === confirmPassword) {
      clearError('confirmPassword');
    }
  }, [clearError, confirmPassword]);

  const handleConfirmPasswordChange = useCallback((e) => {
    setConfirmPassword(e.target.value);
    clearError('confirmPassword');
  }, [clearError]);

  /* ─── Submit ─────────────────────────────────────────────── */

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();

    // Validate all fields
    const nameErr = validateName(name);
    const emailErr = validateEmail(email);
    const passErr = validatePassword(password);
    const confirmErr = validateConfirmPassword(password, confirmPassword);
    const termsErr = !agreedToTerms;

    if (nameErr || emailErr || passErr || confirmErr || termsErr) {
      setErrors({
        name: nameErr,
        email: emailErr,
        password: passErr,
        confirmPassword: confirmErr,
        terms: termsErr ? 'You must agree to the Terms and Conditions' : '',
      });
      return;
    }

    setErrors({});
    setFormError('');
    setIsLoading(true);

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1400));

    const result = signup({ name: name.trim(), email: email.trim(), password });

    if (result.success) {
      setIsLoading(false);
      setIsSuccess(true);

      // Navigate to onboarding after success animation
      setTimeout(() => {
        navigate(ROUTES.ONBOARDING, { replace: true });
      }, SUCCESS_REDIRECT_DELAY);
    } else {
      setFormError(result.error);
      setIsLoading(false);
    }
  }, [name, email, password, confirmPassword, agreedToTerms, signup, navigate]);

  /* ─── Render ─────────────────────────────────────────────── */
  return (
    <motion.div
      className="signup-page"
      variants={pageVariants}
      initial="hidden"
      animate="visible"
    >
      {/* ── LEFT: Branding Section ── */}
      <motion.section
        className="signup-branding"
        variants={brandingVariants}
        initial="hidden"
        animate="visible"
        aria-label="Product introduction"
      >
        <div className="signup-branding__bg" />
        <div className="signup-branding__mesh" />
        <FloatingParticles count={16} />

        <div className="signup-branding__content">
          <motion.h1 className="signup-branding__headline" variants={itemVariants}>
            Start Your{' '}
            <span className="signup-branding__headline-gradient">
              Contribution Journey
            </span>
          </motion.h1>

          <motion.p className="signup-branding__subtitle" variants={itemVariants}>
            Join the ecosystem, earn credits, unlock requests, and redeem
            rewards with partner brands.
          </motion.p>

          <motion.div className="signup-stats" variants={itemVariants}>
            <div className="signup-stat">
              <span className="signup-stat__value signup-stat__value--primary">
                {activeUsers.toLocaleString()}+
              </span>
              <span className="signup-stat__label">Active Users</span>
            </div>
            <div className="signup-stat">
              <span className="signup-stat__value signup-stat__value--secondary">
                {creditsRedeemed.toLocaleString()}+
              </span>
              <span className="signup-stat__label">Credits Redeemed</span>
            </div>
            <div className="signup-stat">
              <span className="signup-stat__value signup-stat__value--gold">
                {partnerBrands}+
              </span>
              <span className="signup-stat__label">Partner Brands</span>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* ── Divider ── */}
      <div className="signup-divider" />

      {/* ── RIGHT: Signup Form ── */}
      <section className="signup-form-section" aria-label="Create account form">
        <motion.div
          className="signup-card"
          variants={cardVariants}
          initial="hidden"
          animate="visible"
        >
          {/* ── Success Overlay ── */}
          <AnimatePresence>
            {isSuccess && (
              <motion.div
                className="signup-success"
                variants={successVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
              >
                <motion.div
                  className="signup-success__icon"
                  initial={{ scale: 0, rotate: -90 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
                >
                  <Check size={32} strokeWidth={3} />
                </motion.div>

                <motion.h3
                  className="signup-success__title"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.4 }}
                >
                  Account Created Successfully
                </motion.h3>

                <motion.p
                  className="signup-success__subtitle"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5, duration: 0.4 }}
                >
                  Redirecting you to onboarding…
                </motion.p>

                <motion.div
                  className="signup-success__progress"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6, duration: 0.3 }}
                >
                  <motion.div
                    className="signup-success__progress-bar"
                    initial={{ width: '0%' }}
                    animate={{ width: '100%' }}
                    transition={{
                      duration: SUCCESS_REDIRECT_DELAY / 1000,
                      ease: 'linear',
                    }}
                  />
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Logo */}
          <motion.div className="signup-logo" variants={fieldVariants}>
            <div className="signup-logo__icon">
              <Zap size={22} />
            </div>
            <span className="signup-logo__text">EcoPay</span>
          </motion.div>

          {/* Header */}
          <motion.div className="signup-card__header" variants={fieldVariants}>
            <h2 className="signup-card__title">Create Account</h2>
            <p className="signup-card__subtitle">
              Begin your journey today
            </p>
          </motion.div>

          {/* Form */}
          <form className="signup-form" onSubmit={handleSubmit} noValidate>
            <div className="signup-form__fields">
              {/* Full Name */}
              <motion.div variants={fieldVariants}>
                <Input
                  id="signup-name"
                  label="Full Name"
                  type="text"
                  icon={User}
                  value={name}
                  onChange={handleNameChange}
                  error={errors.name}
                  autoComplete="name"
                  disabled={isLoading || isSuccess}
                />
              </motion.div>

              {/* Email */}
              <motion.div variants={fieldVariants}>
                <Input
                  id="signup-email"
                  label="Email Address"
                  type="email"
                  icon={Mail}
                  value={email}
                  onChange={handleEmailChange}
                  error={errors.email}
                  autoComplete="email"
                  disabled={isLoading || isSuccess}
                />
              </motion.div>

              {/* Password */}
              <motion.div variants={fieldVariants}>
                <Input
                  id="signup-password"
                  label="Password"
                  type="password"
                  icon={Lock}
                  value={password}
                  onChange={handlePasswordChange}
                  error={errors.password}
                  autoComplete="new-password"
                  disabled={isLoading || isSuccess}
                />
                <PasswordStrength password={password} />
              </motion.div>

              {/* Confirm Password */}
              <motion.div variants={fieldVariants}>
                <Input
                  id="signup-confirm-password"
                  label="Confirm Password"
                  type="password"
                  icon={Lock}
                  value={confirmPassword}
                  onChange={handleConfirmPasswordChange}
                  error={errors.confirmPassword}
                  autoComplete="new-password"
                  disabled={isLoading || isSuccess}
                />
              </motion.div>
            </div>

            {/* Terms Checkbox */}
            <motion.div variants={fieldVariants}>
              <label
                className={`signup-checkbox ${errors.terms ? 'signup-checkbox--error' : ''}`}
              >
                <input
                  type="checkbox"
                  className="signup-checkbox__input"
                  checked={agreedToTerms}
                  onChange={(e) => {
                    setAgreedToTerms(e.target.checked);
                    if (errors.terms) clearError('terms');
                  }}
                  disabled={isLoading || isSuccess}
                />
                <span className="signup-checkbox__box">
                  <Check size={14} className="signup-checkbox__check" />
                </span>
                <span className="signup-checkbox__label">
                  I agree to the{' '}
                  <a href="#terms" onClick={(e) => e.preventDefault()}>
                    Terms and Conditions
                  </a>
                </span>
              </label>
              {errors.terms && (
                <motion.span
                  className="signup-checkbox__error"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  {errors.terms}
                </motion.span>
              )}
            </motion.div>

            {/* Form-level error */}
            {formError && (
              <motion.div
                className="signup-form__error"
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
            <motion.div className="signup-form__actions" variants={fieldVariants}>
              <Button
                type="submit"
                variant="primary"
                size="lg"
                fullWidth
                loading={isLoading}
                disabled={isSuccess}
              >
                Create Account
              </Button>

              <Button
                type="button"
                variant="secondary"
                size="lg"
                fullWidth
                disabled={isLoading || isSuccess}
                onClick={() => navigate(ROUTES.LOGIN)}
              >
                Back to Login
              </Button>
            </motion.div>
          </form>

          {/* Footer */}
          <motion.div className="signup-card__footer" variants={fieldVariants}>
            <p className="signup-card__footer-text">
              Already have an account?{' '}
              <Link to={ROUTES.LOGIN} className="signup-card__footer-link">
                Sign In
              </Link>
            </p>
          </motion.div>
        </motion.div>
      </section>
    </motion.div>
  );
}
