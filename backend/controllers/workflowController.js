import SupervisionRequest from '../models/SupervisionRequest.js';
import User from '../models/User.js';

export const sendRequest = async (req, res) => {
    try {
        const { supervisorId } = req.body;

        // Ensure not already requested or approved
        const existingStudent = await User.findById(req.user._id);
        if (existingStudent.supervisor) {
            return res.status(400).json({ message: 'You already have an assigned supervisor.' });
        }

        const exists = await SupervisionRequest.findOne({ student: req.user._id, status: 'Pending' });
        if (exists) {
            return res.status(400).json({ message: 'You already have a pending request.' });
        }

        const request = await SupervisionRequest.create({
            student: req.user._id,
            supervisor: supervisorId
        });

        res.status(201).json(request);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const getPendingRequests = async (req, res) => {
    try {
        const query = req.user.role === 'Student'
            ? { student: req.user._id }
            : { supervisor: req.user._id, status: 'Pending' };

        const requests = await SupervisionRequest.find(query)
            .populate('student', 'name email')
            .populate('supervisor', 'name email');

        res.status(200).json(requests);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const handleRequest = async (req, res) => {
    try {
        const { status } = req.body; // 'Approved' or 'Rejected'
        const request = await SupervisionRequest.findById(req.params.id);
        if (!request) return res.status(404).json({ message: 'Request not found' });

        // Ensure only the requested supervisor can handle it
        if (request.supervisor.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        request.status = status;
        await request.save();

        if (status === 'Approved') {
            // Unlink any other pending requests from this student
            await SupervisionRequest.updateMany(
                { student: request.student, status: 'Pending', _id: { $ne: request._id } },
                { $set: { status: 'Rejected' } }
            );

            // Link them permanently on User model
            await User.findByIdAndUpdate(request.student, { supervisor: request.supervisor });
            await User.findByIdAndUpdate(request.supervisor, { $addToSet: { students: request.student } });
        }

        res.status(200).json(request);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
