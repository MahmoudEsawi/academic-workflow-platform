import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { loginSuccess } from '../redux/authSlice';
import { GraduationCap, Mail, Lock, User } from 'lucide-react';

const Signup = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('Student'); // Default
    const [error, setError] = useState('');

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleSignup = async (e) => {
        e.preventDefault();
        try {
            const { data } = await axios.post('http://localhost:5001/api/auth/register', {
                name,
                email,
                password,
                role
            });
            dispatch(loginSuccess(data));
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Signup failed');
        }
    };

    return (
        <div className="min-h-screen flex">
            {/* Left Panel - Branding */}
            <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#00244D] via-[#003366] to-[#001a38] flex-col justify-center items-center p-12 relative overflow-hidden">
                <div className="absolute inset-0 opacity-5">
                    <div className="absolute top-20 left-20 w-72 h-72 bg-white rounded-full blur-3xl"></div>
                    <div className="absolute bottom-20 right-20 w-96 h-96 bg-[#3498DB] rounded-full blur-3xl"></div>
                </div>
                <div className="relative z-10 text-center">
                    <div className="w-20 h-20 bg-[#E81700] rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-lg shadow-red-900/30">
                        <GraduationCap size={40} className="text-white" />
                    </div>
                    <h1 className="text-4xl font-bold text-white mb-4">
                        Tafila Technical University
                    </h1>
                    <p className="text-xl text-slate-300 font-light mb-2">
                        Academic Workflow Platform
                    </p>
                    <p className="text-sm text-slate-400 max-w-sm mt-6">
                        Join the platform to submit proposals, manage your graduation project, and collaborate with your team.
                    </p>
                </div>
            </div>

            {/* Right Panel - Form */}
            <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 sm:px-12 lg:px-20 bg-white">
                <div className="max-w-md w-full mx-auto">
                    {/* Mobile Logo */}
                    <div className="lg:hidden flex items-center gap-3 mb-10">
                        <div className="w-10 h-10 bg-[#E81700] rounded-xl flex items-center justify-center">
                            <GraduationCap size={24} className="text-white" />
                        </div>
                        <span className="text-xl font-bold text-[#00244D]">TTU Workflow</span>
                    </div>

                    <h2 className="text-3xl font-bold text-[#00244D] mb-2">
                        Create your account
                    </h2>
                    <p className="text-gray-500 mb-8">
                        Already have an account?{' '}
                        <Link to="/login" className="font-semibold text-[#E81700] hover:text-[#C71400]">
                            Sign in
                        </Link>
                    </p>

                    {error && (
                        <div className="bg-red-50 border-l-4 border-[#E81700] p-4 mb-6 rounded-r-lg">
                            <p className="text-sm text-red-700">{error}</p>
                        </div>
                    )}

                    <form className="space-y-5" onSubmit={handleSignup}>
                        <div>
                            <label className="block text-sm font-semibold text-[#00244D] mb-1.5">Full Name</label>
                            <div className="relative">
                                <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    required
                                    placeholder="Your full name"
                                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00244D]/20 focus:border-[#00244D] text-sm bg-gray-50/50"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-[#00244D] mb-1.5">Email Address</label>
                            <div className="relative">
                                <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="email"
                                    required
                                    placeholder="you@ttu.edu.jo"
                                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00244D]/20 focus:border-[#00244D] text-sm bg-gray-50/50"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-[#00244D] mb-1.5">Password</label>
                            <div className="relative">
                                <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="password"
                                    required
                                    minLength="6"
                                    placeholder="••••••••"
                                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00244D]/20 focus:border-[#00244D] text-sm bg-gray-50/50"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-[#00244D] mb-1.5">I am a...</label>
                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    type="button"
                                    className={`py-3 px-4 border rounded-xl text-sm font-semibold focus:outline-none transition-all ${role === 'Student' ? 'border-[#00244D] ring-2 ring-[#00244D] bg-[#00244D]/5 text-[#00244D]' : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'}`}
                                    onClick={() => setRole('Student')}
                                >
                                    Student
                                </button>
                                <button
                                    type="button"
                                    className={`py-3 px-4 border rounded-xl text-sm font-semibold focus:outline-none transition-all ${role === 'Supervisor' ? 'border-[#00244D] ring-2 ring-[#00244D] bg-[#00244D]/5 text-[#00244D]' : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'}`}
                                    onClick={() => setRole('Supervisor')}
                                >
                                    Supervisor
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full py-3 px-4 bg-[#E81700] hover:bg-[#C71400] text-white font-semibold rounded-xl shadow-lg shadow-red-500/20 transition-all hover:shadow-red-500/30 text-sm"
                        >
                            Create Account
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Signup;
