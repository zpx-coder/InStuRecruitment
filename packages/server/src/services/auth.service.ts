import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import prisma from '../utils/prisma';
import config from '../config';
import { AppError } from '../middleware/error-handler';
import type { LoginInput } from '../validators/auth.schema';

export async function login(input: LoginInput) {
  const admin = await prisma.admin.findUnique({
    where: { username: input.username },
  });

  if (!admin) {
    throw new AppError('用户名或密码错误', 401);
  }

  const valid = await bcrypt.compare(input.password, admin.passwordHash);
  if (!valid) {
    throw new AppError('用户名或密码错误', 401);
  }

  const token = jwt.sign(
    { sub: admin.id, username: admin.username },
    config.jwtSecret,
    { expiresIn: config.jwtExpiresIn },
  );

  return {
    token,
    expires_in: config.jwtExpiresIn,
  };
}

export function verifyToken(token: string): { sub: string; username: string } {
  return jwt.verify(token, config.jwtSecret) as { sub: string; username: string };
}
