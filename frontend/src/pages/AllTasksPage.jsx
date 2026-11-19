import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useTasks } from '../context/TaskContext';
import TaskFilter from '../components/TaskFilter';
import TaskCard from '../components/TaskCard';
import { Plus, CheckSquare, Loader2, RefreshCw } from 'lucide-react';

const AllTasksPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { tasks, loading, fetchTasks } = useTasks();

  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    status: searchParams.get('status') || 'All',
    priority: searchParams.get('priority') || 'All',
    sortBy: searchParams.get('sortBy') || 'dueDate',
    order: searchParams.get('order') || 'asc',
    overdue: searchParams.get('overdue') === 'true',
    upcoming: searchParams.get('upcoming') === 'true',
  });

  // Load tasks whenever filters change
  useEffect(() => {
    fetchTasks(filters);
  }, [filters, fetchTasks]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => {
      const updated = { ...prev, [key]: value };
      return updated;
    });
  };

  const handleResetFilters = () => {
    setFilters({
      search: '',
      status: 'All',
      priority: 'All',
      sortBy: 'dueDate',
      order: 'asc',
      overdue: false,
      upcoming: false,
    });
    setSearchParams({});
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <CheckSquare className="w-6 h-6 text-indigo-600" />
            All Tasks
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Browse, search, sort, and organize your tasks
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => fetchTasks(filters)}
            title="Refresh list"
            className="p-2.5 rounded-xl border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <Link
            to="/tasks/create"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm rounded-xl shadow-md shadow-indigo-200 transition"
          >
            <Plus className="w-4 h-4" />
            <span>Create Task</span>
          </Link>
        </div>
      </div>

      {/* Filter and Search Bar Component */}
      <TaskFilter
        filters={filters}
        onFilterChange={handleFilterChange}
        onReset={handleResetFilters}
      />

      {/* Task List Grid */}
      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center text-slate-400">
          <Loader2 className="w-10 h-10 animate-spin text-indigo-600 mb-3" />
          <p className="text-sm font-medium">Loading your tasks...</p>
        </div>
      ) : tasks.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 border border-slate-200 text-center max-w-md mx-auto my-8 shadow-xs">
          <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 mx-auto flex items-center justify-center mb-4">
            <CheckSquare className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-800">No tasks found</h3>
          <p className="text-sm text-slate-500 mt-1 mb-6">
            {filters.search || filters.status !== 'All' || filters.priority !== 'All'
              ? 'Try adjusting your search criteria or resetting filters.'
              : 'You have not created any tasks yet. Create your first task to get started!'}
          </p>
          {filters.search || filters.status !== 'All' || filters.priority !== 'All' ? (
            <button
              onClick={handleResetFilters}
              className="px-4 py-2 text-sm font-semibold text-indigo-600 bg-indigo-50 rounded-xl hover:bg-indigo-100 transition"
            >
              Clear Filters
            </button>
          ) : (
            <Link
              to="/tasks/create"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white text-sm font-semibold rounded-xl hover:bg-indigo-700 shadow-md shadow-indigo-200 transition"
            >
              <Plus className="w-4 h-4" />
              <span>Create Task</span>
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {tasks.map((task) => (
            <TaskCard key={task._id} task={task} />
          ))}
        </div>
      )}
    </div>
  );
};

export default AllTasksPage;
