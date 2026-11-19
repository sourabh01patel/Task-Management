import React from 'react';
import { Search, Filter, ArrowUpDown, X, AlertCircle, Clock } from 'lucide-react';
import { TASK_STATUSES, TASK_PRIORITIES } from '../utils/constants';

const TaskFilter = ({ filters, onFilterChange, onReset }) => {
  const hasActiveFilters =
    filters.search ||
    filters.status !== 'All' ||
    filters.priority !== 'All' ||
    filters.overdue ||
    filters.upcoming ||
    filters.sortBy !== 'dueDate' ||
    filters.order !== 'asc';

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs mb-6 space-y-4">
      {/* Top Row: Search & Quick Presets */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search input */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search tasks by title..."
            value={filters.search || ''}
            onChange={(e) => onFilterChange('search', e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition"
          />
          {filters.search && (
            <button
              onClick={() => onFilterChange('search', '')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Quick Deadline Toggles */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              onFilterChange('overdue', !filters.overdue);
              if (!filters.overdue) onFilterChange('upcoming', false);
            }}
            className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition ${
              filters.overdue
                ? 'bg-rose-50 text-rose-700 border-rose-300 ring-1 ring-rose-300'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
          >
            <AlertCircle className="w-3.5 h-3.5 text-rose-500" />
            <span>Overdue</span>
          </button>

          <button
            type="button"
            onClick={() => {
              onFilterChange('upcoming', !filters.upcoming);
              if (!filters.upcoming) onFilterChange('overdue', false);
            }}
            className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition ${
              filters.upcoming
                ? 'bg-amber-50 text-amber-700 border-amber-300 ring-1 ring-amber-300'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
          >
            <Clock className="w-3.5 h-3.5 text-amber-500" />
            <span>Next 7 Days</span>
          </button>
        </div>
      </div>

      {/* Bottom Row: Selectors (Status, Priority, Sort) */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 text-xs sm:text-sm">
        <div className="flex flex-wrap items-center gap-2 sm:gap-4">
          {/* Status selector */}
          <div className="flex items-center gap-1.5">
            <span className="text-slate-500 font-medium">Status:</span>
            <select
              value={filters.status || 'All'}
              onChange={(e) => onFilterChange('status', e.target.value)}
              className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
            >
              <option value="All">All Statuses</option>
              {TASK_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          {/* Priority selector */}
          <div className="flex items-center gap-1.5">
            <span className="text-slate-500 font-medium">Priority:</span>
            <select
              value={filters.priority || 'All'}
              onChange={(e) => onFilterChange('priority', e.target.value)}
              className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
            >
              <option value="All">All Priorities</option>
              {TASK_PRIORITIES.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>

          {/* Sort By selector */}
          <div className="flex items-center gap-1.5">
            <span className="text-slate-500 font-medium">Sort:</span>
            <select
              value={`${filters.sortBy || 'dueDate'}:${filters.order || 'asc'}`}
              onChange={(e) => {
                const [sortBy, order] = e.target.value.split(':');
                onFilterChange('sortBy', sortBy);
                onFilterChange('order', order);
              }}
              className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
            >
              <option value="dueDate:asc">Due Date (Earliest)</option>
              <option value="dueDate:desc">Due Date (Latest)</option>
              <option value="priority:desc">Priority (High to Low)</option>
              <option value="title:asc">Title (A - Z)</option>
              <option value="createdAt:desc">Recently Created</option>
            </select>
          </div>
        </div>

        {/* Reset button */}
        {hasActiveFilters && (
          <button
            onClick={onReset}
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition flex items-center gap-1 ml-auto"
          >
            <X className="w-3.5 h-3.5" />
            Reset Filters
          </button>
        )}
      </div>
    </div>
  );
};

export default TaskFilter;
