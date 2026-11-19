import React, { useState } from 'react';
import { useTasks } from '../context/TaskContext';
import { formatDate, formatDateForInput } from '../utils/formatters';
import {
  TrendingUp,
  Calendar,
  Clock,
  Plus,
  Trash2,
  X,
  CheckCircle2,
  Loader2,
  AlertCircle,
  FileText,
} from 'lucide-react';

const TaskProgressModal = ({ task, isOpen, onClose }) => {
  const { addProgressLog, deleteProgressLog } = useTasks();

  const [date, setDate] = useState(() => formatDateForInput(new Date().toISOString()));
  const [note, setNote] = useState('');
  const [progressPercentage, setProgressPercentage] = useState(task?.progressPercentage || 0);
  const [hoursSpent, setHoursSpent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen || !task) return null;

  const logs = task.dailyLogs || [];
  const currentProgress = task.progressPercentage || 0;

  // Calculate total hours spent across all logs
  const totalHours = logs.reduce((sum, log) => sum + (Number(log.hoursSpent) || 0), 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!note.trim()) {
      setError('Please write a brief note about what you accomplished.');
      return;
    }

    setSubmitting(true);
    const result = await addProgressLog(task._id, {
      date,
      note: note.trim(),
      progressPercentage: Number(progressPercentage),
      hoursSpent: hoursSpent ? Number(hoursSpent) : 0,
    });
    setSubmitting(false);

    if (result.success) {
      setNote('');
      setHoursSpent('');
    } else {
      setError(result.message || 'Failed to record daily progress.');
    }
  };

  const handleDeleteLog = async (logId) => {
    await deleteProgressLog(task._id, logId);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-100 overflow-hidden transform transition-all">
        {/* Header */}
        <div className="p-5 sm:p-6 pb-4 border-b border-slate-100 flex items-start justify-between gap-4 bg-slate-50/50">
          <div>
            <div className="flex items-center gap-2 text-indigo-600 text-xs font-bold uppercase tracking-wider mb-1">
              <TrendingUp className="w-4 h-4" />
              <span>Day-by-Day Progress Tracker</span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 leading-snug">{task.title}</h2>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Overall Progress Bar Card */}
        <div className="px-5 sm:px-6 py-4 bg-indigo-50/40 border-b border-indigo-100/60">
          <div className="flex items-center justify-between text-xs font-semibold mb-2">
            <span className="text-slate-700">Overall Completion:</span>
            <span className="text-indigo-700 font-extrabold text-sm">{currentProgress}%</span>
          </div>

          {/* Progress Bar */}
          <div className="h-3 w-full bg-slate-200 rounded-full overflow-hidden shadow-inner">
            <div
              style={{ width: `${currentProgress}%` }}
              className={`h-full rounded-full transition-all duration-500 ${
                currentProgress === 100
                  ? 'bg-emerald-500'
                  : currentProgress > 50
                  ? 'bg-indigo-600'
                  : 'bg-indigo-500'
              }`}
            />
          </div>

          <div className="mt-2.5 flex items-center justify-between text-xs text-slate-500">
            <span>{logs.length} daily update{logs.length === 1 ? '' : 's'} recorded</span>
            {totalHours > 0 && <span>Total Time: <strong>{totalHours} hrs</strong></span>}
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          {/* Add Daily Progress Log Form */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5 mb-3">
              <Plus className="w-4 h-4 text-indigo-600" />
              <span>Record Today's Progress</span>
            </h3>

            {error && (
              <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Date */}
                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                  />
                </div>

                {/* Hours Spent (Optional) */}
                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                    Hours Spent (Optional)
                  </label>
                  <input
                    type="number"
                    step="0.25"
                    min="0"
                    max="24"
                    placeholder="e.g., 1.5"
                    value={hoursSpent}
                    onChange={(e) => setHoursSpent(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                  />
                </div>
              </div>

              {/* Progress Note */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                  What did you achieve today?
                </label>
                <textarea
                  rows={2}
                  required
                  placeholder="e.g., Finished Chapter 2, practiced Candlestick chart setups..."
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none font-medium"
                />
              </div>

              {/* Progress Percentage Slider */}
              <div>
                <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                  <span>Current Task Completion Level</span>
                  <span className="text-indigo-600 font-bold text-xs">{progressPercentage}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  value={progressPercentage}
                  onChange={(e) => setProgressPercentage(e.target.value)}
                  className="w-full accent-indigo-600 cursor-pointer"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl shadow-xs transition flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Saving Log...</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-3.5 h-3.5" />
                    <span>Save Daily Progress</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Timeline of Previous Days */}
          <div>
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-slate-400" />
              <span>Progress History ({logs.length} Day{logs.length === 1 ? '' : 's'})</span>
            </h4>

            {logs.length === 0 ? (
              <div className="text-center py-8 px-4 rounded-2xl bg-slate-50 border border-dashed border-slate-200 text-slate-400">
                <FileText className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                <p className="text-xs font-medium">No daily updates recorded yet.</p>
                <p className="text-[11px] text-slate-400 mt-1">
                  Log your first day of work above to start building your progress timeline!
                </p>
              </div>
            ) : (
              <div className="relative pl-6 space-y-6 before:content-[''] before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-indigo-100">
                {logs.map((log) => (
                  <div key={log._id} className="relative group">
                    {/* Timeline dot */}
                    <span className="absolute -left-6 top-1.5 w-4 h-4 rounded-full bg-white border-4 border-indigo-600 shadow-xs" />

                    <div className="p-4 rounded-2xl bg-slate-50 hover:bg-indigo-50/30 border border-slate-200 transition">
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <span className="text-xs font-bold text-slate-800">
                          {formatDate(log.date)}
                        </span>

                        <div className="flex items-center gap-2">
                          {log.hoursSpent > 0 && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-indigo-100/70 text-indigo-700 text-[11px] font-semibold">
                              <Clock className="w-3 h-3" />
                              {log.hoursSpent}h
                            </span>
                          )}
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-emerald-100/70 text-emerald-800 text-[11px] font-bold">
                            {log.progressPercentage}%
                          </span>
                          <button
                            type="button"
                            onClick={() => handleDeleteLog(log._id)}
                            title="Delete this entry"
                            className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-wrap">
                        {log.note}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl transition"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskProgressModal;

