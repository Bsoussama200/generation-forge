import { Router } from 'express';
import { body } from 'express-validator';
import { PipelineController } from '../controllers/PipelineController';
import { authenticate } from '../middleware/auth';
import { validate } from '../middleware/validation';

const router = Router();
const pipelineController = new PipelineController();

router.post(
  '/templates/:templateId/pipelines',
  authenticate,
  [
    body('name').notEmpty().withMessage('Pipeline name is required'),
    body('description').optional().isString(),
    body('steps').isArray().withMessage('Steps must be an array'),
    validate,
  ],
  pipelineController.createPipeline
);

router.get('/templates/:templateId/pipelines', pipelineController.listPipelines);

router.get('/pipelines/:id', pipelineController.getPipeline);

router.patch(
  '/pipelines/:id',
  authenticate,
  [
    body('name').optional().notEmpty(),
    body('description').optional().isString(),
    body('steps').optional().isArray(),
    validate,
  ],
  pipelineController.updatePipeline
);

router.delete('/pipelines/:id', authenticate, pipelineController.deletePipeline);

// Pipeline execution
router.post(
  '/templates/:templateId/execute',
  authenticate,
  [body('inputData').optional().isObject(), validate],
  pipelineController.executePipeline
);

router.get(
  '/executions/:executionId',
  authenticate,
  pipelineController.getExecutionStatus
);

export default router;
