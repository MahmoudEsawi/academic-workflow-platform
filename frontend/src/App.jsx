import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ProjectDetails from './pages/ProjectDetails';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 font-sans">
        <Navbar />
        <main>
          <Routes>
            <Route path="/login" element={<Login />} />

            <Route element={<ProtectedRoute allowedRoles={['Student', 'Supervisor', 'Admin']} />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/project/:id" element={<ProjectDetails />} />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
