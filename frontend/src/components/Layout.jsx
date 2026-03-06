import React, { useState } from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { Outlet } from 'react-router-dom';

const Layout = () => {
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    return (
        <div className="min-h-screen bg-gray-50 font-sans flex flex-col">
            <Navbar onMenuClick={() => setIsMobileOpen(true)} />
            <div className="flex flex-1 relative">
                <Sidebar isOpen={isMobileOpen} onClose={() => setIsMobileOpen(false)} />
                <main className="flex-1 p-4 md:p-8 overflow-x-hidden">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default Layout;
