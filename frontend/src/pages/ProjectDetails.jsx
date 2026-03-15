import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setCurrentProject, setTasks, updateTaskInStore, updateProjectStatusInStore, updateProjectInStore } from '../redux/projectSlice';
import KanbanBoard from '../components/KanbanBoard';
import ChatPanel from '../components/ChatPanel';
import { MessageCircle } from 'lucide-react';
import axios from 'axios';
import socket from '../socket';

const ProjectDetails = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const { currentProject, tasks } = useSelector((state) => state.project);
    const { user } = useSelector((state) => state.auth);
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [actionLoading, setActionLoading] = useState(null);

    useEffect(() => {
        const fetchProjectAndTasks = async () => {
            try {
                const [projectRes, tasksRes] = await Promise.all([
                    axios.get(`http://localhost:5001/api/projects/${id}`),
                    axios.get(`http://localhost:5001/api/tasks/project/${id}`)
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
            dispatch(updateProjectInStore(project));
        });

        return () => {
            socket.off('taskUpdated');
            socket.off(`project-${id}-updated`);
        };
    }, [id, dispatch]);

    const handleStatusChange = async (newStatus) => {
        try {
            await axios.put(`http://localhost:5001/api/projects/${id}/status`, { status: newStatus });
            // Will be updated via socket
        } catch (error) {
            console.error('Failed to update status');
        }
    };

    const handleMemberAction = async (studentId, action) => {
        setActionLoading(studentId);
        try {
            await axios.put(`http://localhost:5001/api/projects/${id}/members/${studentId}`, { action });
            // State updates automatically via Socket.io
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to manage team member');
        } finally {
            setActionLoading(null);
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
                        {(user?.role === 'Supervisor' || user?.role === 'Admin') && (
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

            {/* Team Members Section */}
            <div className="bg-white shadow sm:rounded-lg mb-8 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4 border-b pb-2">Team Overview</h3>
                
                <div className="grid md:grid-cols-2 gap-8">
                    {/* Active Members */}
                    <div>
                        <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Active Members</h4>
                        {!currentProject.students || currentProject.students.length === 0 ? (
                            <p className="text-sm text-gray-400 italic">No active members yet.</p>
                        ) : (
                            <ul className="space-y-3">
                                {currentProject.students.map(member => (
                                        <li key={member._id} className="flex items-center gap-3 bg-gray-50 p-2 rounded-lg border border-gray-100">
                                        <div className="w-8 h-8 rounded-full bg-[#00244D]/15 text-[#00244D] flex items-center justify-center font-bold text-sm">
                                            {member.name ? member.name.charAt(0) : '?'}
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">{member.name || 'Unknown'}</p>
                                            <p className="text-xs text-gray-500">{member.email || 'No email'}</p>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    {/* Pending Requests (Supervisor only) */}
                    {(user?.role === 'Supervisor' || user?.role === 'Admin') && (
                        <div>
                            <h4 className="text-sm font-semibold text-amber-600 uppercase tracking-wider mb-3">Pending Join Requests</h4>
                            {!currentProject.pendingStudents || currentProject.pendingStudents.length === 0 ? (
                                <p className="text-sm text-gray-400 italic">No pending requests.</p>
                            ) : (
                                <ul className="space-y-3">
                                    {currentProject.pendingStudents.map(student => (
                                        <li key={student._id} className="flex items-center justify-between bg-amber-50 p-3 rounded-lg border border-amber-100">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-amber-200 text-amber-800 flex items-center justify-center font-bold text-sm">
                                                    {student.name ? student.name.charAt(0) : '?'}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-amber-900">{student.name || 'Unknown'}</p>
                                                    <p className="text-xs text-amber-700">{student.email || 'No email'}</p>
                                                </div>
                                            </div>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleMemberAction(student._id, 'reject')}
                                                    disabled={actionLoading === student._id}
                                                    className="px-2 py-1 text-xs font-semibold text-red-600 bg-red-100 hover:bg-red-200 rounded disabled:opacity-50"
                                                >
                                                    Reject
                                                </button>
                                                <button
                                                    onClick={() => handleMemberAction(student._id, 'approve')}
                                                    disabled={actionLoading === student._id}
                                                    className="px-2 py-1 text-xs font-semibold text-emerald-700 bg-emerald-100 hover:bg-emerald-200 rounded disabled:opacity-50"
                                                >
                                                    Approve
                                                </button>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    )}
                </div>
            </div>

            <div className="mb-6 flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-900">Task Board</h2>
                <div className="flex gap-4">
                    <button 
                        onClick={() => setIsChatOpen(true)}
                        className="flex items-center gap-2 bg-[#00244D]/15 text-[#00244D] px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#00244D]/20 transition-colors"
                    >
                        <MessageCircle size={18} />
                        Project Chat
                    </button>
                    <button className="bg-[#00244D] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#003366] transition-colors">
                        Add Task
                    </button>
                </div>
            </div>

            <KanbanBoard projectId={id} tasks={tasks} />

            <ChatPanel
                isOpen={isChatOpen}
                onClose={() => setIsChatOpen(false)}
                projectId={id}
                currentUserId={user?._id}
            />
        </div>
    );
};

export default ProjectDetails;
