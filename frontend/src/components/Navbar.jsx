import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../redux/authSlice';
import { useNavigate, Link } from 'react-router-dom';
import { LogOut, User as UserIcon, Menu } from 'lucide-react';

const Navbar = ({ onMenuClick }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.auth);

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
    };

    if (!user) return null;

    return (
        <nav className="bg-indigo-600 shadow-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <button
                            onClick={onMenuClick}
                            className="mr-2 md:hidden p-2 rounded-md text-indigo-100 hover:text-white hover:bg-indigo-500 transition-colors"
                        >
                            <Menu size={24} />
                        </button>
                        <div className="flex-shrink-0 flex items-center">
                            <Link to="/" className="text-white font-bold text-xl tracking-tight">
                                Academic Workflow
                            </Link>
                        </div>
                    </div>
                    <div className="flex items-center space-x-4">
                        <div className="flex items-center text-indigo-100">
                            <UserIcon className="w-5 h-5 mr-1" />
                            <span className="font-medium">{user.name}</span>
                            <span className="ml-2 text-xs bg-indigo-700 px-2 py-0.5 rounded-full">
                                {user.role}
                            </span>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="flex items-center text-white bg-indigo-500 hover:bg-indigo-700 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                        >
                            <LogOut className="w-4 h-4 mr-1" />
                            Logout
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
