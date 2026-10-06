import React, { useState, useEffect, useCallback } from 'react';
import { msRemaining } from '../utils/time.js';

/**
 * Live countdown hook — ticks every second.
 * Returns a map: { `${emailId}-${type}`: msRemaining }
 */
export function useCountdowns(emails) {
  const [, setTick] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setTick(t => t + 1), 1000);
    return () => clearInterval(id);
  }, []);

  // Recalculated fresh every render (once per second)
  const map = {};
  for (const em of emails) {
    map[`${em.id}-gemini`] = em.gemini?.resetAt ? msRemaining(em.gemini.resetAt) : null;
    map[`${em.id}-other`]  = em.other?.resetAt  ? msRemaining(em.other.resetAt)  : null;
  }
  return map;
}

/**
 * Notification hook — fires browser notification when a timer hits zero.
 */
export function useNotifications(emails, countdowns, prevCountdowns) {
  const requestPermission = useCallback(async () => {
    if ('Notification' in window && Notification.permission === 'default') {
      await Notification.requestPermission();
    }
  }, []);

  useEffect(() => {
    if (!('Notification' in window) || Notification.permission !== 'granted') return;

    for (const em of emails) {
      for (const type of ['gemini', 'other']) {
        const key = `${em.id}-${type}`;
        const cur = countdowns[key];
        const prev = prevCountdowns.current[key];
        // Transition from >0 to 0
        if (prev !== undefined && prev > 0 && cur === 0) {
          const label = type === 'gemini' ? 'Gemini' : 'Other / AGY';
          new Notification('AI Credit Ready 🎉', {
            body: `${em.email} — ${label} credit is now ready!`,
            icon: '/favicon.ico',
          });
        }
        prevCountdowns.current[key] = cur;
      }
    }
  });

  return { requestPermission };
}
