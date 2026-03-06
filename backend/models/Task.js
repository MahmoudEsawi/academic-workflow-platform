import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
        },
        status: {
            type: String,
            enum: ['To Do', 'In Progress', 'Review', 'Done'],
            default: 'To Do',
        },
        project: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Project',
            required: true,
        },
        assignedTo: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        position: {
            type: Number,
            default: 0,
        },
    },
    { timestamps: true }
);

export default mongoose.model('Task', taskSchema);
