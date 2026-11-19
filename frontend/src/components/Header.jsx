import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Menu, Plus, UserCircle, LayoutDashboard, CheckSquare } from 'lucide-react';

const Header = ({ onOpenSidebar }) => {
  const { user } = useAuth();
  const location = useLocation();

  return (
    <header className="sticky top-0 z-30 h-16 bg-white/80 backdrop-blur-md border-b border-slate-200 px-4 sm:px-6 flex items-center justify-between">
      <div className="flex items-center gap-3">
        {/* Mobile menu trigger */}
        <button
          onClick={onOpenSidebar}
          className="p-2 -ml-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 lg:hidden"
          aria-label="Open sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        <span className="text-sm font-medium text-slate-500 hidden md:inline">
          Welcome back, <span className="font-semibold text-slate-800">{user?.name}</span> 👋
        </span>

        {/* Quick navigation tabs */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
          <Link
            to="/dashboard"
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition ${
              location.pathname === '/dashboard' || location.pathname === '/'
                ? 'bg-white text-indigo-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Dashboard</span>
          </Link>
          <Link
            to="/tasks"
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition ${
              location.pathname === '/tasks'
                ? 'bg-white text-indigo-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <CheckSquare className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Tasks</span>
          </Link>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Link
          to="/tasks/create"
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm shadow-indigo-200 transition"
        >
          <Plus className="w-4 h-4" />
          <span>New Task</span>
        </Link>

        <Link
          to="/profile"
          className="p-1 rounded-xl text-slate-500 hover:text-indigo-600 hover:bg-slate-50 transition flex items-center"
          title="User Profile"
        >
          {user?.avatar ? (
            <img
              src={user.avatar}
              alt={user?.name || 'User'}
              className="w-8 h-8 rounded-full object-cover border border-slate-200 shadow-xs"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-xs">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
          )}
        </Link>
      </div>
    </header>
  );
};

export default Header;

