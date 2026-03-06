import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Code, FileUp, Send, History, ArrowLeft, CheckCircle } from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

const StudentWorkspace = () => {
    const { taskId } = useParams();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('code'); // 'code' or 'file'

    const [content, setContent] = useState('');
    const [language, setLanguage] = useState('javascript');
    const [description, setDescription] = useState('');
    const [fileUrl, setFileUrl] = useState('');

    const [submissions, setSubmissions] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const token = localStorage.getItem('token');
                const { data } = await axios.get(`http://localhost:5001/api/submissions/task/${taskId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
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
        try {
            const token = localStorage.getItem('token');
            const payload = {
                taskId,
                description,
                ...(activeTab === 'code' ? { content, language } : { fileUrl })
            };
            const { data } = await axios.post('http://localhost:5001/api/submissions', payload, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setSubmissions([data, ...submissions]);
            setContent('');
            setDescription('');
            setFileUrl('');
            alert(`Submission successful! Saved as Version ${data.version}`);
        } catch (err) {
            console.error(err);
            alert('Failed to submit, please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-6xl mx-auto space-y-6 pb-12">
            <div className="flex items-center gap-4 mb-6">
                <button
                    onClick={() => navigate(-1)}
                    className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-500"
                >
                    <ArrowLeft size={20} />
                </button>
                <h1 className="text-2xl font-bold text-slate-800">Task Workspace</h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Submission Form */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                        <div className="flex border-b border-slate-200">
                            <button
                                className={`flex-1 py-4 flex justify-center items-center gap-2 font-medium transition-colors ${activeTab === 'code' ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50/50' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'}`}
                                onClick={() => setActiveTab('code')}
                            >
                                <Code size={18} /> Paste Source Code
                            </button>
                            <button
                                className={`flex-1 py-4 flex justify-center items-center gap-2 font-medium transition-colors ${activeTab === 'file' ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50/50' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'}`}
                                onClick={() => setActiveTab('file')}
                            >
                                <FileUp size={18} /> Upload Document
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-6">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1">
                                    Submission Description
                                </label>
                                <textarea
                                    required
                                    rows={3}
                                    placeholder="Briefly describe what you've accomplished in this version..."
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                />
                            </div>

                            {activeTab === 'code' ? (
                                <div className="space-y-4">
                                    <div className="flex items-center gap-4">
                                        <label className="text-sm font-semibold text-slate-700">Language:</label>
                                        <select
                                            value={language}
                                            onChange={(e) => setLanguage(e.target.value)}
                                            className="px-3 py-1.5 border border-slate-300 rounded-md text-sm outline-none focus:border-indigo-500"
                                        >
                                            <option value="javascript">JavaScript / Node.js</option>
                                            <option value="python">Python</option>
                                            <option value="html">HTML</option>
                                            <option value="css">CSS</option>
                                            <option value="java">Java</option>
                                            <option value="jsx">React JSX</option>
                                        </select>
                                    </div>
                                    <div className="relative">
                                        <textarea
                                            required
                                            rows={12}
                                            placeholder="// Paste your formatted code here..."
                                            className="w-full font-mono text-sm px-4 py-4 bg-slate-900 text-slate-100 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                                            value={content}
                                            onChange={(e) => setContent(e.target.value)}
                                        />
                                    </div>
                                </div>
                            ) : (
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-1">
                                        File URL / Attachment Link
                                    </label>
                                    <input
                                        type="url"
                                        required
                                        placeholder="https://drive.google.com/..."
                                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                                        value={fileUrl}
                                        onChange={(e) => setFileUrl(e.target.value)}
                                    />
                                    <p className="text-xs text-slate-500 mt-2">
                                        * Note: Direct file uploads are simulated via URLs in this version.
                                    </p>
                                </div>
                            )}

                            <div className="pt-4 flex justify-end">
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 active:bg-indigo-800 transition-colors disabled:opacity-70"
                                >
                                    <Send size={18} />
                                    {isSubmitting ? 'Submitting...' : 'Submit Version'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Version History Sidebar */}
                <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6 self-start">
                    <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-6">
                        <History size={20} className="text-indigo-600" />
                        Version History
                    </h2>

                    <div className="space-y-6">
                        {submissions.length === 0 ? (
                            <p className="text-sm text-slate-500 italic">No submissions yet for this task.</p>
                        ) : (
                            submissions.map((sub) => (
                                <div key={sub._id} className="relative pl-6 border-l-2 border-indigo-200 pb-2">
                                    <div className="absolute -left-[9px] top-0 bg-indigo-600 rounded-full w-4 h-4 border-2 border-white ring-2 ring-indigo-100" />
                                    <div className="bg-white rounded-lg p-4 shadow-sm border border-slate-200">
                                        <div className="flex justify-between items-start mb-2">
                                            <span className="font-bold text-indigo-700">Version {sub.version}</span>
                                            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${sub.status === 'Approved' ? 'bg-emerald-100 text-emerald-700' :
                                                    sub.status === 'Needs Revision' ? 'bg-amber-100 text-amber-700' :
                                                        sub.status === 'Rejected' ? 'bg-red-100 text-red-700' :
                                                            'bg-slate-100 text-slate-700'
                                                }`}>
                                                {sub.status}
                                            </span>
                                        </div>
                                        <p className="text-sm text-slate-600 mb-2">{sub.description}</p>
                                        <span className="text-xs text-slate-400">
                                            {new Date(sub.createdAt).toLocaleDateString()} at {new Date(sub.createdAt).toLocaleTimeString()}
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
