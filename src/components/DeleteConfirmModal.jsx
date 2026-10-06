import React from 'react';
import { Modal, Btn } from './ui.jsx';

export default function DeleteConfirmModal({ email, onConfirm, onClose }) {
  return (
    <Modal title="Delete Email" onClose={onClose}>
      <div className="flex flex-col gap-4">
        <p className="text-gray-300">
          Are you sure you want to delete{' '}
          <span className="font-semibold text-white">{email.email}</span>?
          {email.displayName && ` (${email.displayName})`}
        </p>
        <p className="text-sm text-gray-500">
          This will permanently remove the account and all its tracking data. History entries will be kept.
        </p>
        <div className="flex justify-end gap-2 pt-1">
          <Btn variant="ghost" onClick={onClose}>Cancel</Btn>
          <Btn variant="danger" onClick={onConfirm}>🗑️ Delete</Btn>
        </div>
      </div>
    </Modal>
  );
}
