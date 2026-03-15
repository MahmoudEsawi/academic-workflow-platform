# 🎓 Academic Workflow Platform

<div align="center">
  <h3>A comprehensive MERN stack platform for managing academic graduation projects.</h3>
  <p>Streamline project tracking, role-based workflows, real-time collaboration, and document management in one unified workspace.</p>
</div>

---

## ✨ Key Features

- 🔐 **Secure Authentication:** Robust role-based access control (Admin, Supervisor, Student) with sessions fortified by `HttpOnly` secure cookies.
- 🤝 **Supervisor Linking System:** Students can browse and request linkages with available Doctors, while Supervisors manage incoming requests from their dashboards.
- 📋 **Real-Time Kanban Boards:** Drag-and-drop project task management synced instantly across all users using `Socket.io` and `react-beautiful-dnd`.
- 💬 **Live Chat Collaboration:** Integrated real-time messaging using Socket.io for dedicated team communication within the project workspace.
- 💻 **Advanced Code Submission Portal:** Students can submit task deliverables via multiple formats, including an embedded source code editor with `react-syntax-highlighter`.
- 👩‍🏫 **Interactive Review Workflows:** Doctors can step through versioned student submissions, review code formatting, and assign `Approved`, `Needs Revision`, or `Rejected` statuses.
- 📁 **Document & File Management:** Upload, store, and manage project deliverables securely with `Multer`.
- ⚡ **Modern & Responsive UI:** Built with React, Tailwind CSS v4, and Lucide Icons for a beautiful and accessible user experience.
- 🔄 **State Management:** Predictable global state handling using Redux Toolkit.

---

## 🛠️ Technology Stack

### Frontend (Client)
- **Framework:** React 19 + Vite
- **Styling:** Tailwind CSS v4
- **State Management:** Redux Toolkit (`@reduxjs/toolkit`)
- **Routing:** React Router v7
- **Drag & Drop:** `react-beautiful-dnd`
- **Real-time:** `socket.io-client`
- **Icons:** `lucide-react`

### Backend (Server)
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB & Mongoose
- **Authentication:** JSON Web Tokens (JWT) & bcryptjs
- **Real-time:** `socket.io`
- **File Uploads:** `multer`

---

## 🚀 Getting Started

Follow these steps to set up the project locally on your machine.

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher)
- [MongoDB](https://www.mongodb.com/) (running locally on `127.0.0.1:27017` or configured via `.env` file)

### 1. Clone the Repository

```bash
git clone https://github.com/MahmoudEsawi/academic-workflow-platform.git
cd academic-workflow-platform
```

### 2. Backend Setup

Open a terminal and navigate to the backend directory:

```bash
cd backend

# Install necessary dependencies
npm install

# Seed the database with initial Users, Supervisors, and Admins
npm run seed

# Start the backend development server (runs on port 5000 by default)
npm run dev
```

### 3. Frontend Setup

Open a new terminal window and navigate to the frontend directory:

```bash
cd frontend

# Install dependencies (using legacy-peer-deps for react-beautiful-dnd compatibility)
npm install --legacy-peer-deps

# Start the Vite development server
npm run dev
```

The frontend application should now be running at `http://localhost:5173`.

---

## 🔑 Demo & Test Accounts

The `npm run seed` command provisions the database with several test accounts. You can log in using any of the emails below and the common password: `password123`.

| Role | Email Address |
| :--- | :--- |
| **Admin** | `admin@university.edu` |
| **Supervisor** | `smith@university.edu`<br>`johnson@university.edu` |
| **Student** | `alice@student.edu`<br>`bob@student.edu`<br>`charlie@student.edu` |

---

## 📂 Project Structure

```text
academic-workflow-platform/
├── backend/
│   ├── controllers/    # Route logic handlers
│   ├── middleware/     # Auth & validation middlewares
│   ├── models/         # Mongoose schema definitions
│   ├── routes/         # Express API routes
│   ├── uploads/        # Directory for uploaded files
│   ├── seed.js         # Database seeding script
│   └── server.js       # Express & Socket.io entry point
└── frontend/
    ├── public/         # Static assets
    └── src/
        ├── assets/     # Images & icons
        ├── components/ # Reusable React components (KanbanBoard, Navbar, etc.)
        ├── pages/      # Route pages (Dashboard, Login, ProjectDetails)
        ├── redux/      # Redux store and slices (auth, project)
        ├── App.jsx     # Root application component
        └── socket.js   # Socket.io client configuration
```

<div align="center">
  <i>Built with ❤️ for the academic community.</i>
</div>
