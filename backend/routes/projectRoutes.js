import express from 'express';
import {
    createProject,
    getProjects,
    getProjectById,
    updateProjectStatus,
    uploadFiles,
    joinProject,
    leaveProject,
    manageTeamMember,
    getAvailableProjects
} from '../controllers/projectController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorizeRoles } from '../middleware/roleMiddleware.js';
import { authorizeProjectAccess } from '../middleware/tenantMiddleware.js';
import { upload } from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.route('/')
    .post(protect, authorizeRoles('Student'), createProject)
    .get(protect, getProjects);

router.route('/available')
    .get(protect, authorizeRoles('Student'), getAvailableProjects);

router.route('/:id')
    .get(protect, authorizeProjectAccess, getProjectById);

router.route('/:id/status')
    .put(protect, authorizeProjectAccess, authorizeRoles('Supervisor', 'Admin'), updateProjectStatus);

router.route('/:id/join')
    .post(protect, authorizeRoles('Student'), joinProject);

router.route('/:id/leave')
    .post(protect, authorizeRoles('Student'), leaveProject);

router.route('/:id/members/:studentId')
    .put(protect, authorizeProjectAccess, authorizeRoles('Supervisor', 'Admin'), manageTeamMember);

router.route('/:id/upload')
    .post(protect, authorizeProjectAccess, upload.array('files'), uploadFiles);

export default router;
