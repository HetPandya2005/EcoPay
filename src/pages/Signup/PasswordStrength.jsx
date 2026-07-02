/* =========================================================
   PasswordStrength.jsx — Animated password strength meter
   Evaluates: length, uppercase, lowercase, number, special char
   ========================================================= */

import { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './PasswordStrength.css';

/* ─── Strength Calculation ────────────────────────────────── */

function evaluateStrength(password) {
  if (!password) return { score: 0, label: '', color: '' };

  let score = 0;
  if (password.length >= 4) score += 1;
  if (password.length >= 8) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;

  const levels = [
    { label: '', color: '' },
    { label: 'Weak', color: 'var(--danger)' },
    { label: 'Fair', color: 'var(--warning)' },
    { label: 'Good', color: 'var(--accent-gold)' },
    { label: 'Strong', color: 'var(--success)' },
    { label: 'Excellent', color: 'var(--secondary)' },
  ];

  return { score, ...levels[score] };
}

const SEGMENT_COUNT = 5;

/* ─── Component ───────────────────────────────────────────── */

export default function PasswordStrength({ password }) {
  const { score, label, color } = useMemo(
    () => evaluateStrength(password),
    [password]
  );

  if (!password) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="pw-strength"
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: 'auto' }}
        exit={{ opacity: 0, height: 0 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Segments */}
        <div className="pw-strength__bar">
          {Array.from({ length: SEGMENT_COUNT }, (_, i) => (
            <motion.div
              key={i}
              className="pw-strength__segment"
              initial={{ scaleX: 0 }}
              animate={{
                scaleX: i < score ? 1 : 1,
                backgroundColor: i < score ? color : 'var(--glass-bg-active)',
              }}
              transition={{ duration: 0.35, delay: i * 0.06 }}
            />
          ))}
        </div>

        {/* Label */}
        <motion.span
          className="pw-strength__label"
          style={{ color }}
          key={label}
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          {label}
        </motion.span>
      </motion.div>
    </AnimatePresence>
  );
}
