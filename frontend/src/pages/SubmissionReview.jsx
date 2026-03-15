import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, CheckCircle, XCircle, AlertCircle, Send, Code, FileText } from 'lucide-react';
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
            // Update local state
            const updated = [...submissions];
            updated[selectedSubIndex] = data;
            setSubmissions(updated);
            alert(`Submission marked as ${status}`);
        } catch (err) {
            console.error(err);
            alert('Failed to submit review');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!submissions.length) {
        return (
            <div className="max-w-6xl mx-auto py-12 px-6">
                <button onClick={() => navigate(-1)} className="mb-6 flex items-center text-slate-500 hover:text-slate-800">
                    <ArrowLeft size={18} className="mr-2" /> Back
                </button>
                <div className="bg-white border text-center border-slate-200 rounded-2xl p-12">
                    <h2 className="text-xl font-bold text-slate-800">No Submissions Yet</h2>
                    <p className="text-slate-500 mt-2">The student has not submitted any work for this task yet.</p>
                </div>
            </div>
        );
    }

    const currentSub = submissions[selectedSubIndex];

    return (
        <div className="max-w-7xl mx-auto pb-12">
            <div className="flex items-center gap-4 mb-6">
                <button
                    onClick={() => navigate(-1)}
                    className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-500"
                >
                    <ArrowLeft size={20} />
                </button>
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Review Submission</h1>
                    <p className="text-sm text-slate-500">Student: {currentSub.student?.name} ({currentSub.student?.email})</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Main Content Area */}
                <div className="lg:col-span-3 space-y-6">
                    {/* View Portal */}
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-[600px]">
                        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
                            <h3 className="font-bold text-slate-700 flex items-center gap-2">
                                {currentSub.content ? <Code size={18} className="text-indigo-500" /> : <FileText size={18} className="text-blue-500" />}
                                Version {currentSub.version} - {currentSub.content ? 'Source Code' : 'Document Reference'}
                            </h3>
                            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${currentSub.status === 'Approved' ? 'bg-emerald-100 text-emerald-800' :
                                    currentSub.status === 'Needs Revision' ? 'bg-amber-100 text-amber-800' :
                                        currentSub.status === 'Rejected' ? 'bg-red-100 text-red-800' :
                                            'bg-slate-200 text-slate-800'
                                }`}>
                                {currentSub.status}
                            </span>
                        </div>
                        <div className="flex-1 overflow-auto bg-slate-100 p-0 m-0">
                            {currentSub.content ? (
                                <SyntaxHighlighter
                                    language={currentSub.language || 'javascript'}
                                    style={vscDarkPlus}
                                    customStyle={{ margin: 0, minHeight: '100%', borderRadius: 0, padding: '1.5rem' }}
                                    showLineNumbers={true}
                                >
                                    {currentSub.content}
                                </SyntaxHighlighter>
                            ) : (
                                <div className="p-8 h-full flex items-center justify-center flex-col gap-4 text-center">
                                    <FileText size={48} className="text-slate-400" />
                                    <div>
                                        <p className="font-medium text-slate-800">File Attachment URL:</p>
                                        <a href={currentSub.fileUrl} target="_blank" rel="noreferrer" className="text-indigo-600 hover:underline mt-1 break-all">
                                            {currentSub.fileUrl}
                                        </a>
                                    </div>
                                    <p className="text-sm text-slate-500 max-w-md mt-4">
                                        Note: Click the link above to view external documents. For security, we do not inline external iFrames.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Review Action Box */}
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                        <h3 className="font-bold text-slate-800 mb-4">Provide Supervisor Feedback</h3>

                        <div className="mb-4">
                            <textarea
                                rows={4}
                                placeholder="Write your feedback for this version here..."
                                value={overallFeedback || currentSub.overallFeedback || ''}
                                onChange={(e) => setOverallFeedback(e.target.value)}
                                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none resize-y"
                            />
                        </div>

                        <div className="flex flex-wrap gap-3">
                            <button
                                onClick={() => handleReviewSubmit('Approved')}
                                disabled={isSubmitting}
                                className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 transition flex-1 justify-center disabled:opacity-50"
                            >
                                <CheckCircle size={18} /> Approve Fixes
                            </button>
                            <button
                                onClick={() => handleReviewSubmit('Needs Revision')}
                                disabled={isSubmitting}
                                className="flex items-center gap-2 px-5 py-2.5 bg-amber-500 text-white font-medium rounded-lg hover:bg-amber-600 transition flex-1 justify-center disabled:opacity-50"
                            >
                                <AlertCircle size={18} /> Request Edits
                            </button>
                            <button
                                onClick={() => handleReviewSubmit('Rejected')}
                                disabled={isSubmitting}
                                className="flex items-center gap-2 px-5 py-2.5 bg-slate-200 text-slate-700 font-medium rounded-lg hover:bg-slate-300 transition flex-1 justify-center disabled:opacity-50"
                            >
                                <XCircle size={18} /> Reject Version
                            </button>
                        </div>
                    </div>
                </div>

                {/* Sidebar: Submissions Versions */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 self-start max-h-[800px] overflow-y-auto">
                    <h3 className="font-bold text-slate-800 mb-4">Version History</h3>
                    <div className="space-y-3">
                        {submissions.map((sub, idx) => (
                            <button
                                key={sub._id}
                                onClick={() => {
                                    setSelectedSubIndex(idx);
                                    setOverallFeedback(sub.overallFeedback || '');
                                }}
                                className={`w-full text-left p-4 rounded-xl border transition-all ${idx === selectedSubIndex
                                        ? 'border-indigo-600 bg-indigo-50 ring-1 ring-indigo-600'
                                        : 'border-slate-200 hover:border-indigo-300 bg-white'
                                    }`}
                            >
                                <div className="flex justify-between items-center mb-1">
                                    <span className={`font-bold ${idx === selectedSubIndex ? 'text-indigo-700' : 'text-slate-700'}`}>
                                        Version {sub.version} {idx === 0 ? '(Latest)' : ''}
                                    </span>
                                </div>
                                <p className="text-xs text-slate-500 mb-2 truncate" title={sub.description}>{sub.description}</p>
                                <div className="flex justify-between items-end">
                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${sub.status === 'Approved' ? 'bg-emerald-100 text-emerald-800' :
                                            sub.status === 'Needs Revision' ? 'bg-amber-100 text-amber-800' :
                                                sub.status === 'Rejected' ? 'bg-red-100 text-red-800' :
                                                    'bg-slate-200 text-slate-800'
                                        }`}>
                                        {sub.status}
                                    </span>
                                    <span className="text-[10px] text-slate-400">
                                        {new Date(sub.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SubmissionReview;
