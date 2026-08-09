import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import http from 'http';
import { Server } from 'socket.io';
import path from 'path';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import { MongoMemoryServer } from 'mongodb-memory-server';
import bcrypt from 'bcryptjs';
import User from './models/User.js';
import Project from './models/Project.js';
import Task from './models/Task.js';
import Submission from './models/Submission.js';
import SupervisionRequest from './models/SupervisionRequest.js';
import Message from './models/Message.js';

import authRoutes from './routes/authRoutes.js';
import projectRoutes from './routes/projectRoutes.js';
import taskRoutes from './routes/taskRoutes.js';
import userRoutes from './routes/userRoutes.js';
import workflowRoutes from './routes/workflowRoutes.js';
import submissionRoutes from './routes/submissionRoutes.js';
import messageRoutes from './routes/messageRoutes.js';

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: 'http://localhost:5173', // Must be specific origin when using credentials
        credentials: true,
    },
});

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

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
app.use('/api/messages', messageRoutes);

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

const PORT = process.env.PORT || 5001;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/academic-workflow-platform';

let mongoServer;

const seedFullDatabase = async () => {
    try {
        console.log('Seeding Realistic Academic Workflow Mock Data...');
        await User.deleteMany();
        await Project.deleteMany();
        await Task.deleteMany();
        await Submission.deleteMany();
        await SupervisionRequest.deleteMany();
        await Message.deleteMany();

        const salt = await bcrypt.genSalt(10);
        const password = await bcrypt.hash('password123', salt);

        // 1. Admin
        await User.create({
            name: 'Dean Eleanor Vance',
            email: 'admin@university.edu',
            password,
            role: 'Admin',
            bio: 'Head of Computing & Engineering Department. Academic Accreditation Chair.',
            phone: '+1 (555) 019-2831'
        });

        // 2. Supervisors
        const drSmith = await User.create({
            name: 'Dr. Robert Smith',
            email: 'smith@university.edu',
            password,
            role: 'Supervisor',
            bio: 'Professor of Distributed Systems & Embedded IoT. IEEE Senior Member.',
            phone: '+1 (555) 432-8765'
        });

        const drJohnson = await User.create({
            name: 'Dr. Elena Johnson',
            email: 'johnson@university.edu',
            password,
            role: 'Supervisor',
            bio: 'Associate Professor of Computer Vision & Applied Artificial Intelligence.',
            phone: '+1 (555) 876-1234'
        });

        // 3. Students
        const alice = await User.create({
            name: 'Alice Chen',
            email: 'alice@student.edu',
            password,
            role: 'Student',
            supervisor: drSmith._id,
            bio: 'Senior Software Engineering Student. Focus on Real-Time Distributed Architectures.',
            phone: '+1 (555) 234-5678'
        });

        const bob = await User.create({
            name: 'Bob Martinez',
            email: 'bob@student.edu',
            password,
            role: 'Student',
            supervisor: drSmith._id,
            bio: 'Computer Science Major. Specializing in Cloud Infrastructure & MQTT Streaming.',
            phone: '+1 (555) 345-6789'
        });

        const charlie = await User.create({
            name: 'Charlie Zhang',
            email: 'charlie@student.edu',
            password,
            role: 'Student',
            supervisor: drSmith._id,
            bio: 'AI & Data Science Senior. Neural Network Architectures & Image Segmentation.',
            phone: '+1 (555) 456-7890'
        });

        const david = await User.create({
            name: 'David Al-Mansoor',
            email: 'david@student.edu',
            password,
            role: 'Student',
            bio: 'Robotics & Autonomous Systems Major.',
            phone: '+1 (555) 567-8901'
        });

        // Update Doctor Smith's students array
        drSmith.students = [alice._id, bob._id, charlie._id];
        await drSmith.save();

        // 4. Projects
        // Project 1: IoT Healthcare (Approved, Alice & Bob)
        const proj1 = await Project.create({
            title: 'Distributed IoT Healthcare Telemetry & Remote Monitoring Platform',
            description: 'A fault-tolerant cloud platform ingesting continuous biometric MQTT streams from edge medical sensors with real-time anomaly detection, encrypted JWT sessions, and Doctor alerts.',
            status: 'Approved',
            inviteCode: 'IOT101',
            supervisor: drSmith._id,
            students: [alice._id, bob._id],
            pendingStudents: []
        });

        // Project 2: AI Medical Diagnostic (Approved, Charlie)
        const proj2 = await Project.create({
            title: 'Deep Learning Convolutional Pipeline for Histopathological Image Classification',
            description: 'Automated cellular tumor segmenter utilizing ResNet-50 transfer learning and attention maps to assist pathology faculty in accelerating biopsy review cycles.',
            status: 'Approved',
            inviteCode: 'MED202',
            supervisor: drSmith._id,
            students: [charlie._id],
            pendingStudents: []
        });

        // Project 3: Autonomous Drone Navigation (Pending, with Dr. Johnson)
        const proj3 = await Project.create({
            title: 'Autonomous Swarm UAV Path Planning in GPS-Denied Environments',
            description: 'Multi-agent deep reinforcement learning framework deploying Proximal Policy Optimization (PPO) for obstacle avoidance in subterranean tunnels.',
            status: 'Pending',
            inviteCode: 'DRN303',
            supervisor: drJohnson._id,
            students: [david._id],
            pendingStudents: []
        });

        // 5. Tasks for Project 1 (IoT Healthcare)
        const task1 = await Task.create({
            title: 'System Architecture Specification & IEEE Report Draft',
            description: 'Complete high-level architectural diagram, database schema ERDs, and draft Chapter 1-3 for thesis defense.',
            status: 'Done',
            project: proj1._id,
            assignedTo: alice._id,
            position: 0
        });

        const task2 = await Task.create({
            title: 'Edge MQTT Broker & Ingestion Pipeline',
            description: 'Configure Mosquitto MQTT broker with TLS encryption and build microservice consumer in Node.js.',
            status: 'Done',
            project: proj1._id,
            assignedTo: bob._id,
            position: 1
        });

        const task3 = await Task.create({
            title: 'React Real-Time Telemetry Dashboard & Vital Charts',
            description: 'Build interactive patient vital monitoring widgets using WebSocket channels, Tailwind CSS, and ChartJS.',
            status: 'In Progress',
            project: proj1._id,
            assignedTo: alice._id,
            position: 0
        });

        const task4 = await Task.create({
            title: 'JWT Role-Based Auth Middleware & AES-256 Patient Data Encryption',
            description: 'Implement secure cryptographic storage of patient biometric readings with HttpOnly session cookies.',
            status: 'Review',
            project: proj1._id,
            assignedTo: alice._id,
            position: 0
        });

        const task5 = await Task.create({
            title: 'Docker Containerization & Kubernetes Cluster Deployment',
            description: 'Write production Dockerfiles, docker-compose orchestration, and CI/CD automated test workflows.',
            status: 'To Do',
            project: proj1._id,
            assignedTo: bob._id,
            position: 0
        });

        // 6. Submissions for Task 4 (Code Deliverable)
        const submissionCode = `// Middleware: AES-256 Biometric Stream Verification
import crypto from 'crypto';
import jwt from 'jsonwebtoken';

const ALGORITHM = 'aes-256-gcm';
const SECRET_KEY = Buffer.from(process.env.ENCRYPTION_KEY || '01234567890123456789012345678901', 'utf-8');

export const verifyAndDecryptPayload = (req, res, next) => {
    try {
        const { iv, authTag, encryptedData } = req.body;
        if (!iv || !authTag || !encryptedData) {
            return res.status(400).json({ error: 'Malformed telemetry packet' });
        }

        const decipher = crypto.createDecipheriv(
            ALGORITHM, 
            SECRET_KEY, 
            Buffer.from(iv, 'hex')
        );
        decipher.setAuthTag(Buffer.from(authTag, 'hex'));

        let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
        decrypted += decipher.final('utf8');

        req.telemetryData = JSON.parse(decrypted);
        next();
    } catch (err) {
        return res.status(403).json({ error: 'Cipher verification failed: ' + err.message });
    }
};`;

        await Submission.create({
            task: task4._id,
            student: alice._id,
            version: 1,
            content: submissionCode,
            language: 'javascript',
            description: 'Initial implementation of GCM AES-256 payload decryption and authenticated verification pipeline.',
            status: 'Approved',
            overallFeedback: 'Excellent cryptographic structure, Alice! The GCM authentication tag guarantees tamper resistance. Ready for milestone defense.'
        });

        // 7. Supervision Request (David -> Dr. Smith)
        await SupervisionRequest.create({
            student: david._id,
            supervisor: drSmith._id,
            status: 'Pending'
        });

        // 8. Sample Team Messages in Chat
        await Message.create({
            project: proj1._id,
            sender: alice._id,
            content: 'Hey Bob! I just pushed the AES-256 decryption middleware for Task 4. Dr. Smith approved Version 1!'
        });

        await Message.create({
            project: proj1._id,
            sender: bob._id,
            content: 'Awesome work Alice! I am finishing the Docker deployment configs today so we can test the staging server.'
        });

        await Message.create({
            project: proj1._id,
            sender: drSmith._id,
            content: 'Great velocity team. Keep up the high standard for our upcoming sprint review on Thursday!'
        });

        console.log('Seeding complete! Full realistic mock database initialized.');
    } catch (err) {
        console.error('Error seeding full database:', err);
    }
};

const connectDB = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log(`Connected to MongoDB (Local/Atlas)`);
        await seedFullDatabase();
    } catch (err) {
        console.warn('Local MongoDB connection failed. Falling back to In-Memory MongoDB...', err.message);
        mongoServer = await MongoMemoryServer.create();
        const inMemoryUri = mongoServer.getUri();
        await mongoose.connect(inMemoryUri);
        console.log(`Connected to In-Memory MongoDB at ${inMemoryUri}`);
        await seedFullDatabase();
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

            socket.on('joinUserRoom', (userId) => {
                socket.join(`user-${userId}`);
                console.log(`Socket ${socket.id} joined user-${userId}`);
            });

            socket.on('sendMessage', (data) => {
                // data should contain { projectId, message }
                // Broadcast it to everyone else in the same room
                socket.to(`project-${data.projectId}`).emit('receiveMessage', data.message);
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
