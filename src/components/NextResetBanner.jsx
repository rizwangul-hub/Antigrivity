import React from 'react';
import { CountdownDisplay, OpenAGYBtn } from './ui.jsx';
import { msRemaining } from '../utils/time.js';

/**
 * Hero banner: highlights the very next credit to become available.
 */
export default function NextResetBanner({ emails, countdowns }) {
  // Find all waiting entries and pick the soonest
  const candidates = [];

  for (const em of emails) {
    for (const type of ['gemini', 'other']) {
      const slot = em[type];
      if (slot?.status === 'waiting' && slot.resetAt) {
        const ms = msRemaining(slot.resetAt);
        candidates.push({ email: em, type, ms });
      }
    }
  }

  if (candidates.length === 0) {
    return (
      <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl px-6 py-4 flex items-center gap-3">
        <span className="text-2xl">🟢</span>
        <div>
          <p className="font-semibold text-emerald-400">All Credits Ready!</p>
          <p className="text-sm text-gray-400">No active resets. You're good to go.</p>
        </div>
      </div>
    );
  }

  candidates.sort((a, b) => a.ms - b.ms);
  const first = candidates[0];
  const second = candidates[1] || null;

  const typeLabel = t => t === 'gemini' ? 'Gemini' : 'Other / AGY';
  const key = (c) => `${c.email.id}-${c.type}`;

  return (
    <div className="bg-gradient-to-r from-orange-500/10 via-yellow-500/5 to-transparent border border-orange-500/30 rounded-2xl px-6 py-4 fire-pulse">
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        {/* Icon + label */}
        <div className="text-3xl shrink-0">⏰</div>

        <div className="flex-1 min-w-0">
          <p className="text-xs font-bold uppercase tracking-widest text-orange-400 mb-1">
            🔥 Next Credit Available
          </p>
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-semibold text-white truncate max-w-xs">
              {first.email.email}
            </span>
            {first.email.displayName && (
              <span className="text-xs text-gray-500">({first.email.displayName})</span>
            )}
            <span className="text-xs bg-orange-500/20 text-orange-300 px-2 py-0.5 rounded-full border border-orange-500/30">
              {typeLabel(first.type)}
            </span>
          </div>
          <div className="mt-1 flex flex-wrap items-center gap-2">
            <CountdownDisplay ms={countdowns[key(first)]} />
            <OpenAGYBtn className="text-xs py-1 px-2.5" />
          </div>
        </div>

        {/* Second entry */}
        {second && (
          <div className="text-sm text-gray-400 shrink-0 hidden sm:block">
            <span className="text-gray-600">Next: </span>
            <span className="text-gray-300">{second.email.email}</span>
            <span className="mx-1 text-gray-600">—</span>
            <span className="text-gray-400">{typeLabel(second.type)}</span>
            <span className="mx-1 text-gray-600">—</span>
            <CountdownDisplay ms={countdowns[key(second)]} />
          </div>
        )}
      </div>
    </div>
  );
}
