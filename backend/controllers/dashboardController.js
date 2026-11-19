const Task = require('../models/Task');

// @desc    Get dashboard metrics and statistics
// @route   GET /api/dashboard/stats
// @access  Private
const getDashboardStats = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const now = new Date();

    // Run parallel aggregation queries for optimal performance
    const [
      totalTasks,
      pendingTasks,
      inProgressTasks,
      completedTasks,
      overdueTasks,
      priorityCounts,
      recentTasks,
      upcomingTasks,
    ] = await Promise.all([
      // Total count
      Task.countDocuments({ userId }),

      // Pending (To Do) count
      Task.countDocuments({ userId, status: 'To Do' }),

      // In Progress count
      Task.countDocuments({ userId, status: 'In Progress' }),

      // Completed (Done) count
      Task.countDocuments({ userId, status: 'Done' }),

      // Overdue (Due before current timestamp & not Done)
      Task.countDocuments({
        userId,
        dueDate: { $lt: now },
        status: { $ne: 'Done' },
      }),

      // Breakdown by priority
      Task.aggregate([
        { $match: { userId } },
        { $group: { _id: '$priority', count: { $sum: 1 } } },
      ]),

      // 5 most recent tasks
      Task.find({ userId })
        .sort({ createdAt: -1 })
        .limit(5),

      // Next 5 upcoming tasks
      Task.find({
        userId,
        dueDate: { $gte: now },
        status: { $ne: 'Done' },
      })
        .sort({ dueDate: 1 })
        .limit(5),
    ]);

    // Format priority stats for easy charting in frontend
    const priorityStats = {
      Low: 0,
      Medium: 0,
      High: 0,
    };

    priorityCounts.forEach((item) => {
      if (item._id && priorityStats.hasOwnProperty(item._id)) {
        priorityStats[item._id] = item.count;
      }
    });

    // Format status stats
    const statusStats = {
      toDo: pendingTasks,
      inProgress: inProgressTasks,
      done: completedTasks,
    };

    // Calculate completion rate percentage
    const completionRate =
      totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    res.status(200).json({
      success: true,
      stats: {
        totalTasks,
        pendingTasks,
        inProgressTasks,
        completedTasks,
        overdueTasks,
        completionRate,
        statusStats,
        priorityStats,
      },
      recentTasks,
      upcomingTasks,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboardStats,
};

