import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import RootRedirect from './components/RootRedirect';
import Layout from './components/Layout';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import ProjectDetails from './pages/ProjectDetails';
import SubmitProposal from './pages/SubmitProposal';
import StudentWorkspace from './pages/StudentWorkspace';
import SubmissionReview from './pages/SubmissionReview';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Root redirect handles users just going to '/' */}
        <Route path="/" element={<RootRedirect />} />

        {/* Dashboards wrapped in Layout (Navbar + Sidebar) */}
        <Route element={<Layout />}>

          <Route element={<ProtectedRoute allowedRoles={['Student', 'Supervisor', 'Admin']} />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/project/:id" element={<ProjectDetails />} />
          </Route>

          <Route element={<ProtectedRoute allowedRoles={['Student']} />}>
            <Route path="/dashboard/submit" element={<SubmitProposal />} />
            <Route path="/workspace/:taskId" element={<StudentWorkspace />} />
          </Route>

          <Route element={<ProtectedRoute allowedRoles={['Supervisor', 'Admin']} />}>
            <Route path="/review/:taskId" element={<SubmissionReview />} />
          </Route>

        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
