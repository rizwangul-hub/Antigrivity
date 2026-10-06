import React, { useState, useEffect, useRef, useCallback } from 'react';
import { loadEmails, saveEmails, loadHistory, saveHistory, addHistoryEntry } from './utils/storage.js';
import { sortEmails, genId, msRemaining } from './utils/time.js';
import { SAMPLE_EMAILS } from './utils/sampleData.js';
import { useCountdowns } from './hooks/useCountdowns.js';

import NextResetBanner from './components/NextResetBanner.jsx';
import SummaryCards from './components/SummaryCards.jsx';
import Toolbar from './components/Toolbar.jsx';
import EmailList from './components/EmailList.jsx';
import HistoryPanel from './components/HistoryPanel.jsx';
import MarkFinishedModal from './components/MarkFinishedModal.jsx';
import EmailFormModal from './components/EmailFormModal.jsx';
import DeleteConfirmModal from './components/DeleteConfirmModal.jsx';

// ─────────────────────────────────────────────────────────────────────────────
// App
// ─────────────────────────────────────────────────────────────────────────────
export default function App() {
  // ── State ──────────────────────────────────────────────────────────────────
  const [emails, setEmails] = useState(() => {
    const stored = loadEmails();
    return stored ?? SAMPLE_EMAILS;
  });
  const [history, setHistory] = useState(() => loadHistory());
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [sort, setSort] = useState('soonest');
  const [showHistory, setShowHistory] = useState(false);
  const [notifPermission, setNotifPermission] = useState(
    'Notification' in window ? Notification.permission : 'denied'
  );

  // ── Modals ─────────────────────────────────────────────────────────────────
  const [finishedModal, setFinishedModal] = useState(null); // { email, creditType }
  const [editModal, setEditModal] = useState(null);         // email object or null (null = add)
  const [deleteModal, setDeleteModal] = useState(null);     // email object

  // ── Live countdowns ────────────────────────────────────────────────────────
  const countdowns = useCountdowns(emails);

  // ── Notification: fire when a countdown hits 0 ────────────────────────────
  const prevCountdowns = useRef({});
  useEffect(() => {
    if (!('Notification' in window) || Notification.permission !== 'granted') {
      prevCountdowns.current = { ...countdowns };
      return;
    }
    for (const [key, cur] of Object.entries(countdowns)) {
      const prev = prevCountdowns.current[key];
      if (prev !== undefined && prev > 0 && cur === 0) {
        const [emailId, type] = key.split('-');
        const em = emails.find(e => e.id === emailId);
        if (em) {
          const label = type === 'gemini' ? 'Gemini' : 'Other / AGY';
          new Notification('AI Credit Ready 🎉', {
            body: `${em.email} — ${label} credit is now ready!`,
          });
        }
      }
    }
    prevCountdowns.current = { ...countdowns };
  });

  // ── Auto-update status to "ready" when countdown hits 0 ───────────────────
  useEffect(() => {
    let changed = false;
    const updated = emails.map(em => {
      const newEm = { ...em };
      for (const type of ['gemini', 'other']) {
        const slot = em[type];
        if (slot?.status === 'waiting' && slot?.resetAt) {
          const ms = msRemaining(slot.resetAt);
          if (ms === 0) {
            newEm[type] = { ...slot, status: 'ready' };
            changed = true;
          }
        }
      }
      return newEm;
    });
    if (changed) {
      setEmails(updated);
      saveEmails(updated);
    }
  });

  // ── Persist emails ─────────────────────────────────────────────────────────
  useEffect(() => saveEmails(emails), [emails]);

  // ─────────────────────────────────────────────────────────────────────────
  // Derived / filtered / sorted list
  // ─────────────────────────────────────────────────────────────────────────
  const filteredEmails = React.useMemo(() => {
    let list = emails;

    // Search
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(em =>
        em.email.toLowerCase().includes(q) ||
        em.displayName?.toLowerCase().includes(q)
      );
    }

    // Filter
    switch (filter) {
      case 'ready':
        list = list.filter(em => em.gemini?.status !== 'waiting' || em.other?.status !== 'waiting');
        break;
      case 'waiting':
        list = list.filter(em => em.gemini?.status === 'waiting' || em.other?.status === 'waiting');
        break;
      case 'gemini':
        list = list.filter(em => em.gemini?.status === 'waiting');
        break;
      case 'other':
        list = list.filter(em => em.other?.status === 'waiting');
        break;
      default:
        break;
    }

    return sortEmails(list, sort);
  }, [emails, search, filter, sort]);

  // ─────────────────────────────────────────────────────────────────────────
  // Handlers
  // ─────────────────────────────────────────────────────────────────────────

  function handleMarkFinishedOpen(email, creditType) {
    setFinishedModal({ email, creditType });
  }

  function handleMarkFinishedSave(saves) {
    // saves is an array: [{ emailId, creditType, finishedAt, resetAt, notes }, ...]
    let updatedEmails = emails;
    let updatedHistory = history;

    for (const { emailId, creditType, finishedAt, resetAt, notes } of saves) {
      // Update email state
      updatedEmails = updatedEmails.map(em => {
        if (em.id !== emailId) return em;
        return { ...em, [creditType]: { status: 'waiting', resetAt, notes } };
      });

      // Add history entry
      const entry = {
        email: updatedEmails.find(e => e.id === emailId)?.email || emailId,
        creditType,
        finishedAt,
        resetAt,
        notes,
      };
      updatedHistory = addHistoryEntry(updatedHistory, entry);
    }

    setEmails(updatedEmails);
    setHistory(updatedHistory);
    setFinishedModal(null);
  }

  function handleAddEmail() {
    setEditModal(null); // null = add mode
  }

  function handleEditEmail(email) {
    setEditModal(email);
  }

  function handleEmailFormSave(emailData) {
    if (editModal) {
      // Edit
      setEmails(prev => prev.map(em => em.id === emailData.id ? emailData : em));
    } else {
      // Add
      setEmails(prev => [...prev, emailData]);
    }
    setEditModal(undefined); // undefined = closed
  }

  function handleDeleteOpen(email) {
    setDeleteModal(email);
  }

  function handleDeleteConfirm() {
    setEmails(prev => prev.filter(em => em.id !== deleteModal.id));
    setDeleteModal(null);
  }

  async function requestNotif() {
    if ('Notification' in window) {
      const perm = await Notification.requestPermission();
      setNotifPermission(perm);
    }
  }

  function clearHistory() {
    setHistory([]);
    saveHistory([]);
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Render
  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-950">
      {/* ── Header ───────────────────────────────────────────────────────── */}
      <header className="bg-gray-900/80 backdrop-blur-sm border-b border-gray-800 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-2xl">⚡</span>
            <div className="min-w-0">
              <h1 className="text-base sm:text-lg font-bold text-white leading-tight truncate">
                AI Credit Reset Tracker
              </h1>
              <p className="text-xs text-gray-500 hidden sm:block">Personal credit refresh dashboard</p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setShowHistory(h => !h)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                showHistory
                  ? 'bg-sky-600/20 border-sky-500/40 text-sky-300'
                  : 'bg-gray-800 border-gray-700 text-gray-400 hover:border-sky-600'
              }`}
            >
              📜 History
            </button>
          </div>
        </div>
      </header>

      {/* ── Main ─────────────────────────────────────────────────────────── */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 flex flex-col gap-6">

        {/* Next Reset Banner */}
        <NextResetBanner emails={emails} countdowns={countdowns} />

        {/* Summary Cards */}
        <SummaryCards emails={emails} countdowns={countdowns} />

        {/* History Panel (collapsible) */}
        {showHistory && (
          <section className="bg-gray-900/60 border border-gray-700/50 rounded-2xl px-5 py-4">
            <HistoryPanel history={history} onClear={clearHistory} />
          </section>
        )}

        {/* Toolbar */}
        <Toolbar
          search={search}
          onSearch={setSearch}
          filter={filter}
          onFilter={setFilter}
          sort={sort}
          onSort={setSort}
          onAdd={handleAddEmail}
          notifPermission={notifPermission}
          onRequestNotif={requestNotif}
        />

        {/* Result count */}
        <div className="flex items-center justify-between -mt-2">
          <p className="text-xs text-gray-500">
            Showing <span className="text-gray-300 font-medium">{filteredEmails.length}</span> of{' '}
            <span className="text-gray-300 font-medium">{emails.length}</span> emails
          </p>
          {(search || filter !== 'all') && (
            <button
              onClick={() => { setSearch(''); setFilter('all'); }}
              className="text-xs text-sky-500 hover:text-sky-400 transition-colors"
            >
              Clear filters ✕
            </button>
          )}
        </div>

        {/* Email List */}
        <EmailList
          emails={filteredEmails}
          countdowns={countdowns}
          onMarkFinished={handleMarkFinishedOpen}
          onEdit={handleEditEmail}
          onDelete={handleDeleteOpen}
        />

        {/* Footer */}
        <footer className="text-center text-xs text-gray-700 py-4">
          AI Credit Reset Tracker — Personal use only · Data stored locally in your browser
        </footer>
      </main>

      {/* ── Modals ───────────────────────────────────────────────────────── */}
      {finishedModal && (
        <MarkFinishedModal
          email={finishedModal.email}
          creditType={finishedModal.creditType}
          onSave={handleMarkFinishedSave}
          onClose={() => setFinishedModal(null)}
        />
      )}

      {/* editModal: undefined = closed, null = add mode, object = edit mode */}
      {editModal !== undefined && (
        <EmailFormModal
          existingEmail={editModal}
          onSave={handleEmailFormSave}
          onClose={() => setEditModal(undefined)}
        />
      )}

      {deleteModal && (
        <DeleteConfirmModal
          email={deleteModal}
          onConfirm={handleDeleteConfirm}
          onClose={() => setDeleteModal(null)}
        />
      )}
    </div>
  );
}
