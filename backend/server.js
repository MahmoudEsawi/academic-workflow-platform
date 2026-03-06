import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import http from 'http';
import { Server } from 'socket.io';
import path from 'path';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import bcrypt from 'bcryptjs';
import User from './models/User.js';
import Project from './models/Project.js';
import Task from './models/Task.js';

import authRoutes from './routes/authRoutes.js';
import projectRoutes from './routes/projectRoutes.js';
import taskRoutes from './routes/taskRoutes.js';
import userRoutes from './routes/userRoutes.js';
import workflowRoutes from './routes/workflowRoutes.js';
import submissionRoutes from './routes/submissionRoutes.js';

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*',
    },
});

app.use(cors());
app.use(express.json());

const __dirname = path.resolve();
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.set('socketio', io);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/users', userRoutes);
app.use('/api/workflow', workflowRoutes);
app.use('/api/submissions', submissionRoutes);

// Error Middlewares
app.use((req, res, next) => {
    const error = new Error(`Not Found - ${req.originalUrl}`);
    res.status(404);
    next(error);
});

app.use((err, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode).json({
        message: err.message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
});

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/academic-workflow-platform';

let mongoServer;

const seedInMemoryDatabase = async () => {
    try {
        console.log('Seeding In-Memory MongoDB...');
        await User.deleteMany();
        await Project.deleteMany();
        await Task.deleteMany();

        const salt = await bcrypt.genSalt(10);
        const password = await bcrypt.hash('password123', salt);

        await User.create({ name: 'Admin User', email: 'admin@university.edu', password, role: 'Admin' });

        await User.insertMany([
            { name: 'Dr. Smith', email: 'smith@university.edu', password, role: 'Supervisor' },
            { name: 'Dr. Johnson', email: 'johnson@university.edu', password, role: 'Supervisor' },
        ]);

        await User.insertMany([
            { name: 'Alice Student', email: 'alice@student.edu', password, role: 'Student' },
            { name: 'Bob Student', email: 'bob@student.edu', password, role: 'Student' },
            { name: 'Charlie Student', email: 'charlie@student.edu', password, role: 'Student' },
        ]);
        console.log('Seeding complete.');
    } catch (err) {
        console.error('Error seeding:', err);
    }
};

const connectDB = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log(`Connected to MongoDB (Local/Atlas)`);
    } catch (err) {
        console.warn('Local MongoDB connection failed. Falling back to In-Memory MongoDB...', err.message);
        mongoServer = await MongoMemoryServer.create();
        const inMemoryUri = mongoServer.getUri();
        await mongoose.connect(inMemoryUri);
        console.log(`Connected to In-Memory MongoDB at ${inMemoryUri}`);
        await seedInMemoryDatabase();
    }
};

connectDB()
    .then(() => {
        io.on('connection', (socket) => {
            console.log('A user connected:', socket.id);

            socket.on('joinProject', (projectId) => {
                socket.join(`project-${projectId}`);
                console.log(`Socket ${socket.id} joined project-${projectId}`);
            });

            socket.on('disconnect', () => {
                console.log('User disconnected:', socket.id);
            });
        });

        server.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    })
    .catch((err) => {
        console.error('Error connecting to MongoDB:', err.message);
        process.exit(1);
    });
