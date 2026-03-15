import Project from '../models/Project.js';

/**
 * Middleware to authorize access to a specific project.
 * It checks if the logged-in user is an Admin, the Supervisor, an active Student, 
 * or a pending Student on the requested project.
 * 
 * Assumes the project ID is either in `req.params.id` or `req.params.projectId`.
 */
export const authorizeProjectAccess = async (req, res, next) => {
    try {
        // Find the project ID from common route parameter names
        const projectId = req.params.id || req.params.projectId;

        if (!projectId) {
            return res.status(400).json({ message: 'Project ID is required for authorization' });
        }

        // Admins have universal access
        if (req.user.role === 'Admin') {
            return next();
        }

        const project = await Project.findById(projectId);

        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        const userId = req.user._id.toString();

        // Check if user is the supervisor
        const isSupervisor = project.supervisor && project.supervisor.toString() === userId;

        // Check if user is an active student
        const isStudent = project.students.some(id => id.toString() === userId);

        // Check if user is a pending student (needed for viewing project details before approval)
        const isPending = project.pendingStudents && project.pendingStudents.some(id => id.toString() === userId);

        if (isSupervisor || isStudent || isPending) {
            // Attach the project to the request object so downstream controllers don't have to re-fetch it if they don't want to
            req.project = project;
            return next();
        }

        // If none of the above matched, user is absolutely not authorized for this project
        return res.status(403).json({ 
            message: 'Forbidden. You do not have permission to access this project.' 
        });

    } catch (error) {
        res.status(500).json({ message: 'Server error during authorization check', error: error.message });
    }
};
