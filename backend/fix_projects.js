import mongoose from 'mongoose';
import Project from './models/Project.js';
import User from './models/User.js';

const run = async () => {
    await mongoose.connect('mongodb+srv://esawi_db_user:r383P14WAu3Itqhp@cluster0.hpvjkgt.mongodb.net/academic_workflow?retryWrites=true&w=majority&appName=Cluster0');
    const smith = await User.findOne({ email: 'smith@university.edu' });
    if (smith) {
        const result = await Project.updateMany(
            { supervisor: { $exists: false } },
            { $set: { supervisor: smith._id } }
        );
        console.log('Fixed projects:', result.modifiedCount);
    }
    process.exit(0);
};
run();
