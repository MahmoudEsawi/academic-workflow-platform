import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setProjects } from '../redux/projectSlice';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Dashboard = () => {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    const { projects } = useSelector((state) => state.project);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const token = localStorage.getItem('token');
                const { data } = await axios.get('http://localhost:5000/api/projects', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                dispatch(setProjects(data));
            } catch (error) {
                console.error('Failed to fetch projects');
            }
        };
        fetchProjects();
    }, [dispatch]);

    const getStatusColor = (status) => {
        switch (status) {
            case 'Approved': return 'bg-green-100 text-green-800';
            case 'Rejected': return 'bg-red-100 text-red-800';
            case 'Edits Requested': return 'bg-yellow-100 text-yellow-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                {user.role === 'Student' && (
                    <button className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700">
                        Submit Proposal
                    </button>
                )}
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {projects.map((project) => (
                    <Link
                        key={project._id}
                        to={`/project/${project._id}`}
                        className="block bg-white rounded-lg shadow hover:shadow-md transition-shadow duration-200 border border-gray-200"
                    >
                        <div className="p-6">
                            <div className="flex justify-between items-start">
                                <h3 className="text-lg font-semibold text-gray-900 truncate">
                                    {project.title}
                                </h3>
                                <span className={`px-2 py-1 flex-shrink-0 text-xs rounded-full font-medium ${getStatusColor(project.status)}`}>
                                    {project.status}
                                </span>
                            </div>
                            <p className="mt-2 text-sm text-gray-600 line-clamp-2">
                                {project.description}
                            </p>
                            <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
                                <span>Supervisor: {project.supervisor?.name || 'Unassigned'}</span>
                                <span>{new Date(project.createdAt).toLocaleDateString()}</span>
                            </div>
                        </div>
                    </Link>
                ))}
                {projects.length === 0 && (
                    <div className="col-span-full text-center py-12 bg-gray-50 rounded-lg">
                        <p className="text-gray-500">No projects found.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
