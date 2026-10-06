import React from 'react';
import { StatCard } from './ui.jsx';
import { msRemaining, formatDuration } from '../utils/time.js';

export default function SummaryCards({ emails, countdowns }) {
  let geminiWaiting = 0;
  let otherWaiting = 0;
  let readyCount = 0;  // emails where both Gemini and Other are ready (or unset)

  let nextMs = Infinity;
  let nextLabel = null;

  for (const em of emails) {
    const gReady = em.gemini?.status !== 'waiting';
    const oReady = em.other?.status !== 'waiting';

    if (!gReady) {
      geminiWaiting++;
      const ms = countdowns[`${em.id}-gemini`];
      if (ms !== null && ms < nextMs) {
        nextMs = ms;
        nextLabel = `${em.email} · Gemini`;
      }
    }
    if (!oReady) {
      otherWaiting++;
      const ms = countdowns[`${em.id}-other`];
      if (ms !== null && ms < nextMs) {
        nextMs = ms;
        nextLabel = `${em.email} · Other`;
      }
    }
    if (gReady && oReady) readyCount++;
  }

  const nextDisplay = nextLabel
    ? `${formatDuration(nextMs)} — ${nextLabel}`
    : 'None waiting';

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
      <StatCard label="Total Emails"  value={emails.length}  color="sky"     icon="📧" />
      <StatCard label="Gemini Waiting" value={geminiWaiting}  color="purple"  icon="🟡" />
      <StatCard label="Other Waiting"  value={otherWaiting}   color="yellow"  icon="🟡" />
      <StatCard label="Ready to Use"   value={readyCount}     color="emerald" icon="🟢" />
      <StatCard
        label="Next Reset"
        value={nextMs === Infinity ? '—' : formatDuration(nextMs)}
        sub={nextLabel}
        color="orange"
        icon="⏰"
      />
    </div>
  );
}
