import React from 'react';
import { useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, FilePlus2, X, UserCircle, Layers, Users, Sparkles, Compass } from 'lucide-react';

const Sidebar = ({ isOpen, onClose }) => {
    const { user } = useSelector((state) => state.auth);
    const location = useLocation();

    if (!user) return null;

    const navItems = {
        Admin: [
            { name: 'System Overview', path: '/dashboard', icon: LayoutDashboard },
        ],
        Supervisor: [
            { name: 'Workspace & Groups', path: '/dashboard', icon: LayoutDashboard },
        ],
        Student: [
            { name: 'Project Dashboard', path: '/dashboard', icon: LayoutDashboard },
            { name: 'Submit Proposal', path: '/dashboard/submit', icon: FilePlus2 }
        ]
    };

    const currentNav = navItems[user.role] || [];
    const avatarSrc = user.avatar ? `http://localhost:5001${user.avatar}` : null;

    return (
        <>
            {/* Mobile Backdrop */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-[#142820]/60 backdrop-blur-sm z-40 md:hidden"
                    onClick={onClose}
                />
            )}

            {/* Sidebar Element */}
            <aside className={`
                fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-[#E5ECE8] transform transition-transform duration-300 ease-in-out
                ${isOpen ? 'translate-x-0' : '-translate-x-full'}
                md:relative md:translate-x-0 md:min-h-[calc(100vh-4rem)] flex flex-col justify-between
            `}>
                <div>
                    {/* Mobile Header */}
                    <div className="flex justify-between items-center p-4 md:hidden border-b border-[#E5ECE8]">
                        <span className="font-bold text-[#1E3A2F] text-base">Navigation</span>
                        <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-[#F4F2EC]">
                            <X size={18} />
                        </button>
                    </div>

                    {/* User Profile Mini Card */}
                    <Link
                        to="/profile"
                        onClick={() => window.innerWidth < 768 && onClose()}
                        className="block p-4 mx-3 my-3 rounded-2xl bg-[#FAF9F5] hover:bg-[#F4F2EC] border border-[#E5ECE8] transition-all group"
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-[#1E3A2F] text-white flex items-center justify-center font-bold text-sm shadow-md overflow-hidden shrink-0">
                                {avatarSrc ? (
                                    <img src={avatarSrc} alt="Avatar" className="w-full h-full object-cover" />
                                ) : (
                                    <span>{user.name?.charAt(0)?.toUpperCase()}</span>
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-bold text-[#1E3A2F] truncate group-hover:text-[#3E735E] transition-colors">{user.name}</p>
                                <p className="text-xs text-[#6B7F76] truncate">{user.email}</p>
                            </div>
                        </div>
                    </Link>

                    {/* Nav Links */}
                    <nav className="p-3 space-y-1.5">
                        <div className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-[#6B7F76]">
                            Portal Menu
                        </div>
                        {currentNav.map((item) => {
                            const isExact = location.pathname === item.path;

                            return (
                                <Link
                                    key={item.name}
                                    to={item.path}
                                    onClick={() => {
                                        if (window.innerWidth < 768) {
                                            onClose();
                                        }
                                    }}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition-all ${
                                        isExact
                                            ? 'bg-[#1E3A2F] text-white shadow-md shadow-[#1E3A2F]/15'
                                            : 'text-[#4A5D54] hover:bg-[#FAF9F5] hover:text-[#1E3A2F]'
                                    }`}
                                >
                                    <item.icon className={`w-4 h-4 ${isExact ? 'text-white' : 'text-[#3E735E]'}`} />
                                    <span>{item.name}</span>
                                </Link>
                            );
                        })}

                        <div className="px-3 pt-4 pb-1.5 text-[11px] font-bold uppercase tracking-wider text-[#6B7F76]">
                            Account
                        </div>
                        <Link
                            to="/profile"
                            onClick={() => window.innerWidth < 768 && onClose()}
                            className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition-all ${
                                location.pathname === '/profile'
                                    ? 'bg-[#1E3A2F] text-white shadow-md shadow-[#1E3A2F]/15'
                                    : 'text-[#4A5D54] hover:bg-[#FAF9F5] hover:text-[#1E3A2F]'
                            }`}
                        >
                            <UserCircle className={`w-4 h-4 ${location.pathname === '/profile' ? 'text-white' : 'text-[#3E735E]'}`} />
                            <span>Profile & Security</span>
                        </Link>

                        <Link
                            to="/"
                            onClick={() => window.innerWidth < 768 && onClose()}
                            className="flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold text-[#4A5D54] hover:bg-[#FAF9F5] hover:text-[#1E3A2F] transition-all"
                        >
                            <Compass className="w-4 h-4 text-[#3E735E]" />
                            <span>Public Landing Page</span>
                        </Link>
                    </nav>
                </div>

                {/* Footer Pro Badge */}
                <div className="p-4 m-3 rounded-2xl bg-[#EBF3EE] border border-[#D1E7DD]">
                    <div className="flex items-center gap-2 mb-1">
                        <Sparkles size={14} className="text-[#1E3A2F]" />
                        <span className="text-xs font-bold text-[#1E3A2F]">Real-time Sync Active</span>
                    </div>
                    <p className="text-[11px] text-[#4A5D54] leading-relaxed">
                        Socket.io live connection for tasks, chat, and supervisor reviews.
                    </p>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;
