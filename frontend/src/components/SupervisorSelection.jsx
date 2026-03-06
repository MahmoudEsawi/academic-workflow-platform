import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPendingRequests, sendSupervisionRequest, clearWorkflowMessages } from '../redux/workflowSlice';
import axios from 'axios';
import { Users, AlertCircle, CheckCircle2 } from 'lucide-react';

const SupervisorSelection = () => {
    const dispatch = useDispatch();
    const { requests, isLoading, error, successMessage } = useSelector((state) => state.workflow);
    const [supervisors, setSupervisors] = useState([]);

    useEffect(() => {
        dispatch(fetchPendingRequests());

        // Fetch list of available supervisors
        const fetchSupervisors = async () => {
            try {
                const token = localStorage.getItem('token');
                const { data } = await axios.get('http://localhost:5001/api/users/supervisors', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setSupervisors(data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchSupervisors();

        return () => {
            dispatch(clearWorkflowMessages());
        };
    }, [dispatch]);

    const handleSendRequest = (supervisorId) => {
        dispatch(sendSupervisionRequest(supervisorId));
    };

    // If student has a pending request, show a different view
    const hasPendingRequest = requests.length > 0;

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                            <Users size={24} />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">Select Your Supervisor</h2>
                            <p className="text-sm text-gray-500 mt-1">
                                Choose a doctor to supervise your academic project workflow.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="p-6">
                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-md flex items-start">
                            <AlertCircle className="text-red-500 mt-0.5 mr-3 shrink-0" size={20} />
                            <p className="text-sm text-red-700">{error}</p>
                        </div>
                    )}

                    {successMessage && (
                        <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 rounded-r-md flex items-start">
                            <CheckCircle2 className="text-green-500 mt-0.5 mr-3 shrink-0" size={20} />
                            <p className="text-sm text-green-700">{successMessage}</p>
                        </div>
                    )}

                    {hasPendingRequest ? (
                        <div className="text-center py-12">
                            <div className="mx-auto w-16 h-16 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mb-4">
                                <Users size={32} />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900">Request Pending</h3>
                            <p className="mt-2 text-sm text-gray-500 max-w-sm mx-auto">
                                You have successfully sent a supervision request. Please wait for the Doctor to approve it to unlock the Workspace.
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {supervisors.map((doctor) => (
                                <div key={doctor._id} className="border border-gray-200 rounded-lg p-5 hover:border-indigo-300 transition-colors flex flex-col justify-between">
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-900">{doctor.name}</h3>
                                        <p className="text-sm text-gray-500">{doctor.email}</p>
                                    </div>
                                    <button
                                        onClick={() => handleSendRequest(doctor._id)}
                                        disabled={isLoading}
                                        className="mt-6 w-full py-2 px-4 bg-indigo-50 text-indigo-700 font-medium rounded-md hover:bg-indigo-100 transition-colors disabled:opacity-50"
                                    >
                                        Send Request
                                    </button>
                                </div>
                            ))}
                            {supervisors.length === 0 && (
                                <div className="col-span-2 text-center py-8 text-gray-500">
                                    No supervisors available at the moment.
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SupervisorSelection;
