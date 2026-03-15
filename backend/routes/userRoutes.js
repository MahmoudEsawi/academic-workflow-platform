import express from 'express';
import { getSupervisors, getProfile, updateProfile, changePassword } from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';
import { upload } from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.get('/supervisors', protect, getSupervisors);
router.route('/profile')
    .get(protect, getProfile)
    .put(protect, upload.single('avatar'), updateProfile);
router.put('/password', protect, changePassword);

export default router;
