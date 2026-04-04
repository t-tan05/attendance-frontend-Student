import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './components/Sidebar';

const Layout = () => {
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

    return (
        <div style={{ display: 'flex' }}>
            <Sidebar onCollapseChange={setIsSidebarCollapsed} />
            <main style={{ 
                marginLeft: isSidebarCollapsed ? '0px' : '280px', 
                padding: '20px', 
                flexGrow: 1,
                transition: 'margin-left 0.3s ease',
                minHeight: '100vh',
                backgroundColor: '#f9fafb'
            }}>
                <Outlet /> {/* This is where nested routes will render */}
            </main>
        </div>
    );
};

export default Layout;