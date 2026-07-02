/* =========================================================
   Card.jsx — Reusable card primitive
   Variants: default, glass, gradient, glow
   ========================================================= */

import { forwardRef } from 'react';
import { motion } from 'framer-motion';
import './Card.css';

const Card = forwardRef(({
  children,
  variant = 'glass',
  padding = 'md',
  hover = true,
  glow,
  className = '',
  onClick,
  animate = true,
  delay = 0,
  ...props
}, ref) => {
  const classes = [
    'card',
    `card--${variant}`,
    `card--pad-${padding}`,
    hover && 'card--hover',
    glow && `card--glow-${glow}`,
    onClick && 'card--clickable',
    className,
  ].filter(Boolean).join(' ');

  const motionProps = animate ? {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.4, delay, ease: [0.22, 1, 0.36, 1] },
  } : {};

  return (
    <motion.div
      ref={ref}
      className={classes}
      onClick={onClick}
      {...motionProps}
      {...props}
    >
      {children}
    </motion.div>
  );
});

Card.displayName = 'Card';
export default Card;
