/* =========================================================
   StatCard.jsx — Animated statistic display card
   Features: icon, animated counter, label, trend indicator
   ========================================================= */

import { motion } from 'framer-motion';
import { useAnimatedCounter } from '../../hooks/useAnimatedCounter';
import { formatNumber } from '../../utils/formatters';
import './StatCard.css';

export default function StatCard({
  label,
  value,
  prefix = '',
  suffix = '',
  icon: Icon,
  trend,
  trendLabel,
  color = 'primary',
  delay = 0,
  className = '',
}) {
  const animatedValue = useAnimatedCounter(value);

  return (
    <motion.div
      className={`stat-card stat-card--${color} ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="stat-card__header">
        {Icon && (
          <div className="stat-card__icon">
            <Icon size={20} />
          </div>
        )}
        {trend !== undefined && (
          <span className={`stat-card__trend stat-card__trend--${trend >= 0 ? 'up' : 'down'}`}>
            {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}%
            {trendLabel && <span className="stat-card__trend-label">{trendLabel}</span>}
          </span>
        )}
      </div>
      <div className="stat-card__value">
        {prefix}{formatNumber(animatedValue)}{suffix}
      </div>
      <div className="stat-card__label">{label}</div>
    </motion.div>
  );
}
