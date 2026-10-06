import React from 'react';
import { Btn, Input, Select } from './ui.jsx';

export default function Toolbar({
  search, onSearch,
  filter, onFilter,
  sort, onSort,
  onAdd,
  notifPermission, onRequestNotif,
}) {
  return (
    <div className="flex flex-col gap-3">
      {/* Row 1: Search + Add */}
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm pointer-events-none">🔍</span>
          <Input
            className="pl-8"
            placeholder="Search email..."
            value={search}
            onChange={e => onSearch(e.target.value)}
          />
        </div>
        <Btn variant="primary" onClick={onAdd}>
          ➕ Add Email
        </Btn>
        {notifPermission === 'default' && (
          <Btn variant="ghost" onClick={onRequestNotif} title="Enable browser notifications">
            🔔 Enable Notifications
          </Btn>
        )}
      </div>

      {/* Row 2: Filters + Sort */}
      <div className="flex flex-wrap gap-2 items-center">
        {/* Filter chips */}
        {['all', 'ready', 'waiting', 'gemini', 'other'].map(f => (
          <button
            key={f}
            onClick={() => onFilter(f)}
            className={`px-3 py-1 rounded-full text-xs font-semibold border transition-all capitalize ${
              filter === f
                ? 'bg-sky-600 border-sky-500 text-white'
                : 'bg-gray-800 border-gray-700 text-gray-400 hover:border-sky-600 hover:text-sky-300'
            }`}
          >
            {f === 'all' ? 'All' :
             f === 'ready' ? '🟢 Ready' :
             f === 'waiting' ? '🟡 Waiting' :
             f === 'gemini' ? '💎 Gemini' :
             '⚡ Other'}
          </button>
        ))}

        {/* Separator */}
        <span className="text-gray-700 hidden sm:inline">|</span>

        {/* Sort select */}
        <div className="flex items-center gap-2 ml-auto">
          <span className="text-xs text-gray-500">Sort:</span>
          <Select
            className="!w-auto text-xs py-1"
            value={sort}
            onChange={e => onSort(e.target.value)}
          >
            <option value="soonest">⏱ Soonest Reset</option>
            <option value="latest">🕰 Latest Reset</option>
            <option value="az">🔤 Email A–Z</option>
            <option value="za">🔤 Email Z–A</option>
          </Select>
        </div>
      </div>
    </div>
  );
}
