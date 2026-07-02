/* =========================================================
   useAnimatedCounter.js — Smooth counting animation hook
   Animates a number from its previous value to the current
   ========================================================= */

import { useState, useEffect, useRef } from 'react';

/**
 * Hook that smoothly animates a number change.
 * @param {number} targetValue - The value to animate to
 * @param {number} duration - Animation duration in ms (default: 800)
 * @returns {number} The current animated value
 */
export function useAnimatedCounter(targetValue, duration = 800) {
  const [displayValue, setDisplayValue] = useState(targetValue);
  const previousValue = useRef(targetValue);
  const rafRef = useRef(null);

  useEffect(() => {
    const start = previousValue.current;
    const end = targetValue;
    const diff = end - start;

    if (diff === 0) return;

    const startTime = performance.now();

    function animate(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(start + diff * eased);

      setDisplayValue(current);

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate);
      } else {
        previousValue.current = end;
      }
    }

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [targetValue, duration]);

  return displayValue;
}
