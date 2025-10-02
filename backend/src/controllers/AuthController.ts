import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/AuthService';
import { asyncHandler } from '../utils/errors';

const authService = new AuthService();

export class AuthController {
  register = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    const result = await authService.register(email, password);

    res.status(201).json({
      status: 'success',
      data: result,
    });
  });

  login = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    const result = await authService.login(email, password);

    res.status(200).json({
      status: 'success',
      data: result,
    });
  });

  verifyToken = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { token } = req.body;

    const result = await authService.verifyToken(token);

    res.status(200).json({
      status: 'success',
      data: result,
    });
  });
}
