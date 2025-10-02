import { Router } from 'express';
import { body } from 'express-validator';
import { TemplateController } from '../controllers/TemplateController';
import { authenticate } from '../middleware/auth';
import { validate } from '../middleware/validation';

const router = Router();
const templateController = new TemplateController();

router.post(
  '/',
  authenticate,
  [
    body('name').notEmpty().withMessage('Template name is required'),
    body('description').optional().isString(),
    body('category').optional().isString(),
    body('is_public').optional().isBoolean(),
    validate,
  ],
  templateController.createTemplate
);

router.get('/', templateController.listTemplates);

router.get('/:id', templateController.getTemplate);

router.patch(
  '/:id',
  authenticate,
  [
    body('name').optional().notEmpty().withMessage('Name cannot be empty'),
    body('description').optional().isString(),
    body('category').optional().isString(),
    body('is_public').optional().isBoolean(),
    validate,
  ],
  templateController.updateTemplate
);

router.delete('/:id', authenticate, templateController.deleteTemplate);

export default router;
