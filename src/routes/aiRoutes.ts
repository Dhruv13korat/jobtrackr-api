import { Router } from 'express';
import { analyzeResume } from '../controllers/aiController.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { aiLimiter } from '../middleware/rateLimiter.js';

const router = Router();

// Protect with JWT middleware
router.post('/analyze', authenticate, analyzeResume, aiLimiter);

export default router;