/* =========================================================
   Button.jsx — Reusable button primitive
   Variants: primary, secondary, ghost, danger, gold
   Sizes: sm, md, lg
   ========================================================= */

import { forwardRef } from 'react';
import { motion } from 'framer-motion';
import './Button.css';

const Button = forwardRef(({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  loading = false,
  disabled = false,
  icon: Icon,
  iconPosition = 'left',
  className = '',
  onClick,
  type = 'button',
  ...props
}, ref) => {
  const classes = [
    'btn',
    `btn--${variant}`,
    `btn--${size}`,
    fullWidth && 'btn--full',
    loading && 'btn--loading',
    disabled && 'btn--disabled',
    className,
  ].filter(Boolean).join(' ');

  return (
    <motion.button
      ref={ref}
      className={classes}
      onClick={onClick}
      type={type}
      disabled={disabled || loading}
      whileHover={!disabled && !loading ? { scale: 1.02 } : {}}
      whileTap={!disabled && !loading ? { scale: 0.98 } : {}}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      {...props}
    >
      {loading && (
        <span className="btn__spinner">
          <span className="btn__spinner-dot" />
          <span className="btn__spinner-dot" />
          <span className="btn__spinner-dot" />
        </span>
      )}
      {!loading && Icon && iconPosition === 'left' && (
        <Icon className="btn__icon btn__icon--left" size={size === 'sm' ? 14 : size === 'lg' ? 20 : 16} />
      )}
      {!loading && <span className="btn__label">{children}</span>}
      {!loading && Icon && iconPosition === 'right' && (
        <Icon className="btn__icon btn__icon--right" size={size === 'sm' ? 14 : size === 'lg' ? 20 : 16} />
      )}
    </motion.button>
  );
});

Button.displayName = 'Button';
export default Button;
