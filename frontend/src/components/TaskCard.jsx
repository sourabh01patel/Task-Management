import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTasks } from '../context/TaskContext';
import {
  Calendar,
  AlertCircle,
  Clock,
  Edit2,
  Trash2,
  CheckCircle2,
  MoreVertical,
} from 'lucide-react';
import { formatDate, isTaskOverdue, isTaskDueSoon } from '../utils/formatters';
import { STATUS_COLORS, PRIORITY_COLORS, TASK_STATUSES } from '../utils/constants';
import ConfirmModal from './ConfirmModal';
import TaskDetailModal from './TaskDetailModal';

const TaskCard = ({ task }) => {
  const { updateTaskStatus, deleteTask } = useTasks();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  const isOverdue = isTaskOverdue(task.dueDate, task.status);
  const isDueSoon = isTaskDueSoon(task.dueDate, task.status);

  const handleStatusChange = async (newStatus) => {
    setIsUpdatingStatus(true);
    await updateTaskStatus(task._id, newStatus);
    setIsUpdatingStatus(false);
  };

  const handleDeleteConfirm = async () => {
    await deleteTask(task._id);
    setShowDeleteModal(false);
  };

  return (
    <>
      <div
        className={`bg-white rounded-2xl p-5 border transition-all duration-200 hover:shadow-lg flex flex-col justify-between cursor-pointer group ${
          task.status === 'Done'
            ? 'border-slate-200 bg-slate-50/70 opacity-90'
            : isOverdue
            ? 'border-rose-300 ring-1 ring-rose-200 shadow-xs'
            : 'border-slate-200 hover:border-indigo-300'
        }`}
        onClick={() => setShowDetailModal(true)}
      >
        <div>
          {/* Header row: Priority Badge & Actions */}
          <div
            className="flex items-center justify-between gap-2 mb-3"
            onClick={(e) => e.stopPropagation()}
          >
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${
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

            <div className="flex items-center gap-1">
              <Link
                to={`/tasks/edit/${task._id}`}
                className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
                title="Edit task"
                onClick={(e) => e.stopPropagation()}
              >
                <Edit2 className="w-4 h-4" />
              </Link>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowDeleteModal(true);
                }}
                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                title="Delete task"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Title (clickable) */}
          <h4
            className={`text-base font-bold text-slate-900 leading-snug mb-1.5 group-hover:text-indigo-600 transition ${
              task.status === 'Done' ? 'line-through text-slate-400 group-hover:text-slate-500' : ''
            }`}
          >
            {task.title}
          </h4>

          {/* Description */}
          {task.description && (
            <p className="text-sm text-slate-500 line-clamp-3 mb-4 leading-relaxed">
              {task.description}
            </p>
          )}
        </div>

        {/* Footer Area: Due Date & Status dropdown */}
        <div
          className="pt-4 border-t border-slate-100 mt-4 space-y-3"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Due date info */}
          <div className="flex items-center justify-between text-xs">
            <div
              className={`inline-flex items-center gap-1.5 font-medium ${
                isOverdue
                  ? 'text-rose-600 font-semibold'
                  : isDueSoon
                  ? 'text-amber-600 font-semibold'
                  : 'text-slate-500'
              }`}
            >
              {isOverdue ? (
                <AlertCircle className="w-3.5 h-3.5" />
              ) : (
                <Calendar className="w-3.5 h-3.5" />
              )}
              <span>Due {formatDate(task.dueDate)}</span>
              {isOverdue && <span className="text-[11px] uppercase tracking-wider">(Overdue)</span>}
              {isDueSoon && <span className="text-[11px] uppercase tracking-wider">(Due Soon)</span>}
            </div>
          </div>

          {/* Status select dropdown */}
          <div className="flex items-center justify-between gap-2">
            <label className="text-xs font-medium text-slate-400">Status:</label>
            <select
              value={task.status}
              onChange={(e) => handleStatusChange(e.target.value)}
              disabled={isUpdatingStatus}
              className={`text-xs font-semibold px-2.5 py-1.5 rounded-xl border transition cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                STATUS_COLORS[task.status]?.badge || 'bg-slate-100 text-slate-700'
              }`}
            >
              {TASK_STATUSES.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Task Details Modal */}
      <TaskDetailModal
        task={task}
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        onStatusChange={handleStatusChange}
        onDeleteClick={() => setShowDeleteModal(true)}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={showDeleteModal}
        title="Delete Task"
        message={`Are you sure you want to delete "${task.title}"? This task will be permanently removed.`}
        confirmText="Yes, Delete"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setShowDeleteModal(false)}
        isDanger={true}
      />
    </>
  );
};

export default TaskCard;
