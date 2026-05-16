import { Router } from 'express';
import {
  createProject,
  getProjects,
  getProject,
  updateProject,
  deleteProject,
  addTeamMember,
  removeTeamMember,
  updateMemberRole,
} from '../controllers/projectController.js';
import { protect } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import {
  createProjectValidator,
  updateProjectValidator,
  projectIdValidator,
  addMemberValidator,
  removeMemberValidator,
} from '../validators/projectValidators.js';
import { body } from 'express-validator';

const router = Router();

router.use(protect);

router.route('/').get(getProjects).post(createProjectValidator, validate, createProject);
router
  .route('/:id')
  .get(projectIdValidator, validate, getProject)
  .put(updateProjectValidator, validate, updateProject)
  .delete(projectIdValidator, validate, deleteProject);
router.post('/:id/members', addMemberValidator, validate, addTeamMember);
router.delete('/:id/members/:userId', removeMemberValidator, validate, removeTeamMember);
router.patch(
  '/:id/members/:userId',
  [
    ...removeMemberValidator,
    body('role').isIn(['admin', 'member']).withMessage('Invalid role'),
  ],
  validate,
  updateMemberRole
);

export default router;
