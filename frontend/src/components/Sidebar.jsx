import React from 'react';
import { useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import { Home, FileText, X, UserCircle } from 'lucide-react';

const Sidebar = ({ isOpen, onClose }) => {
    const { user } = useSelector((state) => state.auth);
    const location = useLocation();

    if (!user) return null;

    const navItems = {
        Admin: [
            { name: 'Dashboard', path: '/dashboard', icon: Home }
        ],
        Supervisor: [
            { name: 'My Dashboard', path: '/dashboard', icon: Home }
        ],
        Student: [
            { name: 'My Dashboard', path: '/dashboard', icon: Home },
            { name: 'Submit Proposal', path: '/dashboard/submit', icon: FileText }
        ]
    };

    const currentNav = navItems[user.role] || [];

    const avatarSrc = user.avatar ? `http://localhost:5001${user.avatar}` : null;

    return (
        <>
            {/* Mobile Backdrop */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-slate-900/50 z-40 md:hidden"
                    onClick={onClose}
                />
            )}

            {/* Sidebar Element */}
            <div className={`
                fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out
                ${isOpen ? 'translate-x-0' : '-translate-x-full'}
                md:relative md:translate-x-0 md:min-h-[calc(100vh-4rem)]
            `}>
                <div className="flex justify-between items-center p-4 md:hidden border-b border-gray-100">
                    <span className="font-bold text-slate-800 text-lg">Menu</span>
                    <button onClick={onClose} className="p-1 rounded-md text-slate-400 hover:bg-slate-100">
                        <X size={20} />
                    </button>
                </div>

                {/* User Profile Mini Card */}
                <Link to="/profile" onClick={() => window.innerWidth < 768 && onClose()} className="block p-4 border-b border-gray-100 hover:bg-slate-50 transition-colors group">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-[#00244D]/10 text-[#00244D] flex items-center justify-center overflow-hidden">
                            {avatarSrc ? (
                                <img src={avatarSrc} alt="Avatar" className="w-full h-full object-cover" />
                            ) : (
                                <span className="text-sm font-bold">{user.name?.charAt(0)?.toUpperCase()}</span>
                            )}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-slate-800 truncate">{user.name}</p>
                            <p className="text-xs text-slate-400 truncate">{user.email}</p>
                        </div>
                    </div>
                </Link>

                <nav className="p-4 space-y-2">
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
                                className={`flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-colors ${isExact
                                    ? 'bg-[#00244D]/10 text-[#00244D] border-l-3 border-[#E81700]'
                                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                    }`}
                            >
                                <item.icon className={`w-5 h-5 mr-3 ${isExact ? 'text-[#00244D]' : 'text-gray-400'}`} />
                                {item.name}
                            </Link>
                        )
                    })}

                    {/* Profile Link */}
                    <Link
                        to="/profile"
                        onClick={() => window.innerWidth < 768 && onClose()}
                        className={`flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-colors ${location.pathname === '/profile'
                            ? 'bg-[#00244D]/10 text-[#00244D] border-l-3 border-[#E81700]'
                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                            }`}
                    >
                        <UserCircle className={`w-5 h-5 mr-3 ${location.pathname === '/profile' ? 'text-[#00244D]' : 'text-gray-400'}`} />
                        Profile Settings
                    </Link>
                </nav>
            </div>
        </>
    );
};

export default Sidebar;
