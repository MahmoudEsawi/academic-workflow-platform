import express from 'express';
import { getSupervisors } from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/supervisors', protect, getSupervisors);

export default router;
