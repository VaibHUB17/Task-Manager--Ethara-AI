const Task = require('../models/Task');
const Project = require('../models/Project');
const { getAccessibleProjectIds } = require('../utils/taskAccess');

exports.stats = async (req, res, next) => {
  try {
    const projectIds = await getAccessibleProjectIds(req.user);
    if (!projectIds.length) {
      return res.json({
        total: 0,
        completed: 0,
        inProgress: 0,
        inReview: 0,
        todo: 0,
        overdue: 0,
        taskProgress: { total: 0, completed: 0, percent: 0 },
        projectProgress: { total: 0, completed: 0, percent: 0 },
        assignedTaskProgress: { total: 0, completed: 0, percent: 0 },
      });
    }

    const baseFilter = { project: { $in: projectIds } };
    const [total, completed, inProgress, inReview, todo, overdue, assignedTotal, assignedCompleted, projects] = await Promise.all([
      Task.countDocuments(baseFilter),
      Task.countDocuments({ ...baseFilter, status: 'completed' }),
      Task.countDocuments({ ...baseFilter, status: 'in-progress' }),
      Task.countDocuments({ ...baseFilter, status: 'in-review' }),
      Task.countDocuments({ ...baseFilter, status: 'todo' }),
      Task.countDocuments({ ...baseFilter, dueDate: { $lt: new Date() }, status: { $ne: 'completed' } }),
      Task.countDocuments({ ...baseFilter, assignedTo: req.user._id }),
      Task.countDocuments({ ...baseFilter, assignedTo: req.user._id, status: 'completed' }),
      Project.find({ _id: { $in: projectIds } }).select('_id'),
    ]);

    const projectCompletionRows = await Task.aggregate([
      { $match: { project: { $in: projectIds } } },
      {
        $group: {
          _id: '$project',
          total: { $sum: 1 },
          completed: {
            $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] },
          },
        },
      },
    ]);

    const projectCompletionMap = new Map(
      projectCompletionRows.map((row) => [row._id.toString(), row])
    );
    const projectProgress = projectIds.length
      ? projectIds.reduce((sum, projectId) => {
        const projectRow = projectCompletionMap.get(projectId.toString());
        if (!projectRow || !projectRow.total) return sum;
        return sum + (projectRow.completed / projectRow.total);
      }, 0) / projectIds.length
      : 0;

    res.json({
      total,
      completed,
      inProgress,
      inReview,
      todo,
      overdue,
      taskProgress: {
        total,
        completed,
        percent: total ? Math.round((completed / total) * 100) : 0,
      },
      projectProgress: {
        total: projects.length,
        completed: projectIds.filter((projectId) => {
          const projectRow = projectCompletionMap.get(projectId.toString());
          return projectRow && projectRow.total && projectRow.completed === projectRow.total;
        }).length,
        percent: Math.round(projectProgress * 100),
      },
      assignedTaskProgress: {
        total: assignedTotal,
        completed: assignedCompleted,
        percent: assignedTotal ? Math.round((assignedCompleted / assignedTotal) * 100) : 0,
      },
    });
  } catch (err) { next(err); }
};

exports.recent = async (req, res, next) => {
  try {
    const projectIds = await getAccessibleProjectIds(req.user);
    if (!projectIds.length) return res.json([]);

    const tasks = await Task.find({ project: { $in: projectIds } }).sort({ updatedAt: -1 }).limit(10).populate('assignedTo project');
    res.json(tasks);
  } catch (err) { next(err); }
};
