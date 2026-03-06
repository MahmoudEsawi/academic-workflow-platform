import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const RootRedirect = () => {
    const { isAuthenticated, user } = useSelector(state => state.auth);

    if (!isAuthenticated) return <Navigate to="/login" replace />;

    // Since Dashboard dynamically handles widgets by role, they all go to /dashboard
    if (user && ['Admin', 'Supervisor', 'Student'].includes(user.role)) {
        return <Navigate to="/dashboard" replace />;
    }

    return <Navigate to="/login" replace />;
};

export default RootRedirect;
