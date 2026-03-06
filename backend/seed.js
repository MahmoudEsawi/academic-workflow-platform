import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from './models/User.js';
import Project from './models/Project.js';
import Task from './models/Task.js';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/academic-workflow-platform';

const seedDatabase = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('Connected to MongoDB for seeding...');

        // Clear existing data
        await User.deleteMany();
        await Project.deleteMany();
        await Task.deleteMany();
        console.log('Cleared existing database data.');

        const salt = await bcrypt.genSalt(10);
        const password = await bcrypt.hash('password123', salt);

        // Create 1 Admin
        const admin = await User.create({
            name: 'Admin User',
            email: 'admin@university.edu',
            password,
            role: 'Admin',
        });

        // Create 2 Supervisors
        const supervisors = await User.insertMany([
            { name: 'Dr. Smith', email: 'smith@university.edu', password, role: 'Supervisor' },
            { name: 'Dr. Johnson', email: 'johnson@university.edu', password, role: 'Supervisor' },
        ]);

        // Create 3 Students
        const students = await User.insertMany([
            { name: 'Alice Student', email: 'alice@student.edu', password, role: 'Student' },
            { name: 'Bob Student', email: 'bob@student.edu', password, role: 'Student' },
            { name: 'Charlie Student', email: 'charlie@student.edu', password, role: 'Student' },
        ]);

        console.log('Successfully seeded Admin, 2 Supervisors, and 3 Students.');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
};

seedDatabase();
