import { Router } from 'express';
import { createJob, getJobs, updateJob, deleteJob } from '../controllers/jobController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = Router();

// Apply middleware to all routes in this file
router.use(authenticate);

router.post('/', createJob);
router.get('/', getJobs);
router.put('/:id', updateJob);
router.delete('/:id', deleteJob);

export default router;