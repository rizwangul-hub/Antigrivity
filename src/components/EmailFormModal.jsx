import React, { useState, useEffect } from 'react';
import { Modal, FormField, Input, Textarea, Btn } from './ui.jsx';
import { genId } from '../utils/time.js';

const EMPTY = {
  email: '',
  displayName: '',
  notes: '',
  gemini: { status: 'ready', resetAt: null, notes: '' },
  other: { status: 'ready', resetAt: null, notes: '' },
};

export default function EmailFormModal({ existingEmail, onSave, onClose }) {
  const isEdit = !!existingEmail;
  const [form, setForm] = useState(existingEmail ? { ...existingEmail } : { ...EMPTY, id: genId() });
  const [error, setError] = useState('');

  function setField(field, value) {
    setForm(f => ({ ...f, [field]: value }));
  }

  function handleSave() {
    if (!form.email.trim()) {
      setError('Email address is required.');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email.trim())) {
      setError('Please enter a valid email address.');
      return;
    }
    onSave({ ...form, email: form.email.trim() });
  }

  return (
    <Modal title={isEdit ? `Edit — ${existingEmail.email}` : 'Add New Email'} onClose={onClose}>
      <div className="flex flex-col gap-4">

        <FormField label="Email Address *">
          <Input
            type="email"
            placeholder="user@gmail.com"
            value={form.email}
            onChange={e => setField('email', e.target.value)}
          />
        </FormField>

        <FormField label="Display Name (optional)">
          <Input
            placeholder="e.g. Primary Account"
            value={form.displayName}
            onChange={e => setField('displayName', e.target.value)}
          />
        </FormField>

        <FormField label="Notes (optional)">
          <Textarea
            rows={2}
            placeholder="Any notes about this account..."
            value={form.notes}
            onChange={e => setField('notes', e.target.value)}
          />
        </FormField>

        {error && (
          <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
            ⚠️ {error}
          </p>
        )}

        <div className="flex justify-end gap-2 pt-1">
          <Btn variant="ghost" onClick={onClose}>Cancel</Btn>
          <Btn variant="primary" onClick={handleSave}>
            {isEdit ? '💾 Save Changes' : '➕ Add Email'}
          </Btn>
        </div>
      </div>
    </Modal>
  );
}
