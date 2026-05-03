const Task = require('../models/Task');
const User = require('../models/User');
const mongoose = require('mongoose');
const Project = require('../models/Project');
const { getAccessibleProjectIds, canViewTask, canEditTask } = require('../utils/taskAccess');

exports.getAll = async (req, res, next) => {
  try {
    const filter = {};
    const accessibleProjectIds = await getAccessibleProjectIds(req.user);
    if (!accessibleProjectIds.length) return res.json([]);

    filter.project = { $in: accessibleProjectIds };
    if (req.query.project) {
      const requestedProjectId = req.query.project.toString();
      if (!accessibleProjectIds.some((projectId) => projectId.toString() === requestedProjectId)) {
        return res.json([]);
      }
      filter.project = req.query.project;
    }
    if (req.query.status) filter.status = req.query.status;
    if (req.query.assignedTo) filter.assignedTo = req.query.assignedTo;

    const tasks = await Task.find(filter).populate('assignedTo project createdBy');
    res.json(tasks);
  } catch (err) {
    next(err);
  }
};

exports.create = async (req, res, next) => {
  try {
    const { title, description, project: projectId, assignedTo, assignedToEmail, dueDate, priority } = req.body;

    if (!projectId || !mongoose.Types.ObjectId.isValid(projectId)) {
      return res.status(400).json({ message: 'Valid project id is required' });
    }

    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ message: 'Project not found' });

    if (!project.members.some((memberId) => memberId.toString() === req.user._id.toString())) {
      return res.status(403).json({ message: 'You are not a member of this project' });
    }

    let assigneeId = null;
    if (assignedToEmail) {
      const user = await User.findOne({ email: assignedToEmail.toLowerCase() });
      if (!user) return res.status(400).json({ message: 'Assignee email not found' });
      assigneeId = user._id.toString();
    } else if (assignedTo) {
      if (assignedTo.includes && assignedTo.includes('@')) {
        const user = await User.findOne({ email: assignedTo.toLowerCase() });
        if (!user) return res.status(400).json({ message: 'Assignee email not found' });
        assigneeId = user._id.toString();
      } else {
        if (!mongoose.Types.ObjectId.isValid(assignedTo)) return res.status(400).json({ message: 'Assigned user id is invalid' });
        assigneeId = assignedTo;
      }
    }

    if (assigneeId && !project.members.some((memberId) => memberId.toString() === assigneeId)) {
      return res.status(400).json({ message: 'Assignee must be a member of the project' });
    }

    if (req.user.role !== 'admin' && assigneeId && assigneeId !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Members can only assign tasks to self' });
    }

    const taskData = { title, description, project: projectId, dueDate, priority, createdBy: req.user._id };
    if (assigneeId) taskData.assignedTo = assigneeId;

    const task = await Task.create(taskData);
    const populated = await Task.findById(task._id).populate('assignedTo project createdBy');
    res.status(201).json(populated);
  } catch (err) {
    next(err);
  }
};

exports.getById = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id).populate('assignedTo project createdBy');
    if (!task) return res.status(404).json({ message: 'Task not found' });
    if (!(await canViewTask(req.user, task))) return res.status(403).json({ message: 'Forbidden' });
    res.json(task);
  } catch (err) {
    next(err);
  }
};

exports.update = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    if (req.user.role !== 'admin') {
      if (!(await canEditTask(req.user, task))) return res.status(403).json({ message: 'Members can only update their assigned tasks' });

      const allowedFields = ['status'];
      const incomingFields = Object.keys(req.body).filter((field) => req.body[field] !== undefined);
      if (!incomingFields.length || incomingFields.some((field) => !allowedFields.includes(field))) {
        return res.status(403).json({ message: 'Members can only update task status' });
      }

      task.status = req.body.status;
    } else {
      if (!(await canViewTask(req.user, task))) return res.status(403).json({ message: 'Forbidden' });

      if (req.body.assignedToEmail || (req.body.assignedTo && req.body.assignedTo.includes && req.body.assignedTo.includes('@'))) {
        const email = req.body.assignedToEmail || req.body.assignedTo;
        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) return res.status(400).json({ message: 'Assignee email not found' });

        const project = await Project.findById(task.project);
        if (!project.members.some((memberId) => memberId.toString() === user._id.toString())) {
          return res.status(400).json({ message: 'Assignee must be a member of the project' });
        }

        task.assignedTo = user._id;
      }

      if (req.body.assignedTo && !(req.body.assignedTo.includes && req.body.assignedTo.includes('@'))) {
        if (!mongoose.Types.ObjectId.isValid(req.body.assignedTo)) return res.status(400).json({ message: 'Assigned user id is invalid' });
        task.assignedTo = req.body.assignedTo;
      }

      const updatable = ['title', 'description', 'status', 'priority', 'dueDate'];
      updatable.forEach((field) => {
        if (req.body[field] !== undefined) task[field] = req.body[field];
      });
    }

    await task.save();
    const populated = await Task.findById(task._id).populate('assignedTo project createdBy');
    res.json(populated);
  } catch (err) {
    next(err);
  }
};

exports.remove = async (req, res, next) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.json({ message: 'Deleted' });
  } catch (err) {
    next(err);
  }
};

exports.updateStatus = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });
    if (!(await canEditTask(req.user, task))) return res.status(403).json({ message: 'Not allowed' });
    task.status = req.body.status;
    await task.save();
    res.json(task);
  } catch (err) {
    next(err);
  }
};
