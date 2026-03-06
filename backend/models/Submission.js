import mongoose from 'mongoose';

const submissionSchema = new mongoose.Schema({
    task: { type: mongoose.Schema.Types.ObjectId, ref: 'Task', required: true },
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    version: { type: Number, default: 1 },
    content: { type: String }, // Source Code Snippet
    language: { type: String, default: 'javascript' }, // Syntax Highlighter language
    fileUrl: { type: String }, // PDFs, Images
    description: { type: String, required: true },
    status: { type: String, enum: ['Pending', 'Approved', 'Needs Revision', 'Rejected'], default: 'Pending' },
    feedback: [{
        line: Number, // Optional, for inline code comments
        comment: String,
        supervisor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        createdAt: { type: Date, default: Date.now }
    }],
    overallFeedback: { type: String }
}, { timestamps: true });

export default mongoose.model('Submission', submissionSchema);
