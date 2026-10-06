import React, { useState } from 'react';
import { Modal, FormField, Input, Select, Textarea, Btn } from './ui.jsx';

/**
 * Modal for marking a credit type as finished and entering reset date/time.
 */
export default function MarkFinishedModal({ email, creditType: initialType, onSave, onClose }) {
  const [creditType, setCreditType] = useState(initialType || 'gemini');
  const [finishedDate, setFinishedDate] = useState(
    new Date().toISOString().slice(0, 16)
  );
  const [resetDate, setResetDate] = useState('');
  const [resetTime, setResetTime] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  function handleSave() {
    if (!resetDate || !resetTime) {
      setError('Please enter both reset date and time.');
      return;
    }
    const resetAtIso = new Date(`${resetDate}T${resetTime}`).toISOString();
    if (isNaN(new Date(resetAtIso).getTime())) {
      setError('Invalid date/time. Please check your input.');
      return;
    }
    onSave({
      emailId: email.id,
      creditType,
      finishedAt: new Date(finishedDate).toISOString(),
      resetAt: resetAtIso,
      notes,
    });
  }

  return (
    <Modal title={`Mark Finished — ${email.email}`} onClose={onClose}>
      <div className="flex flex-col gap-4">

        <FormField label="Email">
          <div className="text-sm text-gray-300 bg-gray-800/50 rounded-lg px-3 py-2 border border-gray-700">
            {email.email}
            {email.displayName && <span className="ml-2 text-gray-500">({email.displayName})</span>}
          </div>
        </FormField>

        <FormField label="Credit Type">
          <Select value={creditType} onChange={e => setCreditType(e.target.value)}>
            <option value="gemini">Gemini</option>
            <option value="other">Other / AGY</option>
          </Select>
        </FormField>

        <FormField label="Finished Date & Time">
          <Input
            type="datetime-local"
            value={finishedDate}
            onChange={e => setFinishedDate(e.target.value)}
          />
        </FormField>

        <div className="grid grid-cols-2 gap-3">
          <FormField label="Reset Date">
            <Input
              type="date"
              value={resetDate}
              onChange={e => setResetDate(e.target.value)}
            />
          </FormField>
          <FormField label="Reset Time">
            <Input
              type="time"
              value={resetTime}
              onChange={e => setResetTime(e.target.value)}
            />
          </FormField>
        </div>

        <FormField label="Notes (optional)">
          <Textarea
            rows={2}
            placeholder="Any notes about this reset..."
            value={notes}
            onChange={e => setNotes(e.target.value)}
          />
        </FormField>

        {error && (
          <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
            ⚠️ {error}
          </p>
        )}

        <div className="flex justify-end gap-2 pt-1">
          <Btn variant="ghost" onClick={onClose}>Cancel</Btn>
          <Btn variant="warning" onClick={handleSave}>💾 Save Reset</Btn>
        </div>
      </div>
    </Modal>
  );
}
