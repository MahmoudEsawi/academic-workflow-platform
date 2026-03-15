import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

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
            const { data } = await axios.post(
                'http://localhost:5001/api/projects',
                { title, description, supervisorId }
            );

            // Redirect back to dashboard indicating success
            navigate('/dashboard', { state: { message: 'Proposal submitted successfully!' } });
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to submit proposal.');
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Submit Project Proposal</h1>
            <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
                <form onSubmit={handleSubmit} className="space-y-6">
                    {error && (
                        <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm border border-red-200">
                            {error}
                        </div>
                    )}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Project Title</label>
                        <input
                            type="text"
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[#00244D] focus:border-[#00244D]"
                            placeholder="Enter a descriptive title..."
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Proposal Description & Objectives</label>
                        <textarea
                            required
                            rows={6}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[#00244D] focus:border-[#00244D]"
                            placeholder="Describe your project, the problem it solves, and the technologies you plan to use..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Select Supervisor</label>
                        <select
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[#00244D] focus:border-[#00244D] bg-white"
                            value={supervisorId}
                            onChange={(e) => setSupervisorId(e.target.value)}
                        >
                            <option value="" disabled>Select a Supervisor...</option>
                            {supervisors.map(sup => (
                                <option key={sup._id} value={sup._id}>
                                    {sup.name} ({sup.email})
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="flex justify-end gap-3 pt-4">
                        <button
                            type="button"
                            onClick={() => navigate('/dashboard')}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className={`px-4 py-2 text-sm font-medium text-white rounded-md transition-colors ${isSubmitting ? 'bg-[#00244D] cursor-not-allowed' : 'bg-[#00244D] hover:bg-[#003366]'
                                }`}
                        >
                            {isSubmitting ? 'Submitting...' : 'Submit Proposal'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SubmitProposal;
