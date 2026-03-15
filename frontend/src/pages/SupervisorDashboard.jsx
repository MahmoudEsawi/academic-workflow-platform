import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setProjects } from '../redux/projectSlice';
import { Link } from 'react-router-dom';
import { Bell, X } from 'lucide-react';
import axios from 'axios';
import socket from '../socket';

const SupervisorDashboard = () => {
    const dispatch = useDispatch();
    const { projects } = useSelector((state) => state.project);
    const [notifications, setNotifications] = React.useState([]);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const { data } = await axios.get('http://localhost:5001/api/projects');
                dispatch(setProjects(data));
            } catch {
                console.error('Failed to fetch projects');
            }
        };
        fetchProjects();

        // Listen for real-time supervision requests
        const handleNewRequest = (requestData) => {
            const newNotification = {
                id: Date.now(),
                message: `New supervision request from ${requestData.student?.name || 'a student'}`,
                time: new Date(),
            };
            
            setNotifications((prev) => [newNotification, ...prev]);

            // Auto-remove notification after 5 seconds
            setTimeout(() => {
                setNotifications((prev) => prev.filter(n => n.id !== newNotification.id));
            }, 5000);
        };

        socket.on('newSupervisionRequest', handleNewRequest);

        return () => {
            socket.off('newSupervisionRequest', handleNewRequest);
        };
    }, [dispatch]);

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Supervisor Dashboard</h1>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {projects.map((project) => (
                    <Link
                        key={project._id}
                        to={`/project/${project._id}`}
                        className="block bg-white rounded-lg shadow hover:shadow-md transition-shadow duration-200 border border-gray-200"
                    >
                        <div className="p-6">
                            <h3 className="text-lg font-semibold text-gray-900 truncate">
                                {project.title}
                            </h3>
                            <p className="mt-2 text-sm text-gray-600 line-clamp-2">
                                {project.description}
                            </p>
                            <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
                                <span className="bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full">{project.status}</span>
                                <span>{new Date(project.createdAt).toLocaleDateString()}</span>
                            </div>
                        </div>
                    </Link>
                ))}
                {projects.length === 0 && (
                    <div className="col-span-full text-center py-12 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                        <p className="text-gray-500">No projects currently assigned to you.</p>
                    </div>
                )}
            </div>

            {/* Real-time Notification Container */}
            <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
                {notifications.map((notif) => (
                    <div 
                        key={notif.id} 
                        className="bg-white border-l-4 border-indigo-500 shadow-xl rounded-md p-4 flex items-start gap-3 w-80 animate-[slideIn_0.3s_ease-out_forwards]"
                    >
                        <div className="bg-indigo-100 p-2 rounded-full text-indigo-600 shrink-0">
                            <Bell size={20} />
                        </div>
                        <div className="flex-1">
                            <h4 className="text-sm font-semibold text-gray-900">New Request</h4>
                            <p className="text-sm text-gray-600 mt-1">{notif.message}</p>
                            <span className="text-xs text-gray-400 block mt-2">Just now</span>
                        </div>
                        <button 
                            onClick={() => setNotifications(prev => prev.filter(n => n.id !== notif.id))}
                            className="text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <X size={16} />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SupervisorDashboard;
