import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../services/auth.service';
import { AppError } from './error-handler';

// Extend Express Request to include authenticated user info
declare global {
  namespace Express {
    interface Request {
      user?: { sub: string; username: string };
    }
  }
}

/**
 * JWT authentication middleware.
 * Verifies the Bearer token and attaches user info to req.user.
 */
export function authMiddleware(req: Request, _res: Response, next: NextFunction): void {
  const header = req.headers.authorization;

  if (!header || !header.startsWith('Bearer ')) {
    throw new AppError('Authentication required', 401);
  }

  const token = header.slice(7);
  try {
    const payload = verifyToken(token);
    req.user = payload;
    next();
  } catch {
    throw new AppError('Invalid or expired token', 401);
  }
}
