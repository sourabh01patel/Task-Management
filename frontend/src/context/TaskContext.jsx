import React, { createContext, useContext, useState, useCallback } from 'react';
import { taskService } from '../services/taskService';
import { dashboardService } from '../services/dashboardService';

const TaskContext = createContext();

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [statsLoading, setStatsLoading] = useState(false);
  const [toast, setToast] = useState(null);

  // Toast notification helper
  const showToast = (message, type = 'success') => {
    setToast({ message, type, id: Date.now() });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  // Fetch all user tasks with optional filters
  const fetchTasks = useCallback(async (filters = {}) => {
    setLoading(true);
    try {
      const data = await taskService.getTasks(filters);
      setTasks(data.tasks || []);
      return { success: true, count: data.count };
    } catch (error) {
      const msg = error.response?.data?.message || 'Failed to load tasks.';
      showToast(msg, 'error');
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch dashboard statistics
  const fetchStats = useCallback(async () => {
    setStatsLoading(true);
    try {
      const data = await dashboardService.getStats();
      setStats(data);
      return { success: true, data };
    } catch (error) {
      console.error('Error loading dashboard stats:', error);
      return { success: false };
    } finally {
      setStatsLoading(false);
    }
  }, []);

  // Create new task
  const createTask = async (taskData) => {
    try {
      const data = await taskService.createTask(taskData);
      setTasks((prev) => [data.task, ...prev]);
      showToast('Task created successfully!', 'success');
      return { success: true, task: data.task };
    } catch (error) {
      const msg = error.response?.data?.message || 'Failed to create task.';
      showToast(msg, 'error');
      return { success: false, message: msg };
    }
  };

  // Update existing task
  const updateTask = async (id, taskData) => {
    try {
      const data = await taskService.updateTask(id, taskData);
      setTasks((prev) =>
        prev.map((t) => (t._id === id ? data.task : t))
      );
      showToast('Task updated successfully!', 'success');
      return { success: true, task: data.task };
    } catch (error) {
      const msg = error.response?.data?.message || 'Failed to update task.';
      showToast(msg, 'error');
      return { success: false, message: msg };
    }
  };

  // Quick status update with optimistic UI update
  const updateTaskStatus = async (id, newStatus) => {
    // Save previous state for rollback on error
    const previousTasks = [...tasks];

    // Optimistically update local state
    setTasks((prev) =>
      prev.map((t) => (t._id === id ? { ...t, status: newStatus } : t))
    );

    try {
      await taskService.updateStatus(id, newStatus);
      showToast(`Status updated to "${newStatus}"`, 'success');
      // Refresh stats in background if on dashboard
      fetchStats();
      return { success: true };
    } catch (error) {
      // Rollback on failure
      setTasks(previousTasks);
      const msg = error.response?.data?.message || 'Failed to update task status.';
      showToast(msg, 'error');
      return { success: false, message: msg };
    }
  };

  // Delete task
  const deleteTask = async (id) => {
    try {
      await taskService.deleteTask(id);
      setTasks((prev) => prev.filter((t) => t._id !== id));
      showToast('Task deleted successfully!', 'success');
      fetchStats();
      return { success: true };
    } catch (error) {
      const msg = error.response?.data?.message || 'Failed to delete task.';
      showToast(msg, 'error');
      return { success: false, message: msg };
    }
  };

  // Add daily progress log
  const addProgressLog = async (taskId, logData) => {
    try {
      const data = await taskService.addProgressLog(taskId, logData);
      setTasks((prev) =>
        prev.map((t) => (t._id === taskId ? data.task : t))
      );
      showToast('Daily progress recorded!', 'success');
      fetchStats();
      return { success: true, task: data.task };
    } catch (error) {
      const msg = error.response?.data?.message || 'Failed to record progress.';
      showToast(msg, 'error');
      return { success: false, message: msg };
    }
  };

  // Delete daily progress log
  const deleteProgressLog = async (taskId, logId) => {
    try {
      const data = await taskService.deleteProgressLog(taskId, logId);
      setTasks((prev) =>
        prev.map((t) => (t._id === taskId ? data.task : t))
      );
      showToast('Progress entry removed', 'success');
      fetchStats();
      return { success: true, task: data.task };
    } catch (error) {
      const msg = error.response?.data?.message || 'Failed to remove entry.';
      showToast(msg, 'error');
      return { success: false, message: msg };
    }
  };

  const value = {
    tasks,
    stats,
    loading,
    statsLoading,
    toast,
    showToast,
    fetchTasks,
    fetchStats,
    createTask,
    updateTask,
    updateTaskStatus,
    deleteTask,
    addProgressLog,
    deleteProgressLog,
  };

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
};

export const useTasks = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTasks must be used within a TaskProvider');
  }
  return context;
};

