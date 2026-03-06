import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setProjects } from '../redux/projectSlice';
import { Link } from 'react-router-dom';
import axios from 'axios';

const SupervisorDashboard = () => {
    const dispatch = useDispatch();
    const { projects } = useSelector((state) => state.project);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const token = localStorage.getItem('token');
                const { data } = await axios.get('http://localhost:5001/api/projects', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                dispatch(setProjects(data));
            } catch {
                console.error('Failed to fetch projects');
            }
        };
        fetchProjects();
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
        </div>
    );
};

export default SupervisorDashboard;
