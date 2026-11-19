import React from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar,
  AlertCircle,
  Clock,
  Edit2,
  Trash2,
  CheckCircle2,
  X,
  Tag,
  AlignLeft,
  TrendingUp,
} from 'lucide-react';
import { formatDate, isTaskOverdue, isTaskDueSoon } from '../utils/formatters';
import { STATUS_COLORS, PRIORITY_COLORS, TASK_STATUSES } from '../utils/constants';

const TaskDetailModal = ({ task, isOpen, onClose, onStatusChange, onDeleteClick, onOpenProgress }) => {
  if (!isOpen || !task) return null;

  const isOverdue = isTaskOverdue(task.dueDate, task.status);
  const isDueSoon = isTaskDueSoon(task.dueDate, task.status);
  const progress = task.progressPercentage || 0;
  const logCount = task.dailyLogs?.length || 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-100 overflow-hidden transform transition-all">
        {/* Modal Header */}
        <div className="p-6 pb-4 border-b border-slate-100 flex items-start justify-between gap-4">
          <div className="space-y-1">
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${
                PRIORITY_COLORS[task.priority]?.badge || 'bg-slate-100 text-slate-700'
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  PRIORITY_COLORS[task.priority]?.dot || 'bg-slate-400'
                }`}
              />
              {task.priority} Priority
            </span>
            <h3 className="text-xl font-bold text-slate-900 pt-2 leading-snug">
              {task.title}
            </h3>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6">
          {/* Description */}
          <div>
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 mb-2">
              <AlignLeft className="w-3.5 h-3.5" />
              Description
            </label>
            <p className="text-sm text-slate-700 bg-slate-50 p-4 rounded-2xl border border-slate-100 leading-relaxed whitespace-pre-wrap">
              {task.description || 'No description provided for this task.'}
            </p>
          </div>

          {/* Metadata Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
              <span className="text-xs text-slate-400 block mb-1">Due Date</span>
              <div
                className={`text-sm font-semibold flex items-center gap-1.5 ${
                  isOverdue
                    ? 'text-rose-600'
                    : isDueSoon
                    ? 'text-amber-600'
                    : 'text-slate-800'
                }`}
              >
                <Calendar className="w-4 h-4" />
                <span>{formatDate(task.dueDate)}</span>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
              <span className="text-xs text-slate-400 block mb-1">Status</span>
              <span
                className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                  STATUS_COLORS[task.status]?.badge
                }`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${STATUS_COLORS[task.status]?.dot}`} />
                {task.status}
              </span>
            </div>
          </div>

          {/* Day-by-Day Progress Section */}
          <div className="p-4 rounded-2xl bg-indigo-50/50 border border-indigo-100 space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="text-slate-700 flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-indigo-600" />
                Day-by-Day Progress Tracker
              </span>
              <span className="text-indigo-700 font-bold">{progress}%</span>
            </div>

            <div className="h-2.5 w-full bg-slate-200 rounded-full overflow-hidden">
              <div
                style={{ width: `${progress}%` }}
                className={`h-full rounded-full transition-all duration-500 ${
                  progress === 100
                    ? 'bg-emerald-500'
                    : progress > 50
                    ? 'bg-indigo-600'
                    : 'bg-indigo-500'
                }`}
              />
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-[11px] text-slate-500">
                {logCount} daily log{logCount === 1 ? '' : 's'} recorded
              </span>
              <button
                type="button"
                onClick={onOpenProgress}
                className="text-xs font-bold text-indigo-600 hover:text-indigo-800 hover:underline flex items-center gap-1"
              >
                <span>View / Add Logs</span>
                <span>→</span>
              </button>
            </div>
          </div>

          {/* Quick Status Toggle Buttons */}
          <div>
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
              Change Status
            </label>
            <div className="grid grid-cols-3 gap-2">
              {TASK_STATUSES.map((status) => (
                <button
                  key={status}
                  onClick={() => onStatusChange(status)}
                  className={`py-2 px-3 rounded-xl text-xs font-semibold border transition ${
                    task.status === status
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <button
            onClick={() => {
              onClose();
              onDeleteClick();
            }}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 px-3 py-2 rounded-xl transition"
          >
            <Trash2 className="w-4 h-4" />
            <span>Delete Task</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-200 rounded-xl transition"
            >
              Close
            </button>
            <Link
              to={`/tasks/edit/${task._id}`}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl shadow-xs transition"
            >
              <Edit2 className="w-3.5 h-3.5" />
              <span>Edit Details</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskDetailModal;

