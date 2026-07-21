import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import config from './config';
import { errorHandler } from './middleware/error-handler';

const app = express();

// ---- Global middleware ----

// CORS
app.use(cors({
  origin: config.corsOrigin,
  credentials: true,
}));

// Body parser
app.use(express.json({ limit: '1mb' }));

// Rate limiter factory — 10 submissions per hour per IP
export const submissionLimiter = rateLimit({
  windowMs: config.rateLimitWindowMs,
  max: config.rateLimitMax,
  message: { success: false, message: 'Too many submissions. Please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// ---- Health check ----

app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    environment: config.nodeEnv,
    timestamp: new Date().toISOString(),
  });
});

// ---- Routes (to be implemented in Phase 2) ----
// app.post('/api/applications', submissionLimiter, ...);
// app.post('/api/auth/login', ...);
// app.get('/api/dict/options', ...);

// ---- Error handler (must be last) ----
app.use(errorHandler);

export default app;
