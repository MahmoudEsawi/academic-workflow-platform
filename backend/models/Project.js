import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            enum: ['Pending', 'Approved', 'Rejected', 'Edits Requested'],
            default: 'Pending',
        },
        students: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
            },
        ],
        supervisor: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        files: [
            {
                filename: String,
                path: String,
                mimetype: String,
            },
        ],
    },
    { timestamps: true }
);

export default mongoose.model('Project', projectSchema);
