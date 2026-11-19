import React from 'react';

const StatCard = ({ title, value, icon: Icon, color, subtitle, onClick, isActive }) => {
  const colorMap = {
    indigo: {
      bg: 'bg-indigo-50',
      text: 'text-indigo-600',
      border: 'border-indigo-100 hover:border-indigo-300',
      activeRing: 'ring-2 ring-indigo-500 border-indigo-500',
    },
    amber: {
      bg: 'bg-amber-50',
      text: 'text-amber-600',
      border: 'border-amber-100 hover:border-amber-300',
      activeRing: 'ring-2 ring-amber-500 border-amber-500',
    },
    blue: {
      bg: 'bg-sky-50',
      text: 'text-sky-600',
      border: 'border-sky-100 hover:border-sky-300',
      activeRing: 'ring-2 ring-sky-500 border-sky-500',
    },
    emerald: {
      bg: 'bg-emerald-50',
      text: 'text-emerald-600',
      border: 'border-emerald-100 hover:border-emerald-300',
      activeRing: 'ring-2 ring-emerald-500 border-emerald-500',
    },
    rose: {
      bg: 'bg-rose-50',
      text: 'text-rose-600',
      border: 'border-rose-100 hover:border-rose-300',
      activeRing: 'ring-2 ring-rose-500 border-rose-500',
    },
  };

  const scheme = colorMap[color] || colorMap.indigo;

  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-2xl p-5 border shadow-xs transition-all duration-200 ${
        onClick ? 'cursor-pointer hover:shadow-md' : ''
      } ${isActive ? scheme.activeRing : scheme.border}`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            {title}
          </p>
          <h3 className="text-3xl font-extrabold text-slate-900 mt-1 tracking-tight">
            {value}
          </h3>
        </div>
        <div className={`p-3 rounded-2xl ${scheme.bg} ${scheme.text}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>

      {subtitle && (
        <p className="mt-3 text-xs text-slate-500 font-medium">
          {subtitle}
        </p>
      )}
    </div>
  );
};

export default StatCard;

