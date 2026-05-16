import { Router } from 'express';
import {
  createTask,
  getTasks,
  getTask,
  updateTask,
  deleteTask,
} from '../controllers/taskController.js';
import { protect } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import {
  createTaskValidator,
  updateTaskValidator,
  taskIdValidator,
  taskQueryValidator,
} from '../validators/taskValidators.js';

const router = Router();

router.use(protect);

router
  .route('/')
  .get(taskQueryValidator, validate, getTasks)
  .post(createTaskValidator, validate, createTask);
router
  .route('/:id')
  .get(taskIdValidator, validate, getTask)
  .put(updateTaskValidator, validate, updateTask)
  .delete(taskIdValidator, validate, deleteTask);

export default router;
