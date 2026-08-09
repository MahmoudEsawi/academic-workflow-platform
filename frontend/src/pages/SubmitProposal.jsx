import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, Send, AlertCircle, Sparkles } from 'lucide-react';

const SubmitProposal = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [supervisorId, setSupervisorId] = useState('');
    const [supervisors, setSupervisors] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchSupervisors = async () => {
            try {
                const { data } = await axios.get('http://localhost:5001/api/users/supervisors');
                setSupervisors(data);
            } catch (err) {
                console.error('Failed to load supervisors', err);
            }
        };
        fetchSupervisors();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');

        try {
            await axios.post(
                'http://localhost:5001/api/projects',
                { title, description, supervisorId }
            );
            navigate('/dashboard', { state: { message: 'Proposal submitted successfully!' } });
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to submit proposal.');
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto space-y-6 pb-12">
            <div className="flex items-center gap-4">
                <button
                    onClick={() => navigate('/dashboard')}
                    className="p-2.5 bg-white border border-[#E5ECE8] hover:bg-[#FAF9F5] rounded-2xl text-[#1E3A2F] transition-all shadow-sm"
                >
                    <ArrowLeft size={18} />
                </button>
                <div>
                    <h1 className="text-2xl font-extrabold text-[#1E3A2F] tracking-tight">Submit Project Proposal</h1>
                    <p className="text-xs text-[#596F65]">Initialize a new graduation project research team</p>
                </div>
            </div>

            <div className="bg-white p-6 sm:p-8 rounded-[2rem] shadow-sm border border-[#E5ECE8]">
                <form onSubmit={handleSubmit} className="space-y-5">
                    {error && (
                        <div className="bg-rose-50 border border-rose-200 text-rose-800 p-4 rounded-2xl text-xs flex items-start gap-2">
                            <AlertCircle size={16} className="shrink-0 mt-0.5" />
                            <span>{error}</span>
                        </div>
                    )}

                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-[#1E3A2F] mb-1.5">
                            Project Title
                        </label>
                        <input
                            type="text"
                            required
                            className="w-full px-4 py-3 bg-[#FAF9F5] border border-[#D5DDD8] rounded-2xl text-xs text-[#1A2421] placeholder-slate-400 focus:outline-none focus:border-[#1E3A2F] transition-all"
                            placeholder="e.g. Distributed IoT Healthcare Monitoring System"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-[#1E3A2F] mb-1.5">
                            Proposal Abstract & Objectives
                        </label>
                        <textarea
                            required
                            rows={6}
                            className="w-full px-4 py-3 bg-[#FAF9F5] border border-[#D5DDD8] rounded-2xl text-xs text-[#1A2421] placeholder-slate-400 focus:outline-none focus:border-[#1E3A2F] transition-all resize-none"
                            placeholder="Detail your project problem statement, methodology, planned technologies, and research deliverables..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-[#1E3A2F] mb-1.5">
                            Select Supervising Doctor
                        </label>
                        <select
                            required
                            className="w-full px-4 py-3 bg-[#FAF9F5] border border-[#D5DDD8] rounded-2xl text-xs text-[#1A2421] focus:outline-none focus:border-[#1E3A2F]"
                            value={supervisorId}
                            onChange={(e) => setSupervisorId(e.target.value)}
                        >
                            <option value="" disabled>Choose a faculty supervisor...</option>
                            {supervisors.map(sup => (
                                <option key={sup._id} value={sup._id}>
                                    {sup.name} ({sup.email})
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-[#F0EFEA]">
                        <button
                            type="button"
                            onClick={() => navigate('/dashboard')}
                            className="px-5 py-2.5 text-xs font-bold text-[#596F65] hover:text-[#1E3A2F] bg-[#FAF9F5] hover:bg-[#F4F2EC] rounded-xl transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-6 py-2.5 text-xs font-bold text-white bg-[#1E3A2F] hover:bg-[#142820] rounded-full shadow-md transition-all disabled:opacity-50 flex items-center gap-2"
                        >
                            <Send size={14} />
                            <span>{isSubmitting ? 'Submitting...' : 'Submit Proposal'}</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SubmitProposal;
