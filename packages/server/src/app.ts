import express from 'express';
import cors from 'cors';
import config from './config';
import { errorHandler } from './middleware/error-handler';
import routes from './routes';

const app = express();

// ---- Global middleware ----

// CORS
app.use(cors({
  origin: config.corsOrigin,
  credentials: true,
}));

// Body parser
app.use(express.json({ limit: '1mb' }));

// ---- Health check ----

app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    environment: config.nodeEnv,
    timestamp: new Date().toISOString(),
  });
});

// ---- API routes ----
app.use('/api', routes);

// ---- Error handler (must be last) ----
app.use(errorHandler);

export default app;
