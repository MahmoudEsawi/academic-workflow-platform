import Message from '../models/Message.js';
import Project from '../models/Project.js';

// @desc    Get all messages for a specific project
// @route   GET /api/messages/:projectId
// @access  Private (Student or Supervisor involved in project)
export const getMessagesByProject = async (req, res) => {
    try {
        const { projectId } = req.params;

        // Verify the project exists
        const project = await Project.findById(projectId);
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        // Fetch messages and optionally populate sender details
        const messages = await Message.find({ project: projectId })
            .populate('sender', 'name email role')
            .sort({ createdAt: 1 }); // Sort by chronological order

        res.status(200).json(messages);
    } catch (error) {
        console.error('Error in getMessagesByProject:', error);
        res.status(500).json({ message: 'Server error while fetching messages' });
    }
};

// @desc    Create a new message
// @route   POST /api/messages/:projectId
// @access  Private
export const createMessage = async (req, res) => {
    try {
        const { projectId } = req.params;
        const { content } = req.body;

        // Verify the project exists
        const project = await Project.findById(projectId);
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        // We assume req.user is populated by the protect middleware
        const newMessage = await Message.create({
            project: projectId,
            sender: req.user._id,
            content,
        });

        const populatedMessage = await Message.findById(newMessage._id).populate(
            'sender',
            'name email role'
        );

        res.status(201).json(populatedMessage);
    } catch (error) {
        console.error('Error in createMessage:', error);
        res.status(500).json({ message: 'Server error while creating message' });
    }
};
