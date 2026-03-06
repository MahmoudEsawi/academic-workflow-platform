import express from 'express';
import { sendRequest, getPendingRequests, handleRequest } from '../controllers/workflowController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/requests', protect, sendRequest);
router.get('/requests', protect, getPendingRequests);
router.put('/requests/:id', protect, handleRequest);

export default router;
