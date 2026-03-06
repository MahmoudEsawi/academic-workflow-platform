# Academic Workflow Platform

A complete MERN stack application for managing academic graduation projects. Includes Role-Based Access Control, real-time Kanban board with Socket.io, and file uploads.

## Prerequisites
- Node.js (v18+)
- MongoDB (running locally on `127.0.0.1:27017` or configured via `.env` `MONGO_URI`)

## Terminal Run Commands

### Backend Initialization & Running
Open your terminal and run:
```bash
cd backend

# Install dependencies (already done if using this initialized folder)
npm install

# Seed the database with initial Users, Supervisors, and Admins
npm run seed

# Start the dev server
npm run dev
```

### Frontend Initialization & Running
Open a second terminal and run:
```bash
cd frontend

# Install dependencies
npm install --legacy-peer-deps

# Start the Vite React app
npm run dev
```

## Seeded Users (Password: `password123`)

**Admins:**
- `admin@university.edu`

**Supervisors:**
- `smith@university.edu`
- `johnson@university.edu`

**Students:**
- `alice@student.edu`
- `bob@student.edu`
- `charlie@student.edu`
