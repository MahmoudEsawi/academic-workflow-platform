import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { loginSuccess } from '../redux/authSlice';
import { GraduationCap, Mail, Lock, User, Sparkles, ArrowRight, ArrowLeft, CheckCircle2 } from 'lucide-react';

const Signup = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('Student');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleSignup = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        try {
            const { data } = await axios.post('http://localhost:5001/api/auth/register', {
                name,
                email,
                password,
                role
            });
            dispatch(loginSuccess(data));
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed. Please verify your details.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex bg-[#FAF9F5] text-[#1A2421] selection:bg-[#1E3A2F] selection:text-white">
            {/* Left Panel - Editorial Branding */}
            <div className="hidden lg:flex lg:w-1/2 bg-[#1E3A2F] text-white flex-col justify-between p-12 relative overflow-hidden">
                <div className="relative z-10 flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-3 group">
                        <div className="w-10 h-10 bg-white text-[#1E3A2F] rounded-xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
                            <GraduationCap size={22} />
                        </div>
                        <span className="text-xl font-extrabold tracking-tight text-white">
                            Academia<span className="font-serif-editorial italic font-normal text-[#A3CFBB]">Flow</span>
                        </span>
                    </Link>

                    <Link
                        to="/"
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-white/80 hover:text-white bg-white/10 hover:bg-white/20 px-3.5 py-1.5 rounded-full transition-all"
                    >
                        <ArrowLeft size={13} />
                        <span>Back to Home</span>
                    </Link>
                </div>

                <div className="relative z-10 max-w-md my-auto space-y-6">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 text-white text-xs font-bold">
                        <Sparkles size={14} /> Join the Academic Network
                    </div>
                    <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
                        Start Your Journey <br />
                        Toward <span className="font-serif-editorial italic font-normal text-[#A3CFBB]">Excellence</span>
                    </h1>
                    <p className="text-white/70 text-sm leading-relaxed">
                        Create an academic account to propose graduation research topics, collaborate with faculty supervisors, and publish sprint deliverables.
                    </p>

                    <div className="space-y-3 pt-2">
                        <div className="flex items-center gap-3 text-xs text-white/90">
                            <div className="w-5 h-5 rounded-full bg-white/10 text-[#A3CFBB] flex items-center justify-center">
                                <CheckCircle2 size={13} />
                            </div>
                            <span>Direct advisor linking and proposal reviews</span>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-white/90">
                            <div className="w-5 h-5 rounded-full bg-white/10 text-[#A3CFBB] flex items-center justify-center">
                                <CheckCircle2 size={13} />
                            </div>
                            <span>Milestone deliverables & versioned code submissions</span>
                        </div>
                    </div>
                </div>

                <div className="relative z-10 text-xs text-white/50">
                    &copy; 2026 AcademiaFlow. Academic Workflow & Defense Platform.
                </div>
            </div>

            {/* Right Panel - Form */}
            <div className="w-full lg:w-1/2 flex flex-col justify-center px-6 sm:px-12 lg:px-16 py-12 bg-white">
                <div className="max-w-md w-full mx-auto space-y-6">
                    {/* Mobile Brand */}
                    <div className="lg:hidden flex items-center justify-between pb-4 border-b border-[#E5ECE8]">
                        <Link to="/" className="flex items-center gap-2.5">
                            <div className="w-9 h-9 bg-[#1E3A2F] text-white rounded-xl flex items-center justify-center">
                                <GraduationCap size={20} />
                            </div>
                            <span className="text-lg font-extrabold text-[#1E3A2F]">AcademiaFlow</span>
                        </Link>
                        <Link to="/" className="text-xs font-bold text-[#1E3A2F] flex items-center gap-1">
                            <ArrowLeft size={13} /> Home
                        </Link>
                    </div>

                    <div>
                        <h2 className="text-3xl font-extrabold text-[#1E3A2F] tracking-tight mb-1.5">
                            Create an account
                        </h2>
                        <p className="text-xs text-[#596F65]">
                            Select your academic role to enter the portal.
                        </p>
                    </div>

                    {error && (
                        <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-rose-700 text-xs">
                            {error}
                        </div>
                    )}

                    <form className="space-y-4" onSubmit={handleSignup}>
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-[#1E3A2F] mb-1.5">Full Name</label>
                            <div className="relative">
                                <User size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input
                                    type="text"
                                    required
                                    placeholder="e.g. Eleanor Vance"
                                    className="w-full pl-10 pr-4 py-3 bg-[#FAF9F5] border border-[#D5DDD8] rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#1E3A2F]/20 focus:border-[#1E3A2F] text-sm text-[#1A2421] placeholder-slate-400 transition-all"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-[#1E3A2F] mb-1.5">Email Address</label>
                            <div className="relative">
                                <Mail size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input
                                    type="email"
                                    required
                                    placeholder="you@university.edu"
                                    className="w-full pl-10 pr-4 py-3 bg-[#FAF9F5] border border-[#D5DDD8] rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#1E3A2F]/20 focus:border-[#1E3A2F] text-sm text-[#1A2421] placeholder-slate-400 transition-all"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-[#1E3A2F] mb-1.5">Password</label>
                            <div className="relative">
                                <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input
                                    type="password"
                                    required
                                    minLength="6"
                                    placeholder="•••••••• (min 6 characters)"
                                    className="w-full pl-10 pr-4 py-3 bg-[#FAF9F5] border border-[#D5DDD8] rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#1E3A2F]/20 focus:border-[#1E3A2F] text-sm text-[#1A2421] placeholder-slate-400 transition-all"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-[#1E3A2F] mb-1.5">Academic Role</label>
                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    type="button"
                                    className={`py-3 px-4 rounded-2xl text-xs font-bold transition-all border flex items-center justify-center gap-2 ${
                                        role === 'Student'
                                            ? 'bg-[#1E3A2F] border-[#1E3A2F] text-white shadow-md'
                                            : 'bg-[#FAF9F5] border-[#D5DDD8] text-[#596F65] hover:text-[#1E3A2F] hover:bg-[#F4F2EC]'
                                    }`}
                                    onClick={() => setRole('Student')}
                                >
                                    <span>🎓 Student</span>
                                </button>
                                <button
                                    type="button"
                                    className={`py-3 px-4 rounded-2xl text-xs font-bold transition-all border flex items-center justify-center gap-2 ${
                                        role === 'Supervisor'
                                            ? 'bg-[#1E3A2F] border-[#1E3A2F] text-white shadow-md'
                                            : 'bg-[#FAF9F5] border-[#D5DDD8] text-[#596F65] hover:text-[#1E3A2F] hover:bg-[#F4F2EC]'
                                    }`}
                                    onClick={() => setRole('Supervisor')}
                                >
                                    <span>👨‍🏫 Faculty Advisor</span>
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-3.5 px-4 bg-[#1E3A2F] hover:bg-[#142820] text-white font-bold rounded-2xl shadow-lg shadow-[#1E3A2F]/20 transition-all hover:scale-[1.01] active:scale-[0.99] text-xs flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            {isLoading ? 'Creating account...' : (
                                <>
                                    <span>Complete Registration</span>
                                    <ArrowRight size={15} />
                                </>
                            )}
                        </button>
                    </form>

                    <p className="text-center text-xs text-[#596F65] pt-2">
                        Already registered?{' '}
                        <Link to="/login" className="font-bold text-[#1E3A2F] hover:underline">
                            Sign in to your account
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Signup;
