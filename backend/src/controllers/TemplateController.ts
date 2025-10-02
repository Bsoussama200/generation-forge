import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types';
import { TemplateService } from '../services/TemplateService';
import { asyncHandler } from '../utils/errors';

const templateService = new TemplateService();

export class TemplateController {
  createTemplate = asyncHandler(
    async (req: AuthRequest, res: Response, next: NextFunction) => {
      const template = await templateService.createTemplate(req.user!.id, req.body);

      res.status(201).json({
        status: 'success',
        data: { template },
      });
    }
  );

  getTemplate = asyncHandler(
    async (req: AuthRequest, res: Response, next: NextFunction) => {
      const { id } = req.params;
      const template = await templateService.getTemplate(id, req.user?.id);

      res.status(200).json({
        status: 'success',
        data: { template },
      });
    }
  );

  listTemplates = asyncHandler(
    async (req: AuthRequest, res: Response, next: NextFunction) => {
      const { category, isPublic, limit, offset } = req.query;

      const result = await templateService.listTemplates({
        userId: req.user?.id,
        category: category as string,
        isPublic: isPublic ? isPublic === 'true' : undefined,
        limit: limit ? parseInt(limit as string) : undefined,
        offset: offset ? parseInt(offset as string) : undefined,
      });

      res.status(200).json({
        status: 'success',
        data: result,
      });
    }
  );

  updateTemplate = asyncHandler(
    async (req: AuthRequest, res: Response, next: NextFunction) => {
      const { id } = req.params;
      const template = await templateService.updateTemplate(
        id,
        req.user!.id,
        req.body
      );

      res.status(200).json({
        status: 'success',
        data: { template },
      });
    }
  );

  deleteTemplate = asyncHandler(
    async (req: AuthRequest, res: Response, next: NextFunction) => {
      const { id } = req.params;
      await templateService.deleteTemplate(id, req.user!.id);

      res.status(204).json({
        status: 'success',
        data: null,
      });
    }
  );
}
