import dotenv from 'dotenv';
dotenv.config();

function required(name: string, fallback?: string): string {
  const value = process.env[name] || fallback;
  if (value === undefined) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export const config = {
  /** Server port */
  port: parseInt(process.env.PORT || '3000', 10),

  /** Runtime environment */
  nodeEnv: process.env.NODE_ENV || 'development',

  /** Whether running in production */
  isProduction: process.env.NODE_ENV === 'production',

  /** Database connection string */
  databaseUrl: required('DATABASE_URL'),

  /** JWT secret for admin authentication */
  jwtSecret: required('JWT_SECRET'),

  /** JWT token expiry in seconds (default 24h) */
  jwtExpiresIn: parseInt(process.env.JWT_EXPIRES_IN || '86400', 10),

  /** AES-256 encryption key (32 hex chars = 128 bits) */
  passportEncryptionKey: required('PASSPORT_ENCRYPTION_KEY'),

  /** Allowed CORS origins (comma-separated) */
  corsOrigin: (process.env.CORS_ORIGIN || 'http://localhost:5173').split(','),

  /** Rate limit: max applications per IP per hour */
  rateLimitMax: 10,

  /** Rate limit window in ms (1 hour) */
  rateLimitWindowMs: 60 * 60 * 1000,
} as const;

export default config;
