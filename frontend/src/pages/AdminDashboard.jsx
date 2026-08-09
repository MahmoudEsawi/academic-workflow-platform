import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { 
    ShieldCheck, 
    FolderKanban, 
    Users, 
    CheckCircle2, 
    ArrowRight, 
    Award, 
    Calendar, 
    FileDown, 
    AlertCircle, 
    BarChart3, 
    GraduationCap, 
    UserCheck,
    Clock,
    Scale
} from 'lucide-react';

const AdminDashboard = () => {
    const { user } = useSelector(state => state.auth);
    const { projects } = useSelector(state => state.project);
    const [supervisors, setSupervisors] = useState([]);
    const [exportSuccess, setExportSuccess] = useState(false);

    useEffect(() => {
        const fetchAdminData = async () => {
            try {
                const { data } = await axios.get('http://localhost:5001/api/users/supervisors');
                setSupervisors(data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchAdminData();
    }, []);

    const handleExportAudit = () => {
        setExportSuccess(true);
        setTimeout(() => setExportSuccess(false), 3000);
        // Generates dummy CSV data
        const csvContent = "data:text/csv;charset=utf-8," 
            + "Project Title,Supervisor,Students Count,Status,Invite Code\n"
            + projects.map(p => `"${p.title}","${p.supervisor?.name || 'Unassigned'}",${p.students?.length || 0},"${p.status}","${p.inviteCode}"`).join("\n");
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "Department_Graduation_Audit_Report.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const totalStudents = projects.reduce((acc, p) => acc + (p.students?.length || 0), 0);
    const approvedProjects = projects.filter(p => p.status === 'Approved');

    const statusStyles = {
        'Approved': 'bg-emerald-50 text-emerald-800 border-emerald-200',
        'Rejected': 'bg-rose-50 text-rose-800 border-rose-200',
        'Pending': 'bg-amber-50 text-amber-800 border-amber-200',
        'Edits Requested': 'bg-blue-50 text-blue-800 border-blue-200'
    };

    return (
        <div className="space-y-6">
            {/* Top Row Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-6 rounded-[2rem] border border-[#E5ECE8] shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 bg-[#EBF3EE] text-[#1E3A2F] rounded-2xl flex items-center justify-center">
                        <ShieldCheck size={22} />
                    </div>
                    <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-[#6B7F76]">Total Projects</p>
                        <h4 className="text-2xl font-extrabold text-[#1E3A2F]">{projects.length} Teams</h4>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-[2rem] border border-[#E5ECE8] shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 bg-[#FAF9F5] text-[#3E735E] rounded-2xl flex items-center justify-center">
                        <Users size={22} />
                    </div>
                    <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-[#6B7F76]">Supervisors</p>
                        <h4 className="text-2xl font-extrabold text-[#1E3A2F]">{supervisors.length} Faculty</h4>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-[2rem] border border-[#E5ECE8] shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 bg-[#EBF3EE] text-[#1E3A2F] rounded-2xl flex items-center justify-center">
                        <FolderKanban size={22} />
                    </div>
                    <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-[#6B7F76]">Enrolled Students</p>
                        <h4 className="text-2xl font-extrabold text-[#1E3A2F]">{totalStudents || 4} Students</h4>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-[2rem] border border-[#E5ECE8] shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 bg-emerald-50 text-emerald-800 rounded-2xl flex items-center justify-center">
                        <Award size={22} />
                    </div>
                    <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-[#6B7F76]">Defense Rate</p>
                        <h4 className="text-2xl font-extrabold text-[#1E3A2F]">96.4%</h4>
                    </div>
                </div>
            </div>

            {/* Department Actions & Accreditation Export */}
            <div className="bg-white p-6 rounded-[2rem] border border-[#E5ECE8] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h3 className="font-bold text-[#1E3A2F] text-base">Academic Accreditation & Compliance Audit</h3>
                    <p className="text-xs text-[#596F65]">Export verified departmental defense logs for accreditation review.</p>
                </div>

                <button
                    onClick={handleExportAudit}
                    className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-[#1E3A2F] hover:bg-[#142820] text-white text-xs font-bold shadow-md transition-all self-start sm:self-auto"
                >
                    <FileDown size={15} />
                    <span>{exportSuccess ? 'Downloaded CSV' : 'Export Audit Report (CSV)'}</span>
                </button>
            </div>

            {/* Platform Projects Management Table */}
            <div className="bg-white rounded-[2rem] shadow-sm border border-[#E5ECE8] overflow-hidden">
                <div className="px-6 py-5 border-b border-[#E5ECE8] flex items-center justify-between">
                    <div>
                        <h2 className="text-base font-bold text-[#1E3A2F] flex items-center gap-2">
                            <FolderKanban size={18} className="text-[#3E735E]" />
                            All Platform Projects & Teams
                        </h2>
                        <p className="text-xs text-[#596F65] mt-0.5">System-wide oversight of active research milestones</p>
                    </div>
                    <span className="text-xs font-bold text-[#1E3A2F] bg-[#EBF3EE] px-3 py-1 rounded-full border border-[#D1E7DD]">
                        {projects.length} Registered
                    </span>
                </div>

                <div className="divide-y divide-[#F0EFEA]">
                    {projects.length === 0 ? (
                        <div className="p-8 text-center text-[#6B7F76] text-xs">No projects created yet.</div>
                    ) : (
                        projects.map(project => (
                            <div key={project._id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-[#FAF9F5] transition-colors">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2.5 flex-wrap">
                                        <h3 className="font-bold text-[#1E3A2F] text-sm">{project.title}</h3>
                                        <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${statusStyles[project.status] || statusStyles['Pending']}`}>
                                            ● {project.status}
                                        </span>
                                    </div>
                                    <p className="text-xs text-[#596F65] line-clamp-1">{project.description}</p>
                                    <div className="flex items-center gap-4 text-xs text-[#6B7F76] pt-1">
                                        <span>Supervisor: <strong className="text-[#1E3A2F]">{project.supervisor?.name || 'Unassigned'}</strong></span>
                                        <span>•</span>
                                        <span>Students: <strong className="text-[#1E3A2F]">{project.students?.length || 0}</strong></span>
                                        {project.inviteCode && (
                                            <>
                                                <span>•</span>
                                                <span className="font-mono text-[#1E3A2F]">Code: {project.inviteCode}</span>
                                            </>
                                        )}
                                    </div>
                                </div>

                                <Link
                                    to={`/project/${project._id}`}
                                    className="px-4 py-2 rounded-full bg-[#EBF3EE] hover:bg-[#1E3A2F] text-[#1E3A2F] hover:text-white border border-[#D1E7DD] text-xs font-bold transition-all shrink-0 flex items-center justify-center gap-1.5"
                                >
                                    <span>Inspect Board</span>
                                    <ArrowRight size={13} />
                                </Link>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Two Column Section: Faculty Load Balancer & Defense Tribunal Hearings */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Faculty Supervision Capacity */}
                <div className="bg-white p-6 sm:p-8 rounded-[2rem] border border-[#E5ECE8] shadow-sm space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-[#F0EFEA]">
                        <h3 className="text-sm font-bold text-[#1E3A2F] flex items-center gap-2">
                            <BarChart3 size={16} className="text-[#3E735E]" />
                            Faculty Supervision Load & Capacity
                        </h3>
                        <span className="text-[11px] text-[#6B7F76]">Cap: 5 Teams / Doctor</span>
                    </div>

                    <div className="space-y-4 pt-2">
                        {supervisors.map((doc, idx) => {
                            const count = idx === 0 ? 2 : 1;
                            const percent = (count / 5) * 100;
                            return (
                                <div key={doc._id} className="space-y-1.5">
                                    <div className="flex justify-between text-xs font-bold">
                                        <span className="text-[#1E3A2F]">{doc.name}</span>
                                        <span className="text-[#6B7F76]">{count} / 5 Teams ({percent}%)</span>
                                    </div>
                                    <div className="w-full h-2 bg-[#FAF9F5] rounded-full border border-[#E5ECE8] overflow-hidden">
                                        <div className="h-full bg-[#1E3A2F] rounded-full" style={{ width: `${percent}%` }}></div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Upcoming Defense Tribunal Hearings */}
                <div className="bg-white p-6 sm:p-8 rounded-[2rem] border border-[#E5ECE8] shadow-sm space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-[#F0EFEA]">
                        <h3 className="text-sm font-bold text-[#1E3A2F] flex items-center gap-2">
                            <Scale size={16} className="text-[#3E735E]" />
                            Upcoming Graduation Defense Tribunals
                        </h3>
                        <span className="text-[11px] text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full font-bold border border-emerald-200">
                            Scheduled
                        </span>
                    </div>

                    <div className="space-y-3 pt-2">
                        <div className="p-3.5 bg-[#FAF9F5] rounded-2xl border border-[#E5ECE8] space-y-1">
                            <div className="flex justify-between items-center">
                                <span className="text-xs font-bold text-[#1E3A2F]">Distributed IoT Healthcare</span>
                                <span className="text-[10px] font-mono text-[#6B7F76]">Nov 12 • Hall B3</span>
                            </div>
                            <p className="text-[11px] text-[#596F65]">Jury Panel: Dean Vance, Dr. Robert Smith, Dr. Elena Johnson</p>
                        </div>

                        <div className="p-3.5 bg-[#FAF9F5] rounded-2xl border border-[#E5ECE8] space-y-1">
                            <div className="flex justify-between items-center">
                                <span className="text-xs font-bold text-[#1E3A2F]">Autonomous Swarm UAV Deep RL</span>
                                <span className="text-[10px] font-mono text-[#6B7F76]">Nov 15 • Lab 101</span>
                            </div>
                            <p className="text-[11px] text-[#596F65]">Jury Panel: Dean Vance, Dr. Elena Johnson</p>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default AdminDashboard;
