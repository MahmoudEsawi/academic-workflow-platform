import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setProjects } from '../redux/projectSlice';
import { loginSuccess } from '../redux/authSlice';
import axios from 'axios';
import StudentWidgets from '../components/StudentWidgets';
import SupervisorWidgets from '../components/SupervisorWidgets';
import SupervisorSelection from '../components/SupervisorSelection';
import LiveTeamHub from '../components/LiveTeamHub';

const Dashboard = () => {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Re-fetch user data to get latest supervisor assignment
                const userRes = await axios.get('http://localhost:5001/api/auth/me');
                dispatch(loginSuccess(userRes.data));

                // Fetch projects
                const projectRes = await axios.get('http://localhost:5001/api/projects');
                dispatch(setProjects(projectRes.data));
            } catch (err) {
                console.error('Failed to fetch dashboard data', err);
            }
        };

        fetchData();
    }, [dispatch]);

    return (
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8">
            {/* Main Content Area */}
            <div className="flex-1 space-y-8">
                <header className="mb-8">
                    <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                        Welcome back, {user?.name.split(' ')[0]} 👋
                    </h1>
                    <p className="mt-2 text-sm text-slate-500 font-medium">
                        Here's your academic workflow overview for today.
                    </p>
                </header>

                {/* Role Based Widgets */}
                {user?.role === 'Student' && (
                    user?.supervisor ? <StudentWidgets /> : <SupervisorSelection />
                )}
                {user?.role === 'Supervisor' && <SupervisorWidgets />}
                {user?.role === 'Admin' && <div className="p-6 bg-white rounded-xl shadow-sm border border-slate-200">Admin Widgets Coming Soon</div>}
            </div>

            {/* Persistent Side Panel: Live Team Hub */}
            <div className="w-full lg:w-96 xl:w-[400px] shrink-0">
                <LiveTeamHub />
            </div>
        </div>
    );
};

export default Dashboard;
