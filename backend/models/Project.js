import mongoose from 'mongoose';

const generateInviteCode = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
};

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
        inviteCode: {
            type: String,
            unique: true,
            default: generateInviteCode,
        },
        students: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
            },
        ],
        pendingStudents: [
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
