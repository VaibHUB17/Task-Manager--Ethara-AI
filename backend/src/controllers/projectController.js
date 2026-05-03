const Project = require('../models/Project');
const User = require('../models/User');

exports.getAll = async (req, res, next) => {
  try {
    const projects = await Project.find({ $or: [{ admin: req.user._id }, { members: req.user._id }] }).populate('admin members');
    res.json(projects);
  } catch (err) { next(err); }
};

exports.create = async (req, res, next) => {
  try {
    const { name, description } = req.body;
    const project = await Project.create({ name, description, admin: req.user._id, members: [req.user._id] });
    res.status(201).json(project);
  } catch (err) { next(err); }
};

exports.getById = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id).populate('admin members');
    if (!project) return res.status(404).json({ message: 'Project not found' });
    if (!project.admin.equals(req.user._id) && !project.members.includes(req.user._id)) return res.status(403).json({ message: 'Forbidden' });
    res.json(project);
  } catch (err) { next(err); }
};

exports.update = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });
    if (!project.admin.equals(req.user._id)) return res.status(403).json({ message: 'Only admin can update' });
    project.name = req.body.name || project.name;
    project.description = req.body.description || project.description;
    // allow changing admin by id or email
    if (req.body.admin) {
      let newAdmin = null;
      if (req.body.admin.includes && req.body.admin.includes('@')) {
        newAdmin = await User.findOne({ email: req.body.admin.toLowerCase() });
      } else {
        newAdmin = await User.findById(req.body.admin);
      }
      if (!newAdmin) return res.status(404).json({ message: 'New admin user not found' });
      // ensure new admin is a member of the project
      if (!project.members.some(m => m.toString() === newAdmin._id.toString())) return res.status(400).json({ message: 'New admin must be a member of the project' });
      project.admin = newAdmin._id;
    }
    await project.save();
    res.json(project);
  } catch (err) { next(err); }
};

exports.remove = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });
    if (!project.admin.equals(req.user._id)) return res.status(403).json({ message: 'Only admin can delete' });
    await project.remove();
    res.json({ message: 'Deleted' });
  } catch (err) { next(err); }
};

exports.addMember = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });
    if (!project.admin.equals(req.user._id)) return res.status(403).json({ message: 'Only admin' });
    const input = req.body.userId;
    let user = null;
    if (!input) return res.status(400).json({ message: 'userId is required' });
    if (input.includes && input.includes('@')) {
      user = await User.findOne({ email: input.toLowerCase() });
    } else {
      user = await User.findById(input);
    }
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (!project.members.includes(user._id)) project.members.push(user._id);
    await project.save();
    const populated = await Project.findById(project._id).populate('admin members');
    res.json(populated);
  } catch (err) { next(err); }
};

exports.removeMember = async (req, res, next) => {
  try {
    const { id, userId } = req.params;
    const project = await Project.findById(id);
    if (!project) return res.status(404).json({ message: 'Project not found' });
    if (!project.admin.equals(req.user._id)) return res.status(403).json({ message: 'Only admin' });
    project.members = project.members.filter(m => m.toString() !== userId);
    await project.save();
    res.json(project);
  } catch (err) { next(err); }
};
