import Project from '../models/Project.js';
import Task from '../models/Task.js';
import User from '../models/User.js';
import asyncHandler from '../utils/asyncHandler.js';
import { isProjectAdmin, isProjectMember } from '../utils/projectHelpers.js';

export const createProject = asyncHandler(async (req, res) => {
  if (req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Only admins can create projects');
  }

  const { title, description } = req.body;

  const project = await Project.create({
    title,
    description,
    createdBy: req.user._id,
    teamMembers: [{ user: req.user._id, role: 'admin' }],
  });

  await project.populate([
    { path: 'createdBy', select: 'name email' },
    { path: 'teamMembers.user', select: 'name email role avatar' },
  ]);

  res.status(201).json({ success: true, data: project });
});

export const getProjects = asyncHandler(async (req, res) => {
  const filter =
    req.user.role === 'admin' && req.query.all === 'true'
      ? {}
      : {
          $or: [
            { createdBy: req.user._id },
            { 'teamMembers.user': req.user._id },
          ],
        };

  const projects = await Project.find(filter)
    .populate('createdBy', 'name email')
    .populate('teamMembers.user', 'name email role avatar')
    .sort('-createdAt');

  const projectsWithStats = await Promise.all(
    projects.map(async (project) => {
      const taskCount = await Task.countDocuments({ project: project._id });
      const completedCount = await Task.countDocuments({
        project: project._id,
        status: 'completed',
      });
      return {
        ...project.toObject(),
        taskCount,
        completedCount,
      };
    })
  );

  res.json({ success: true, data: projectsWithStats });
});

export const getProject = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id)
    .populate('createdBy', 'name email')
    .populate('teamMembers.user', 'name email role avatar');

  if (!project) {
    res.status(404);
    throw new Error('Project not found');
  }

  if (!isProjectMember(project, req.user._id)) {
    res.status(403);
    throw new Error('Not authorized to view this project');
  }

  const taskStats = await Task.aggregate([
    { $match: { project: project._id } },
    { $group: { _id: '$status', count: { $sum: 1 } } },
  ]);

  res.json({
    success: true,
    data: { project, taskStats },
  });
});

export const updateProject = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);

  if (!project) {
    res.status(404);
    throw new Error('Project not found');
  }

  if (!isProjectAdmin(project, req.user._id) && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Only project admins can update projects');
  }

  const { title, description } = req.body;
  if (title) project.title = title;
  if (description !== undefined) project.description = description;
  await project.save();

  await project.populate([
    { path: 'createdBy', select: 'name email' },
    { path: 'teamMembers.user', select: 'name email role avatar' },
  ]);

  res.json({ success: true, data: project });
});

export const deleteProject = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);

  if (!project) {
    res.status(404);
    throw new Error('Project not found');
  }

  if (project.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Only project owner can delete projects');
  }

  await Task.deleteMany({ project: project._id });
  await project.deleteOne();

  res.json({ success: true, message: 'Project deleted' });
});

export const addTeamMember = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);

  if (!project) {
    res.status(404);
    throw new Error('Project not found');
  }

  if (!isProjectAdmin(project, req.user._id) && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Only project admins can add members');
  }

  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    res.status(404);
    throw new Error('User not found with this email');
  }

  const alreadyMember = project.teamMembers.some(
    (m) => m.user.toString() === user._id.toString()
  );
  if (alreadyMember) {
    res.status(400);
    throw new Error('User is already a team member');
  }

  project.teamMembers.push({
    user: user._id,
    role: req.body.role || 'member',
  });
  await project.save();

  await project.populate('teamMembers.user', 'name email role avatar');

  res.json({ success: true, data: project });
});

export const removeTeamMember = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);

  if (!project) {
    res.status(404);
    throw new Error('Project not found');
  }

  if (!isProjectAdmin(project, req.user._id) && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Only project admins can remove members');
  }

  if (project.createdBy.toString() === req.params.userId) {
    res.status(400);
    throw new Error('Cannot remove project owner');
  }

  project.teamMembers = project.teamMembers.filter(
    (m) => m.user.toString() !== req.params.userId
  );
  await project.save();

  await project.populate('teamMembers.user', 'name email role avatar');

  res.json({ success: true, data: project });
});

export const updateMemberRole = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);

  if (!project) {
    res.status(404);
    throw new Error('Project not found');
  }

  if (!isProjectAdmin(project, req.user._id) && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Only project admins can update member roles');
  }

  const member = project.teamMembers.find(
    (m) => m.user.toString() === req.params.userId
  );
  if (!member) {
    res.status(404);
    throw new Error('Member not found in project');
  }

  member.role = req.body.role;
  await project.save();

  await project.populate('teamMembers.user', 'name email role avatar');

  res.json({ success: true, data: project });
});
