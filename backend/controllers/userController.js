import User from '../models/User.js';

export const getSupervisors = async (req, res) => {
    try {
        const supervisors = await User.find({ role: 'Supervisor' }).select('-password');
        res.status(200).json(supervisors);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
