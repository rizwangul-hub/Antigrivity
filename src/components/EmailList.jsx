import React from 'react';
import { StatusBadge, CountdownDisplay, Btn, OpenAGYBtn, CopyEmailBtn } from './ui.jsx';
import { formatDateTime } from '../utils/time.js';

// ─────────────────────────────────────────────────────────────────────────────
// Single credit-type cell — unchanged logic, kept as-is
// ─────────────────────────────────────────────────────────────────────────────
function CreditCell({ slot, ms, onMarkFinished }) {
  return (
    <div className="flex flex-col gap-1 min-w-0">
      <StatusBadge status={slot?.status || 'ready'} resetAt={slot?.resetAt} />
      {slot?.status === 'waiting' && slot?.resetAt ? (
        <>
          <span className="text-xs text-gray-500 truncate">{formatDateTime(slot.resetAt)}</span>
          <CountdownDisplay ms={ms} />
        </>
      ) : (
        <span className="text-xs text-gray-600">—</span>
      )}
      <div className="mt-1">
        <Btn
          variant={slot?.status === 'waiting' ? 'ghost' : 'warning'}
          className="text-xs px-2 py-1"
          onClick={onMarkFinished}
        >
          {slot?.status === 'waiting' ? '✏️ Edit Reset' : '⏱ Mark Finished'}
        </Btn>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Email header: address + copy icon (shared between table and card)
// ─────────────────────────────────────────────────────────────────────────────
function EmailHeader({ email, isNext }) {
  return (
    <div className="flex flex-col gap-0.5 min-w-0">
      {isNext && (
        <span className="text-xs font-bold text-orange-400 uppercase tracking-wider">
          🔥 Next Available
        </span>
      )}
      {/* Email row with inline copy button */}
      <div className="flex items-center gap-1.5 flex-wrap">
        <span className="font-semibold text-white text-sm break-all">{email.email}</span>
        <CopyEmailBtn email={email.email} className="shrink-0" />
      </div>
      {email.displayName && (
        <span className="text-xs text-gray-400">{email.displayName}</span>
      )}
      {email.notes && (
        <span className="text-xs text-gray-600 italic">{email.notes}</span>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Desktop table row
// ─────────────────────────────────────────────────────────────────────────────
function EmailTableRow({ email, countdowns, isNext, onMarkFinished, onEdit, onDelete }) {
  const gMs = countdowns[`${email.id}-gemini`];
  const oMs = countdowns[`${email.id}-other`];

  return (
    <tr className={`border-b border-gray-800 transition-colors ${isNext ? 'bg-orange-500/5' : 'hover:bg-gray-800/40'}`}>
      {/* Email */}
      <td className="px-4 py-3 max-w-[240px]">
        <EmailHeader email={email} isNext={isNext} />
      </td>

      {/* Gemini */}
      <td className="px-4 py-3">
        <CreditCell
          slot={email.gemini}
          ms={gMs}
          onMarkFinished={() => onMarkFinished(email, 'gemini')}
        />
      </td>

      {/* Other */}
      <td className="px-4 py-3">
        <CreditCell
          slot={email.other}
          ms={oMs}
          onMarkFinished={() => onMarkFinished(email, 'other')}
        />
      </td>

      {/* Actions */}
      <td className="px-4 py-3">
        <div className="flex flex-col gap-1.5">
          <OpenAGYBtn className="text-xs px-2 py-1 text-sm" />
          <Btn variant="ghost" className="text-xs" onClick={() => onEdit(email)}>
            ✏️ Edit
          </Btn>
          <Btn variant="danger" className="text-xs" onClick={() => onDelete(email)}>
            🗑️ Delete
          </Btn>
        </div>
      </td>
    </tr>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Mobile card
// ─────────────────────────────────────────────────────────────────────────────
function EmailCard({ email, countdowns, isNext, onMarkFinished, onEdit, onDelete }) {
  const gMs = countdowns[`${email.id}-gemini`];
  const oMs = countdowns[`${email.id}-other`];

  return (
    <div className={`rounded-xl border p-4 flex flex-col gap-3 ${
      isNext ? 'border-orange-500/40 bg-orange-500/5' : 'border-gray-700/50 bg-gray-900/50'
    }`}>
      {/* Header: email + quick management actions */}
      <div className="flex items-start justify-between gap-2">
        <EmailHeader email={email} isNext={isNext} />
        <div className="flex gap-1 shrink-0 mt-0.5">
          <Btn variant="ghost" className="text-xs px-2 py-1" onClick={() => onEdit(email)} title="Edit">✏️</Btn>
          <Btn variant="danger" className="text-xs px-2 py-1" onClick={() => onDelete(email)} title="Delete">🗑️</Btn>
        </div>
      </div>

      {/* Credits grid */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-gray-800/50 rounded-lg p-3 flex flex-col gap-2">
          <p className="text-xs font-bold text-purple-400 uppercase tracking-wider">Gemini</p>
          <CreditCell slot={email.gemini} ms={gMs} onMarkFinished={() => onMarkFinished(email, 'gemini')} />
        </div>
        <div className="bg-gray-800/50 rounded-lg p-3 flex flex-col gap-2">
          <p className="text-xs font-bold text-sky-400 uppercase tracking-wider">Other / AGY</p>
          <CreditCell slot={email.other} ms={oMs} onMarkFinished={() => onMarkFinished(email, 'other')} />
        </div>
      </div>

      {/* Primary actions row */}
      <div className="flex flex-wrap gap-2 pt-1 border-t border-gray-700/40">
        <OpenAGYBtn className="flex-1 justify-center text-xs" />
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main EmailList
// ─────────────────────────────────────────────────────────────────────────────
export default function EmailList({ emails, countdowns, onMarkFinished, onEdit, onDelete }) {
  if (emails.length === 0) {
    return (
      <div className="text-center py-16 text-gray-500">
        <p className="text-4xl mb-3">📭</p>
        <p className="font-medium">No emails found</p>
        <p className="text-sm mt-1">Try adjusting your search/filter, or add a new email.</p>
      </div>
    );
  }

  return (
    <>
      {/* Desktop Table — hidden on mobile */}
      <div className="hidden lg:block overflow-x-auto rounded-xl border border-gray-700/50">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-700 bg-gray-800/50">
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Email</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-purple-400 uppercase tracking-wider">Gemini</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-sky-400 uppercase tracking-wider">Other / AGY</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody>
            {emails.map((email, idx) => (
              <EmailTableRow
                key={email.id}
                email={email}
                countdowns={countdowns}
                isNext={idx === 0}
                onMarkFinished={onMarkFinished}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards — shown on small screens */}
      <div className="lg:hidden flex flex-col gap-3">
        {emails.map((email, idx) => (
          <EmailCard
            key={email.id}
            email={email}
            countdowns={countdowns}
            isNext={idx === 0}
            onMarkFinished={onMarkFinished}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>
    </>
  );
}
