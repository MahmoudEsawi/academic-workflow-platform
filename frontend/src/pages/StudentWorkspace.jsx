import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Code, FileUp, Send, History, ArrowLeft, CheckCircle2 } from 'lucide-react';

const StudentWorkspace = () => {
    const { taskId } = useParams();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('code');

    const [content, setContent] = useState('');
    const [language, setLanguage] = useState('javascript');
    const [description, setDescription] = useState('');
    const [fileUrl, setFileUrl] = useState('');

    const [submissions, setSubmissions] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [feedbackMsg, setFeedbackMsg] = useState('');

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const { data } = await axios.get(`http://localhost:5001/api/submissions/task/${taskId}`);
                setSubmissions(data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchHistory();
    }, [taskId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setFeedbackMsg('');
        try {
            const payload = {
                taskId,
                description,
                ...(activeTab === 'code' ? { content, language } : { fileUrl })
            };
            const { data } = await axios.post('http://localhost:5001/api/submissions', payload);
            setSubmissions([data, ...submissions]);
            setContent('');
            setDescription('');
            setFileUrl('');
            setFeedbackMsg(`Submission successful! Saved as Version ${data.version}`);
        } catch (err) {
            console.error(err);
            alert('Failed to submit, please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const statusBadgeStyles = {
        'Approved': 'bg-emerald-50 text-emerald-800 border-emerald-200',
        'Rejected': 'bg-rose-50 text-rose-800 border-rose-200',
        'Needs Revision': 'bg-amber-50 text-amber-800 border-amber-200',
        'Pending': 'bg-slate-100 text-slate-800 border-slate-200'
    };

    return (
        <div className="max-w-6xl mx-auto space-y-6 pb-12">
            <div className="flex items-center gap-3 sm:gap-4">
                <button
                    onClick={() => navigate(-1)}
                    className="p-2 sm:p-2.5 bg-white border border-[#E5ECE8] hover:bg-[#FAF9F5] rounded-2xl text-[#1E3A2F] transition-all shadow-sm shrink-0"
                >
                    <ArrowLeft size={16} className="sm:w-[18px] sm:h-[18px]" />
                </button>
                <div className="min-w-0 flex-1">
                    <h1 className="text-xl sm:text-2xl font-extrabold text-[#1E3A2F] tracking-tight truncate">
                        Task Deliverable Workspace
                    </h1>
                    <p className="text-[11px] sm:text-xs text-[#596F65] truncate">Submit versioned deliverables for advisor review</p>
                </div>
            </div>

            {feedbackMsg && (
                <div className="p-3.5 sm:p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
                    <CheckCircle2 size={16} className="shrink-0" />
                    <span>{feedbackMsg}</span>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
                {/* Submission Form */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-[1.75rem] sm:rounded-[2rem] shadow-sm border border-[#E5ECE8] overflow-hidden">
                        {/* Tab Switchers */}
                        <div className="flex border-b border-[#E5ECE8] bg-[#FAF9F5] p-1.5 sm:p-2 gap-1.5 sm:gap-2">
                            <button
                                className={`flex-1 py-2.5 sm:py-3 rounded-2xl flex justify-center items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs font-bold transition-all ${
                                    activeTab === 'code'
                                        ? 'bg-[#1E3A2F] text-white shadow-md'
                                        : 'text-[#596F65] hover:text-[#1E3A2F] hover:bg-white'
                                }`}
                                onClick={() => setActiveTab('code')}
                            >
                                <Code size={14} className="shrink-0" /> 
                                <span className="truncate">Paste Source Code</span>
                            </button>
                            <button
                                className={`flex-1 py-2.5 sm:py-3 rounded-2xl flex justify-center items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs font-bold transition-all ${
                                    activeTab === 'file'
                                        ? 'bg-[#1E3A2F] text-white shadow-md'
                                        : 'text-[#596F65] hover:text-[#1E3A2F] hover:bg-white'
                                }`}
                                onClick={() => setActiveTab('file')}
                            >
                                <FileUp size={14} className="shrink-0" /> 
                                <span className="truncate">Document Link</span>
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 sm:space-y-5">
                            <div>
                                <label className="block text-[11px] sm:text-xs font-bold uppercase tracking-wider text-[#1E3A2F] mb-1.5">
                                    Version Changelog / Description
                                </label>
                                <textarea
                                    required
                                    rows={3}
                                    placeholder="Briefly describe what you've implemented or updated in this revision..."
                                    className="w-full px-3.5 sm:px-4 py-2.5 sm:py-3 bg-[#FAF9F5] border border-[#D5DDD8] rounded-2xl text-xs text-[#1A2421] placeholder-slate-400 focus:outline-none focus:border-[#1E3A2F] transition-all resize-none"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                />
                            </div>

                            {activeTab === 'code' ? (
                                <div className="space-y-3 sm:space-y-4">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                        <label className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-[#1E3A2F]">Language:</label>
                                        <select
                                            value={language}
                                            onChange={(e) => setLanguage(e.target.value)}
                                            className="px-3 py-1.5 bg-[#FAF9F5] border border-[#D5DDD8] rounded-xl text-xs font-bold text-[#1E3A2F] outline-none focus:border-[#1E3A2F] self-start sm:self-auto"
                                        >
                                            <option value="javascript">JavaScript / Node.js</option>
                                            <option value="python">Python</option>
                                            <option value="html">HTML</option>
                                            <option value="css">CSS</option>
                                            <option value="java">Java</option>
                                            <option value="jsx">React JSX</option>
                                            <option value="json">JSON</option>
                                        </select>
                                    </div>
                                    <div className="relative overflow-x-auto">
                                        <textarea
                                            required
                                            rows={10}
                                            placeholder="// Paste clean, formatted source code here..."
                                            className="w-full font-mono text-[11px] sm:text-xs px-3.5 sm:px-4 py-3 sm:py-4 bg-[#142820] text-[#A3CFBB] border border-[#1E3A2F] rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#1E3A2F]/30"
                                            value={content}
                                            onChange={(e) => setContent(e.target.value)}
                                        />
                                    </div>
                                </div>
                            ) : (
                                <div>
                                    <label className="block text-[11px] sm:text-xs font-bold uppercase tracking-wider text-[#1E3A2F] mb-1.5">
                                        Cloud Document URL (Google Drive / GitHub / OneDrive)
                                    </label>
                                    <input
                                        type="url"
                                        required
                                        placeholder="https://drive.google.com/file/d/..."
                                        className="w-full px-3.5 sm:px-4 py-2.5 sm:py-3 bg-[#FAF9F5] border border-[#D5DDD8] rounded-2xl text-xs text-[#1A2421] placeholder-slate-400 focus:outline-none focus:border-[#1E3A2F]"
                                        value={fileUrl}
                                        onChange={(e) => setFileUrl(e.target.value)}
                                    />
                                    <p className="text-[10px] sm:text-[11px] text-[#6B7F76] mt-1.5">
                                        Provide a public or accessible document link for your advisor to review.
                                    </p>
                                </div>
                            )}

                            <div className="pt-2 flex justify-end">
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-[#1E3A2F] hover:bg-[#142820] text-white font-bold rounded-full shadow-md transition-all text-xs disabled:opacity-50"
                                >
                                    <Send size={14} />
                                    <span>{isSubmitting ? 'Publishing...' : 'Submit Deliverable Version'}</span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Version History Sidebar */}
                <div className="bg-white rounded-[1.75rem] sm:rounded-[2rem] border border-[#E5ECE8] p-5 sm:p-6 self-start space-y-4 shadow-sm w-full">
                    <h2 className="text-sm font-bold text-[#1E3A2F] flex items-center gap-2 pb-2 border-b border-[#F0EFEA]">
                        <History size={16} className="text-[#3E735E]" />
                        Version History
                    </h2>

                    <div className="space-y-3.5">
                        {submissions.length === 0 ? (
                            <p className="text-xs text-[#6B7F76] italic">No submissions published yet for this task.</p>
                        ) : (
                            submissions.map((sub) => (
                                <div key={sub._id} className="relative pl-4 sm:pl-5 border-l-2 border-[#D1E7DD] pb-2">
                                    <div className="absolute -left-[5px] top-1.5 bg-[#1E3A2F] rounded-full w-2.5 h-2.5 ring-4 ring-white" />
                                    <div className="bg-[#FAF9F5] rounded-2xl p-3 sm:p-3.5 border border-[#E5ECE8] space-y-2">
                                        <div className="flex justify-between items-center flex-wrap gap-1">
                                            <span className="font-bold text-[#1E3A2F] text-xs">Version {sub.version}</span>
                                            <span className={`text-[9px] sm:text-[10px] font-bold px-2 py-0.5 rounded-full border ${statusBadgeStyles[sub.status] || statusBadgeStyles.Pending}`}>
                                                {sub.status}
                                            </span>
                                        </div>
                                        <p className="text-xs text-[#4A5D54] break-words">{sub.description}</p>
                                        {sub.overallFeedback && (
                                            <div className="p-2.5 rounded-xl bg-white border border-[#E5ECE8] text-[11px] text-[#1A2421]">
                                                <span className="font-bold text-[#1E3A2F] block mb-0.5">Advisor Feedback:</span>
                                                {sub.overallFeedback}
                                            </div>
                                        )}
                                        <span className="text-[9px] sm:text-[10px] text-[#6B7F76] block">
                                            {new Date(sub.createdAt).toLocaleDateString()} at {new Date(sub.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentWorkspace;
