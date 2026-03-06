import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Project from './models/Project.js';
import User from './models/User.js';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

const createTestProject = async () => {
    try {
        console.log('Connecting to your real MongoDB Atlas database...');
        await mongoose.connect(MONGO_URI);
        console.log('✅ Connected successfully!');

        // Find a supervisor to assign
        const supervisor = await User.findOne({ role: 'Supervisor' });

        console.log('creating a new "Test Project" in your database...');
        const newProject = await Project.create({
            title: 'My First Real Database Project',
            description: 'This is proof that the database is hooked up and storing real data!',
            supervisor: supervisor ? supervisor._id : null,
            status: 'Pending',
        });

        console.log('\n🎉 Successfully stored new data in your DB!');
        console.log(newProject);

        process.exit(0);
    } catch (err) {
        console.error('❌ Error:', err.message);
        process.exit(1);
    }
};

createTestProject();
