// Format date into human-readable string (e.g., Nov 25, 2026)
export const formatDate = (dateString) => {
  if (!dateString) return 'No date';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return 'Invalid date';

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
};

// Format date for HTML date input: YYYY-MM-DD
export const formatDateForInput = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '';
  return date.toISOString().split('T')[0];
};

// Check if a task is overdue
export const isTaskOverdue = (dueDate, status) => {
  if (!dueDate || status === 'Done') return false;
  const now = new Date();
  const due = new Date(dueDate);
  // Compare end of day or exact timestamp
  return due < now;
};

// Check if task is due soon (within 3 days)
export const isTaskDueSoon = (dueDate, status) => {
  if (!dueDate || status === 'Done') return false;
  const now = new Date();
  const due = new Date(dueDate);
  const diffDays = (due - now) / (1000 * 60 * 60 * 24);
  return diffDays >= 0 && diffDays <= 3;
};

