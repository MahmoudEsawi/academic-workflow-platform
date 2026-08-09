import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setCurrentProject, setTasks, updateTaskInStore, updateProjectStatusInStore, updateProjectInStore } from '../redux/projectSlice';
import KanbanBoard from '../components/KanbanBoard';
import ChatPanel from '../components/ChatPanel';
import { MessageSquare, Copy, CheckCheck, KeyRound, ArrowLeft, Users, Plus, Check, X } from 'lucide-react';
import axios from 'axios';
import socket from '../socket';

const ProjectDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { currentProject, tasks } = useSelector((state) => state.project);
    const { user } = useSelector((state) => state.auth);
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [actionLoading, setActionLoading] = useState(null);
    const [copied, setCopied] = useState(false);

    // Modal state for adding a task
    const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
    const [taskTitle, setTaskTitle] = useState('');
    const [taskDesc, setTaskDesc] = useState('');
    const [creatingTask, setCreatingTask] = useState(false);

    useEffect(() => {
        const fetchProjectAndTasks = async () => {
            try {
                const [projectRes, tasksRes] = await Promise.all([
                    axios.get(`http://localhost:5001/api/projects/${id}`),
                    axios.get(`http://localhost:5001/api/tasks/project/${id}`)
                ]);

                dispatch(setCurrentProject(projectRes.data));
                dispatch(setTasks(tasksRes.data));

                if (!socket.connected) {
                    socket.connect();
                }
                socket.emit('joinProject', id);
            } catch (error) {
                console.error('Failed to fetch project details', error);
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
            dispatch(updateProjectStatusInStore({ projectId: id, status: newStatus }));
        } catch (error) {
            console.error('Failed to update status');
        }
    };

    const handleMemberAction = async (studentId, action) => {
        setActionLoading(studentId);
        try {
            await axios.put(`http://localhost:5001/api/projects/${id}/members/${studentId}`, { action });
            const { data } = await axios.get(`http://localhost:5001/api/projects/${id}`);
            dispatch(setCurrentProject(data));
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to manage team member');
        } finally {
            setActionLoading(null);
        }
    };

    const handleCreateTask = async (e) => {
        e.preventDefault();
        if (!taskTitle.trim()) return;
        setCreatingTask(true);
        try {
            const { data } = await axios.post('http://localhost:5001/api/tasks', {
                title: taskTitle,
                description: taskDesc,
                projectId: id,
                status: 'To Do'
            });
            dispatch(setTasks([...(tasks || []), data]));
            setTaskTitle('');
            setTaskDesc('');
            setIsTaskModalOpen(false);
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to create task');
        } finally {
            setCreatingTask(false);
        }
    };

    const handleCopyInvite = () => {
        if (currentProject?.inviteCode) {
            navigator.clipboard.writeText(currentProject.inviteCode);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    if (!currentProject) {
        return (
            <div className="max-w-7xl mx-auto py-16 text-center text-[#6B7F76]">
                <div className="w-8 h-8 border-2 border-[#1E3A2F] border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                <p className="text-xs">Loading project workspace...</p>
            </div>
        );
    }

    const statusBadgeStyles = {
        'Approved': 'bg-emerald-50 text-emerald-800 border-emerald-200',
        'Rejected': 'bg-rose-50 text-rose-800 border-rose-200',
        'Pending': 'bg-amber-50 text-amber-800 border-amber-200',
        'Edits Requested': 'bg-blue-50 text-blue-800 border-blue-200'
    };

    return (
        <div className="max-w-7xl mx-auto space-y-8 pb-12">
            {/* Top Navigation Bar */}
            <div className="flex items-center gap-4">
                <button
                    onClick={() => navigate('/dashboard')}
                    className="p-2.5 bg-white border border-[#E5ECE8] hover:bg-[#FAF9F5] rounded-2xl text-[#1E3A2F] transition-all shadow-sm"
                >
                    <ArrowLeft size={18} />
                </button>
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 flex-wrap">
                        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1E3A2F] tracking-tight truncate">
                            {currentProject.title}
                        </h1>
                        <span className={`text-xs font-bold px-3 py-1 rounded-full border ${statusBadgeStyles[currentProject.status] || statusBadgeStyles['Pending']}`}>
                            {currentProject.status}
                        </span>
                    </div>
                </div>

                {/* Right Action: Project Chat Toggle */}
                <button 
                    onClick={() => setIsChatOpen(true)}
                    className="flex items-center gap-2 bg-[#EBF3EE] hover:bg-[#D1E7DD] border border-[#D1E7DD] text-[#1E3A2F] px-4 py-2.5 rounded-full text-xs font-bold transition-all shrink-0"
                >
                    <MessageSquare size={15} />
                    <span>Project Chat</span>
                </button>
            </div>

            {/* Project Overview Card */}
            <div className="bg-white rounded-[2rem] p-6 sm:p-8 border border-[#E5ECE8] shadow-sm space-y-6">
                <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-[#6B7F76] mb-2">Project Abstract</h3>
                    <p className="text-[#4A5D54] text-xs sm:text-sm leading-relaxed">{currentProject.description}</p>
                </div>

                {/* Supervisor Approval Buttons */}
                {(user?.role === 'Supervisor' || user?.role === 'Admin') && (
                    <div className="pt-4 border-t border-[#F0EFEA] flex flex-wrap items-center justify-between gap-4">
                        <span className="text-xs font-bold text-[#6B7F76]">Faculty Advisor Actions:</span>
                        <div className="flex flex-wrap gap-2">
                            <button
                                onClick={() => handleStatusChange('Approved')}
                                className="px-4 py-2 bg-emerald-50 hover:bg-emerald-600 hover:text-white border border-emerald-200 text-emerald-800 text-xs font-bold rounded-xl transition-all"
                            >
                                ✓ Mark Approved
                            </button>
                            <button
                                onClick={() => handleStatusChange('Edits Requested')}
                                className="px-4 py-2 bg-blue-50 hover:bg-blue-600 hover:text-white border border-blue-200 text-blue-800 text-xs font-bold rounded-xl transition-all"
                            >
                                ✎ Request Revisions
                            </button>
                            <button
                                onClick={() => handleStatusChange('Rejected')}
                                className="px-4 py-2 bg-rose-50 hover:bg-rose-600 hover:text-white border border-rose-200 text-rose-800 text-xs font-bold rounded-xl transition-all"
                            >
                                ✕ Reject
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Team Members & Invite Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Active Members */}
                <div className="lg:col-span-2 bg-white rounded-[2rem] p-6 sm:p-8 border border-[#E5ECE8] shadow-sm space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-[#F0EFEA]">
                        <h3 className="text-sm font-bold text-[#1E3A2F] flex items-center gap-2">
                            <Users size={16} className="text-[#3E735E]" />
                            Team Roster ({currentProject.students?.length || 0})
                        </h3>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-3">
                        {!currentProject.students || currentProject.students.length === 0 ? (
                            <p className="text-xs text-[#6B7F76] italic col-span-2">No students assigned yet.</p>
                        ) : (
                            currentProject.students.map(member => (
                                <div key={member._id} className="flex items-center gap-3 bg-[#FAF9F5] p-3 rounded-2xl border border-[#E5ECE8]">
                                    <div className="w-9 h-9 rounded-xl bg-[#1E3A2F] text-white flex items-center justify-center font-bold text-xs shrink-0">
                                        {member.name ? member.name.charAt(0) : '?'}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="text-xs font-bold text-[#1E3A2F] truncate">{member.name}</p>
                                        <p className="text-[11px] text-[#6B7F76] truncate">{member.email}</p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Pending Requests for Supervisor */}
                    {(user?.role === 'Supervisor' || user?.role === 'Admin') && currentProject.pendingStudents?.length > 0 && (
                        <div className="pt-4 border-t border-[#F0EFEA]">
                            <h4 className="text-xs font-bold text-amber-800 uppercase tracking-wider mb-3">
                                Pending Join Requests ({currentProject.pendingStudents.length})
                            </h4>
                            <div className="space-y-2">
                                {currentProject.pendingStudents.map(student => (
                                    <div key={student._id} className="flex items-center justify-between bg-amber-50 border border-amber-200 p-3 rounded-2xl">
                                        <div>
                                            <p className="text-xs font-bold text-amber-900">{student.name}</p>
                                            <p className="text-[10px] text-amber-700">{student.email}</p>
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleMemberAction(student._id, 'reject')}
                                                disabled={actionLoading === student._id}
                                                className="p-1.5 text-rose-600 hover:bg-rose-100 rounded-lg text-xs"
                                                title="Decline"
                                            >
                                                <X size={16} />
                                            </button>
                                            <button
                                                onClick={() => handleMemberAction(student._id, 'approve')}
                                                disabled={actionLoading === student._id}
                                                className="flex items-center gap-1 px-3 py-1 bg-[#1E3A2F] text-white text-xs font-bold rounded-lg hover:bg-[#142820]"
                                            >
                                                <Check size={13} /> Accept
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Invite Code Box */}
                <div className="bg-white rounded-[2rem] p-6 sm:p-8 border border-[#E5ECE8] shadow-sm flex flex-col justify-between">
                    <div>
                        <div className="flex items-center gap-2 text-[#1E3A2F] mb-1.5">
                            <KeyRound size={16} className="text-[#3E735E]" />
                            <h3 className="text-sm font-bold text-[#1E3A2F]">Invite Teammates</h3>
                        </div>
                        <p className="text-xs text-[#596F65] leading-relaxed">
                            Share this unique 6-character access code with students who need to join your graduation group.
                        </p>
                    </div>

                    <div className="bg-[#FAF9F5] rounded-2xl p-4 my-4 border border-[#E5ECE8] flex items-center justify-between">
                        <div>
                            <span className="text-[10px] uppercase font-bold text-[#6B7F76] tracking-wider block">Access Code</span>
                            <span className="text-2xl font-mono font-extrabold text-[#1E3A2F] tracking-widest">{currentProject.inviteCode || 'N/A'}</span>
                        </div>
                        <button
                            onClick={handleCopyInvite}
                            className="p-2.5 bg-white hover:bg-[#F4F2EC] border border-[#D5DDD8] rounded-xl text-[#1E3A2F] text-xs font-bold transition-all flex items-center gap-1 shadow-sm"
                            title="Copy code"
                        >
                            {copied ? <CheckCheck size={16} className="text-emerald-600" /> : <Copy size={16} />}
                        </button>
                    </div>

                    <div className="text-[11px] text-[#6B7F76]">
                        Advisor: <span className="text-[#1E3A2F] font-bold">{currentProject.supervisor?.name || 'Unassigned'}</span>
                    </div>
                </div>
            </div>

            {/* Task Board Header & Kanban */}
            <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-xl font-extrabold text-[#1E3A2F] tracking-tight">Milestone Task Board</h2>
                        <p className="text-xs text-[#596F65]">Drag and drop deliverables between sprint columns</p>
                    </div>
                    <button
                        onClick={() => setIsTaskModalOpen(true)}
                        className="flex items-center justify-center gap-2 bg-[#1E3A2F] hover:bg-[#142820] text-white text-xs font-bold px-5 py-2.5 rounded-full transition-all shadow-sm"
                    >
                        <Plus size={16} />
                        <span>Add Task</span>
                    </button>
                </div>

                <KanbanBoard projectId={id} tasks={tasks} />
            </div>

            {/* Add Task Modal */}
            {isTaskModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#142820]/60 backdrop-blur-sm">
                    <div className="bg-white border border-[#E5ECE8] rounded-[2rem] p-6 w-full max-w-md shadow-2xl space-y-5 animate-fadeIn">
                        <div className="flex items-center justify-between">
                            <h3 className="text-base font-bold text-[#1E3A2F]">Create New Task</h3>
                            <button
                                onClick={() => setIsTaskModalOpen(false)}
                                className="p-1.5 text-slate-400 hover:text-[#1E3A2F] rounded-lg"
                            >
                                <X size={18} />
                            </button>
                        </div>
                        <form onSubmit={handleCreateTask} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-[#1E3A2F] mb-1">Task Title</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="e.g. Implement JWT Auth Middleware"
                                    value={taskTitle}
                                    onChange={(e) => setTaskTitle(e.target.value)}
                                    className="w-full px-3.5 py-2.5 bg-[#FAF9F5] border border-[#D5DDD8] rounded-xl text-xs text-[#1A2421] focus:outline-none focus:border-[#1E3A2F]"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-[#1E3A2F] mb-1">Description / Deliverable</label>
                                <textarea
                                    rows={3}
                                    placeholder="Detailed requirements for this task..."
                                    value={taskDesc}
                                    onChange={(e) => setTaskDesc(e.target.value)}
                                    className="w-full px-3.5 py-2.5 bg-[#FAF9F5] border border-[#D5DDD8] rounded-xl text-xs text-[#1A2421] focus:outline-none focus:border-[#1E3A2F] resize-none"
                                />
                            </div>
                            <div className="flex justify-end gap-2 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setIsTaskModalOpen(false)}
                                    className="px-4 py-2 bg-[#FAF9F5] hover:bg-[#F4F2EC] text-[#596F65] text-xs font-bold rounded-xl"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={creatingTask}
                                    className="px-5 py-2 bg-[#1E3A2F] hover:bg-[#142820] text-white text-xs font-bold rounded-xl shadow-sm disabled:opacity-50"
                                >
                                    {creatingTask ? 'Saving...' : 'Create Task'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Chat Drawer */}
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
