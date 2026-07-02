/* =========================================================
   FloatingParticles.jsx — Ambient floating credit particles
   Creates subtle, randomized floating orbs for the branding
   section background. Pure CSS animation, no JS animation loop.
   ========================================================= */

import { useMemo } from 'react';

const PARTICLE_COLORS = [
  'rgba(124, 108, 240, 0.35)',  // primary
  'rgba(0, 210, 198, 0.30)',    // secondary
  'rgba(244, 196, 48, 0.25)',   // gold
  'rgba(157, 143, 247, 0.30)',  // primary-light
];

export default function FloatingParticles({ count = 18 }) {
  const particles = useMemo(() => {
    return Array.from({ length: count }, (_, i) => {
      const size = Math.random() * 4 + 2;                      // 2px – 6px
      const left = Math.random() * 100;                         // 0% – 100%
      const delay = Math.random() * 12;                         // 0s – 12s
      const duration = Math.random() * 10 + 12;                 // 12s – 22s
      const color = PARTICLE_COLORS[i % PARTICLE_COLORS.length];
      const startY = Math.random() * 40 + 80;                   // start near bottom

      return { id: i, size, left, delay, duration, color, startY };
    });
  }, [count]);

  return (
    <div className="login-particles" aria-hidden="true">
      {particles.map((p) => (
        <span
          key={p.id}
          className="login-particle"
          style={{
            width: `${p.size}px`,
            height: `${p.size}px`,
            left: `${p.left}%`,
            bottom: `-${p.size}px`,
            background: p.color,
            boxShadow: `0 0 ${p.size * 3}px ${p.color}`,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
          }}
        />
      ))}
    </div>
  );
}
