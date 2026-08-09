import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../redux/authSlice';
import { useNavigate, Link } from 'react-router-dom';
import { LogOut, User as UserIcon, Menu, GraduationCap, ArrowUpRight, Compass } from 'lucide-react';
import socket from '../socket';
import axios from 'axios';

const Navbar = ({ onMenuClick }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.auth);

    React.useEffect(() => {
        if (user && user._id) {
            if (!socket.connected) {
                socket.connect();
            }
            if (socket.connected) {
                socket.emit('joinUserRoom', user._id);
            } else {
                socket.once('connect', () => {
                    socket.emit('joinUserRoom', user._id);
                });
            }
        }
    }, [user]);

    const handleLogout = async () => {
        if (socket.connected) {
            socket.disconnect();
        }
        try {
            await axios.post(import.meta.env.MODE === 'production' ? '/api/auth/logout' : 'http://localhost:5001/api/auth/logout');
        } catch (error) {
            console.error('Logout failed on backend:', error);
        }
        dispatch(logout());
        navigate('/login');
    };

    if (!user) return null;

    const roleBadgeStyles = {
        Admin: 'bg-[#F4F2EC] text-[#1E3A2F] border-[#D5DDD8]',
        Supervisor: 'bg-[#EBF3EE] text-[#1E3A2F] border-[#D1E7DD]',
        Student: 'bg-[#EBF3EE] text-[#1E3A2F] border-[#D1E7DD]',
    };

    return (
        <nav className="sticky top-0 z-40 bg-[#1E3A2F] text-white shadow-lg shadow-[#1E3A2F]/10 border-b border-[#142820]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Brand */}
                    <div className="flex items-center gap-3">
                        <button
                            onClick={onMenuClick}
                            className="mr-1 md:hidden p-2 rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-colors"
                        >
                            <Menu size={22} />
                        </button>
                        <Link to="/" className="flex items-center gap-2.5 group">
                            <div className="w-9 h-9 bg-white text-[#1E3A2F] rounded-xl flex items-center justify-center font-bold shadow-md group-hover:scale-105 transition-transform">
                                <GraduationCap size={20} />
                            </div>
                            <div>
                                <span className="text-white font-extrabold text-base tracking-tight">
                                    Academia<span className="font-serif-editorial italic font-normal text-[#A3CFBB]">Flow</span>
                                </span>
                                <span className="hidden sm:block text-[9px] uppercase font-bold tracking-widest text-white/60 -mt-1">
                                    Workspace
                                </span>
                            </div>
                        </Link>
                    </div>

                    {/* Right User & Actions */}
                    <div className="flex items-center gap-3 sm:gap-4">
                        <Link
                            to="/"
                            className="hidden lg:flex items-center gap-1 text-xs font-bold text-white/80 hover:text-white bg-white/10 hover:bg-white/20 px-3.5 py-1.5 rounded-full transition-all"
                        >
                            <Compass size={13} />
                            <span>Landing Page</span>
                        </Link>

                        <Link
                            to="/profile"
                            className="flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 transition-all text-white"
                        >
                            <div className="w-6 h-6 rounded-full bg-white text-[#1E3A2F] flex items-center justify-center font-bold text-xs">
                                {user.name ? user.name.charAt(0).toUpperCase() : <UserIcon size={12} />}
                            </div>
                            <div className="hidden sm:block text-left">
                                <p className="text-xs font-bold text-white leading-tight truncate max-w-[120px]">{user.name}</p>
                            </div>
                            <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-white text-[#1E3A2F]">
                                {user.role}
                            </span>
                        </Link>

                        <button
                            onClick={handleLogout}
                            title="Sign out"
                            className="flex items-center gap-1.5 text-white/80 hover:text-white bg-white/10 hover:bg-rose-600/80 border border-white/15 px-3 py-1.5 rounded-full text-xs font-bold transition-all shadow-sm"
                        >
                            <LogOut className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">Logout</span>
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
