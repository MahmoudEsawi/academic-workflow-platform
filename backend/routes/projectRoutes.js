import express from 'express';
import {
    createProject,
    getProjects,
    getProjectById,
    updateProjectStatus,
    uploadFiles,
} from '../controllers/projectController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorizeRoles } from '../middleware/roleMiddleware.js';
import { upload } from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.route('/')
    .post(protect, authorizeRoles('Student'), createProject)
    .get(protect, getProjects);

router.route('/:id')
    .get(protect, getProjectById);

router.route('/:id/status')
    .put(protect, authorizeRoles('Supervisor', 'Admin'), updateProjectStatus);

router.route('/:id/upload')
    .post(protect, upload.array('files'), uploadFiles);

export default router;
