/* =========================================================
   useGrowthSimulation.js — Real-time Buy Credit growth hook
   Ticks growth at intervals while a request card is active
   ========================================================= */

import { useEffect, useRef } from 'react';
import { useEconomy } from '../context/EconomyContext';
import { ECONOMY } from '../utils/constants';
import { getStoredSettings } from '../services/storage';

export function useGrowthSimulation() {
  const { activeRequest, tickGrowth } = useEconomy();
  const intervalRef = useRef(null);

  useEffect(() => {
    // Only run if there's an active, growing request
    if (!activeRequest || activeRequest.status !== 'growing') {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    const settings = getStoredSettings();
    const interval = settings.demoMode
      ? ECONOMY.DEMO_GROWTH_TICK_INTERVAL
      : ECONOMY.GROWTH_TICK_INTERVAL;

    intervalRef.current = setInterval(() => {
      tickGrowth();
    }, interval);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [activeRequest?.status, activeRequest?.id, tickGrowth]);
}
