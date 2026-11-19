export const TASK_STATUSES = ['To Do', 'In Progress', 'Done'];
export const TASK_PRIORITIES = ['Low', 'Medium', 'High'];

export const STATUS_COLORS = {
  'To Do': {
    badge: 'bg-slate-100 text-slate-700 border-slate-200',
    dot: 'bg-slate-400',
    ring: 'border-slate-300',
  },
  'In Progress': {
    badge: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    dot: 'bg-indigo-500',
    ring: 'border-indigo-300',
  },
  'Done': {
    badge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    dot: 'bg-emerald-500',
    ring: 'border-emerald-300',
  },
};

export const PRIORITY_COLORS = {
  Low: {
    badge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    dot: 'bg-emerald-500',
    border: 'border-l-emerald-500',
  },
  Medium: {
    badge: 'bg-amber-50 text-amber-700 border-amber-200',
    dot: 'bg-amber-500',
    border: 'border-l-amber-500',
  },
  High: {
    badge: 'bg-rose-50 text-rose-700 border-rose-200',
    dot: 'bg-rose-500',
    border: 'border-l-rose-500',
  },
};

