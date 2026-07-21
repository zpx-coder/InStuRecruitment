import { Router } from 'express';
import { submissionLimiter } from '../middleware/rate-limiter';
import { authMiddleware } from '../middleware/auth';
import * as appCtrl from '../controllers/application.controller';
import * as authCtrl from '../controllers/auth.controller';
import * as dictCtrl from '../controllers/dict.controller';

const router = Router();

// Public routes
router.get('/dict/options', dictCtrl.getOptions);
router.post('/auth/login', authCtrl.login);
router.post('/applications', submissionLimiter, appCtrl.create);

// Protected routes (admin only)
router.get('/auth/me', authMiddleware, authCtrl.me);
router.get('/applications', authMiddleware, appCtrl.list);
router.get('/applications/export', authMiddleware, appCtrl.exportExcel);
router.patch('/applications/:id', authMiddleware, appCtrl.update);
router.get('/applications/:id', authMiddleware, appCtrl.detail);

export default router;
