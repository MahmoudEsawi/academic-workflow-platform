import Project from '../models/Project.js';

export const createProject = async (req, res) => {
    try {
        const { title, description, supervisorId } = req.body;

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
