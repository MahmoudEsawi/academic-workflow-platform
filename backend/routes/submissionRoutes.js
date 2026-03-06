import express from 'express';
import { createSubmission, getTaskSubmissions, reviewSubmission } from '../controllers/submissionController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, createSubmission);
router.get('/task/:taskId', protect, getTaskSubmissions);
router.put('/:id/review', protect, reviewSubmission);

export default router;
