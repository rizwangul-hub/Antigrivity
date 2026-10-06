import React from 'react';
import { formatDateTime } from '../utils/time.js';

export default function HistoryPanel({ history, onClear }) {
  if (history.length === 0) {
    return (
      <div className="text-center py-10 text-gray-600">
        <p className="text-3xl mb-2">📜</p>
        <p>No history yet. Mark a credit as finished to start logging.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between mb-1">
        <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Recent Activity</p>
        <button
          onClick={onClear}
          className="text-xs text-gray-600 hover:text-red-400 transition-colors"
        >
          Clear history
        </button>
      </div>

      <div className="flex flex-col gap-1.5 max-h-72 overflow-y-auto pr-1">
        {history.map((h, i) => (
          <div
            key={i}
            className="flex flex-wrap items-center gap-2 bg-gray-800/40 border border-gray-700/30 rounded-lg px-3 py-2 text-sm"
          >
            <span className="font-medium text-white truncate max-w-[180px]">{h.email}</span>
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
              h.creditType === 'gemini'
                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                : 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
            }`}>
              {h.creditType === 'gemini' ? 'Gemini' : 'Other / AGY'}
            </span>
            <span className="text-gray-500 text-xs">
              Finished: <span className="text-gray-400">{formatDateTime(h.finishedAt)}</span>
            </span>
            <span className="text-gray-500 text-xs">
              Resets: <span className="text-gray-400">{formatDateTime(h.resetAt)}</span>
            </span>
            {h.notes && (
              <span className="text-gray-600 text-xs italic">— {h.notes}</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
