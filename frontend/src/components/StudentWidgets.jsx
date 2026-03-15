import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Layers, CheckCircle, Clock, UsersRound, Plus, LogIn } from 'lucide-react';
import axios from 'axios';

const StudentWidgets = () => {
    const { user } = useSelector((state) => state.auth);
    const { projects } = useSelector((state) => state.project);
    const myProject = projects[0]; // Assuming student has 1 active project

    const [availableTeams, setAvailableTeams] = useState([]);
    const [loadingAction, setLoadingAction] = useState(null);

    // Fetch available teams if student is not in one
    useEffect(() => {
        if (!myProject) {
            const fetchAvailableTeams = async () => {
                try {
                    const { data } = await axios.get('http://localhost:5001/api/projects/available');
                    
                    // Filter out projects where the student is already pending to avoid showing them as "Join"
                    const joinable = data.filter(p => !p.pendingStudents?.some(s => s._id === user._id || s === user._id));
                    setAvailableTeams(joinable);
                } catch (error) {
                    console.error('Failed to fetch available teams', error);
                }
            };
            fetchAvailableTeams();
        }
    }, [myProject, user._id]);

    const handleJoinTeam = async (projectId) => {
        setLoadingAction(projectId);
        try {
            await axios.post(`http://localhost:5001/api/projects/${projectId}/join`, {});
            // Give instant feedback by removing it from the list locally
            setAvailableTeams(prev => prev.filter(p => p._id !== projectId));
            alert('Request to join team sent! Waiting for Supervisor approval.');
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to send join request');
        } finally {
            setLoadingAction(null);
        }
    };

    if (!myProject) {
        return (
            <div className="space-y-6">
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-12 h-12 bg-[#00244D]/10 text-[#00244D] rounded-xl flex items-center justify-center">
                            <Layers size={24} />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-slate-800">You don't have an active team yet.</h3>
                            <p className="text-slate-500 text-sm mt-1">
                                Create a brand new project, or request to join an existing one supervised by {user.supervisor?.name || 'your assigned doctor'}.
                            </p>
                        </div>
                    </div>

                    <Link
                        to="/dashboard/submit"
                        className="inline-flex w-full md:w-auto items-center justify-center gap-2 bg-[#00244D] hover:bg-[#003366] text-white font-medium py-3 px-6 rounded-lg transition-all shadow-sm shadow-[#00244D]/15 mb-8"
                    >
                        <Plus size={18} />
                        Submit New Proposal
                    </Link>

                    {availableTeams.length > 0 && (
                        <div>
                            <h4 className="font-semibold text-slate-700 mb-4 flex items-center gap-2">
                                <UsersRound size={18} className="text-emerald-500" />
                                Available Teams to Join
                            </h4>
                            <div className="grid gap-4 md:grid-cols-2">
                                {availableTeams.map(team => (
                                    <div key={team._id} className="border border-slate-200 p-5 rounded-xl flex flex-col justify-between hover:border-[#3498DB] transition-colors">
                                        <div>
                                            <h5 className="font-bold text-slate-900">{team.title}</h5>
                                            <p className="text-sm text-slate-500 mt-1 line-clamp-2">{team.description}</p>
                                            <p className="text-xs text-slate-400 mt-3 font-medium">
                                                {team.students?.length || 0} Members
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => handleJoinTeam(team._id)}
                                            disabled={loadingAction === team._id}
                                            className="mt-4 flex items-center justify-center gap-2 w-full py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 font-medium rounded-lg transition-colors border border-slate-200 disabled:opacity-50"
                                        >
                                            {loadingAction === team._id ? 'Sending...' : <><LogIn size={16} /> Request to Join</>}
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    const statusColors = {
        'Approved': 'bg-emerald-100 text-emerald-700 ring-emerald-600/20',
        'Rejected': 'bg-red-100 text-red-700 ring-red-600/20',
        'Pending': 'bg-amber-100 text-amber-700 ring-amber-600/20',
        'Edits Requested': 'bg-blue-100 text-blue-700 ring-blue-600/20'
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Widget 1: My Project Status */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                        <Layers className="text-[#3498DB]" size={20} />
                        My Project Status
                    </h2>
                    <span className={`inline-flex items-center rounded-md px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${statusColors[myProject.status] || statusColors['Pending']}`}>
                        {myProject.status}
                    </span>
                </div>
                <div className="space-y-4">
                    <div>
                        <h3 className="font-semibold text-slate-900 text-xl">{myProject.title}</h3>
                        <p className="text-slate-500 text-sm mt-1 line-clamp-2">{myProject.description}</p>
                    </div>
                    <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-sm">
                        <span className="text-slate-500">Supervisor: <strong className="text-slate-700">{myProject.supervisor?.name || 'Pending Assignment'}</strong></span>
                        <Link to={`/project/${myProject._id}`} className="text-[#00244D] font-semibold hover:text-[#00244D] flex items-center gap-1">
                            View Details &rarr;
                        </Link>
                    </div>
                </div>
            </div>

            {/* Widget 2: Pending Tasks & Kanban */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col justify-between">
                <div>
                    <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-4">
                        <Clock className="text-amber-500" size={20} />
                        Workflow Actions
                    </h2>
                    <p className="text-slate-600 text-sm mb-6">
                        Stay on top of your deliverables. Check your Kanban board to update tasks and notify your supervisor.
                    </p>
                </div>

                <div className="flex gap-3 mt-auto">
                    <Link
                        to={`/project/${myProject._id}`}
                        className="flex-1 flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-medium py-2.5 px-4 rounded-lg transition-colors shadow-sm"
                    >
                        <CheckCircle size={18} />
                        Open Kanban Board
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default StudentWidgets;
