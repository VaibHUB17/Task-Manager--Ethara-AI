const Project = require('../models/Project');

const toStringId = (value) => value?.toString?.() || String(value);

exports.getAccessibleProjectIds = async (user) => {
  const filter = user.role === 'admin' ? { admin: user._id } : { members: user._id };
  const projects = await Project.find(filter).select('_id');
  return projects.map((project) => project._id);
};

exports.canViewTask = async (user, task) => {
  const project = await Project.findById(task.project).select('admin members');
  if (!project) return false;

  if (user.role === 'admin') {
    return toStringId(project.admin) === toStringId(user._id);
  }

  return project.members.some((memberId) => toStringId(memberId) === toStringId(user._id));
};

exports.canEditTask = async (user, task) => {
  if (user.role === 'admin') {
    return exports.canViewTask(user, task);
  }

  return toStringId(task.assignedTo) === toStringId(user._id);
};