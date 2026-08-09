import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, CheckCircle2, XCircle, AlertCircle, Code, FileText, ExternalLink, History } from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

const SubmissionReview = () => {
    const { taskId } = useParams();
    const navigate = useNavigate();
    const [submissions, setSubmissions] = useState([]);
    const [selectedSubIndex, setSelectedSubIndex] = useState(0);
    const [overallFeedback, setOverallFeedback] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

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

    const handleReviewSubmit = async (status) => {
        if (!submissions.length) return;
        const currentSub = submissions[selectedSubIndex];
        setIsSubmitting(true);
        try {
            const { data } = await axios.put(`http://localhost:5001/api/submissions/${currentSub._id}/review`, {
                status,
                overallFeedback
            });
            const updated = [...submissions];
            updated[selectedSubIndex] = data;
            setSubmissions(updated);
            alert(`Deliverable status updated to: ${status}`);
        } catch (err) {
            console.error(err);
            alert('Failed to submit review');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!submissions.length) {
        return (
            <div className="max-w-4xl mx-auto py-12 sm:py-16 px-4 text-center">
                <button onClick={() => navigate(-1)} className="mb-6 inline-flex items-center text-xs font-bold text-[#1E3A2F] bg-white border border-[#E5ECE8] px-3.5 py-2 rounded-full shadow-sm">
                    <ArrowLeft size={15} className="mr-1.5" /> Back to Project
                </button>
                <div className="bg-white border border-[#E5ECE8] rounded-[2rem] p-8 sm:p-12 shadow-sm">
                    <h2 className="text-lg sm:text-xl font-bold text-[#1E3A2F] mb-2">No Submissions Found</h2>
                    <p className="text-[#596F65] text-xs">The student has not pushed any code or deliverables for this task yet.</p>
                </div>
            </div>
        );
    }

    const currentSub = submissions[selectedSubIndex];

    const statusBadgeStyles = {
        'Approved': 'bg-emerald-50 text-emerald-800 border-emerald-200',
        'Rejected': 'bg-rose-50 text-rose-800 border-rose-200',
        'Needs Revision': 'bg-amber-50 text-amber-800 border-amber-200',
        'Pending': 'bg-slate-100 text-slate-800 border-slate-200'
    };

    return (
        <div className="max-w-7xl mx-auto space-y-6 pb-12">
            {/* Top Bar */}
            <div className="flex items-center gap-3 sm:gap-4">
                <button
                    onClick={() => navigate(-1)}
                    className="p-2 sm:p-2.5 bg-white border border-[#E5ECE8] hover:bg-[#FAF9F5] rounded-2xl text-[#1E3A2F] transition-all shadow-sm shrink-0"
                >
                    <ArrowLeft size={16} className="sm:w-[18px] sm:h-[18px]" />
                </button>
                <div className="min-w-0 flex-1">
                    <h1 className="text-xl sm:text-2xl font-extrabold text-[#1E3A2F] tracking-tight truncate">
                        Deliverable Review Console
                    </h1>
                    <p className="text-[11px] sm:text-xs text-[#596F65] truncate">
                        Student: <strong className="text-[#1E3A2F]">{currentSub.student?.name}</strong> ({currentSub.student?.email})
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Main Code & Review Area */}
                <div className="lg:col-span-3 space-y-6">
                    {/* View Portal */}
                    <div className="bg-white rounded-[1.75rem] sm:rounded-[2rem] shadow-sm border border-[#E5ECE8] overflow-hidden flex flex-col h-[420px] sm:h-[540px]">
                        <div className="px-4 sm:px-6 py-3.5 bg-[#FAF9F5] border-b border-[#E5ECE8] flex justify-between items-center flex-wrap gap-2">
                            <h3 className="font-bold text-[#1E3A2F] text-xs flex items-center gap-2 truncate max-w-[260px] sm:max-w-none">
                                {currentSub.content ? <Code size={15} className="text-[#3E735E] shrink-0" /> : <FileText size={15} className="text-[#1E3A2F] shrink-0" />}
                                <span className="truncate">Version {currentSub.version} — {currentSub.content ? `Code (${currentSub.language || 'js'})` : 'Document Reference'}</span>
                            </h3>
                            <span className={`text-[10px] sm:text-[11px] font-bold px-2.5 py-0.5 rounded-full border shrink-0 ${statusBadgeStyles[currentSub.status] || statusBadgeStyles.Pending}`}>
                                {currentSub.status}
                            </span>
                        </div>

                        <div className="flex-1 overflow-auto bg-[#142820] p-0 m-0">
                            {currentSub.content ? (
                                <SyntaxHighlighter
                                    language={currentSub.language || 'javascript'}
                                    style={vscDarkPlus}
                                    customStyle={{ margin: 0, minHeight: '100%', background: '#142820', padding: '1rem', fontSize: '0.8rem' }}
                                    showLineNumbers={true}
                                >
                                    {currentSub.content}
                                </SyntaxHighlighter>
                            ) : (
                                <div className="p-6 sm:p-8 h-full flex items-center justify-center flex-col gap-4 text-center bg-[#FAF9F5]">
                                    <div className="w-14 h-14 rounded-2xl bg-[#EBF3EE] text-[#1E3A2F] flex items-center justify-center">
                                        <FileText size={28} />
                                    </div>
                                    <div>
                                        <p className="text-xs sm:text-sm font-bold text-[#1E3A2F]">Attached External Document:</p>
                                        <a
                                            href={currentSub.fileUrl}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1E3A2F] hover:underline mt-2 bg-white px-4 py-2 rounded-xl border border-[#D5DDD8] break-all shadow-sm"
                                        >
                                            <span>Open Deliverable Link</span>
                                            <ExternalLink size={13} />
                                        </a>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Supervisor Feedback & Verdict */}
                    <div className="bg-white rounded-[1.75rem] sm:rounded-[2rem] shadow-sm border border-[#E5ECE8] p-5 sm:p-6 space-y-4">
                        <h3 className="font-bold text-[#1E3A2F] text-xs sm:text-sm">Supervisor Evaluation & Feedback</h3>

                        <textarea
                            rows={3}
                            placeholder="Write structured guidance, corrections, or notes for the student..."
                            value={overallFeedback || currentSub.overallFeedback || ''}
                            onChange={(e) => setOverallFeedback(e.target.value)}
                            className="w-full px-3.5 sm:px-4 py-2.5 sm:py-3 bg-[#FAF9F5] border border-[#D5DDD8] rounded-2xl text-xs text-[#1A2421] placeholder-slate-400 focus:outline-none focus:border-[#1E3A2F] transition-all resize-none"
                        />

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3">
                            <button
                                onClick={() => handleReviewSubmit('Approved')}
                                disabled={isSubmitting}
                                className="flex items-center justify-center gap-2 px-4 py-2.5 bg-[#1E3A2F] hover:bg-[#142820] text-white text-xs font-bold rounded-full shadow-md transition-all disabled:opacity-50"
                            >
                                <CheckCircle2 size={15} />
                                <span>Approve</span>
                            </button>
                            <button
                                onClick={() => handleReviewSubmit('Needs Revision')}
                                disabled={isSubmitting}
                                className="flex items-center justify-center gap-2 px-4 py-2.5 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 text-xs font-bold rounded-full transition-all disabled:opacity-50"
                            >
                                <AlertCircle size={15} />
                                <span>Request Revisions</span>
                            </button>
                            <button
                                onClick={() => handleReviewSubmit('Rejected')}
                                disabled={isSubmitting}
                                className="flex items-center justify-center gap-2 px-4 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200 text-xs font-bold rounded-full transition-all disabled:opacity-50"
                            >
                                <XCircle size={15} />
                                <span>Reject</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Sidebar: Submissions Versions */}
                <div className="bg-white rounded-[1.75rem] sm:rounded-[2rem] shadow-sm border border-[#E5ECE8] p-4 sm:p-5 self-start space-y-3 w-full">
                    <h3 className="font-bold text-[#1E3A2F] text-xs sm:text-sm flex items-center gap-2 pb-2 border-b border-[#F0EFEA]">
                        <History size={15} className="text-[#3E735E]" />
                        Submission Versions
                    </h3>
                    <div className="space-y-2">
                        {submissions.map((sub, idx) => (
                            <button
                                key={sub._id}
                                onClick={() => {
                                    setSelectedSubIndex(idx);
                                    setOverallFeedback(sub.overallFeedback || '');
                                }}
                                className={`w-full text-left p-3 rounded-2xl border transition-all ${
                                    idx === selectedSubIndex
                                        ? 'border-[#1E3A2F] bg-[#EBF3EE] ring-1 ring-[#1E3A2F]/20'
                                        : 'border-[#E5ECE8] hover:border-[#CBDCD4] bg-[#FAF9F5]'
                                }`}
                            >
                                <div className="flex justify-between items-center mb-1">
                                    <span className="font-bold text-[11px] sm:text-xs text-[#1E3A2F]">
                                        Version {sub.version} {idx === 0 ? '(Latest)' : ''}
                                    </span>
                                    <span className={`text-[8px] sm:text-[9px] font-bold px-2 py-0.5 rounded-full border ${statusBadgeStyles[sub.status] || statusBadgeStyles.Pending}`}>
                                        {sub.status}
                                    </span>
                                </div>
                                <p className="text-[11px] text-[#596F65] truncate mb-1">{sub.description}</p>
                                <span className="text-[9px] text-[#6B7F76] block font-mono">
                                    {new Date(sub.createdAt).toLocaleDateString()}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SubmissionReview;
