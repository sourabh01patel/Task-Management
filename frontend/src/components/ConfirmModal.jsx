import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

const ConfirmModal = ({ isOpen, title, message, confirmText = 'Delete', onConfirm, onCancel, isDanger = true }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-100 overflow-hidden transform transition-all">
        <div className="p-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-xl ${isDanger ? 'bg-rose-100 text-rose-600' : 'bg-indigo-100 text-indigo-600'}`}>
                <AlertTriangle className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900">{title || 'Confirm Action'}</h3>
            </div>
            <button
              onClick={onCancel}
              className="text-slate-400 hover:text-slate-600 p-1 rounded-lg transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <p className="mt-4 text-sm text-slate-600 leading-relaxed">
            {message || 'Are you sure you want to proceed with this action? This operation cannot be undone.'}
          </p>

          <div className="mt-6 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={onConfirm}
              className={`px-4 py-2 text-sm font-medium text-white rounded-xl shadow-sm transition ${
                isDanger
                  ? 'bg-rose-600 hover:bg-rose-700'
                  : 'bg-indigo-600 hover:bg-indigo-700'
              }`}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
