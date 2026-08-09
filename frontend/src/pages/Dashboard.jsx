import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setProjects } from '../redux/projectSlice';
import { loginSuccess } from '../redux/authSlice';
import axios from 'axios';
import StudentWidgets from '../components/StudentWidgets';
import SupervisorWidgets from '../components/SupervisorWidgets';
import SupervisorSelection from '../components/SupervisorSelection';
import LiveTeamHub from '../components/LiveTeamHub';
import AdminDashboard from './AdminDashboard';
import { Sparkles, ShieldCheck, GraduationCap, Users } from 'lucide-react';

const Dashboard = () => {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const userRes = await axios.get('http://localhost:5001/api/auth/me');
                dispatch(loginSuccess(userRes.data));

                const projectRes = await axios.get('http://localhost:5001/api/projects');
                dispatch(setProjects(projectRes.data));
            } catch (err) {
                console.error('Failed to fetch dashboard data', err);
            }
        };

        fetchData();
    }, [dispatch]);

    const getRoleIcon = () => {
        if (user?.role === 'Admin') return <ShieldCheck className="text-[#1E3A2F]" size={22} />;
        if (user?.role === 'Supervisor') return <Users className="text-[#1E3A2F]" size={22} />;
        return <GraduationCap className="text-[#1E3A2F]" size={22} />;
    };

    return (
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8 pb-12">
            {/* Main Content Area */}
            <div className="flex-1 space-y-8 min-w-0">
                <header className="relative p-6 sm:p-8 rounded-[2rem] bg-white border border-[#E5ECE8] shadow-sm overflow-hidden flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EBF3EE] text-[#1E3A2F] text-xs font-bold border border-[#D1E7DD] mb-2">
                            <Sparkles size={13} /> {user?.role} Portal
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1E3A2F] tracking-tight">
                            Welcome back, {user?.name?.split(' ')[0]} 👋
                        </h1>
                        <p className="mt-1 text-xs sm:text-sm text-[#596F65]">
                            Here is what is happening across your academic workflows today.
                        </p>
                    </div>

                    <div className="flex items-center gap-3 bg-[#FAF9F5] border border-[#E5ECE8] px-4 py-3 rounded-2xl shrink-0">
                        <div className="w-10 h-10 rounded-xl bg-[#EBF3EE] flex items-center justify-center">
                            {getRoleIcon()}
                        </div>
                        <div className="text-left">
                            <p className="text-[10px] uppercase font-bold text-[#6B7F76] tracking-wider">Signed in as</p>
                            <p className="text-xs font-extrabold text-[#1E3A2F]">{user?.role} Portal</p>
                        </div>
                    </div>
                </header>

                {/* Role Based Widgets */}
                <div className="space-y-6">
                    {user?.role === 'Student' && (
                        user?.supervisor ? <StudentWidgets /> : <SupervisorSelection />
                    )}
                    {user?.role === 'Supervisor' && <SupervisorWidgets />}
                    {user?.role === 'Admin' && <AdminDashboard />}
                </div>
            </div>

            {/* Persistent Side Panel: Live Team Hub */}
            <div className="w-full lg:w-96 shrink-0">
                <LiveTeamHub />
            </div>
        </div>
    );
};

export default Dashboard;
