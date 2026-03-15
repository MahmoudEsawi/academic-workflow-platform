import Project from '../models/Project.js';

export const createProject = async (req, res) => {
    try {
        const { title, description } = req.body;
        
        // Wait, earlier it was supervisorId from req.body? Let's check `user.supervisor`.
        const supervisorId = req.user.supervisor || req.body.supervisorId;

        const project = await Project.create({
            title,
            description,
            students: [req.user._id],
            supervisor: supervisorId,
        });

        res.status(201).json(project);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getProjects = async (req, res) => {
    try {
        let query = {};
        if (req.user.role === 'Student') {
            query = { students: req.user._id };
        } else if (req.user.role === 'Supervisor') {
            query = { supervisor: req.user._id };
        } // Admins see all

        const projects = await Project.find(query)
            .populate('students', 'name email')
            .populate('pendingStudents', 'name email')
            .populate('supervisor', 'name email');
        res.status(200).json(projects);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getAvailableProjects = async (req, res) => {
    try {
        // Find projects that are supervised by the student's supervisor
        if (!req.user.supervisor) {
            return res.status(200).json([]);
        }

        const query = { 
            supervisor: req.user.supervisor,
            status: { $in: ['Pending', 'Approved', 'Edits Requested'] } // Active projects
        };

        const projects = await Project.find(query)
            .populate('students', 'name email')
            .populate('supervisor', 'name email');
            
        res.status(200).json(projects);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getProjectById = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id)
            .populate('students', 'name email')
            .populate('pendingStudents', 'name email')
            .populate('supervisor', 'name email');

        if (!project) return res.status(404).json({ message: 'Project not found' });
        res.status(200).json(project);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateProjectStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const project = await Project.findById(req.params.id);

        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        project.status = status;
        const updatedProject = await project.save();

        // Notify via socket
        const io = req.app.get('socketio');
        if (io) {
            io.emit(`project-${project._id}-updated`, updatedProject);
        }

        res.status(200).json(updatedProject);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const uploadFiles = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);
        if (!project) return res.status(404).json({ message: 'Project not found' });

        const newFiles = req.files.map((file) => ({
            filename: file.originalname,
            path: file.path,
            mimetype: file.mimetype,
        }));

        project.files.push(...newFiles);
        const updatedProject = await project.save();

        res.status(200).json(updatedProject);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const joinProject = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);
        if (!project) return res.status(404).json({ message: 'Project not found' });

        // Check if student is already in the project or pending
        if (project.students.includes(req.user._id)) {
            return res.status(400).json({ message: 'You are already a member of this project' });
        }
        if (project.pendingStudents.includes(req.user._id)) {
            return res.status(400).json({ message: 'You have already requested to join this project' });
        }

        project.pendingStudents.push(req.user._id);
        await project.save();

        // Notify supervisor
        const io = req.app.get('socketio');
        if (io && project.supervisor) {
            io.to(`user-${project.supervisor}`).emit('newTeamJoinRequest', {
                projectId: project._id,
                projectTitle: project.title,
                student: req.user
            });
        }

        res.status(200).json({ message: 'Request to join sent successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const joinByCode = async (req, res) => {
    try {
        const { code } = req.body;
        if (!code) return res.status(400).json({ message: 'Invite code is required' });

        const project = await Project.findOne({ inviteCode: code.toUpperCase() });
        if (!project) return res.status(404).json({ message: 'Invalid invite code. No project found.' });

        if (project.students.some(id => id.toString() === req.user._id.toString())) {
            return res.status(400).json({ message: 'You are already a member of this project' });
        }
        if (project.pendingStudents.some(id => id.toString() === req.user._id.toString())) {
            return res.status(400).json({ message: 'You have already requested to join this project' });
        }

        project.pendingStudents.push(req.user._id);
        await project.save();

        const io = req.app.get('socketio');
        if (io && project.supervisor) {
            io.to(`user-${project.supervisor}`).emit('newTeamJoinRequest', {
                projectId: project._id,
                projectTitle: project.title,
                student: req.user
            });
        }

        res.status(200).json({ message: `Request to join "${project.title}" sent! Waiting for supervisor approval.`, projectTitle: project.title });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const leaveProject = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);
        if (!project) return res.status(404).json({ message: 'Project not found' });

        // Remove from both lists to be safe
        project.students = project.students.filter(id => id.toString() !== req.user._id.toString());
        project.pendingStudents = project.pendingStudents.filter(id => id.toString() !== req.user._id.toString());
        
        await project.save();
        res.status(200).json({ message: 'Successfully left the project' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const manageTeamMember = async (req, res) => {
    try {
        const { action } = req.body; // 'approve' or 'reject'
        const { id, studentId } = req.params;

        const project = await Project.findById(id).populate('students', 'name email').populate('pendingStudents', 'name email').populate('supervisor', 'name email');
        if (!project) return res.status(404).json({ message: 'Project not found' });

        // Verify supervisor
        if (project.supervisor._id.toString() !== req.user._id.toString() && req.user.role !== 'Admin') {
            return res.status(403).json({ message: 'Not authorized to manage this project' });
        }

        if (action === 'approve') {
            // Move from pending to students
            project.pendingStudents = project.pendingStudents.filter(stu => stu._id.toString() !== studentId);
            if (!project.students.some(stu => stu._id.toString() === studentId)) {
                project.students.push(studentId);
            }
        } else if (action === 'reject') {
            // Just remove from pending
            project.pendingStudents = project.pendingStudents.filter(stu => stu._id.toString() !== studentId);
        } else {
            return res.status(400).json({ message: 'Invalid action. Use approve or reject.' });
        }

        await project.save();
        
        // Re-populate to send back
        const updatedProject = await Project.findById(id).populate('students', 'name email').populate('pendingStudents', 'name email').populate('supervisor', 'name email');

        // Socket notifications
        const io = req.app.get('socketio');
        if (io) {
            io.emit(`project-${project._id}-updated`, updatedProject);
            // Notify the specific student
            io.to(`user-${studentId}`).emit('teamJoinResponse', {
                projectId: project._id,
                projectTitle: project.title,
                status: action
            });
        }
        
        res.status(200).json(updatedProject);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
