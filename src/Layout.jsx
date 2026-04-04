import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';

const Layout = () => {
    const navigate = useNavigate();

    // Placeholder for logout functionality
    const handleLogout = () => {
        localStorage.removeItem('access_token');
        navigate('/login');
    };

    return (
        <div style={{ display: 'flex' }}>
            <Sidebar />
            <main style={{ marginLeft: '250px', padding: '20px', flexGrow: 1 }}>
                <Outlet /> {/* This is where nested routes will render */}
            </main>
        </div>
    );
};

export default Layout;