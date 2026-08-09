import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { 
    Layers, 
    CheckCircle2, 
    Clock, 
    UsersRound, 
    Plus, 
    LogIn, 
    KeyRound, 
    Copy, 
    CheckCheck, 
    ArrowRight, 
    Calendar, 
    ExternalLink, 
    FileText, 
    GitBranch, 
    Sparkles, 
    ShieldCheck, 
    Award, 
    TrendingUp, 
    AlertCircle, 
    BookOpen,
    Code2,
    Video
} from 'lucide-react';
import axios from 'axios';

const StudentWidgets = () => {
    const { user } = useSelector((state) => state.auth);
    const { projects } = useSelector((state) => state.project);
    const myProject = projects[0];

    const [availableTeams, setAvailableTeams] = useState([]);
    const [loadingAction, setLoadingAction] = useState(null);
    const [inviteCode, setInviteCode] = useState('');
    const [joinMsg, setJoinMsg] = useState({ type: '', text: '' });
    const [joiningByCode, setJoiningByCode] = useState(false);
    const [copied, setCopied] = useState(false);
    const [activeTab, setActiveTab] = useState('overview');

    useEffect(() => {
        if (!myProject) {
            const fetchAvailableTeams = async () => {
                try {
                    const { data } = await axios.get('http://localhost:5001/api/projects/available');
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
            setAvailableTeams(prev => prev.filter(p => p._id !== projectId));
            setJoinMsg({ type: 'success', text: 'Request to join team sent! Waiting for Supervisor approval.' });
        } catch (error) {
            setJoinMsg({ type: 'error', text: error.response?.data?.message || 'Failed to send join request' });
        } finally {
            setLoadingAction(null);
        }
    };

    const handleJoinByCode = async (e) => {
        e.preventDefault();
        if (!inviteCode.trim()) return;
        setJoiningByCode(true);
        setJoinMsg({ type: '', text: '' });
        try {
            const { data } = await axios.post('http://localhost:5001/api/projects/join-by-code', { code: inviteCode.trim() });
            setJoinMsg({ type: 'success', text: data.message });
            setInviteCode('');
        } catch (error) {
            setJoinMsg({ type: 'error', text: error.response?.data?.message || 'Invalid invite code. Please check and retry.' });
        } finally {
            setJoiningByCode(false);
        }
    };

    const handleCopyCode = (code) => {
        navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    if (!myProject) {
        return (
            <div className="space-y-6">
                <div className="bg-white p-6 sm:p-8 rounded-[2rem] border border-[#E5ECE8] shadow-sm">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-12 h-12 bg-[#EBF3EE] text-[#1E3A2F] rounded-2xl flex items-center justify-center">
                            <Layers size={24} />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-[#1E3A2F]">No Active Project Team</h3>
                            <p className="text-[#596F65] text-xs sm:text-sm mt-0.5">
                                Submit a new proposal, join with a teammate's invite code, or join an existing group.
                            </p>
                        </div>
                    </div>

                    {/* Join Feedback */}
                    {joinMsg.text && (
                        <div className={`mb-6 p-4 rounded-2xl flex items-start gap-3 border ${joinMsg.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-rose-50 border-rose-200 text-rose-800'}`}>
                            <CheckCircle2 size={18} className="mt-0.5 shrink-0" />
                            <p className="text-xs font-semibold">{joinMsg.text}</p>
                        </div>
                    )}

                    {/* Join by Invite Code */}
                    <div className="bg-[#FAF9F5] rounded-2xl p-5 mb-6 border border-[#E5ECE8]">
                        <h4 className="font-bold text-[#1E3A2F] mb-1.5 flex items-center gap-2 text-xs">
                            <KeyRound size={15} className="text-[#3E735E]" />
                            Join via 6-character Project Invite Code
                        </h4>
                        <p className="text-xs text-[#596F65] mb-3">Ask your teammate or supervisor for your project's unique access code.</p>
                        <form onSubmit={handleJoinByCode} className="flex gap-2">
                            <input
                                type="text"
                                maxLength={6}
                                placeholder="e.g. IOT101"
                                value={inviteCode}
                                onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
                                className="flex-1 px-4 py-2.5 bg-white border border-[#D5DDD8] rounded-xl text-center text-base font-mono tracking-widest uppercase focus:outline-none focus:border-[#1E3A2F] text-[#1A2421]"
                            />
                            <button
                                type="submit"
                                disabled={joiningByCode || inviteCode.length < 3}
                                className="px-5 py-2.5 bg-[#1E3A2F] hover:bg-[#142820] text-white font-bold rounded-xl transition-all shadow-sm text-xs disabled:opacity-50"
                            >
                                {joiningByCode ? 'Joining...' : 'Join Team'}
                            </button>
                        </form>
                    </div>

                    <Link
                        to="/dashboard/submit"
                        className="inline-flex w-full sm:w-auto items-center justify-center gap-2 bg-[#1E3A2F] hover:bg-[#142820] text-white font-bold py-3 px-6 rounded-full transition-all shadow-md text-xs mb-8"
                    >
                        <Plus size={16} />
                        Submit New Proposal
                    </Link>

                    {availableTeams.length > 0 && (
                        <div>
                            <h4 className="font-bold text-[#1E3A2F] mb-4 flex items-center gap-2 text-xs">
                                <UsersRound size={15} className="text-[#3E735E]" />
                                Available Teams Seeking Members
                            </h4>
                            <div className="grid gap-4 sm:grid-cols-2">
                                {availableTeams.map(team => (
                                    <div key={team._id} className="bg-[#FAF9F5] border border-[#E5ECE8] p-5 rounded-2xl flex flex-col justify-between hover:border-[#1E3A2F] transition-all group">
                                        <div>
                                            <h5 className="font-bold text-[#1E3A2F] group-hover:text-[#3E735E] transition-colors text-sm">{team.title}</h5>
                                            <p className="text-xs text-[#596F65] mt-1 line-clamp-2">{team.description}</p>
                                            <p className="text-[11px] text-[#6B7F76] mt-3 font-medium flex items-center gap-1.5">
                                                <UsersRound size={12} /> {team.students?.length || 0} Members Enrolled
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => handleJoinTeam(team._id)}
                                            disabled={loadingAction === team._id}
                                            className="mt-4 flex items-center justify-center gap-1.5 w-full py-2 bg-white hover:bg-[#1E3A2F] hover:text-white text-[#1E3A2F] font-bold rounded-xl transition-all border border-[#D5DDD8] text-xs disabled:opacity-50"
                                        >
                                            {loadingAction === team._id ? 'Sending...' : <><LogIn size={13} /> Request to Join</>}
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

    const statusBadgeStyles = {
        'Approved': 'bg-emerald-50 text-emerald-800 border-emerald-200',
        'Rejected': 'bg-rose-50 text-rose-800 border-rose-200',
        'Pending': 'bg-amber-50 text-amber-800 border-amber-200',
        'Edits Requested': 'bg-blue-50 text-blue-800 border-blue-200'
    };

    return (
        <div className="space-y-6">
            {/* Top Row: Project Hero & Quick Stats */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Active Project Hero Card */}
                <div className="lg:col-span-2 bg-white p-6 sm:p-8 rounded-[2rem] border border-[#E5ECE8] shadow-sm flex flex-col justify-between">
                    <div>
                        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EBF3EE] text-[#1E3A2F] text-xs font-bold border border-[#D1E7DD]">
                                <Sparkles size={13} /> Active Graduation Research
                            </div>
                            <span className={`inline-flex items-center rounded-full px-3.5 py-1 text-xs font-extrabold border ${statusBadgeStyles[myProject.status] || statusBadgeStyles['Pending']}`}>
                                ● {myProject.status}
                            </span>
                        </div>

                        <h2 className="text-xl sm:text-2xl font-extrabold text-[#1E3A2F] tracking-tight mb-2">
                            {myProject.title}
                        </h2>
                        <p className="text-[#596F65] text-xs sm:text-sm leading-relaxed mb-6">
                            {myProject.description}
                        </p>

                        {/* Invite Code & Team Members */}
                        <div className="grid sm:grid-cols-2 gap-4">
                            <div className="bg-[#FAF9F5] p-4 rounded-2xl border border-[#E5ECE8] flex items-center justify-between">
                                <div>
                                    <p className="text-[10px] uppercase font-bold text-[#6B7F76] tracking-wider">Team Access Code</p>
                                    <p className="text-xl font-mono font-extrabold text-[#1E3A2F] tracking-widest">{myProject.inviteCode || 'N/A'}</p>
                                </div>
                                <button
                                    onClick={() => handleCopyCode(myProject.inviteCode)}
                                    className="p-2.5 bg-white hover:bg-[#F4F2EC] border border-[#D5DDD8] rounded-xl text-[#1E3A2F] text-xs font-bold transition-all shadow-sm flex items-center gap-1"
                                    title="Copy invite code"
                                >
                                    {copied ? <CheckCheck size={14} className="text-emerald-600" /> : <Copy size={14} />}
                                    <span>{copied ? 'Copied' : 'Copy'}</span>
                                </button>
                            </div>

                            <div className="bg-[#FAF9F5] p-4 rounded-2xl border border-[#E5ECE8] flex items-center justify-between">
                                <div>
                                    <p className="text-[10px] uppercase font-bold text-[#6B7F76] tracking-wider">Supervising Advisor</p>
                                    <p className="text-sm font-extrabold text-[#1E3A2F] truncate max-w-[150px]">{myProject.supervisor?.name || 'Assigned'}</p>
                                </div>
                                <span className="text-[10px] font-bold bg-[#EBF3EE] text-[#1E3A2F] px-2.5 py-1 rounded-full border border-[#D1E7DD]">
                                    Faculty Chair
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="pt-6 mt-6 border-t border-[#F0EFEA] flex flex-wrap items-center justify-between gap-4">
                        <div className="flex items-center gap-2 text-xs text-[#6B7F76]">
                            <UsersRound size={14} className="text-[#3E735E]" />
                            <span>{myProject.students?.length || 0} Team Members Enrolled</span>
                        </div>
                        <Link
                            to={`/project/${myProject._id}`}
                            className="flex items-center gap-2 bg-[#1E3A2F] hover:bg-[#142820] text-white text-xs font-bold px-5 py-2.5 rounded-full shadow-md transition-all hover:scale-105"
                        >
                            <span>Open Project Workspace</span>
                            <ArrowRight size={14} />
                        </Link>
                    </div>
                </div>

                {/* Defense Countdown & Readiness Card */}
                <div className="bg-[#1E3A2F] text-white p-6 sm:p-8 rounded-[2rem] shadow-xl flex flex-col justify-between relative overflow-hidden">
                    <div className="space-y-4 relative z-10">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-white text-[11px] font-bold">
                            <Award size={13} className="text-[#A3CFBB]" /> Milestone Defense
                        </div>
                        
                        <div>
                            <p className="text-xs text-white/70">Estimated Preliminary Defense</p>
                            <h3 className="text-3xl font-extrabold text-white tracking-tight mt-1">In 14 Days</h3>
                            <p className="text-[11px] text-[#A3CFBB] font-medium mt-0.5">Thursday, Oct 24, 2026 • 2:00 PM</p>
                        </div>

                        {/* Progress meter */}
                        <div className="space-y-2 pt-2">
                            <div className="flex justify-between text-xs font-bold">
                                <span>Thesis Readiness Score</span>
                                <span className="text-[#A3CFBB]">78%</span>
                            </div>
                            <div className="w-full h-2.5 bg-white/10 rounded-full overflow-hidden">
                                <div className="h-full bg-gradient-to-r from-[#3E735E] to-[#A3CFBB] rounded-full w-[78%]"></div>
                            </div>
                        </div>

                        <div className="p-3 bg-white/10 rounded-2xl text-xs text-white/80 space-y-1">
                            <p className="font-bold text-white text-[11px]">Next Milestone Requirement:</p>
                            <p className="text-[11px] text-white/70">Finalize Task 4 Cryptographic Auth Review before Oct 18.</p>
                        </div>
                    </div>

                    <div className="pt-4 mt-4 border-t border-white/10 flex items-center justify-between text-xs text-white/70 relative z-10">
                        <span>Jury Committee Assigned</span>
                        <span className="font-bold text-white">Dean Vance + Dr. Smith</span>
                    </div>
                </div>

            </div>

            {/* Academic Milestone Progress Tracker (5-Phase Pipeline) */}
            <div className="bg-white p-6 sm:p-8 rounded-[2rem] border border-[#E5ECE8] shadow-sm space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                        <h3 className="text-base font-extrabold text-[#1E3A2F]">Academic Graduation Thesis Pipeline</h3>
                        <p className="text-xs text-[#596F65]">Standardized 5-phase departmental milestone progression</p>
                    </div>
                    <span className="text-xs font-bold bg-[#EBF3EE] text-[#1E3A2F] border border-[#D1E7DD] px-3 py-1 rounded-full self-start sm:self-auto">
                        Phase 3 of 5 In Progress
                    </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 pt-2">
                    {/* Phase 1 */}
                    <div className="bg-[#FAF9F5] p-4 rounded-2xl border-2 border-emerald-400/80 space-y-2">
                        <div className="flex items-center justify-between">
                            <span className="text-[10px] font-extrabold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">Phase 1</span>
                            <CheckCircle2 size={15} className="text-emerald-600" />
                        </div>
                        <h4 className="text-xs font-bold text-[#1E3A2F]">Topic & Advisor</h4>
                        <p className="text-[10px] text-[#6B7F76]">Proposal approved by Dr. Smith</p>
                    </div>

                    {/* Phase 2 */}
                    <div className="bg-[#FAF9F5] p-4 rounded-2xl border-2 border-emerald-400/80 space-y-2">
                        <div className="flex items-center justify-between">
                            <span className="text-[10px] font-extrabold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">Phase 2</span>
                            <CheckCircle2 size={15} className="text-emerald-600" />
                        </div>
                        <h4 className="text-xs font-bold text-[#1E3A2F]">Architecture Specs</h4>
                        <p className="text-[10px] text-[#6B7F76]">IEEE Ch 1-3 draft verified</p>
                    </div>

                    {/* Phase 3 */}
                    <div className="bg-[#EBF3EE] p-4 rounded-2xl border-2 border-[#1E3A2F] space-y-2 shadow-sm">
                        <div className="flex items-center justify-between">
                            <span className="text-[10px] font-extrabold text-white bg-[#1E3A2F] px-2 py-0.5 rounded-full">Phase 3</span>
                            <TrendingUp size={15} className="text-[#1E3A2F] animate-pulse" />
                        </div>
                        <h4 className="text-xs font-bold text-[#1E3A2F]">Core Sprints</h4>
                        <p className="text-[10px] text-[#4A5D54]">MQTT telemetry & web dashboard</p>
                    </div>

                    {/* Phase 4 */}
                    <div className="bg-[#FAF9F5] p-4 rounded-2xl border border-[#E5ECE8] space-y-2 opacity-70">
                        <div className="flex items-center justify-between">
                            <span className="text-[10px] font-extrabold text-[#6B7F76] bg-white px-2 py-0.5 rounded-full border border-[#E5ECE8]">Phase 4</span>
                            <Clock size={15} className="text-slate-400" />
                        </div>
                        <h4 className="text-xs font-bold text-[#1E3A2F]">Security Review</h4>
                        <p className="text-[10px] text-[#6B7F76]">Doctor code review & audits</p>
                    </div>

                    {/* Phase 5 */}
                    <div className="bg-[#FAF9F5] p-4 rounded-2xl border border-[#E5ECE8] space-y-2 opacity-70">
                        <div className="flex items-center justify-between">
                            <span className="text-[10px] font-extrabold text-[#6B7F76] bg-white px-2 py-0.5 rounded-full border border-[#E5ECE8]">Phase 5</span>
                            <Award size={15} className="text-slate-400" />
                        </div>
                        <h4 className="text-xs font-bold text-[#1E3A2F]">Final Defense</h4>
                        <p className="text-[10px] text-[#6B7F76]">Oral jury presentation</p>
                    </div>
                </div>
            </div>

            {/* Two Column Section: Project Resources & Recent Supervisor Feedback */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Academic Resources Hub */}
                <div className="bg-white p-6 sm:p-8 rounded-[2rem] border border-[#E5ECE8] shadow-sm space-y-4 flex flex-col justify-between">
                    <div>
                        <div className="flex items-center justify-between pb-3 border-b border-[#F0EFEA]">
                            <h3 className="text-sm font-bold text-[#1E3A2F] flex items-center gap-2">
                                <BookOpen size={16} className="text-[#3E735E]" />
                                Project Academic Resources & Links
                            </h3>
                            <span className="text-[11px] text-[#6B7F76]">4 Repos Connected</span>
                        </div>

                        <div className="space-y-3 pt-3">
                            <a
                                href="https://github.com"
                                target="_blank"
                                rel="noreferrer"
                                className="flex items-center justify-between p-3.5 rounded-2xl bg-[#FAF9F5] hover:bg-[#EBF3EE] border border-[#E5ECE8] transition-all group"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center">
                                        <GitBranch size={16} />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-[#1E3A2F] group-hover:text-[#3E735E] transition-colors">GitHub Source Code Repository</p>
                                        <p className="text-[10px] text-[#6B7F76]">github.com/academic/distributed-iot-telemetry</p>
                                    </div>
                                </div>
                                <ExternalLink size={14} className="text-[#6B7F76]" />
                            </a>

                            <a
                                href="https://overleaf.com"
                                target="_blank"
                                rel="noreferrer"
                                className="flex items-center justify-between p-3.5 rounded-2xl bg-[#FAF9F5] hover:bg-[#EBF3EE] border border-[#E5ECE8] transition-all group"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-xl bg-emerald-800 text-white flex items-center justify-center">
                                        <FileText size={16} />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-[#1E3A2F] group-hover:text-[#3E735E] transition-colors">Overleaf LaTeX Thesis Draft</p>
                                        <p className="text-[10px] text-[#6B7F76]">IEEE Conference & Dissertation Template</p>
                                    </div>
                                </div>
                                <ExternalLink size={14} className="text-[#6B7F76]" />
                            </a>

                            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#FAF9F5] border border-[#E5ECE8]">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-xl bg-blue-800 text-white flex items-center justify-center">
                                        <Code2 size={16} />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-[#1E3A2F]">Interactive API Swagger Docs</p>
                                        <p className="text-[10px] text-[#6B7F76]">http://localhost:5001/api-docs</p>
                                    </div>
                                </div>
                                <span className="text-[10px] font-bold text-blue-800 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">v1.2 Live</span>
                            </div>
                        </div>
                    </div>

                    <div className="pt-3 border-t border-[#F0EFEA]">
                        <p className="text-[11px] text-[#6B7F76]">Department server staging endpoint: <strong className="text-[#1E3A2F]">aws.university.edu/health-iot</strong></p>
                    </div>
                </div>

                {/* Supervisor's Latest Verdict & Feedback Feed */}
                <div className="bg-white p-6 sm:p-8 rounded-[2rem] border border-[#E5ECE8] shadow-sm space-y-4 flex flex-col justify-between">
                    <div>
                        <div className="flex items-center justify-between pb-3 border-b border-[#F0EFEA]">
                            <h3 className="text-sm font-bold text-[#1E3A2F] flex items-center gap-2">
                                <ShieldCheck size={16} className="text-[#3E735E]" />
                                Recent Supervisor Evaluation
                            </h3>
                            <span className="text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                                Version 1 Approved
                            </span>
                        </div>

                        <div className="pt-3 space-y-3">
                            <div className="bg-[#FAF9F5] p-4 rounded-2xl border border-[#E5ECE8] space-y-2">
                                <div className="flex items-center justify-between text-xs">
                                    <span className="font-bold text-[#1E3A2F]">Task 4: AES-256 Cryptographic Auth</span>
                                    <span className="text-[10px] text-[#6B7F76]">Reviewed by Dr. Robert Smith</span>
                                </div>
                                <blockquote className="text-xs text-[#4A5D54] italic bg-white p-3 rounded-xl border border-[#E5ECE8] leading-relaxed">
                                    "Excellent cryptographic structure, Alice! The GCM authentication tag guarantees tamper resistance. Ready for milestone defense."
                                </blockquote>
                                <div className="flex items-center justify-between text-[11px] pt-1">
                                    <span className="text-[#6B7F76]">Language: <strong className="text-[#1E3A2F]">JavaScript (Node.js)</strong></span>
                                    <span className="text-emerald-700 font-bold">100% Passed Syntax Audit</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="pt-4 border-t border-[#F0EFEA] flex items-center justify-between">
                        <Link
                            to={`/project/${myProject._id}`}
                            className="text-xs font-bold text-[#1E3A2F] hover:underline flex items-center gap-1"
                        >
                            Open Kanban Sprint Board <ArrowRight size={13} />
                        </Link>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default StudentWidgets;
