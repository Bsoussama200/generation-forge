import { Request, Response, NextFunction } from 'express';
import { redis } from '../config/redis';
import { config } from '../config/env';
import { AppError } from '../types';

export const rateLimit = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const identifier = req.ip || 'unknown';
    const key = `rate_limit:${identifier}`;
    
    const current = await redis.incr(key);
    
    if (current === 1) {
      await redis.expire(key, Math.floor(config.rateLimit.windowMs / 1000));
    }
    
    if (current > config.rateLimit.maxRequests) {
      throw new AppError('Too many requests', 429);
    }
    
    res.setHeader('X-RateLimit-Limit', config.rateLimit.maxRequests);
    res.setHeader('X-RateLimit-Remaining', Math.max(0, config.rateLimit.maxRequests - current));
    
    next();
  } catch (error) {
    next(error);
  }
};
