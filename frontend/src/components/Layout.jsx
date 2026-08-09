import React, { useState } from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { Outlet } from 'react-router-dom';

const Layout = () => {
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    return (
        <div className="min-h-screen bg-[#FAF9F5] text-[#1A2421] flex flex-col font-sans relative overflow-x-hidden selection:bg-[#1E3A2F] selection:text-white">
            <Navbar onMenuClick={() => setIsMobileOpen(true)} />
            <div className="flex flex-1 relative z-10">
                <Sidebar isOpen={isMobileOpen} onClose={() => setIsMobileOpen(false)} />
                <main className="flex-1 p-4 md:p-8 overflow-x-hidden">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default Layout;
