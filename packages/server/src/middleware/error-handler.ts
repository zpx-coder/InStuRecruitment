import { Request, Response, NextFunction } from 'express';
import config from '../config';

/**
 * Custom application error with HTTP status code.
 */
export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  constructor(message: string, statusCode = 500, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

/**
 * Global error handler middleware.
 * Must be registered AFTER all routes.
 */
export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  // Log all errors
  console.error(`[error] ${err.message}`);
  if (!config.isProduction) {
    console.error(err.stack);
  }

  // Handle known operational errors
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
    return;
  }

  // Handle Prisma known errors
  if (err.name === 'PrismaClientKnownRequestError') {
    res.status(400).json({
      success: false,
      message: 'Database operation failed',
    });
    return;
  }

  // Handle Zod validation errors (Phase 2)
  if (err.name === 'ZodError') {
    res.status(422).json({
      success: false,
      message: 'Validation failed',
    });
    return;
  }

  // Unknown / programming errors
  res.status(500).json({
    success: false,
    message: config.isProduction
      ? 'Internal server error'
      : err.message,
  });
}
