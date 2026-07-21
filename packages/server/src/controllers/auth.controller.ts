import { Request, Response, NextFunction } from 'express';
import { loginSchema } from '../validators/auth.schema';
import * as authService from '../services/auth.service';

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const input = loginSchema.parse(req.body);
    const result = await authService.login(input);
    res.json({ success: true, ...result });
  } catch (err) {
    next(err);
  }
}

export async function me(req: Request, res: Response) {
  res.json({
    success: true,
    data: {
      id: req.user!.sub,
      username: req.user!.username,
    },
  });
}
