import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTasks } from '../context/TaskContext';
import { useAuth } from '../context/AuthContext';
import StatCard from '../components/StatCard';
import TaskCard from '../components/TaskCard';
import {
  CheckSquare,
  Clock,
  PlayCircle,
  CheckCircle2,
  AlertCircle,
  Plus,
  ArrowRight,
  TrendingUp,
  BarChart2,
  PieChart,
} from 'lucide-react';

const DashboardPage = () => {
  const { user } = useAuth();
  const { stats, fetchStats, statsLoading } = useTasks();
  const navigate = useNavigate();

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const metrics = stats?.stats || {
    totalTasks: 0,
    pendingTasks: 0,
    inProgressTasks: 0,
    completedTasks: 0,
    overdueTasks: 0,
    completionRate: 0,
    statusStats: { toDo: 0, inProgress: 0, done: 0 },
    priorityStats: { Low: 0, Medium: 0, High: 0 },
  };

  const recentTasks = stats?.recentTasks || [];
  const upcomingTasks = stats?.upcomingTasks || [];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-indigo-700 via-indigo-600 to-violet-600 rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-indigo-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <span className="px-3 py-1 rounded-full bg-white/20 text-xs font-semibold backdrop-blur-md uppercase tracking-wider">
            Workspace Overview
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold mt-2 tracking-tight">
            Hello, {user?.name}! ✨
          </h1>
          <p className="mt-1 text-sm sm:text-base text-indigo-100 max-w-xl">
            You have <span className="font-bold underline decoration-white/50">{metrics.pendingTasks + metrics.inProgressTasks} active tasks</span> waiting for your attention today.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/tasks/create"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-white text-indigo-700 font-bold text-sm shadow-md hover:bg-indigo-50 transition"
          >
            <Plus className="w-4 h-4" />
            <span>Create Task</span>
          </Link>
          <Link
            to="/tasks"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-indigo-800/40 text-white font-semibold text-sm hover:bg-indigo-800/60 border border-white/20 transition"
          >
            <span>View All</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* 5 Statistics Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          title="Total Tasks"
          value={metrics.totalTasks}
          icon={CheckSquare}
          color="indigo"
          subtitle="All registered tasks"
          onClick={() => navigate('/tasks')}
        />
        <StatCard
          title="To Do"
          value={metrics.pendingTasks}
          icon={Clock}
          color="amber"
          subtitle="Awaiting start"
          onClick={() => navigate('/tasks?status=To Do')}
        />
        <StatCard
          title="In Progress"
          value={metrics.inProgressTasks}
          icon={PlayCircle}
          color="blue"
          subtitle="Actively working"
          onClick={() => navigate('/tasks?status=In Progress')}
        />
        <StatCard
          title="Completed"
          value={metrics.completedTasks}
          icon={CheckCircle2}
          color="emerald"
          subtitle={`${metrics.completionRate}% completion rate`}
          onClick={() => navigate('/tasks?status=Done')}
        />
        <StatCard
          title="Overdue"
          value={metrics.overdueTasks}
          icon={AlertCircle}
          color="rose"
          subtitle="Needs immediate action"
          onClick={() => navigate('/tasks?overdue=true')}
        />
      </div>

      {/* Charts & Visual Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Status Distribution Progress Visual */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
                <BarChart2 className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900">Task Status Breakdown</h3>
            </div>
            <span className="text-xs font-semibold text-slate-500">
              {metrics.totalTasks} Total
            </span>
          </div>

          <div className="mt-6 space-y-4">
            {/* Progress Bar */}
            <div className="h-4 w-full bg-slate-100 rounded-full overflow-hidden flex shadow-inner">
              <div
                style={{
                  width: `${
                    metrics.totalTasks > 0
                      ? (metrics.statusStats.toDo / metrics.totalTasks) * 100
                      : 0
                  }%`,
                }}
                className="bg-amber-400 transition-all duration-500"
                title={`To Do: ${metrics.statusStats.toDo}`}
              />
              <div
                style={{
                  width: `${
                    metrics.totalTasks > 0
                      ? (metrics.statusStats.inProgress / metrics.totalTasks) * 100
                      : 0
                  }%`,
                }}
                className="bg-indigo-500 transition-all duration-500"
                title={`In Progress: ${metrics.statusStats.inProgress}`}
              />
              <div
                style={{
                  width: `${
                    metrics.totalTasks > 0
                      ? (metrics.statusStats.done / metrics.totalTasks) * 100
                      : 0
                  }%`,
                }}
                className="bg-emerald-500 transition-all duration-500"
                title={`Done: ${metrics.statusStats.done}`}
              />
            </div>

            {/* Legend & Count Details */}
            <div className="grid grid-cols-3 gap-2 pt-2">
              <div className="p-3 rounded-2xl bg-amber-50/50 border border-amber-100 text-center">
                <span className="block text-xs font-medium text-amber-700">To Do</span>
                <span className="text-lg font-extrabold text-amber-800">
                  {metrics.statusStats.toDo}
                </span>
              </div>
              <div className="p-3 rounded-2xl bg-indigo-50/50 border border-indigo-100 text-center">
                <span className="block text-xs font-medium text-indigo-700">In Progress</span>
                <span className="text-lg font-extrabold text-indigo-800">
                  {metrics.statusStats.inProgress}
                </span>
              </div>
              <div className="p-3 rounded-2xl bg-emerald-50/50 border border-emerald-100 text-center">
                <span className="block text-xs font-medium text-emerald-700">Done</span>
                <span className="text-lg font-extrabold text-emerald-800">
                  {metrics.statusStats.done}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Priority Breakdown Visual */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-violet-50 text-violet-600 rounded-xl">
                <PieChart className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900">Priority Distribution</h3>
            </div>
            <span className="text-xs font-semibold text-slate-500">
              Severity Levels
            </span>
          </div>

          <div className="mt-6 space-y-4">
            {/* Priority Bars */}
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-rose-700 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-rose-500" />
                    High Priority
                  </span>
                  <span className="text-slate-600">{metrics.priorityStats.High}</span>
                </div>
                <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div
                    style={{
                      width: `${
                        metrics.totalTasks > 0
                          ? (metrics.priorityStats.High / metrics.totalTasks) * 100
                          : 0
                      }%`,
                    }}
                    className="h-full bg-rose-500 rounded-full transition-all"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-amber-700 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-amber-500" />
                    Medium Priority
                  </span>
                  <span className="text-slate-600">{metrics.priorityStats.Medium}</span>
                </div>
                <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div
                    style={{
                      width: `${
                        metrics.totalTasks > 0
                          ? (metrics.priorityStats.Medium / metrics.totalTasks) * 100
                          : 0
                      }%`,
                    }}
                    className="h-full bg-amber-500 rounded-full transition-all"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-emerald-700 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    Low Priority
                  </span>
                  <span className="text-slate-600">{metrics.priorityStats.Low}</span>
                </div>
                <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div
                    style={{
                      width: `${
                        metrics.totalTasks > 0
                          ? (metrics.priorityStats.Low / metrics.totalTasks) * 100
                          : 0
                      }%`,
                    }}
                    className="h-full bg-emerald-500 rounded-full transition-all"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Upcoming & Recent Tasks Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Upcoming Deadlines */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Clock className="w-5 h-5 text-indigo-600" />
              Upcoming Deadlines
            </h3>
            <Link
              to="/tasks?upcoming=true"
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-800"
            >
              See all
            </Link>
          </div>

          {upcomingTasks.length === 0 ? (
            <div className="bg-white rounded-3xl p-8 border border-slate-200 text-center text-slate-500">
              <CheckCircle2 className="w-10 h-10 mx-auto text-emerald-400 mb-2" />
              <p className="text-sm font-medium">No upcoming deadlines within the next 7 days!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {upcomingTasks.map((task) => (
                <TaskCard key={task._id} task={task} />
              ))}
            </div>
          )}
        </div>

        {/* Recently Created Tasks */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-indigo-600" />
              Recent Tasks
            </h3>
            <Link
              to="/tasks"
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-800"
            >
              View all tasks
            </Link>
          </div>

          {recentTasks.length === 0 ? (
            <div className="bg-white rounded-3xl p-8 border border-slate-200 text-center text-slate-500">
              <p className="text-sm font-medium">No tasks found. Click "+ Create Task" to add your first task!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentTasks.map((task) => (
                <TaskCard key={task._id} task={task} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;

