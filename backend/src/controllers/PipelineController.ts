import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types';
import { PipelineService } from '../services/PipelineService';
import { asyncHandler } from '../utils/errors';

const pipelineService = new PipelineService();

export class PipelineController {
  createPipeline = asyncHandler(
    async (req: AuthRequest, res: Response, next: NextFunction) => {
      const { templateId } = req.params;
      const pipeline = await pipelineService.createPipeline(templateId, req.body);

      res.status(201).json({
        status: 'success',
        data: { pipeline },
      });
    }
  );

  getPipeline = asyncHandler(
    async (req: AuthRequest, res: Response, next: NextFunction) => {
      const { id } = req.params;
      const pipeline = await pipelineService.getPipeline(id);

      res.status(200).json({
        status: 'success',
        data: { pipeline },
      });
    }
  );

  listPipelines = asyncHandler(
    async (req: AuthRequest, res: Response, next: NextFunction) => {
      const { templateId } = req.params;
      const pipelines = await pipelineService.listPipelines(templateId);

      res.status(200).json({
        status: 'success',
        data: { pipelines },
      });
    }
  );

  updatePipeline = asyncHandler(
    async (req: AuthRequest, res: Response, next: NextFunction) => {
      const { id } = req.params;
      const pipeline = await pipelineService.updatePipeline(id, req.body);

      res.status(200).json({
        status: 'success',
        data: { pipeline },
      });
    }
  );

  deletePipeline = asyncHandler(
    async (req: AuthRequest, res: Response, next: NextFunction) => {
      const { id } = req.params;
      await pipelineService.deletePipeline(id);

      res.status(204).json({
        status: 'success',
        data: null,
      });
    }
  );

  executePipeline = asyncHandler(
    async (req: AuthRequest, res: Response, next: NextFunction) => {
      const { templateId } = req.params;
      const execution = await pipelineService.executePipeline(
        templateId,
        req.user!.id,
        req.body
      );

      res.status(202).json({
        status: 'success',
        data: { execution },
      });
    }
  );

  getExecutionStatus = asyncHandler(
    async (req: AuthRequest, res: Response, next: NextFunction) => {
      const { executionId } = req.params;
      const execution = await pipelineService.getExecutionStatus(executionId);

      res.status(200).json({
        status: 'success',
        data: { execution },
      });
    }
  );
}
