import { body, param } from 'express-validator';

export const createProjectValidator = [
  body('title').trim().notEmpty().withMessage('Title is required').isLength({ max: 150 }),
  body('description').optional().trim().isLength({ max: 2000 }),
];

export const updateProjectValidator = [
  param('id').isMongoId().withMessage('Invalid project ID'),
  body('title').optional().trim().notEmpty().isLength({ max: 150 }),
  body('description').optional().trim().isLength({ max: 2000 }),
];

export const projectIdValidator = [
  param('id').isMongoId().withMessage('Invalid project ID'),
];

export const addMemberValidator = [
  param('id').isMongoId().withMessage('Invalid project ID'),
  body('email').trim().isEmail().withMessage('Valid email is required'),
  body('role').optional().isIn(['admin', 'member']).withMessage('Invalid role'),
];

export const removeMemberValidator = [
  param('id').isMongoId().withMessage('Invalid project ID'),
  param('userId').isMongoId().withMessage('Invalid user ID'),
];
