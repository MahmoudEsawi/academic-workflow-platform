import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Layers, CheckCircle, Clock } from 'lucide-react';

const StudentWidgets = () => {
    const { projects } = useSelector((state) => state.project);
    const myProject = projects[0]; // Assuming student has 1 active project

    if (!myProject) {
        return (
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 text-center flex flex-col items-center justify-center min-h-[300px]">
                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4 text-slate-400">
                    <Layers size={32} />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">No Active Project Yet</h3>
                <p className="text-slate-500 mb-6 max-w-sm">
                    You haven't submitted a project proposal yet. Start your academic journey by creating one.
                </p>
                <Link
                    to="/dashboard/submit"
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 px-6 rounded-lg transition-all shadow-sm shadow-indigo-200"
                >
                    Submit Proposal
                </Link>
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
                        <Layers className="text-indigo-500" size={20} />
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
                        <Link to={`/project/${myProject._id}`} className="text-indigo-600 font-semibold hover:text-indigo-700 flex items-center gap-1">
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
