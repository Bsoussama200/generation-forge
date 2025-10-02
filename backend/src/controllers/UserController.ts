import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types';
import { query } from '../config/database';
import { asyncHandler } from '../utils/errors';
import { AppError } from '../types';

export class UserController {
  getProfile = asyncHandler(
    async (req: AuthRequest, res: Response, next: NextFunction) => {
      const result = await query(
        'SELECT * FROM user_profiles WHERE user_id = $1',
        [req.user!.id]
      );

      if (result.rows.length === 0) {
        throw new AppError('Profile not found', 404);
      }

      res.status(200).json({
        status: 'success',
        data: { profile: result.rows[0] },
      });
    }
  );

  updateProfile = asyncHandler(
    async (req: AuthRequest, res: Response, next: NextFunction) => {
      const { display_name, avatar_url, bio } = req.body;

      const updateFields: string[] = [];
      const params: any[] = [];
      let paramIndex = 1;

      if (display_name !== undefined) {
        updateFields.push(`display_name = $${paramIndex}`);
        params.push(display_name);
        paramIndex++;
      }

      if (avatar_url !== undefined) {
        updateFields.push(`avatar_url = $${paramIndex}`);
        params.push(avatar_url);
        paramIndex++;
      }

      if (bio !== undefined) {
        updateFields.push(`bio = $${paramIndex}`);
        params.push(bio);
        paramIndex++;
      }

      if (updateFields.length === 0) {
        throw new AppError('No fields to update', 400);
      }

      const result = await query(
        `UPDATE user_profiles 
         SET ${updateFields.join(', ')} 
         WHERE user_id = $${paramIndex} 
         RETURNING *`,
        [...params, req.user!.id]
      );

      res.status(200).json({
        status: 'success',
        data: { profile: result.rows[0] },
      });
    }
  );

  getUsageStats = asyncHandler(
    async (req: AuthRequest, res: Response, next: NextFunction) => {
      const result = await query(
        `SELECT 
          COUNT(*) as total_executions,
          SUM(credits_used) as total_credits_used,
          AVG(execution_time_ms) as avg_execution_time
         FROM template_usage 
         WHERE user_id = $1`,
        [req.user!.id]
      );

      res.status(200).json({
        status: 'success',
        data: { stats: result.rows[0] },
      });
    }
  );
}
