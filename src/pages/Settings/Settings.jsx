/* =========================================================
   Settings.jsx — Account Settings & Simulation Management
   Clean, premium settings page with reset + logout
   ========================================================= */

import { useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Settings as SettingsIcon,
  RotateCcw, LogOut, Info, Shield,
  AlertTriangle, Minus, Zap,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useEconomy } from '../../context/EconomyContext';
import { getContributorLevel } from '../../utils/economy';
import { ROUTES } from '../../utils/constants';
import Modal from '../../components/ui/Modal';
import './Settings.css';

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

/* ═══════════════════════════════════════════════════════════
   Settings Component
   ═══════════════════════════════════════════════════════════ */

export default function Settings() {
  const { user, logout, updateUser } = useAuth();
  const economy = useEconomy();
  const navigate = useNavigate();
  const [showResetModal, setShowResetModal] = useState(false);

  /* ── Derived data ────────────────────────────────────── */

  const contributorLevel = useMemo(
    () => getContributorLevel(economy.earnCredits),
    [economy.earnCredits]
  );

  const kycVerified = user?.kycStatus === 'verified';

  /* ── Actions ─────────────────────────────────────────── */

  const handleResetSimulation = useCallback(() => {
    // Reset economy data (Earn Credits, Buy Credits, requests, history, achievements)
    economy.resetEconomy();

    // Reset contributor level on the user profile back to 1
    updateUser({ contributorLevel: 1 });

    // Close the modal
    setShowResetModal(false);
  }, [economy, updateUser]);

  const handleLogout = useCallback(() => {
    logout();
    navigate(ROUTES.LOGIN, { replace: true });
  }, [logout, navigate]);

  /* ── Items that will be reset ────────────────────────── */

  const resetItems = [
    'Earn Credits',
    'Buy Credits',
    'Active Request',
    'Contribution History',
    'Redemption History',
    'Achievements',
    'Contributor Level Progress',
    'Dashboard Statistics',
  ];

  /* ── Application info entries ────────────────────────── */

  const appInfoEntries = [
    { label: 'Application', value: 'EcoPay' },
    { label: 'Version', value: 'v1.0 MVP' },
    { label: 'Application Type', value: 'Simulation-First MVP' },
    { label: 'Storage', value: 'Browser LocalStorage' },
    { label: 'Framework', value: 'React + Vite' },
    { label: 'Architecture', value: 'Client-side Business Logic' },
  ];

  /* ── Render ──────────────────────────────────────────── */

  return (
    <motion.div
      className="settings"
      variants={container}
      initial="hidden"
      animate="show"
    >
      {/* ══════════════════════════════════════════════════════
          PAGE HEADER
          ══════════════════════════════════════════════════════ */}
      <motion.div className="settings__header" variants={item}>
        <h1 className="settings__header-title">Settings</h1>
        <p className="settings__header-subtitle">
          Manage your EcoPay account and application preferences.
        </p>
      </motion.div>

      {/* ══════════════════════════════════════════════════════
          SECTION 1 — ACCOUNT INFORMATION
          ══════════════════════════════════════════════════════ */}
      <motion.section variants={container}>
        <motion.h2 className="settings__section-title" variants={item}>
          Account Information
        </motion.h2>
        <motion.div className="settings-account" variants={item} whileHover={{ y: -2 }}>
          <div className="settings-account__grid">
            <div className="settings-account__field">
              <span className="settings-account__field-label">Full Name</span>
              <span className="settings-account__field-value">
                {user?.name || 'N/A'}
              </span>
            </div>
            <div className="settings-account__field">
              <span className="settings-account__field-label">Email Address</span>
              <span className="settings-account__field-value">
                {user?.email || 'N/A'}
              </span>
            </div>
            <div className="settings-account__field">
              <span className="settings-account__field-label">KYC Status</span>
              <span className={`settings-account__field-value ${kycVerified ? 'settings-account__field-value--kyc-verified' : 'settings-account__field-value--kyc-pending'}`}>
                {kycVerified ? '✓ Verified' : '⏳ Pending'}
              </span>
            </div>
            <div className="settings-account__field">
              <span className="settings-account__field-label">Contributor Level</span>
              <span className="settings-account__field-value">
                {contributorLevel.icon} {contributorLevel.name} — Lv. {contributorLevel.level}
              </span>
            </div>
          </div>
        </motion.div>
      </motion.section>

      {/* ══════════════════════════════════════════════════════
          SECTION 2 — RESET SIMULATION
          ══════════════════════════════════════════════════════ */}
      <motion.section variants={container}>
        <motion.h2 className="settings__section-title" variants={item}>
          Simulation
        </motion.h2>
        <motion.div className="settings-reset" variants={item}>
          <h3 className="settings-reset__title">Reset Simulation</h3>
          <p className="settings-reset__description">
            Reset your EcoPay journey and start over while keeping your account.
          </p>
          <motion.button
            id="settings-reset-btn"
            className="settings-reset__btn"
            onClick={() => setShowResetModal(true)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <span className="settings-reset__btn-icon">
              <RotateCcw size={16} />
            </span>
            <span className="settings-reset__btn-text">Reset My Simulation</span>
          </motion.button>
        </motion.div>
      </motion.section>

      {/* ══════════════════════════════════════════════════════
          SECTION 3 — SESSION
          ══════════════════════════════════════════════════════ */}
      <motion.section variants={container}>
        <motion.h2 className="settings__section-title" variants={item}>
          Session
        </motion.h2>
        <motion.div className="settings-session" variants={item}>
          <h3 className="settings-session__title">Logout</h3>
          <p className="settings-session__description">
            End your current session and return to the login page.
          </p>
          <motion.button
            id="settings-logout-btn"
            className="settings-session__btn"
            onClick={handleLogout}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <LogOut size={16} />
            Logout
          </motion.button>
        </motion.div>
      </motion.section>

      {/* ══════════════════════════════════════════════════════
          SECTION 4 — APPLICATION INFORMATION
          ══════════════════════════════════════════════════════ */}
      <motion.section variants={container}>
        <motion.h2 className="settings__section-title" variants={item}>
          Application Information
        </motion.h2>
        <motion.div className="settings-appinfo" variants={item}>
          <div className="settings-appinfo__grid">
            {appInfoEntries.map((entry) => (
              <div className="settings-appinfo__item" key={entry.label}>
                <span className="settings-appinfo__item-label">{entry.label}</span>
                <span className="settings-appinfo__item-value">{entry.value}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </motion.section>

      {/* ══════════════════════════════════════════════════════
          SECTION 5 — ABOUT ECOPAY
          ══════════════════════════════════════════════════════ */}
      <motion.section variants={container}>
        <motion.h2 className="settings__section-title" variants={item}>
          About
        </motion.h2>
        <motion.div className="settings-about" variants={item}>
          <div className="settings-about__logo">
            <div className="settings-about__logo-icon">
              <Zap size={18} />
            </div>
            <span className="settings-about__logo-text">EcoPay</span>
          </div>
          <h3 className="settings-about__title">About EcoPay</h3>
          <p className="settings-about__description">
            EcoPay is a simulation-first micro-contribution purchasing ecosystem designed
            to demonstrate how users can contribute small amounts, earn contribution-based
            credits, unlock purchasing requests, grow Buy Credits through simulated community
            participation, and redeem those credits within a partner ecosystem.
          </p>
          <p className="settings-about__description" style={{ marginTop: 'var(--space-3)' }}>
            This application focuses on modern frontend architecture, premium UI/UX,
            client-side business logic, and realistic workflow simulation.
          </p>
        </motion.div>
      </motion.section>

      {/* ══════════════════════════════════════════════════════
          RESET CONFIRMATION MODAL
          ══════════════════════════════════════════════════════ */}
      <Modal
        isOpen={showResetModal}
        onClose={() => setShowResetModal(false)}
        title="Reset EcoPay Simulation"
        size="md"
      >
        <div className="settings-reset-modal">
          <p className="settings-reset-modal__message">
            Are you sure you want to reset your EcoPay simulation?
          </p>

          {/* What will be removed */}
          <div className="settings-reset-modal__warning">
            <p className="settings-reset-modal__warning-title">
              This will reset only your current account by removing:
            </p>
            <div className="settings-reset-modal__warning-list">
              {resetItems.map((resetItem) => (
                <div className="settings-reset-modal__warning-item" key={resetItem}>
                  <Minus size={12} />
                  <span>{resetItem}</span>
                </div>
              ))}
            </div>
          </div>

          {/* What will be preserved */}
          <div className="settings-reset-modal__safe">
            <p className="settings-reset-modal__safe-title">Preserved</p>
            <p className="settings-reset-modal__safe-text">
              Your account, email, password, login credentials, and KYC information will remain unchanged.
            </p>
          </div>

          {/* Action buttons */}
          <div className="settings-reset-modal__actions">
            <motion.button
              id="settings-reset-cancel-btn"
              className="settings-reset-modal__btn settings-reset-modal__btn--cancel"
              onClick={() => setShowResetModal(false)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Cancel
            </motion.button>
            <motion.button
              id="settings-reset-confirm-btn"
              className="settings-reset-modal__btn settings-reset-modal__btn--confirm"
              onClick={handleResetSimulation}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <RotateCcw size={14} />
              Reset Simulation
            </motion.button>
          </div>
        </div>
      </Modal>
    </motion.div>
  );
}
