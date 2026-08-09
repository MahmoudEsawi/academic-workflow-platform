import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginSuccess } from '../redux/authSlice';
import axios from 'axios';
import { 
    GraduationCap, 
    ArrowUpRight, 
    Play, 
    CheckCircle2, 
    Star, 
    ChevronDown, 
    Code2, 
    UsersRound, 
    ShieldCheck, 
    Sparkles, 
    BookOpen,
    Lock,
    Mail,
    ArrowRight,
    X,
    Shield,
    Check,
    Menu
} from 'lucide-react';

const LandingPage = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { isAuthenticated } = useSelector(state => state.auth);
    const [openFaq, setOpenFaq] = useState(0);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    // Modal state for in-page secure login
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const [modalRole, setModalRole] = useState('Student');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const openPortal = (role) => {
        setModalRole(role);
        setError('');
        if (role === 'Student') {
            setEmail('alice@student.edu');
            setPassword('password123');
        } else if (role === 'Supervisor') {
            setEmail('smith@university.edu');
            setPassword('password123');
        } else {
            setEmail('admin@university.edu');
            setPassword('password123');
        }
        setIsLoginModalOpen(true);
        setMobileMenuOpen(false);
    };

    const handleModalLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        try {
            const { data } = await axios.post('http://localhost:5001/api/auth/login', {
                email,
                password,
            });
            dispatch(loginSuccess(data));
            setIsLoginModalOpen(false);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Authentication failed. Please check credentials.');
        } finally {
            setIsLoading(false);
        }
    };

    const faqs = [
        {
            q: "How do students connect with a project supervisor?",
            a: "Students can browse the faculty directory on their dashboard and send a 1-click supervision request to available doctors. Once the advisor accepts, the project workspace and milestones unlock automatically."
        },
        {
            q: "How does the code submission & review workflow function?",
            a: "Students submit task deliverables through an embedded source code editor with syntax highlighting or via cloud document URLs. Supervisors can inspect version history, provide formatted feedback, and assign status verdicts."
        },
        {
            q: "Can multiple students collaborate using team invite codes?",
            a: "Yes! Each approved project generates a unique 6-character team invite code. Teammates can enter this code to automatically join the project and access shared Kanban boards and chat rooms."
        },
        {
            q: "Is Kanban board and chat communication real-time?",
            a: "Yes, built with Socket.io WebSockets, every task movement, status update, message, and milestone revision syncs instantly across all connected team members and supervisors without page refreshes."
        },
        {
            q: "What user roles are supported on the platform?",
            a: "AcademiaFlow supports three dedicated roles: Students (proposal submission, workspace deliverables, sprint tracking), Supervisors (advisory approvals, code review, feedback), and Department Admins (system analytics and project oversight)."
        }
    ];

    return (
        <div className="min-h-screen bg-[#FAF9F5] text-[#1A2421] font-sans selection:bg-[#1E3A2F] selection:text-white overflow-x-hidden">
            
            {/* Top Navigation Bar */}
            <header className="sticky top-0 z-40 bg-[#FAF9F5]/95 backdrop-blur-md border-b border-[#EBE8E0]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
                    {/* Brand */}
                    <Link to="/" className="flex items-center gap-2.5 sm:gap-3 group">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-[#1E3A2F] text-white rounded-xl flex items-center justify-center shadow-md group-hover:scale-105 transition-transform shrink-0">
                            <GraduationCap size={20} className="sm:w-[22px] sm:h-[22px]" />
                        </div>
                        <div>
                            <span className="font-extrabold text-base sm:text-xl tracking-tight text-[#1E3A2F]">
                                Academia<span className="font-serif-editorial italic font-normal text-[#3E735E]">Flow</span>
                            </span>
                            <span className="hidden xs:block text-[8px] sm:text-[9px] uppercase font-bold tracking-widest text-[#6B7F76] -mt-1">
                                Academic Platform
                            </span>
                        </div>
                    </Link>

                    {/* Center Menu Pill - Desktop */}
                    <nav className="hidden lg:flex items-center gap-1 bg-[#1E3A2F] text-white/80 px-4 py-2 rounded-full shadow-md text-xs font-medium">
                        <a href="#hero" className="px-3 py-1 text-white hover:text-white rounded-full transition-colors">Home</a>
                        <a href="#portals" className="px-3 py-1 hover:text-white rounded-full transition-colors">Dual Portals</a>
                        <a href="#features" className="px-3 py-1 hover:text-white rounded-full transition-colors">Features</a>
                        <a href="#why-us" className="px-3 py-1 hover:text-white rounded-full transition-colors">Workflows</a>
                        <a href="#faqs" className="px-3 py-1 hover:text-white rounded-full transition-colors">FAQs</a>
                    </nav>

                    {/* Right Dual Portal Actions */}
                    <div className="flex items-center gap-2 sm:gap-3">
                        {isAuthenticated ? (
                            <Link
                                to="/dashboard"
                                className="flex items-center gap-1.5 bg-[#1E3A2F] hover:bg-[#142820] text-white text-xs font-bold px-4 sm:px-5 py-2 sm:py-2.5 rounded-full shadow-md transition-all hover:scale-105"
                            >
                                <span>Workspace</span>
                                <ArrowUpRight size={14} />
                            </Link>
                        ) : (
                            <>
                                <button
                                    onClick={() => openPortal('Student')}
                                    className="hidden md:inline-flex items-center gap-1 text-xs font-bold text-[#1E3A2F] bg-[#EBF3EE] hover:bg-[#D1E7DD] border border-[#D1E7DD] px-3.5 py-2 rounded-full transition-all"
                                >
                                    <span>🎓 Student</span>
                                </button>
                                <button
                                    onClick={() => openPortal('Supervisor')}
                                    className="flex items-center gap-1.5 bg-[#1E3A2F] hover:bg-[#142820] text-white text-xs font-bold px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-full shadow-md transition-all hover:scale-105"
                                >
                                    <span>👨‍🏫 Sign In</span>
                                </button>
                                <button
                                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                    className="p-2 lg:hidden text-[#1E3A2F] rounded-xl hover:bg-[#EBF3EE]"
                                >
                                    <Menu size={20} />
                                </button>
                            </>
                        )}
                    </div>
                </div>

                {/* Mobile Menu Dropdown */}
                {mobileMenuOpen && (
                    <div className="lg:hidden bg-white border-b border-[#EBE8E0] px-4 py-4 space-y-3 animate-fadeIn">
                        <a href="#hero" onClick={() => setMobileMenuOpen(false)} className="block text-xs font-bold text-[#1E3A2F] py-1.5">Home</a>
                        <a href="#portals" onClick={() => setMobileMenuOpen(false)} className="block text-xs font-bold text-[#1E3A2F] py-1.5">Dual Portals</a>
                        <a href="#features" onClick={() => setMobileMenuOpen(false)} className="block text-xs font-bold text-[#1E3A2F] py-1.5">Features & Metrics</a>
                        <a href="#why-us" onClick={() => setMobileMenuOpen(false)} className="block text-xs font-bold text-[#1E3A2F] py-1.5">Academic Workflows</a>
                        <a href="#faqs" onClick={() => setMobileMenuOpen(false)} className="block text-xs font-bold text-[#1E3A2F] py-1.5">FAQs</a>
                        <div className="pt-2 border-t border-[#EBE8E0] flex gap-2">
                            <button
                                onClick={() => openPortal('Student')}
                                className="flex-1 py-2 rounded-xl bg-[#EBF3EE] text-[#1E3A2F] text-xs font-bold text-center border border-[#D1E7DD]"
                            >
                                🎓 Student
                            </button>
                            <button
                                onClick={() => openPortal('Supervisor')}
                                className="flex-1 py-2 rounded-xl bg-[#1E3A2F] text-white text-xs font-bold text-center"
                            >
                                👨‍🏫 Doctor
                            </button>
                        </div>
                    </div>
                )}
            </header>

            {/* HERO SECTION */}
            <section id="hero" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12 pb-14 sm:pb-20 lg:pt-16 lg:pb-24">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                    
                    {/* Left Column Text */}
                    <div className="lg:col-span-7 space-y-6 sm:space-y-8">
                        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EBF3EE] text-[#1E3A2F] text-xs font-bold border border-[#D1E7DD]">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#1E3A2F]"></span>
                            Educate. Innovate. Achieve.
                        </div>

                        <h1 className="text-3xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold text-[#1E3A2F] tracking-tight leading-[1.15] sm:leading-[1.1]">
                            Turn Your Ambition <br />
                            into <span className="font-serif-editorial italic font-normal text-[#2D5A4C]">Achievement</span>
                        </h1>

                        <p className="text-[#4A5D54] text-sm sm:text-base lg:text-lg max-w-xl leading-relaxed font-normal">
                            Empowering university students, faculty advisors, and academic departments with unified graduation project tracking, live Kanban milestones, and code reviews.
                        </p>

                        {/* Dual Secure Gateway Buttons */}
                        <div className="p-4 sm:p-5 bg-white rounded-3xl border border-[#E5ECE8] shadow-md space-y-3 max-w-lg">
                            <div className="flex items-center justify-between text-xs">
                                <span className="font-bold text-[#1E3A2F] flex items-center gap-1.5">
                                    <Lock size={13} className="text-[#3E735E]" />
                                    Secure Gateway Access:
                                </span>
                                <span className="text-[10px] text-emerald-800 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                                    🔒 JWT Encrypted
                                </span>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                                <button
                                    onClick={() => openPortal('Student')}
                                    className="flex items-center justify-center gap-2 bg-[#FAF9F5] hover:bg-[#EBF3EE] text-[#1E3A2F] border border-[#D5DDD8] text-xs font-bold py-3 px-4 rounded-2xl transition-all group"
                                >
                                    <span className="text-base">🎓</span>
                                    <span>Student Portal</span>
                                    <ArrowRight size={13} className="text-slate-400 group-hover:text-[#1E3A2F] group-hover:translate-x-0.5 transition-transform" />
                                </button>
                                <button
                                    onClick={() => openPortal('Supervisor')}
                                    className="flex items-center justify-center gap-2 bg-[#1E3A2F] hover:bg-[#142820] text-white text-xs font-bold py-3 px-4 rounded-2xl transition-all shadow-md group"
                                >
                                    <span className="text-base">👨‍🏫</span>
                                    <span>Doctor Portal</span>
                                    <ArrowRight size={13} className="text-white/70 group-hover:text-white group-hover:translate-x-0.5 transition-transform" />
                                </button>
                            </div>
                        </div>

                        {/* Social Proof Stats */}
                        <div className="pt-4 border-t border-[#E5ECE8] flex flex-wrap items-center gap-4 sm:gap-6">
                            <div>
                                <p className="text-2xl sm:text-3xl font-extrabold text-[#1E3A2F]">99%</p>
                                <p className="text-[11px] sm:text-xs font-semibold text-[#6B7F76]">Our Success Rate</p>
                            </div>
                            <div className="h-8 w-px bg-[#E5ECE8]"></div>
                            <div className="flex items-center gap-2.5 sm:gap-3">
                                <div className="flex -space-x-2 overflow-hidden">
                                    <div className="inline-block h-8 w-8 rounded-full ring-2 ring-white bg-[#1E3A2F] text-white flex items-center justify-center font-bold text-[10px]">A</div>
                                    <div className="inline-block h-8 w-8 rounded-full ring-2 ring-white bg-[#3E735E] text-white flex items-center justify-center font-bold text-[10px]">S</div>
                                    <div className="inline-block h-8 w-8 rounded-full ring-2 ring-white bg-[#D4A373] text-white flex items-center justify-center font-bold text-[10px]">D</div>
                                </div>
                                <span className="text-[11px] sm:text-xs font-bold text-[#1E3A2F] bg-[#EBF3EE] px-2.5 sm:px-3 py-1 rounded-full border border-[#D1E7DD]">
                                    30K+ Total Students
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Right Column Imagery (Clocktower & Inset) */}
                    <div className="lg:col-span-5 relative mt-4 lg:mt-0">
                        {/* Main Arched Image */}
                        <div className="relative rounded-[2rem] sm:rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-white aspect-[4/5] max-w-xs sm:max-w-md mx-auto">
                            <img
                                src="/landing/hero_campus.png"
                                alt="Historic University Campus"
                                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none"></div>
                        </div>

                        {/* Floating Inset Image - Safe Positioning */}
                        <div className="absolute -bottom-4 left-2 sm:-bottom-6 sm:-left-6 w-36 sm:w-48 rounded-2xl overflow-hidden shadow-2xl border-4 border-white bg-white">
                            <img
                                src="/landing/students_walking.png"
                                alt="Students on Campus"
                                className="w-full h-24 sm:h-32 object-cover"
                            />
                            <div className="p-2 bg-white text-center">
                                <p className="text-[10px] sm:text-[11px] font-bold text-[#1E3A2F]">Collaboration</p>
                                <p className="text-[8px] sm:text-[9px] text-[#6B7F76]">Research 2026</p>
                            </div>
                        </div>
                    </div>

                </div>
            </section>

            {/* DUAL PORTALS SECTION */}
            <section id="portals" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
                <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12 space-y-2">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EBF3EE] text-[#1E3A2F] text-xs font-bold border border-[#D1E7DD]">
                        <ShieldCheck size={14} className="text-[#1E3A2F]" />
                        Role-Based Access Control
                    </div>
                    <h2 className="text-2xl sm:text-4xl font-extrabold text-[#1E3A2F] tracking-tight">
                        Two Dedicated Ways to <span className="font-serif-editorial italic font-normal text-[#2D5A4C]">Sign In</span>
                    </h2>
                    <p className="text-xs sm:text-sm text-[#596F65]">
                        Choose your academic role to securely access your personalized dashboard with encrypted credentials.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 max-w-4xl mx-auto">
                    {/* Student Portal Card */}
                    <div className="bg-white rounded-[2rem] sm:rounded-[2.5rem] p-6 sm:p-8 border border-[#E5ECE8] shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
                        <div className="space-y-4">
                            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-[#EBF3EE] text-[#1E3A2F] flex items-center justify-center font-bold text-xl sm:text-2xl group-hover:scale-105 transition-transform">
                                🎓
                            </div>
                            <div>
                                <span className="text-[10px] font-bold uppercase tracking-wider text-[#3E735E] bg-[#EBF3EE] px-2.5 py-0.5 rounded-full">
                                    Student Gateway
                                </span>
                                <h3 className="text-xl sm:text-2xl font-extrabold text-[#1E3A2F] mt-2">Student Portal</h3>
                                <p className="text-xs text-[#596F65] leading-relaxed mt-1">
                                    Submit thesis proposals, join teams via 6-character access codes, push versioned source code deliverables, and track sprint deadlines.
                                </p>
                            </div>

                            <ul className="space-y-2 pt-2 text-xs text-[#4A5D54]">
                                <li className="flex items-center gap-2">
                                    <Check size={14} className="text-[#1E3A2F] shrink-0" /> Proposal creation & Doctor linkage
                                </li>
                                <li className="flex items-center gap-2">
                                    <Check size={14} className="text-[#1E3A2F] shrink-0" /> Interactive source code submission editor
                                </li>
                                <li className="flex items-center gap-2">
                                    <Check size={14} className="text-[#1E3A2F] shrink-0" /> Team Kanban board & real-time chat
                                </li>
                            </ul>
                        </div>

                        <div className="pt-6 mt-6 border-t border-[#F0EFEA]">
                            <button
                                onClick={() => openPortal('Student')}
                                className="w-full py-3 sm:py-3.5 px-6 rounded-full bg-[#1E3A2F] hover:bg-[#142820] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all group-hover:scale-[1.02]"
                            >
                                <span>Sign In as Student</span>
                                <ArrowRight size={14} />
                            </button>
                        </div>
                    </div>

                    {/* Doctor Portal Card */}
                    <div className="bg-white rounded-[2rem] sm:rounded-[2.5rem] p-6 sm:p-8 border-2 border-[#1E3A2F] shadow-md hover:shadow-2xl transition-all duration-300 flex flex-col justify-between group relative">
                        <div className="absolute top-6 right-6 hidden sm:block">
                            <span className="text-[10px] font-extrabold bg-[#1E3A2F] text-white px-3 py-1 rounded-full">
                                Faculty Advisor
                            </span>
                        </div>
                        <div className="space-y-4">
                            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-[#1E3A2F] text-white flex items-center justify-center font-bold text-xl sm:text-2xl group-hover:scale-105 transition-transform">
                                👨‍🏫
                            </div>
                            <div>
                                <span className="text-[10px] font-bold uppercase tracking-wider text-[#1E3A2F] bg-[#EBF3EE] px-2.5 py-0.5 rounded-full">
                                    Doctor Gateway
                                </span>
                                <h3 className="text-xl sm:text-2xl font-extrabold text-[#1E3A2F] mt-2">Doctor / Supervisor Portal</h3>
                                <p className="text-xs text-[#596F65] leading-relaxed mt-1">
                                    Review student supervision requests, approve graduation proposals, inspect versioned code syntax, and provide structured milestone evaluations.
                                </p>
                            </div>

                            <ul className="space-y-2 pt-2 text-xs text-[#4A5D54]">
                                <li className="flex items-center gap-2">
                                    <Check size={14} className="text-[#1E3A2F] shrink-0" /> 1-Click student linkage approvals
                                </li>
                                <li className="flex items-center gap-2">
                                    <Check size={14} className="text-[#1E3A2F] shrink-0" /> Syntax-highlighted code review console
                                </li>
                                <li className="flex items-center gap-2">
                                    <Check size={14} className="text-[#1E3A2F] shrink-0" /> Multi-team sprint supervision & verdicts
                                </li>
                            </ul>
                        </div>

                        <div className="pt-6 mt-6 border-t border-[#F0EFEA]">
                            <button
                                onClick={() => openPortal('Supervisor')}
                                className="w-full py-3 sm:py-3.5 px-6 rounded-full bg-[#1E3A2F] hover:bg-[#142820] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all group-hover:scale-[1.02]"
                            >
                                <span>Sign In as Doctor</span>
                                <ArrowRight size={14} />
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* DARK PINE GREEN SECTION */}
            <section id="features" className="bg-[#1E3A2F] text-white py-16 sm:py-20 lg:py-28 relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                        
                        {/* Image Left */}
                        <div className="lg:col-span-4">
                            <div className="rounded-[2rem] sm:rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-white/10 aspect-[4/5] bg-[#142820] max-w-xs sm:max-w-md mx-auto">
                                <img
                                    src="/landing/graduates_celebration.png"
                                    alt="Proud University Graduates"
                                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                                />
                            </div>
                        </div>

                        {/* Middle Text */}
                        <div className="lg:col-span-4 space-y-4 sm:space-y-6 text-center lg:text-left">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white/90 text-[11px] font-bold tracking-wider uppercase">
                                SINCE 1999
                            </div>

                            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight leading-tight">
                                The right opportunity can turn dreams into <span className="font-serif-editorial italic font-normal text-[#A3CFBB]">limitless potential.</span>
                            </h2>

                            <p className="text-white/70 text-xs sm:text-sm leading-relaxed">
                                AcademiaFlow is a community-driven platform designed to connect students with distinguished advisors, manage milestone deliverables, and orchestrate project defenses seamlessly.
                            </p>

                            {/* Dual Metrics */}
                            <div className="pt-4 sm:pt-6 border-t border-white/10 grid grid-cols-2 gap-4 sm:gap-6 text-center">
                                <div>
                                    <p className="text-3xl sm:text-4xl font-extrabold text-white">30%</p>
                                    <p className="text-[11px] sm:text-xs text-white/60 mt-1">Faster Milestone Review</p>
                                </div>
                                <div>
                                    <p className="text-3xl sm:text-4xl font-extrabold text-white">95%</p>
                                    <p className="text-[11px] sm:text-xs text-white/60 mt-1">On-Time Approvals</p>
                                </div>
                            </div>
                        </div>

                        {/* Image Right */}
                        <div className="lg:col-span-4">
                            <div className="rounded-[2rem] sm:rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-white/10 aspect-[4/5] bg-[#142820] max-w-xs sm:max-w-md mx-auto">
                                <img
                                    src="/landing/graduates_toss.png"
                                    alt="Graduates throwing caps into sky"
                                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                                />
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            {/* WHY CHOOSE US */}
            <section id="why-us" className="py-16 sm:py-20 lg:py-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16 space-y-3">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EBF3EE] text-[#1E3A2F] text-xs font-bold border border-[#D1E7DD]">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#1E3A2F]"></span>
                        Why Choose Us
                    </div>
                    <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-[#1E3A2F] tracking-tight">
                        One of the most comprehensive <br className="hidden sm:block" />
                        <span className="font-serif-editorial italic font-normal text-[#2D5A4C]">academic workflow ecosystems</span>
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
                    {/* Card 1 */}
                    <div className="bg-white rounded-[2rem] p-6 sm:p-8 border border-[#E5ECE8] shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1">
                        <div>
                            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-[#EBF3EE] text-[#1E3A2F] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <BookOpen size={26} />
                            </div>
                            <h3 className="text-lg sm:text-xl font-bold text-[#1E3A2F] mb-2 sm:mb-3">Inspiring Student Life & Projects</h3>
                            <p className="text-[#596F65] text-xs sm:text-sm leading-relaxed mb-6">
                                Students track deadlines on interactive drag-and-drop Kanban boards, receive advisor notifications, and generate team invite codes.
                            </p>
                        </div>
                        <button
                            onClick={() => openPortal('Student')}
                            className="inline-flex items-center justify-center w-full py-3 rounded-full bg-[#F4F2EC] text-[#1E3A2F] hover:bg-[#1E3A2F] hover:text-white text-xs font-bold transition-colors"
                        >
                            <span>Open Student Gateway</span>
                            <ArrowUpRight size={14} className="ml-1" />
                        </button>
                    </div>

                    {/* Card 2 */}
                    <div className="bg-white rounded-[2rem] p-6 sm:p-8 border-2 border-[#1E3A2F] shadow-md hover:shadow-2xl transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1 relative">
                        <div>
                            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-[#1E3A2F] text-white flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <Code2 size={26} />
                            </div>
                            <h3 className="text-lg sm:text-xl font-bold text-[#1E3A2F] mb-2 sm:mb-3">Code Review & Syntax Portal</h3>
                            <p className="text-[#596F65] text-xs sm:text-sm leading-relaxed mb-6">
                                Submit code deliverables with multi-language syntax highlighting, maintain full version histories, and get structured Doctor feedback.
                            </p>
                        </div>
                        <button
                            onClick={() => openPortal('Supervisor')}
                            className="inline-flex items-center justify-center w-full py-3 rounded-full bg-[#1E3A2F] text-white hover:bg-[#142820] text-xs font-bold transition-colors shadow-md"
                        >
                            <span>Open Doctor Gateway</span>
                            <ArrowUpRight size={14} className="ml-1" />
                        </button>
                    </div>

                    {/* Card 3 */}
                    <div className="bg-white rounded-[2rem] p-6 sm:p-8 border border-[#E5ECE8] shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1">
                        <div>
                            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-[#EBF3EE] text-[#1E3A2F] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <UsersRound size={26} />
                            </div>
                            <h3 className="text-lg sm:text-xl font-bold text-[#1E3A2F] mb-2 sm:mb-3">Faculty Advisory Coordination</h3>
                            <p className="text-[#596F65] text-xs sm:text-sm leading-relaxed mb-6">
                                Supervisors effortlessly approve student linking requests, supervise multiple graduation groups, and assign milestone verdicts.
                            </p>
                        </div>
                        <button
                            onClick={() => openPortal('Supervisor')}
                            className="inline-flex items-center justify-center w-full py-3 rounded-full bg-[#F4F2EC] text-[#1E3A2F] hover:bg-[#1E3A2F] hover:text-white text-xs font-bold transition-colors"
                        >
                            <span>Supervision Access</span>
                            <ArrowUpRight size={14} className="ml-1" />
                        </button>
                    </div>
                </div>
            </section>

            {/* FREQUENTLY ASKED QUESTIONS */}
            <section id="faqs" className="py-16 sm:py-20 lg:py-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                    
                    {/* Left Gothic Arch Image */}
                    <div className="lg:col-span-5">
                        <div className="rounded-[2rem] sm:rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-white aspect-[4/5] bg-[#EBF3EE] max-w-xs sm:max-w-md mx-auto">
                            <img
                                src="/landing/campus_arch.png"
                                alt="Historic University Campus Archway"
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </div>

                    {/* Right FAQ Accordion */}
                    <div className="lg:col-span-7 space-y-5 sm:space-y-6">
                        <div className="space-y-2">
                            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EBF3EE] text-[#1E3A2F] text-xs font-bold border border-[#D1E7DD]">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#1E3A2F]"></span>
                                FAQ
                            </div>
                            <h2 className="text-2xl sm:text-4xl font-extrabold text-[#1E3A2F] tracking-tight">
                                Frequently Asked <span className="font-serif-editorial italic font-normal text-[#2D5A4C]">Questions</span>
                            </h2>
                        </div>

                        <div className="space-y-3 pt-2">
                            {faqs.map((faq, index) => {
                                const isOpen = openFaq === index;
                                return (
                                    <div
                                        key={index}
                                        className="bg-white border border-[#E5ECE8] rounded-2xl overflow-hidden transition-all shadow-sm"
                                    >
                                        <button
                                            onClick={() => setOpenFaq(isOpen ? -1 : index)}
                                            className="w-full px-5 sm:px-6 py-4 text-left flex items-center justify-between gap-3 font-bold text-xs sm:text-sm text-[#1E3A2F] hover:text-[#142820]"
                                        >
                                            <span className="leading-snug">{faq.q}</span>
                                            <ChevronDown
                                                size={16}
                                                className={`text-[#6B7F76] transition-transform duration-200 shrink-0 ${isOpen ? 'rotate-180 text-[#1E3A2F]' : ''}`}
                                            />
                                        </button>
                                        {isOpen && (
                                            <div className="px-5 sm:px-6 pb-4 text-xs text-[#596F65] leading-relaxed border-t border-[#F0EFEA] pt-3 break-words">
                                                {faq.a}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                </div>
            </section>

            {/* SECURE ROLE LOGIN MODAL */}
            {isLoginModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#142820]/75 backdrop-blur-md overflow-y-auto">
                    <div className="bg-white border border-[#E5ECE8] rounded-[2rem] sm:rounded-[2.5rem] w-full max-w-md p-5 sm:p-8 shadow-2xl space-y-5 animate-fadeIn relative my-auto">
                        {/* Close button */}
                        <button
                            onClick={() => setIsLoginModalOpen(false)}
                            className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-[#1E3A2F] hover:bg-[#F4F2EC] transition-colors"
                        >
                            <X size={18} />
                        </button>

                        <div>
                            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EBF3EE] text-[#1E3A2F] text-[10px] font-bold border border-[#D1E7DD] mb-2">
                                <Shield size={12} /> Secure Authentication
                            </div>
                            <h3 className="text-xl sm:text-2xl font-extrabold text-[#1E3A2F]">
                                {modalRole === 'Student' ? '🎓 Student Portal' : modalRole === 'Supervisor' ? '👨‍🏫 Doctor Portal' : '👑 Admin Portal'}
                            </h3>
                            <p className="text-xs text-[#596F65] mt-0.5">
                                Encrypted JWT session with role-based redirection.
                            </p>
                        </div>

                        {/* Role Tabs */}
                        <div className="grid grid-cols-3 gap-1 bg-[#FAF9F5] p-1 rounded-2xl border border-[#E5ECE8]">
                            <button
                                type="button"
                                onClick={() => openPortal('Student')}
                                className={`py-2 rounded-xl text-[11px] sm:text-xs font-bold transition-all ${
                                    modalRole === 'Student'
                                        ? 'bg-[#1E3A2F] text-white shadow-sm'
                                        : 'text-[#596F65] hover:text-[#1E3A2F]'
                                }`}
                            >
                                🎓 Student
                            </button>
                            <button
                                type="button"
                                onClick={() => openPortal('Supervisor')}
                                className={`py-2 rounded-xl text-[11px] sm:text-xs font-bold transition-all ${
                                    modalRole === 'Supervisor'
                                        ? 'bg-[#1E3A2F] text-white shadow-sm'
                                        : 'text-[#596F65] hover:text-[#1E3A2F]'
                                }`}
                            >
                                👨‍🏫 Doctor
                            </button>
                            <button
                                type="button"
                                onClick={() => openPortal('Admin')}
                                className={`py-2 rounded-xl text-[11px] sm:text-xs font-bold transition-all ${
                                    modalRole === 'Admin'
                                        ? 'bg-[#1E3A2F] text-white shadow-sm'
                                        : 'text-[#596F65] hover:text-[#1E3A2F]'
                                }`}
                            >
                                👑 Admin
                            </button>
                        </div>

                        {/* Pre-fill Info */}
                        <div className="p-2.5 sm:p-3 bg-[#FAF9F5] rounded-xl border border-[#E5ECE8] text-[10px] sm:text-[11px] text-[#4A5D54] flex items-center justify-between truncate">
                            <span className="shrink-0">Demo:</span>
                            <strong className="text-[#1E3A2F] font-mono truncate ml-2">{email}</strong>
                        </div>

                        {error && (
                            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleModalLogin} className="space-y-3.5">
                            <div>
                                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#1E3A2F] mb-1">Email Address</label>
                                <div className="relative">
                                    <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                                    <input
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full pl-9 pr-3.5 py-2.5 bg-[#FAF9F5] border border-[#D5DDD8] rounded-xl text-xs text-[#1A2421] focus:outline-none focus:border-[#1E3A2F]"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#1E3A2F] mb-1">Password</label>
                                <div className="relative">
                                    <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                                    <input
                                        type="password"
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full pl-9 pr-3.5 py-2.5 bg-[#FAF9F5] border border-[#D5DDD8] rounded-xl text-xs text-[#1A2421] focus:outline-none focus:border-[#1E3A2F]"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full py-3 bg-[#1E3A2F] hover:bg-[#142820] text-white text-xs font-bold rounded-full shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                            >
                                {isLoading ? 'Authenticating...' : (
                                    <>
                                        <span>Sign In to {modalRole} Portal</span>
                                        <ArrowRight size={14} />
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* FOOTER */}
            <footer className="bg-[#162E24] text-white/80 pt-12 sm:pt-16 pb-8 sm:pb-12 border-t border-white/10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 sm:space-y-12">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 sm:gap-8">
                        
                        {/* Brand Column */}
                        <div className="sm:col-span-2 space-y-3">
                            <div className="flex items-center gap-2.5">
                                <div className="w-9 h-9 bg-white text-[#1E3A2F] rounded-xl flex items-center justify-center font-bold shrink-0">
                                    <GraduationCap size={20} />
                                </div>
                                <span className="font-extrabold text-lg sm:text-xl tracking-tight text-white">
                                    Academia<span className="font-serif-editorial italic text-[#A3CFBB]">Flow</span>
                                </span>
                            </div>
                            <p className="text-xs text-white/60 max-w-sm leading-relaxed">
                                The comprehensive academic workflow management platform for universities, supporting students, faculty supervisors, and department administrators.
                            </p>
                        </div>

                        {/* Menu Links */}
                        <div>
                            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3">Platform</h4>
                            <ul className="space-y-1.5 text-xs text-white/70">
                                <li><a href="#hero" className="hover:text-white transition-colors">Home</a></li>
                                <li><a href="#portals" className="hover:text-white transition-colors">Dual Portals</a></li>
                                <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                                <li><a href="#why-us" className="hover:text-white transition-colors">Workflows</a></li>
                            </ul>
                        </div>

                        {/* Portals */}
                        <div>
                            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3">Portals</h4>
                            <ul className="space-y-1.5 text-xs text-white/70">
                                <li><button onClick={() => openPortal('Student')} className="hover:text-white transition-colors text-left">🎓 Student Portal</button></li>
                                <li><button onClick={() => openPortal('Supervisor')} className="hover:text-white transition-colors text-left">👨‍🏫 Doctor Portal</button></li>
                                <li><button onClick={() => openPortal('Admin')} className="hover:text-white transition-colors text-left">👑 Admin Overview</button></li>
                            </ul>
                        </div>

                        {/* Newsletter */}
                        <div>
                            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3">Newsletter</h4>
                            <form onSubmit={(e) => { e.preventDefault(); alert('Subscribed to academic updates!'); }} className="space-y-2">
                                <input
                                    type="email"
                                    required
                                    placeholder="Enter email"
                                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-xl text-xs text-white placeholder-white/40 focus:outline-none focus:border-white"
                                />
                                <button
                                    type="submit"
                                    className="w-full py-2 bg-white text-[#162E24] hover:bg-[#FAF9F5] text-xs font-bold rounded-xl transition-colors"
                                >
                                    Subscribe
                                </button>
                            </form>
                        </div>

                    </div>

                    <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-[11px] text-white/50 gap-3 text-center sm:text-left">
                        <p>&copy; 2026 AcademiaFlow. All rights reserved.</p>
                        <div className="flex flex-wrap justify-center gap-4">
                            <a href="#hero" className="hover:text-white transition-colors">Privacy</a>
                            <a href="#hero" className="hover:text-white transition-colors">Terms</a>
                            <a href="#hero" className="hover:text-white transition-colors">Guidelines</a>
                        </div>
                    </div>
                </div>
            </footer>

        </div>
    );
};

export default LandingPage;
