const Joi = require('joi');

const passwordPattern = new RegExp('(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).{8,}');

exports.signupSchema = Joi.object({
  name: Joi.string().min(2).required(),
  email: Joi.string().email().required(),
  password: Joi.string().pattern(passwordPattern).required(),
  role: Joi.string().valid('admin','member').optional()
});

exports.loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

exports.projectSchema = Joi.object({
  name: Joi.string().min(3).max(100).required(),
  description: Joi.string().max(500).allow('', null)
});

exports.taskSchema = Joi.object({
  title: Joi.string().min(3).max(200).required(),
  description: Joi.string().max(1000).allow('', null),
  project: Joi.string().required(),
  assignedTo: Joi.string().optional(),
  dueDate: Joi.date().greater('now').optional(),
  priority: Joi.string().valid('low','medium','high','urgent').optional()
});
