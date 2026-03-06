import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setCurrentProject, setTasks, updateTaskInStore, updateProjectStatusInStore } from '../redux/projectSlice';
import KanbanBoard from '../components/KanbanBoard';
import axios from 'axios';
import socket from '../socket';

const ProjectDetails = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const { currentProject, tasks } = useSelector((state) => state.project);
    const { user } = useSelector((state) => state.auth);

    useEffect(() => {
        const fetchProjectAndTasks = async () => {
            try {
                const token = localStorage.getItem('token');
                const headers = { Authorization: `Bearer ${token}` };

                const [projectRes, tasksRes] = await Promise.all([
                    axios.get(`http://localhost:5001/api/projects/${id}`, { headers }),
                    axios.get(`http://localhost:5001/api/tasks/project/${id}`, { headers })
                ]);

                dispatch(setCurrentProject(projectRes.data));
                dispatch(setTasks(tasksRes.data));

                // Connect socket and join project room
                if (!socket.connected) {
                    socket.connect();
                }
                socket.emit('joinProject', id);
            } catch (error) {
                console.error('Failed to fetch project details');
            }
        };

        fetchProjectAndTasks();

        socket.on('taskUpdated', (task) => {
            dispatch(updateTaskInStore(task));
        });

        socket.on(`project-${id}-updated`, (project) => {
            dispatch(updateProjectStatusInStore(project));
        });

        return () => {
            socket.off('taskUpdated');
            socket.off(`project-${id}-updated`);
        };
    }, [id, dispatch]);

    const handleStatusChange = async (newStatus) => {
        try {
            const token = localStorage.getItem('token');
            await axios.put(`http://localhost:5001/api/projects/${id}/status`, { status: newStatus }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            // Will be updated via socket
        } catch (error) {
            console.error('Failed to update status');
        }
    };

    if (!currentProject) return <div className="p-8 text-center text-gray-500">Loading...</div>;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
                <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
                    <div>
                        <h3 className="text-lg leading-6 font-medium text-gray-900">{currentProject.title}</h3>
                        <p className="mt-1 max-w-2xl text-sm text-gray-500">Project details and progress.</p>
                    </div>
                    <div className="flex gap-2 items-center">
                        <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm font-medium">
                            {currentProject.status}
                        </span>
                        {(user.role === 'Supervisor' || user.role === 'Admin') && (
                            <div className="ml-4 flex gap-2">
                                <button
                                    onClick={() => handleStatusChange('Approved')}
                                    className="px-3 py-1.5 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 transition-colors"
                                >
                                    Approve
                                </button>
                                <button
                                    onClick={() => handleStatusChange('Rejected')}
                                    className="px-3 py-1.5 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700 transition-colors"
                                >
                                    Reject
                                </button>
                                <button
                                    onClick={() => handleStatusChange('Edits Requested')}
                                    className="px-3 py-1.5 bg-yellow-500 text-white text-sm font-medium rounded-md hover:bg-yellow-600 transition-colors"
                                >
                                    Request Edits
                                </button>
                            </div>
                        )}
                    </div>
                </div>
                <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
                    <p className="text-sm text-gray-900">{currentProject.description}</p>
                </div>
            </div>

            <div className="mb-6 flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-900">Task Board</h2>
                <button className="bg-indigo-600 text-white px-3 py-1.5 rounded text-sm hover:bg-indigo-700">
                    Add Task
                </button>
            </div>

            <KanbanBoard projectId={id} tasks={tasks} />
        </div>
    );
};

export default ProjectDetails;
