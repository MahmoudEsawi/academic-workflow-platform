import Submission from '../models/Submission.js';

export const createSubmission = async (req, res) => {
    try {
        const { taskId, content, language, fileUrl, description } = req.body;

        // Determine next version dynamically
        const lastSubmission = await Submission.findOne({ task: taskId }).sort({ version: -1 });
        const nextVersion = lastSubmission ? lastSubmission.version + 1 : 1;

        const submission = await Submission.create({
            task: taskId,
            student: req.user._id,
            version: nextVersion,
            content,
            language: language || 'javascript',
            fileUrl,
            description
        });

        res.status(201).json(submission);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const getTaskSubmissions = async (req, res) => {
    try {
        const submissions = await Submission.find({ task: req.params.taskId })
            .populate('student', 'name email')
            .sort({ version: -1 });
        res.status(200).json(submissions);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const reviewSubmission = async (req, res) => {
    try {
        const { status, overallFeedback, inlineFeedback } = req.body;

        const submission = await Submission.findById(req.params.id);
        if (!submission) return res.status(404).json({ message: 'Submission not found' });

        submission.status = status || submission.status;
        submission.overallFeedback = overallFeedback || submission.overallFeedback;

        if (inlineFeedback) {
            submission.feedback.push({
                ...inlineFeedback,
                supervisor: req.user._id
            });
        }

        await submission.save();
        res.status(200).json(submission);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
