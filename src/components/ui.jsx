import React, { useState, useCallback } from 'react';
import { formatDuration, msRemaining } from '../utils/time.js';

// ─────────────────────────────────────────────────────────────────────────────
// ✏️  CONFIGURE: Antigravity URL — change this one line if the URL ever changes
// ─────────────────────────────────────────────────────────────────────────────
export const AGY_URL = 'https://antigravity.dev';

// ─────────────────────────────────────────────────────────────────────────────
// Open Antigravity button
// Opens the AGY site in a new tab. No passwords, no automation.
// ─────────────────────────────────────────────────────────────────────────────
export function OpenAGYBtn({ className = '' }) {
  return (
    <a
      href={AGY_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium
        bg-violet-600 hover:bg-violet-500 text-white transition-all ${className}`}
    >
      <span>🚀</span> Open Antigravity
    </a>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Copy Email button — copies email string to clipboard, shows "Copied!" toast
// ─────────────────────────────────────────────────────────────────────────────
export function CopyEmailBtn({ email, className = '' }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const ta = document.createElement('textarea');
      ta.value = email;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [email]);

  return (
    <button
      onClick={handleCopy}
      title={copied ? 'Copied!' : `Copy ${email}`}
      className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all
        ${copied
          ? 'bg-emerald-600/30 text-emerald-400 border border-emerald-500/40'
          : 'bg-gray-700 hover:bg-gray-600 text-gray-300 border border-gray-600/50'
        } ${className}`}
    >
      {copied ? '✅ Copied!' : '📋 Copy Email'}
    </button>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Status badge
// ─────────────────────────────────────────────────────────────────────────────
export function StatusBadge({ status, resetAt }) {
  if (status === 'ready') {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
        🟢 READY
      </span>
    );
  }

  if (status === 'waiting' && resetAt) {
    const ms = msRemaining(resetAt);
    const isUrgent = ms !== null && ms < 30 * 60 * 1000; // < 30 min
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold border ${
        isUrgent
          ? 'bg-orange-500/20 text-orange-300 border-orange-500/30'
          : 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30'
      }`}>
        🟡 Waiting
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-gray-700/50 text-gray-400 border border-gray-600/30">
      ⚪ Not Set
    </span>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Live countdown display
// ─────────────────────────────────────────────────────────────────────────────
export function CountdownDisplay({ ms }) {
  if (ms === null || ms === undefined) return <span className="text-gray-600">—</span>;

  if (ms <= 0) {
    return (
      <span className="font-bold text-emerald-400">🟢 READY</span>
    );
  }

  const isUrgent = ms < 30 * 60 * 1000;
  const isMedium = ms < 2 * 3600 * 1000;

  const colorClass = isUrgent
    ? 'text-orange-400 countdown-urgent'
    : isMedium
      ? 'text-yellow-400'
      : 'text-sky-400';

  return (
    <span className={`font-mono text-sm font-semibold ${colorClass}`}>
      {formatDuration(ms)}
    </span>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Summary stat card
// ─────────────────────────────────────────────────────────────────────────────
export function StatCard({ label, value, sub, color = 'sky', icon }) {
  const colorMap = {
    sky:     'from-sky-500/10 to-sky-600/5 border-sky-500/20 text-sky-400',
    emerald: 'from-emerald-500/10 to-emerald-600/5 border-emerald-500/20 text-emerald-400',
    yellow:  'from-yellow-500/10 to-yellow-600/5 border-yellow-500/20 text-yellow-400',
    orange:  'from-orange-500/10 to-orange-600/5 border-orange-500/20 text-orange-400',
    purple:  'from-purple-500/10 to-purple-600/5 border-purple-500/20 text-purple-400',
  };

  return (
    <div className={`bg-gradient-to-br ${colorMap[color]} border rounded-xl p-4 flex flex-col gap-1`}>
      <div className="flex items-center gap-2 text-gray-400 text-xs font-medium uppercase tracking-wider">
        {icon && <span>{icon}</span>}
        {label}
      </div>
      <div className={`text-2xl font-bold ${colorMap[color].split(' ').find(c => c.startsWith('text-'))}`}>
        {value}
      </div>
      {sub && <div className="text-xs text-gray-500 truncate">{sub}</div>}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Generic modal wrapper
// ─────────────────────────────────────────────────────────────────────────────
export function Modal({ title, onClose, children }) {
  // Close on backdrop click
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-lg shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-700">
          <h2 className="text-lg font-semibold text-white">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors text-xl leading-none"
          >
            ✕
          </button>
        </div>
        <div className="px-6 py-5 overflow-y-auto max-h-[80vh]">
          {children}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Form label + input helpers
// ─────────────────────────────────────────────────────────────────────────────
export function FormField({ label, children }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">{label}</label>
      {children}
    </div>
  );
}

export function Input({ className = '', ...props }) {
  return (
    <input
      className={`bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500
        focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500/50 transition-colors w-full ${className}`}
      {...props}
    />
  );
}

export function Select({ className = '', children, ...props }) {
  return (
    <select
      className={`bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-sm text-white
        focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500/50 transition-colors w-full ${className}`}
      {...props}
    >
      {children}
    </select>
  );
}

export function Textarea({ className = '', ...props }) {
  return (
    <textarea
      className={`bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500
        focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500/50 transition-colors w-full resize-none ${className}`}
      {...props}
    />
  );
}

export function Btn({ variant = 'primary', className = '', children, ...props }) {
  const base = 'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed';
  const variants = {
    primary:  'bg-sky-600 hover:bg-sky-500 text-white',
    success:  'bg-emerald-600 hover:bg-emerald-500 text-white',
    danger:   'bg-red-600 hover:bg-red-500 text-white',
    ghost:    'bg-gray-700 hover:bg-gray-600 text-gray-200',
    warning:  'bg-yellow-600 hover:bg-yellow-500 text-white',
    orange:   'bg-orange-600 hover:bg-orange-500 text-white',
  };
  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}
