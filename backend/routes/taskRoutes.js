import express from 'express';
import {
    createTask,
    getTasks,
    updateTask,
    deleteTask,
} from '../controllers/taskController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorizeRoles } from '../middleware/roleMiddleware.js';
import { authorizeProjectAccess } from '../middleware/tenantMiddleware.js';

const router = express.Router();

router.route('/project/:projectId')
    .post(protect, authorizeProjectAccess, authorizeRoles('Student', 'Supervisor', 'Admin'), createTask)
    .get(protect, authorizeProjectAccess, getTasks);

router.route('/:id')
    .put(protect, updateTask)
    .delete(protect, authorizeRoles('Supervisor', 'Admin'), deleteTask);

export default router;
