import Task from '../models/Task.js';
import Project from '../models/Project.js';
import asyncHandler from '../utils/asyncHandler.js';
import { isProjectAdmin, isProjectMember } from '../utils/projectHelpers.js';

const populateTask = { path: 'assignedTo createdBy project', select: 'name email title' };

const getAccessibleProjectIds = async (userId, userRole) => {
  if (userRole === 'admin') {
    const projects = await Project.find({}).select('_id');
    return projects.map((p) => p._id);
  }
  const projects = await Project.find({
    $or: [{ createdBy: userId }, { 'teamMembers.user': userId }],
  }).select('_id');
  return projects.map((p) => p._id);
};

export const createTask = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.body.project);

  if (!project) {
    res.status(404);
    throw new Error('Project not found');
  }

  if (!isProjectAdmin(project, req.user._id) && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Only project admins can create tasks');
  }

  if (req.body.assignedTo) {
    const isMember = project.teamMembers.some(
      (m) => m.user.toString() === req.body.assignedTo
    );
    if (!isMember && project.createdBy.toString() !== req.body.assignedTo) {
      res.status(400);
      throw new Error('Assignee must be a project team member');
    }
  }

  const task = await Task.create({
    ...req.body,
    createdBy: req.user._id,
  });

  await task.populate(populateTask);
  res.status(201).json({ success: true, data: task });
});

export const getTasks = asyncHandler(async (req, res) => {
  const projectIds = await getAccessibleProjectIds(req.user._id, req.user.role);

  const filter = { project: { $in: projectIds } };

  if (req.query.project) {
    if (!projectIds.some((id) => id.toString() === req.query.project)) {
      res.status(403);
      throw new Error('Not authorized for this project');
    }
    filter.project = req.query.project;
  }

  if (req.query.status) filter.status = req.query.status;
  if (req.query.priority) filter.priority = req.query.priority;
  if (req.query.assignedTo === 'me') filter.assignedTo = req.user._id;
  else if (req.query.assignedTo) filter.assignedTo = req.query.assignedTo;

  if (req.query.search) {
    filter.$or = [
      { title: { $regex: req.query.search, $options: 'i' } },
      { description: { $regex: req.query.search, $options: 'i' } },
    ];
  }

  const sort = req.query.sort || '-createdAt';
  const tasks = await Task.find(filter).populate(populateTask).sort(sort);

  res.json({ success: true, data: tasks });
});

export const getTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id).populate(populateTask);

  if (!task) {
    res.status(404);
    throw new Error('Task not found');
  }

  const project = await Project.findById(task.project);
  if (!isProjectMember(project, req.user._id) && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Not authorized');
  }

  res.json({ success: true, data: task });
});

export const updateTask = asyncHandler(async (req, res) => {
  let task = await Task.findById(req.params.id);

  if (!task) {
    res.status(404);
    throw new Error('Task not found');
  }

  const project = await Project.findById(task.project);
  const isAdmin = isProjectAdmin(project, req.user._id) || req.user.role === 'admin';
  const isAssignee =
    task.assignedTo?.toString() === req.user._id.toString();

  if (!isAdmin && !isAssignee) {
    res.status(403);
    throw new Error('Not authorized to update this task');
  }

  if (!isAdmin) {
    const allowed = ['status'];
    const keys = Object.keys(req.body);
    if (keys.some((k) => !allowed.includes(k))) {
      res.status(403);
      throw new Error('Members can only update task status');
    }
  }

  if (req.body.assignedTo && isAdmin) {
    const isMember = project.teamMembers.some(
      (m) => m.user.toString() === req.body.assignedTo
    );
    if (!isMember && project.createdBy.toString() !== req.body.assignedTo) {
      res.status(400);
      throw new Error('Assignee must be a project team member');
    }
  }

  task = await Task.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  }).populate(populateTask);

  res.json({ success: true, data: task });
});

export const deleteTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);

  if (!task) {
    res.status(404);
    throw new Error('Task not found');
  }

  const project = await Project.findById(task.project);
  if (!isProjectAdmin(project, req.user._id) && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Only project admins can delete tasks');
  }

  await task.deleteOne();
  res.json({ success: true, message: 'Task deleted' });
});
