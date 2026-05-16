import { Router } from 'express';
import { getProfile, updateProfile, searchUsers } from '../controllers/userController.js';
import { protect } from '../middleware/auth.js';
import { body } from 'express-validator';
import { validate } from '../middleware/validate.js';

const router = Router();

router.use(protect);

router.get('/profile', getProfile);
router.put(
  '/profile',
  [body('name').optional().trim().notEmpty(), body('avatar').optional().isString()],
  validate,
  updateProfile
);
router.get('/search', searchUsers);

export default router;
