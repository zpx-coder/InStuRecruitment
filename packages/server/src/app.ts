import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';

const app = express();

// CORS
app.use(cors({
  origin: (process.env.CORS_ORIGIN || 'http://localhost:5173').split(','),
  credentials: true,
}));

// Body parser
app.use(express.json());

// Rate limiting — 10 submissions per hour per IP for application endpoint
const submissionLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10,
  message: { success: false, message: 'Too many submissions. Please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Routes (to be implemented in Phase 2)
// app.post('/api/applications', submissionLimiter, ...);
// app.post('/api/auth/login', ...);
// app.get('/api/dict/options', ...);

// Global error handler
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('[error]', err.message);
  res.status(500).json({
    success: false,
    message: process.env.NODE_ENV === 'production'
      ? 'Internal server error'
      : err.message,
  });
});

export default app;
