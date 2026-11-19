import React from 'react';
import { useTasks } from '../context/TaskContext';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';

const Toast = () => {
  const { toast } = useTasks();

  if (!toast) return null;

  const isSuccess = toast.type === 'success';

  return (
    <div className="fixed bottom-5 right-5 z-50 max-w-sm animate-bounce-in shadow-xl rounded-xl overflow-hidden border">
      <div
        className={`flex items-center gap-3 p-4 ${
          isSuccess
            ? 'bg-emerald-900/90 text-white border-emerald-700'
            : 'bg-rose-900/90 text-white border-rose-700'
        } backdrop-blur-md`}
      >
        {isSuccess ? (
          <CheckCircle2 className="w-5 h-5 text-emerald-300 flex-shrink-0" />
        ) : (
          <AlertCircle className="w-5 h-5 text-rose-300 flex-shrink-0" />
        )}
        <p className="text-sm font-medium">{toast.message}</p>
      </div>
    </div>
  );
};

export default Toast;

