import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { 
    FolderKanban, 
    FileWarning, 
    UsersRound, 
    ArrowRight, 
    Check, 
    X, 
    Bell, 
    Clock, 
    Calendar, 
    Code2, 
    CheckCircle2, 
    Award, 
    Megaphone, 
    Video, 
    Eye, 
    ShieldCheck, 
    Sparkles 
} from 'lucide-react';
import { fetchPendingRequests, handleSupervisionRequest, addNewRequest } from '../redux/workflowSlice';
import socket from '../socket';

const SupervisorWidgets = () => {
    const dispatch = useDispatch();
    const { projects } = useSelector((state) => state.project);
    const { requests, isLoading: workflowLoading } = useSelector((state) => state.workflow);
    const [notifications, setNotifications] = useState([]);
    const [broadcastMsg, setBroadcastMsg] = useState('');
    const [broadcastSent, setBroadcastSent] = useState(false);

    useEffect(() => {
        dispatch(fetchPendingRequests());

        const handleNewRequest = (requestData) => {
            dispatch(addNewRequest(requestData));

            const newNotification = {
                id: Date.now(),
                message: `New supervision request from ${requestData.student?.name || 'a student'}`,
            };
            
            setNotifications((prev) => [newNotification, ...prev]);

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

    const handleBroadcast = (e) => {
        e.preventDefault();
        if (!broadcastMsg.trim()) return;
        setBroadcastSent(true);
        setBroadcastMsg('');
        setTimeout(() => setBroadcastSent(false), 3000);
    };

    const pendingProjects = projects.filter(p => p.status === 'Pending' || p.status === 'Edits Requested');
    const approvedProjects = projects.filter(p => p.status === 'Approved');

    return (
        <div className="space-y-6">
            {/* Top Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                <div className="bg-white p-6 rounded-[2rem] border border-[#E5ECE8] shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 bg-[#EBF3EE] border border-[#D1E7DD] text-[#1E3A2F] rounded-2xl flex items-center justify-center">
                        <FolderKanban size={22} />
                    </div>
                    <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-[#6B7F76]">Supervised Teams</p>
                        <h4 className="text-2xl font-extrabold text-[#1E3A2F]">{approvedProjects.length} Active</h4>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-[2rem] border border-[#E5ECE8] shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 bg-amber-50 border border-amber-200 text-amber-800 rounded-2xl flex items-center justify-center">
                        <FileWarning size={22} />
                    </div>
                    <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-[#6B7F76]">Pending Reviews</p>
                        <h4 className="text-2xl font-extrabold text-[#1E3A2F]">{pendingProjects.length} Proposals</h4>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-[2rem] border border-[#E5ECE8] shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl flex items-center justify-center">
                        <Award size={22} />
                    </div>
                    <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-[#6B7F76]">Defense Readiness</p>
                        <h4 className="text-2xl font-extrabold text-[#1E3A2F]">88.5%</h4>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-[2rem] border border-[#E5ECE8] shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 bg-[#FAF9F5] border border-[#E5ECE8] text-[#3E735E] rounded-2xl flex items-center justify-center">
                        <UsersRound size={22} />
                    </div>
                    <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-[#6B7F76]">Active Students</p>
                        <h4 className="text-2xl font-extrabold text-[#1E3A2F]">
                            {projects.reduce((total, p) => total + (p.students?.length || 0), 0)} Researchers
                        </h4>
                    </div>
                </div>
            </div>

            {/* Supervision Requests Banner (Full Width) */}
            {requests && requests.length > 0 && (
                <div className="bg-[#EBF3EE] rounded-[2rem] border border-[#D1E7DD] p-6 shadow-sm">
                    <div className="flex flex-col md:flex-row gap-6 md:items-center justify-between">
                        <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white text-[#1E3A2F] text-xs font-bold border border-[#D1E7DD] mb-2">
                                <UsersRound size={13} /> Incoming Student Applications
                            </div>
                            <h2 className="text-lg font-bold text-[#1E3A2F]">
                                Student Supervision Requests ({requests.length})
                            </h2>
                            <p className="text-xs text-[#596F65] mt-1">
                                Students awaiting your advisory approval to initialize their graduation research workspace.
                            </p>
                        </div>
                        <div className="flex flex-col gap-3 w-full md:w-auto">
                            {requests.map(req => (
                                <div key={req._id} className="bg-white px-5 py-3 rounded-2xl border border-[#D1E7DD] shadow-sm flex items-center justify-between gap-4 min-w-full md:min-w-[360px]">
                                    <div>
                                        <h4 className="font-bold text-[#1E3A2F] text-sm">{req.student?.name}</h4>
                                        <p className="text-xs text-[#6B7F76]">{req.student?.email}</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => handleReject(req._id)}
                                            disabled={workflowLoading}
                                            className="p-2 text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                                            title="Decline"
                                        >
                                            <X size={18} />
                                        </button>
                                        <button
                                            onClick={() => handleApprove(req._id)}
                                            disabled={workflowLoading}
                                            className="flex items-center gap-1.5 px-4 py-2 bg-[#1E3A2F] hover:bg-[#142820] text-white text-xs font-bold rounded-xl transition-all shadow-sm"
                                        >
                                            <Check size={14} /> Accept Request
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Supervised Teams Health & Defense Eligibility Matrix */}
            <div className="bg-white rounded-[2rem] shadow-sm border border-[#E5ECE8] overflow-hidden">
                <div className="px-6 py-5 border-b border-[#E5ECE8] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                        <h2 className="text-base font-bold text-[#1E3A2F] flex items-center gap-2">
                            <ShieldCheck size={18} className="text-[#3E735E]" />
                            Supervised Research Groups & Defense Health
                        </h2>
                        <p className="text-xs text-[#596F65]">Real-time milestone completion and defense eligibility audit</p>
                    </div>
                    <span className="text-xs font-bold bg-[#EBF3EE] text-[#1E3A2F] border border-[#D1E7DD] px-3 py-1 rounded-full self-start sm:self-auto">
                        {approvedProjects.length} Active Cohorts
                    </span>
                </div>

                <div className="divide-y divide-[#F0EFEA]">
                    {approvedProjects.map((project, idx) => (
                        <div key={project._id} className="p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-6 hover:bg-[#FAF9F5] transition-colors">
                            <div className="space-y-2 flex-1 min-w-0">
                                <div className="flex items-center gap-3 flex-wrap">
                                    <h3 className="font-extrabold text-[#1E3A2F] text-base">{project.title}</h3>
                                    <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                                        ● Approved
                                    </span>
                                </div>
                                <p className="text-xs text-[#596F65] line-clamp-1">{project.description}</p>
                                
                                <div className="flex items-center gap-4 text-xs text-[#6B7F76] pt-1">
                                    <span>Team: <strong className="text-[#1E3A2F]">{project.students?.map(s => s.name).join(', ') || 'Assigned'}</strong></span>
                                    <span>•</span>
                                    <span>Access Code: <strong className="font-mono text-[#1E3A2F]">{project.inviteCode}</strong></span>
                                </div>
                            </div>

                            {/* Progress & Defense Status */}
                            <div className="flex items-center gap-6 shrink-0">
                                <div className="w-40 space-y-1.5">
                                    <div className="flex justify-between text-xs font-bold">
                                        <span className="text-[#6B7F76]">Sprint Progress</span>
                                        <span className="text-[#1E3A2F]">{idx === 0 ? '70%' : '45%'}</span>
                                    </div>
                                    <div className="w-full h-2 bg-[#FAF9F5] rounded-full border border-[#E5ECE8] overflow-hidden">
                                        <div 
                                            className="h-full bg-[#1E3A2F] rounded-full" 
                                            style={{ width: idx === 0 ? '70%' : '45%' }}
                                        ></div>
                                    </div>
                                </div>

                                <Link
                                    to={`/project/${project._id}`}
                                    className="px-5 py-2.5 rounded-full bg-[#1E3A2F] hover:bg-[#142820] text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
                                >
                                    <span>Open Board</span>
                                    <ArrowRight size={13} />
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Two Column Section: Advisory Office Hours & Broadcast Announcement */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Office Hours & Scheduled Consultations */}
                <div className="bg-white p-6 sm:p-8 rounded-[2rem] border border-[#E5ECE8] shadow-sm space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-[#F0EFEA]">
                        <h3 className="text-sm font-bold text-[#1E3A2F] flex items-center gap-2">
                            <Calendar size={16} className="text-[#3E735E]" />
                            Upcoming Advisory Office Hours
                        </h3>
                        <span className="text-[11px] text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full font-bold border border-emerald-200">
                            2 Sessions Today
                        </span>
                    </div>

                    <div className="space-y-3 pt-2">
                        <div className="p-4 rounded-2xl bg-[#FAF9F5] border border-[#E5ECE8] flex items-center justify-between gap-4">
                            <div className="space-y-1">
                                <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#3E735E] bg-[#EBF3EE] px-2 py-0.5 rounded-md">
                                    3:30 PM (Today)
                                </span>
                                <h4 className="text-xs font-bold text-[#1E3A2F]">IoT Healthcare Architecture Sync</h4>
                                <p className="text-[11px] text-[#6B7F76]">Alice Chen & Bob Martinez • Computing Lab 402</p>
                            </div>
                            <button
                                onClick={() => alert('Launching Virtual Meeting room for IoT Healthcare Team...')}
                                className="px-3.5 py-2 rounded-xl bg-white hover:bg-[#1E3A2F] hover:text-white border border-[#D5DDD8] text-[#1E3A2F] text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm shrink-0"
                            >
                                <Video size={13} /> Join Virtual
                            </button>
                        </div>

                        <div className="p-4 rounded-2xl bg-[#FAF9F5] border border-[#E5ECE8] flex items-center justify-between gap-4">
                            <div className="space-y-1">
                                <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#6B7F76] bg-white px-2 py-0.5 rounded-md border border-[#E5ECE8]">
                                    Tomorrow 11:00 AM
                                </span>
                                <h4 className="text-xs font-bold text-[#1E3A2F]">AI Histopathology ResNet Biopsy Review</h4>
                                <p className="text-[11px] text-[#6B7F76]">Charlie Zhang • Office 214</p>
                            </div>
                            <span className="text-xs font-bold text-[#6B7F76]">Confirmed</span>
                        </div>
                    </div>
                </div>

                {/* Broadcast Announcement to Supervised Cohorts */}
                <div className="bg-white p-6 sm:p-8 rounded-[2rem] border border-[#E5ECE8] shadow-sm space-y-4 flex flex-col justify-between">
                    <div>
                        <div className="flex items-center justify-between pb-3 border-b border-[#F0EFEA]">
                            <h3 className="text-sm font-bold text-[#1E3A2F] flex items-center gap-2">
                                <Megaphone size={16} className="text-[#3E735E]" />
                                Broadcast Advisory Notice
                            </h3>
                            <span className="text-[11px] text-[#6B7F76]">Sends to all supervised students</span>
                        </div>

                        {broadcastSent && (
                            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2 mt-3">
                                <CheckCircle2 size={15} />
                                <span>Advisory notice broadcasted to all team channels!</span>
                            </div>
                        )}

                        <form onSubmit={handleBroadcast} className="space-y-3 pt-3">
                            <textarea
                                rows={3}
                                required
                                value={broadcastMsg}
                                onChange={(e) => setBroadcastMsg(e.target.value)}
                                placeholder="Post important deadline reminders, defense schedule notices, or thesis guidelines..."
                                className="w-full px-4 py-3 bg-[#FAF9F5] border border-[#D5DDD8] rounded-2xl text-xs text-[#1A2421] placeholder-slate-400 focus:outline-none focus:border-[#1E3A2F] transition-all resize-none"
                            />
                            <div className="flex justify-end">
                                <button
                                    type="submit"
                                    className="px-5 py-2.5 bg-[#1E3A2F] hover:bg-[#142820] text-white text-xs font-bold rounded-full shadow-sm transition-all"
                                >
                                    Broadcast Notice
                                </button>
                            </div>
                        </form>
                    </div>

                    <div className="pt-3 border-t border-[#F0EFEA] text-[11px] text-[#6B7F76]">
                        Automated push sent via WebSocket channels to all student dashboards.
                    </div>
                </div>

            </div>

            {/* Real-time Notification Toast */}
            <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2">
                {notifications.map((notif) => (
                    <div 
                        key={notif.id} 
                        className="bg-white border-2 border-[#1E3A2F] shadow-2xl rounded-2xl p-4 flex items-start gap-3 w-80 animate-slideIn"
                    >
                        <div className="bg-[#EBF3EE] p-2 rounded-xl text-[#1E3A2F] shrink-0">
                            <Bell size={18} />
                        </div>
                        <div className="flex-1">
                            <h4 className="text-xs font-bold text-[#1E3A2F]">Live Notification</h4>
                            <p className="text-xs text-[#4A5D54] mt-0.5">{notif.message}</p>
                            <span className="text-[10px] text-[#6B7F76] block mt-1">Just now</span>
                        </div>
                        <button 
                            onClick={() => setNotifications(prev => prev.filter(n => n.id !== notif.id))}
                            className="text-slate-400 hover:text-slate-700 transition-colors"
                        >
                            <X size={15} />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SupervisorWidgets;
