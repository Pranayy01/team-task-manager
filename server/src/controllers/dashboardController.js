import Task from '../models/Task.js';
import Project from '../models/Project.js';
import asyncHandler from '../utils/asyncHandler.js';

export const getDashboard = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const now = new Date();

  const projectFilter =
    req.user.role === 'admin'
      ? {}
      : {
          $or: [{ createdBy: userId }, { 'teamMembers.user': userId }],
        };

  const projects = await Project.find(projectFilter).select('_id title description createdAt');
  const projectIds = projects.map((p) => p._id);

  const taskFilter = { project: { $in: projectIds } };
  const myTaskFilter = { ...taskFilter, assignedTo: userId };

  const [totalTasks, completedTasks, pendingTasks, overdueTasks] = await Promise.all([
    Task.countDocuments(taskFilter),
    Task.countDocuments({ ...taskFilter, status: 'completed' }),
    Task.countDocuments({ ...taskFilter, status: { $in: ['todo', 'in_progress'] } }),
    Task.countDocuments({
      ...taskFilter,
      status: { $ne: 'completed' },
      dueDate: { $lt: now },
    }),
  ]);

  const statusBreakdown = await Task.aggregate([
    { $match: taskFilter },
    { $group: { _id: '$status', count: { $sum: 1 } } },
  ]);

  const priorityBreakdown = await Task.aggregate([
    { $match: taskFilter },
    { $group: { _id: '$priority', count: { $sum: 1 } } },
  ]);

  const recentTasks = await Task.find(taskFilter)
    .populate('assignedTo', 'name email')
    .populate('project', 'title')
    .sort('-createdAt')
    .limit(5);

  const myTasks = await Task.find(myTaskFilter)
    .populate('project', 'title')
    .sort('dueDate')
    .limit(10);

  const overdueTasksList = await Task.find({
    ...taskFilter,
    status: { $ne: 'completed' },
    dueDate: { $lt: now },
  })
    .populate('assignedTo', 'name email')
    .populate('project', 'title')
    .sort('dueDate')
    .limit(10);

  const projectSummaries = await Promise.all(
    projects.slice(0, 6).map(async (project) => {
      const [total, completed] = await Promise.all([
        Task.countDocuments({ project: project._id }),
        Task.countDocuments({ project: project._id, status: 'completed' }),
      ]);
      return {
        _id: project._id,
        title: project.title,
        description: project.description,
        total,
        completed,
        progress: total > 0 ? Math.round((completed / total) * 100) : 0,
      };
    })
  );

  res.json({
    success: true,
    data: {
      stats: {
        totalTasks,
        completedTasks,
        pendingTasks,
        overdueTasks,
      },
      statusBreakdown,
      priorityBreakdown,
      recentTasks,
      myTasks,
      overdueTasksList,
      projectSummaries,
    },
  });
});
