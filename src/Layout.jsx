import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import './App.css'; // Import CSS

const Layout = () => {
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

    return (
        <div style={{ display: 'flex', minHeight: '100vh' }}>
            <Sidebar onCollapseChange={setIsSidebarCollapsed} />
            <main style={{ 
                marginLeft: isSidebarCollapsed ? '60px' : '280px', 
                padding: '24px', 
                flexGrow: 1,
                transition: 'margin-left 0.3s ease',
                minHeight: '100vh',
                backgroundColor: '#f7f8fc'
            }}>
                <div className="portal-shell">
                    <Outlet /> {/* This is where nested routes will render */}
                </div>
            </main>
        </div>
    );
};

export default Layout;