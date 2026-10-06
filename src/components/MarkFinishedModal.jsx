import React, { useState } from 'react';
import { Modal, FormField, Input, Textarea, Btn } from './ui.jsx';

/**
 * Single credit-type section inside the modal.
 * Shows a toggle + one datetime-local input.
 */
function CreditSection({ label, color, enabled, onToggle, value, onChange, notes, onNotes }) {
  const borderColor = color === 'purple' ? 'border-purple-500/40' : 'border-sky-500/40';
  const labelColor  = color === 'purple' ? 'text-purple-400'       : 'text-sky-400';
  const bgActive    = color === 'purple' ? 'bg-purple-500/10'       : 'bg-sky-500/10';

  return (
    <div className={`rounded-xl border p-4 flex flex-col gap-3 transition-all ${
      enabled ? `${borderColor} ${bgActive}` : 'border-gray-700/40 bg-gray-800/20 opacity-60'
    }`}>
      {/* Header + toggle */}
      <div className="flex items-center justify-between">
        <span className={`text-sm font-bold uppercase tracking-wider ${labelColor}`}>
          {label}
        </span>
        <button
          type="button"
          onClick={onToggle}
          className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
            enabled ? (color === 'purple' ? 'bg-purple-600' : 'bg-sky-600') : 'bg-gray-600'
          }`}
          aria-label={`Toggle ${label}`}
        >
          <span className={`inline-block h-3.5 w-3.5 rounded-full bg-white shadow transition-transform ${
            enabled ? 'translate-x-4' : 'translate-x-0.5'
          }`} />
        </button>
      </div>

      {enabled && (
        <>
          <FormField label="Reset Date & Time">
            <Input
              type="datetime-local"
              value={value}
              onChange={e => onChange(e.target.value)}
              min={new Date().toISOString().slice(0, 16)}
            />
          </FormField>
          <FormField label="Notes (optional)">
            <Input
              type="text"
              placeholder="Optional note…"
              value={notes}
              onChange={e => onNotes(e.target.value)}
            />
          </FormField>
        </>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main modal
// ─────────────────────────────────────────────────────────────────────────────
export default function MarkFinishedModal({ email, creditType: initialType, onSave, onClose }) {
  // Pre-enable whichever credit type triggered the open, default both to on
  const [geminiOn,   setGeminiOn]   = useState(initialType === 'gemini' || !initialType);
  const [otherOn,    setOtherOn]    = useState(initialType === 'other'  || !initialType);

  const defaultDt = () => {
    // Default to now + 24 h as a useful starting point
    const d = new Date(Date.now() + 24 * 3600 * 1000);
    return d.toISOString().slice(0, 16);
  };

  const [geminiReset, setGeminiReset] = useState(defaultDt);
  const [otherReset,  setOtherReset]  = useState(defaultDt);
  const [geminiNotes, setGeminiNotes] = useState('');
  const [otherNotes,  setOtherNotes]  = useState('');
  const [error,       setError]       = useState('');

  function handleSave() {
    if (!geminiOn && !otherOn) {
      setError('Please enable at least one credit type.');
      return;
    }
    if (geminiOn && !geminiReset) {
      setError('Please set a reset date/time for Gemini.');
      return;
    }
    if (otherOn && !otherReset) {
      setError('Please set a reset date/time for Other / AGY.');
      return;
    }

    const finishedAt = new Date().toISOString();
    const saves = [];

    if (geminiOn) {
      saves.push({
        emailId: email.id,
        creditType: 'gemini',
        finishedAt,
        resetAt: new Date(geminiReset).toISOString(),
        notes: geminiNotes,
      });
    }
    if (otherOn) {
      saves.push({
        emailId: email.id,
        creditType: 'other',
        finishedAt,
        resetAt: new Date(otherReset).toISOString(),
        notes: otherNotes,
      });
    }

    onSave(saves);
  }

  return (
    <Modal title={`Mark Finished — ${email.email}`} onClose={onClose}>
      <div className="flex flex-col gap-4">

        {/* Email display */}
        <div className="text-sm text-gray-300 bg-gray-800/50 rounded-lg px-3 py-2 border border-gray-700 flex items-center gap-2">
          <span className="text-gray-500">📧</span>
          <span className="font-medium text-white break-all">{email.email}</span>
          {email.displayName && <span className="text-gray-500 shrink-0">({email.displayName})</span>}
        </div>

        <p className="text-xs text-gray-500">
          Toggle each credit type on/off, set the reset date &amp; time, then save.
        </p>

        {/* Gemini section */}
        <CreditSection
          label="💎 Gemini"
          color="purple"
          enabled={geminiOn}
          onToggle={() => setGeminiOn(v => !v)}
          value={geminiReset}
          onChange={setGeminiReset}
          notes={geminiNotes}
          onNotes={setGeminiNotes}
        />

        {/* Other / AGY section */}
        <CreditSection
          label="⚡ Other / AGY"
          color="sky"
          enabled={otherOn}
          onToggle={() => setOtherOn(v => !v)}
          value={otherReset}
          onChange={setOtherReset}
          notes={otherNotes}
          onNotes={setOtherNotes}
        />

        {error && (
          <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
            ⚠️ {error}
          </p>
        )}

        <div className="flex justify-end gap-2 pt-1">
          <Btn variant="ghost" onClick={onClose}>Cancel</Btn>
          <Btn variant="warning" onClick={handleSave}>💾 Save Reset(s)</Btn>
        </div>
      </div>
    </Modal>
  );
}
