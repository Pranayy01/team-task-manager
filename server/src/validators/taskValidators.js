import { body, param, query } from 'express-validator';

export const createTaskValidator = [
  body('title').trim().notEmpty().withMessage('Title is required').isLength({ max: 200 }),
  body('description').optional().trim().isLength({ max: 2000 }),
  body('priority').optional().isIn(['low', 'medium', 'high']),
  body('dueDate').optional().isISO8601().withMessage('Invalid due date'),
  body('assignedTo').optional().isMongoId().withMessage('Invalid assignee ID'),
  body('project').isMongoId().withMessage('Valid project ID is required'),
  body('status').optional().isIn(['todo', 'in_progress', 'completed']),
];

export const updateTaskValidator = [
  param('id').isMongoId().withMessage('Invalid task ID'),
  body('title').optional().trim().notEmpty().isLength({ max: 200 }),
  body('description').optional().trim().isLength({ max: 2000 }),
  body('priority').optional().isIn(['low', 'medium', 'high']),
  body('dueDate').optional().isISO8601(),
  body('assignedTo').optional({ nullable: true }).isMongoId(),
  body('status').optional().isIn(['todo', 'in_progress', 'completed']),
];

export const taskIdValidator = [param('id').isMongoId().withMessage('Invalid task ID')];

export const taskQueryValidator = [
  query('project').optional().isMongoId(),
  query('status').optional().isIn(['todo', 'in_progress', 'completed']),
  query('priority').optional().isIn(['low', 'medium', 'high']),
  query('search').optional().trim(),
  query('sort').optional().isIn(['dueDate', '-dueDate', 'createdAt', '-createdAt', 'priority', 'title']),
];
