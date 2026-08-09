import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPendingRequests, sendSupervisionRequest, clearWorkflowMessages } from '../redux/workflowSlice';
import axios from 'axios';
import { Users, AlertCircle, CheckCircle2, Send, Clock, Sparkles } from 'lucide-react';

const SupervisorSelection = () => {
    const dispatch = useDispatch();
    const { requests, isLoading, error, successMessage } = useSelector((state) => state.workflow);
    const [supervisors, setSupervisors] = useState([]);

    useEffect(() => {
        dispatch(fetchPendingRequests());

        const fetchSupervisors = async () => {
            try {
                const { data } = await axios.get('http://localhost:5001/api/users/supervisors');
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

    const hasPendingRequest = requests.length > 0;

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="bg-white rounded-[2rem] shadow-sm border border-[#E5ECE8] overflow-hidden">
                <div className="p-6 sm:p-8 border-b border-[#E5ECE8]">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-[#EBF3EE] text-[#1E3A2F] rounded-2xl flex items-center justify-center">
                            <Users size={24} />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-[#1E3A2F]">Select Your Academic Supervisor</h2>
                            <p className="text-xs sm:text-sm text-[#596F65] mt-0.5">
                                Choose an available faculty doctor to supervise your graduation research milestones.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="p-6 sm:p-8">
                    {error && (
                        <div className="mb-6 p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-start gap-3 text-rose-800 text-xs">
                            <AlertCircle className="mt-0.5 shrink-0" size={16} />
                            <p>{error}</p>
                        </div>
                    )}

                    {successMessage && (
                        <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-start gap-3 text-emerald-800 text-xs">
                            <CheckCircle2 className="mt-0.5 shrink-0" size={16} />
                            <p>{successMessage}</p>
                        </div>
                    )}

                    {hasPendingRequest ? (
                        <div className="text-center py-12 px-4">
                            <div className="mx-auto w-16 h-16 bg-[#EBF3EE] text-[#1E3A2F] rounded-full flex items-center justify-center mb-4 animate-pulse">
                                <Clock size={30} />
                            </div>
                            <h3 className="text-lg font-bold text-[#1E3A2F]">Supervision Request Pending</h3>
                            <p className="mt-2 text-xs text-[#596F65] max-w-md mx-auto leading-relaxed">
                                You have submitted a request to an academic advisor. Once they accept your request, your full project workspace will be enabled immediately.
                            </p>
                        </div>
                    ) : (
                        <div>
                            <h3 className="text-xs font-bold uppercase tracking-wider text-[#6B7F76] mb-4">
                                Available Faculty Supervisors
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {supervisors.map((doctor) => (
                                    <div
                                        key={doctor._id}
                                        className="bg-[#FAF9F5] border border-[#E5ECE8] rounded-2xl p-5 hover:border-[#1E3A2F] transition-all flex flex-col justify-between group"
                                    >
                                        <div className="flex items-start gap-3.5">
                                            <div className="w-10 h-10 rounded-xl bg-[#1E3A2F] text-white flex items-center justify-center font-bold text-sm shrink-0">
                                                {doctor.name?.charAt(0) || 'D'}
                                            </div>
                                            <div>
                                                <h3 className="text-base font-bold text-[#1E3A2F] group-hover:text-[#3E735E] transition-colors">{doctor.name}</h3>
                                                <p className="text-xs text-[#6B7F76] mt-0.5">{doctor.email}</p>
                                                <span className="inline-block mt-2 text-[10px] font-bold uppercase tracking-wider text-[#1E3A2F] bg-[#EBF3EE] px-2.5 py-0.5 rounded-full border border-[#D1E7DD]">
                                                    Faculty Advisor
                                                </span>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => handleSendRequest(doctor._id)}
                                            disabled={isLoading}
                                            className="mt-5 w-full py-2.5 px-4 bg-[#1E3A2F] hover:bg-[#142820] text-white text-xs font-bold rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 disabled:opacity-50"
                                        >
                                            <Send size={14} />
                                            <span>Send Supervision Request</span>
                                        </button>
                                    </div>
                                ))}
                                {supervisors.length === 0 && (
                                    <div className="col-span-2 text-center py-8 text-[#6B7F76] text-xs">
                                        No supervisors registered in the system yet.
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SupervisorSelection;
