/* =========================================================
   ProgressBar.jsx — Animated progress bar
   Features: gradient fill, label, animated entry
   ========================================================= */

import { motion } from 'framer-motion';
import './ProgressBar.css';

export default function ProgressBar({
  value = 0,
  max = 100,
  label,
  showValue = true,
  variant = 'primary',
  size = 'md',
  animated = true,
  className = '',
}) {
  const percentage = Math.min((value / max) * 100, 100);

  return (
    <div className={`progress ${className}`}>
      {(label || showValue) && (
        <div className="progress__header">
          {label && <span className="progress__label">{label}</span>}
          {showValue && (
            <span className="progress__value">{Math.round(percentage)}%</span>
          )}
        </div>
      )}
      <div className={`progress__track progress__track--${size}`}>
        <motion.div
          className={`progress__fill progress__fill--${variant}`}
          initial={animated ? { width: 0 } : false}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>
    </div>
  );
}
