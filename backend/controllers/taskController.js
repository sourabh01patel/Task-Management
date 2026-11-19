const Task = require('../models/Task');

// @desc    Create a new task
// @route   POST /api/tasks
// @access  Private
const createTask = async (req, res, next) => {
  try {
    const { title, description, dueDate, priority, status } = req.body;

    if (!title || !dueDate) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both title and due date for the task',
      });
    }

    // Always enforce userId from authenticated user (never accept from req.body)
    const task = await Task.create({
      title,
      description: description || '',
      dueDate,
      priority: priority || 'Medium',
      status: status || 'To Do',
      userId: req.user._id,
    });

    res.status(201).json({
      success: true,
      message: 'Task created successfully',
      task,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all tasks for current user with filtering, search, sorting
// @route   GET /api/tasks
// @access  Private
const getTasks = async (req, res, next) => {
  try {
    const { status, priority, search, sortBy, order, overdue, upcoming } = req.query;

    // Strict user isolation: ALWAYS include userId
    const query = { userId: req.user._id };

    // Filter by Status
    if (status && status !== 'All') {
      query.status = status;
    }

    // Filter by Priority
    if (priority && priority !== 'All') {
      query.priority = priority;
    }

    // Search by Title (case-insensitive substring)
    if (search && search.trim() !== '') {
      query.title = { $regex: search.trim(), $options: 'i' };
    }

    const now = new Date();

    // Overdue tasks filter (due before now and not completed)
    if (overdue === 'true') {
      query.dueDate = { $lt: now };
      if (!status) {
        query.status = { $ne: 'Done' };
      }
    }

    // Upcoming tasks filter (due in the next 7 days and not completed)
    if (upcoming === 'true') {
      const nextWeek = new Date();
      nextWeek.setDate(now.getDate() + 7);
      query.dueDate = { $gte: now, $lte: nextWeek };
      if (!status) {
        query.status = { $ne: 'Done' };
      }
    }

    // Sorting
    let sortOptions = {};
    const sortOrder = order === 'desc' ? -1 : 1;

    if (sortBy === 'dueDate') {
      sortOptions = { dueDate: sortOrder, createdAt: -1 };
    } else if (sortBy === 'priority') {
      sortOptions = { priority: sortOrder, dueDate: 1 };
    } else if (sortBy === 'title') {
      sortOptions = { title: sortOrder };
    } else {
      // Default sort by due date ascending
      sortOptions = { dueDate: 1, createdAt: -1 };
    }

    const tasks = await Task.find(query).sort(sortOptions);

    res.status(200).json({
      success: true,
      count: tasks.length,
      tasks,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single task by ID
// @route   GET /api/tasks/:id
// @access  Private
const getTaskById = async (req, res, next) => {
  try {
    // Query directly by task ID AND user ID to guarantee strict isolation
    const task = await Task.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found or you are not authorized to view it',
      });
    }

    res.status(200).json({
      success: true,
      task,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a task
// @route   PUT /api/tasks/:id
// @access  Private
const updateTask = async (req, res, next) => {
  try {
    const { title, description, dueDate, priority, status } = req.body;

    const task = await Task.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found or you are not authorized to update it',
      });
    }

    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;
    if (dueDate !== undefined) task.dueDate = dueDate;
    if (priority !== undefined) task.priority = priority;
    if (status !== undefined) task.status = status;

    const updatedTask = await task.save();

    res.status(200).json({
      success: true,
      message: 'Task updated successfully',
      task: updatedTask,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Change task status
// @route   PATCH /api/tasks/:id/status
// @access  Private
const updateTaskStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    if (!status || !['To Do', 'In Progress', 'Done'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be To Do, In Progress, or Done',
      });
    }

    const task = await Task.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found or you are not authorized to modify it',
      });
    }

    task.status = status;
    const updatedTask = await task.save();

    res.status(200).json({
      success: true,
      message: `Task status updated to "${status}"`,
      task: updatedTask,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a task
// @route   DELETE /api/tasks/:id
// @access  Private
const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found or you are not authorized to delete it',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Task deleted successfully',
      deletedTaskId: req.params.id,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  updateTaskStatus,
  deleteTask,
};

