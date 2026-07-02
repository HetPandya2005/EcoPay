/* =========================================================
   CircularProgress.jsx — SVG circular progress ring
   Features: animated fill, center content, glow
   ========================================================= */

import { motion } from 'framer-motion';
import './CircularProgress.css';

export default function CircularProgress({
  value = 0,
  max = 100,
  size = 120,
  strokeWidth = 8,
  color = 'primary',
  children,
  className = '',
  animated = true,
}) {
  const percentage = Math.min((value / max) * 100, 100);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  const colorMap = {
    primary: { stroke: 'url(#gradPrimary)', glow: 'rgba(124, 108, 240, 0.3)' },
    secondary: { stroke: 'url(#gradSecondary)', glow: 'rgba(0, 210, 198, 0.3)' },
    gold: { stroke: 'url(#gradGold)', glow: 'rgba(244, 196, 48, 0.3)' },
    success: { stroke: 'url(#gradSuccess)', glow: 'rgba(16, 185, 129, 0.3)' },
  };

  const colorConfig = colorMap[color] || colorMap.primary;

  return (
    <div className={`circular-progress ${className}`} style={{ width: size, height: size }}>
      <svg viewBox={`0 0 ${size} ${size}`} className="circular-progress__svg">
        <defs>
          <linearGradient id="gradPrimary" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#7c6cf0" />
            <stop offset="100%" stopColor="#00d2c6" />
          </linearGradient>
          <linearGradient id="gradSecondary" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00d2c6" />
            <stop offset="100%" stopColor="#3b82f6" />
          </linearGradient>
          <linearGradient id="gradGold" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f4c430" />
            <stop offset="100%" stopColor="#f0883e" />
          </linearGradient>
          <linearGradient id="gradSuccess" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#10b981" />
            <stop offset="100%" stopColor="#3b82f6" />
          </linearGradient>
        </defs>

        {/* Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth={strokeWidth}
        />

        {/* Fill */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={colorConfig.stroke}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={animated ? { strokeDashoffset: circumference } : false}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          style={{
            transform: 'rotate(-90deg)',
            transformOrigin: '50% 50%',
            filter: `drop-shadow(0 0 6px ${colorConfig.glow})`,
          }}
        />
      </svg>

      {children && (
        <div className="circular-progress__content">
          {children}
        </div>
      )}
    </div>
  );
}
