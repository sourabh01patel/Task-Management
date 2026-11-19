import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Menu, Plus, UserCircle } from 'lucide-react';

const Header = ({ onOpenSidebar }) => {
  const { user } = useAuth();

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
        <span className="text-sm font-medium text-slate-500 hidden sm:inline">
          Welcome back, <span className="font-semibold text-slate-800">{user?.name}</span> 👋
        </span>
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
          className="p-1.5 rounded-xl text-slate-500 hover:text-indigo-600 hover:bg-slate-50 transition"
          title="User Profile"
        >
          <UserCircle className="w-6 h-6" />
        </Link>
      </div>
    </header>
  );
};

export default Header;

