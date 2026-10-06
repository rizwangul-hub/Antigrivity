// localStorage keys
const EMAILS_KEY = 'ai_credit_tracker_emails';
const HISTORY_KEY = 'ai_credit_tracker_history';

// ─── Email CRUD ───────────────────────────────────────────────────────────────

export function loadEmails() {
  try {
    const raw = localStorage.getItem(EMAILS_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveEmails(emails) {
  localStorage.setItem(EMAILS_KEY, JSON.stringify(emails));
}

// ─── History ─────────────────────────────────────────────────────────────────

export function loadHistory() {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveHistory(history) {
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
}

export function addHistoryEntry(history, entry) {
  // Keep last 200 entries
  const updated = [entry, ...history].slice(0, 200);
  saveHistory(updated);
  return updated;
}
