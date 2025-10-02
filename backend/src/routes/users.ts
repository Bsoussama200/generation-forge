import { Router } from 'express';
import { body } from 'express-validator';
import { UserController } from '../controllers/UserController';
import { authenticate } from '../middleware/auth';
import { validate } from '../middleware/validation';

const router = Router();
const userController = new UserController();

router.get('/profile', authenticate, userController.getProfile);

router.patch(
  '/profile',
  authenticate,
  [
    body('display_name').optional().isString(),
    body('avatar_url').optional().isURL(),
    body('bio').optional().isString(),
    validate,
  ],
  userController.updateProfile
);

router.get('/usage', authenticate, userController.getUsageStats);

export default router;
