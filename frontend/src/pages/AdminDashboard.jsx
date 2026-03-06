import React from 'react';
import { useSelector } from 'react-redux';

const AdminDashboard = () => {
    const { user } = useSelector(state => state.auth);
    return (
        <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Admin Dashboard</h1>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h2 className="text-lg font-semibold text-gray-800">Welcome back, {user?.name}!</h2>
                <p className="mt-2 text-gray-600">You have full administrative access. Select an option from the sidebar to manage users, projects, and platform settings.</p>
            </div>
        </div>
    );
};

export default AdminDashboard;
