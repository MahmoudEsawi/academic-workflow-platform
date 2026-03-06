import Task from '../models/Task.js';

export const createTask = async (req, res) => {
    try {
        const { title, description, status, assignedTo, position } = req.body;
        const { projectId } = req.params;

        const task = await Task.create({
            title,
            description,
            status: status || 'To Do',
            project: projectId,
            assignedTo,
            position: position || 0,
        });

        const populatedTask = await Task.findById(task._id).populate('assignedTo', 'name');

        const io = req.app.get('socketio');
        if (io) {
            io.to(`project-${projectId}`).emit('taskCreated', populatedTask);
        }

        res.status(201).json(populatedTask);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getTasks = async (req, res) => {
    try {
        const { projectId } = req.params;
        const tasks = await Task.find({ project: projectId }).sort('position').populate('assignedTo', 'name');
        res.status(200).json(tasks);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateTask = async (req, res) => {
    try {
        const { id } = req.params;
        const task = await Task.findByIdAndUpdate(id, req.body, { new: true }).populate('assignedTo', 'name');

        if (!task) return res.status(404).json({ message: 'Task not found' });

        const io = req.app.get('socketio');
        if (io && task) {
            io.to(`project-${task.project}`).emit('taskUpdated', task);
        }

        res.status(200).json(task);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteTask = async (req, res) => {
    try {
        const { id } = req.params;
        const task = await Task.findById(id);

        if (!task) return res.status(404).json({ message: 'Task not found' });

        const projectId = task.project;
        await task.deleteOne();

        const io = req.app.get('socketio');
        if (io) {
            io.to(`project-${projectId}`).emit('taskDeleted', id);
        }

        res.status(200).json({ message: 'Task removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
