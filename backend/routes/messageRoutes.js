import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { authorizeProjectAccess } from '../middleware/tenantMiddleware.js';
import {
    getMessagesByProject,
    createMessage,
} from '../controllers/messageController.js';

const router = express.Router();

// Both endpoints are protected
router.route('/:projectId')
    .get(protect, authorizeProjectAccess, getMessagesByProject)
    .post(protect, authorizeProjectAccess, createMessage);

export default router;
