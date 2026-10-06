import { genId } from './time.js';

const now = new Date();

function resetAt(hoursFromNow) {
  return new Date(now.getTime() + hoursFromNow * 3600 * 1000).toISOString();
}

export const SAMPLE_EMAILS = [
  {
    id: genId(),
    email: 'user1@gmail.com',
    displayName: 'Primary Account',
    notes: '',
    gemini: { status: 'waiting', resetAt: resetAt(2.25), notes: '' },
    other: { status: 'ready', resetAt: null, notes: '' },
  },
  {
    id: genId(),
    email: 'user2@gmail.com',
    displayName: '',
    notes: '',
    gemini: { status: 'ready', resetAt: null, notes: '' },
    other: { status: 'waiting', resetAt: resetAt(0.5), notes: '' },
  },
  {
    id: genId(),
    email: 'user3@gmail.com',
    displayName: 'Work Email',
    notes: 'Use for work projects',
    gemini: { status: 'waiting', resetAt: resetAt(5), notes: '' },
    other: { status: 'waiting', resetAt: resetAt(3), notes: '' },
  },
  {
    id: genId(),
    email: 'user4@gmail.com',
    displayName: '',
    notes: '',
    gemini: { status: 'ready', resetAt: null, notes: '' },
    other: { status: 'ready', resetAt: null, notes: '' },
  },
  {
    id: genId(),
    email: 'user5@gmail.com',
    displayName: '',
    notes: '',
    gemini: { status: 'waiting', resetAt: resetAt(1.17), notes: '' },
    other: { status: 'ready', resetAt: null, notes: '' },
  },
  {
    id: genId(),
    email: 'user6@gmail.com',
    displayName: 'Backup 1',
    notes: '',
    gemini: { status: 'ready', resetAt: null, notes: '' },
    other: { status: 'waiting', resetAt: resetAt(8), notes: '' },
  },
  {
    id: genId(),
    email: 'user7@gmail.com',
    displayName: '',
    notes: '',
    gemini: { status: 'waiting', resetAt: resetAt(24), notes: '' },
    other: { status: 'ready', resetAt: null, notes: '' },
  },
  {
    id: genId(),
    email: 'user8@gmail.com',
    displayName: '',
    notes: '',
    gemini: { status: 'ready', resetAt: null, notes: '' },
    other: { status: 'ready', resetAt: null, notes: '' },
  },
  {
    id: genId(),
    email: 'user9@gmail.com',
    displayName: 'Dev Account',
    notes: '',
    gemini: { status: 'waiting', resetAt: resetAt(48), notes: '' },
    other: { status: 'waiting', resetAt: resetAt(36), notes: '' },
  },
  {
    id: genId(),
    email: 'user10@gmail.com',
    displayName: '',
    notes: '',
    gemini: { status: 'ready', resetAt: null, notes: '' },
    other: { status: 'waiting', resetAt: resetAt(12), notes: '' },
  },
  {
    id: genId(),
    email: 'user11@gmail.com',
    displayName: '',
    notes: '',
    gemini: { status: 'waiting', resetAt: resetAt(6), notes: '' },
    other: { status: 'ready', resetAt: null, notes: '' },
  },
  {
    id: genId(),
    email: 'user12@gmail.com',
    displayName: 'Spare',
    notes: '',
    gemini: { status: 'ready', resetAt: null, notes: '' },
    other: { status: 'ready', resetAt: null, notes: '' },
  },
];
