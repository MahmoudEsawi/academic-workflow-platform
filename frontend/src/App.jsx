import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import axios from 'axios';

// Ensure all Axios requests include cookies
axios.defaults.withCredentials = true;

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

// Create a wrapper component to use hooks inside Router
function AppContent() {
  const navigate = useNavigate();

  useEffect(() => {
      const responseInterceptor = axios.interceptors.response.use(
          (response) => response,
          (error) => {
              if (error.response && error.response.status === 401) {
                  // Session expired or no token — redirect to login
                  navigate('/login', { replace: true });
              } else if (error.response && error.response.status === 403) {
                  // If tenant unauthorized or strict role failure, bounce to dashboard
                  navigate('/dashboard', { replace: true });
                  alert("Unauthorized: You do not have permission to view this project.");
              }
              return Promise.reject(error);
          }
      );

      return () => {
          axios.interceptors.response.eject(responseInterceptor);
      };
  }, [navigate]);

  return (
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
  );
}

function App() {
    return (
        <Router>
            <AppContent />
        </Router>
    );
}

export default App;
