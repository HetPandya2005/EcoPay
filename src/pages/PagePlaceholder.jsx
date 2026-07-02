/* =========================================================
   PagePlaceholder.jsx — Temporary placeholder for pages
   Will be replaced by actual page components in later phases
   ========================================================= */

import { motion } from 'framer-motion';

export default function PagePlaceholder({ title, description }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '60vh',
        textAlign: 'center',
        gap: '1rem',
      }}
    >
      <h1 style={{
        fontFamily: 'var(--font-display)',
        fontSize: 'var(--text-3xl)',
        fontWeight: 'var(--weight-bold)',
        background: 'var(--gradient-primary)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
      }}>
        {title}
      </h1>
      <p style={{
        fontSize: 'var(--text-base)',
        color: 'var(--text-muted)',
        maxWidth: '400px',
      }}>
        {description || 'This page will be built in an upcoming phase.'}
      </p>
    </motion.div>
  );
}
