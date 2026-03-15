import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { FolderKanban, FileWarning, UsersRound, ArrowRight, Check, X, Bell } from 'lucide-react';
import { fetchPendingRequests, handleSupervisionRequest, addNewRequest } from '../redux/workflowSlice';
import socket from '../socket';

const SupervisorWidgets = () => {
    const dispatch = useDispatch();
    const { projects } = useSelector((state) => state.project);
    const { requests, isLoading: workflowLoading } = useSelector((state) => state.workflow);
    const [notifications, setNotifications] = React.useState([]);

    useEffect(() => {
        dispatch(fetchPendingRequests());

        const handleNewRequest = (requestData) => {
            // Update the redux store immediately to show it in the list
            dispatch(addNewRequest(requestData));

            // Show a visual toast notification
            const newNotification = {
                id: Date.now(),
                message: `New supervision request from ${requestData.student?.name || 'a student'}`,
            };
            
            setNotifications((prev) => [newNotification, ...prev]);

            // Auto-remove notification toast after 5 seconds
            setTimeout(() => {
                setNotifications((prev) => prev.filter(n => n.id !== newNotification.id));
            }, 5000);
        };

        socket.on('newSupervisionRequest', handleNewRequest);

        return () => {
            socket.off('newSupervisionRequest', handleNewRequest);
        };
    }, [dispatch]);

    const handleApprove = (id) => {
        dispatch(handleSupervisionRequest({ requestId: id, status: 'Approved' }));
    };

    const handleReject = (id) => {
        dispatch(handleSupervisionRequest({ requestId: id, status: 'Rejected' }));
    };

    const pendingProjects = projects.filter(p => p.status === 'Pending' || p.status === 'Edits Requested');
    const approvedProjects = projects.filter(p => p.status === 'Approved');

    return (
        <div className="space-y-6">
            {/* Top Metric Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-4">
                    <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
                        <FileWarning size={24} />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-slate-500">Pending Approval</p>
                        <h4 className="text-2xl font-bold text-slate-900">{pendingProjects.length}</h4>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-4">
                    <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
                        <FolderKanban size={24} />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-slate-500">Active Teams</p>
                        <h4 className="text-2xl font-bold text-slate-900">{approvedProjects.length}</h4>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-4">
                    <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
                        <UsersRound size={24} />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-slate-500">Total Students</p>
                        <h4 className="text-2xl font-bold text-slate-900">
                            {projects.reduce((total, p) => total + (p.students?.length || 0), 0)}
                        </h4>
                    </div>
                </div>
            </div>

            {/* Supervision Requests Widget (Full Width) */}
            {requests && requests.length > 0 && (
                <div className="bg-indigo-50 rounded-2xl border border-indigo-100 p-6 flex flex-col md:flex-row gap-6 items-center justify-between shadow-sm">
                    <div>
                        <h2 className="text-lg font-bold text-indigo-900 flex items-center gap-2">
                            <UsersRound size={20} />
                            Student Supervision Requests
                        </h2>
                        <p className="text-sm text-indigo-700 mt-1">
                            You have {requests.length} students waiting for you to supervise their academic projects.
                        </p>
                    </div>
                    <div className="flex flex-col gap-3 w-full md:w-auto">
                        {requests.map(req => (
                            <div key={req._id} className="bg-white px-5 py-3 rounded-xl border border-indigo-200 shadow-sm flex items-center justify-between gap-6 min-w-full md:min-w-[400px]">
                                <div>
                                    <h4 className="font-bold text-slate-900">{req.student?.name}</h4>
                                    <p className="text-xs text-slate-500">{req.student?.email}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => handleReject(req._id)}
                                        disabled={workflowLoading}
                                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                        title="Reject"
                                    >
                                        <X size={20} />
                                    </button>
                                    <button
                                        onClick={() => handleApprove(req._id)}
                                        disabled={workflowLoading}
                                        className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
                                    >
                                        <Check size={16} /> Approve Link
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Main Widget Area */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Pending Approvals List */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
                    <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
                        <h2 className="text-lg font-bold text-slate-800">Projects Pending Approval</h2>
                        <span className="text-xs font-semibold bg-amber-100 text-amber-700 px-2 py-1 rounded-full">{pendingProjects.length} Needs Review</span>
                    </div>
                    <div className="divide-y divide-slate-100 flex-1 overflow-auto max-h-[400px]">
                        {pendingProjects.length === 0 ? (
                            <div className="p-8 text-center text-slate-500 text-sm">No projects currently require your attention.</div>
                        ) : (
                            pendingProjects.map(project => (
                                <div key={project._id} className="p-6 hover:bg-slate-50 transition-colors">
                                    <h3 className="font-semibold text-slate-800 mb-1">{project.title}</h3>
                                    <p className="text-sm text-slate-500 line-clamp-2 mb-3">{project.description}</p>
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs font-medium text-slate-400">
                                            Submitted by: {project.students?.[0]?.name || 'Unknown'}
                                        </span>
                                        <Link
                                            to={`/project/${project._id}`}
                                            className="text-sm font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                                        >
                                            Review <ArrowRight size={14} />
                                        </Link>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* My Assigned Groups */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
                    <div className="px-6 py-5 border-b border-slate-100">
                        <h2 className="text-lg font-bold text-slate-800">My Assigned Groups</h2>
                    </div>
                    <div className="p-6 grid gap-4">
                        {approvedProjects.length === 0 ? (
                            <div className="p-8 text-center text-slate-500 text-sm border border-dashed rounded-xl">No active groups assigned yet.</div>
                        ) : (
                            approvedProjects.map(project => (
                                <Link
                                    key={project._id}
                                    to={`/project/${project._id}`}
                                    className="flex items-center justify-between p-4 rounded-xl border border-slate-200 hover:border-indigo-300 hover:shadow-sm transition-all group"
                                >
                                    <div>
                                        <h4 className="font-semibold text-slate-800 group-hover:text-indigo-600 transition-colors">{project.title}</h4>
                                        <p className="text-xs text-slate-500 mt-0.5">{project.students?.length || 0} Members</p>
                                    </div>
                                    <div className="text-slate-300 group-hover:text-indigo-500 transition-colors">
                                        <ArrowRight size={20} />
                                    </div>
                                </Link>
                            ))
                        )}
                    </div>
                </div>
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

export default SupervisorWidgets;
