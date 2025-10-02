import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config/env';
import { AuthRequest, TokenPayload, AppError, UserRole } from '../types';
import { query } from '../config/database';

export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      throw new AppError('No token provided', 401);
    }

    const decoded = jwt.verify(token, config.jwt.secret) as TokenPayload;

    // Verify user still exists
    const result = await query(
      'SELECT id, email FROM users WHERE id = $1',
      [decoded.userId]
    );

    if (result.rows.length === 0) {
      throw new AppError('User no longer exists', 401);
    }

    // Get user roles
    const rolesResult = await query(
      'SELECT role FROM user_roles WHERE user_id = $1',
      [decoded.userId]
    );

    req.user = {
      id: decoded.userId,
      email: decoded.email,
      roles: rolesResult.rows.map(r => r.role),
    };

    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return next(new AppError('Invalid token', 401));
    }
    next(error);
  }
};

export const requireRole = (roles: UserRole[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new AppError('Not authenticated', 401));
    }

    const hasRole = req.user.roles.some(role => roles.includes(role));

    if (!hasRole) {
      return next(new AppError('Insufficient permissions', 403));
    }

    next();
  };
};
