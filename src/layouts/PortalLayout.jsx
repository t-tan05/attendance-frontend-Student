import { Outlet } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import Sidebar from '../components/Sidebar'; // Import the Sidebar component
import React, { useState } from 'react'; // Need useState for isSidebarCollapsed state

export default function PortalLayout() {
    const { user, logout } = useAuth()
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false); // State to manage sidebar collapse

    // Define sidebar width constants (these should match the widths defined in Sidebar.jsx)
    const sidebarWidth = '280px';
    const collapsedSidebarWidth = '60px';

    return (
        <div className="portal-shell" style={{ display: 'flex' }}>
            {/* Render the Sidebar component and pass the collapse change handler */}
            <Sidebar onCollapseChange={setIsSidebarCollapsed} />

            {/* Main content area, adjust margin based on sidebar's collapsed state */}
            <div style={{
                marginLeft: isSidebarCollapsed ? collapsedSidebarWidth : sidebarWidth,
                flexGrow: 1,
                transition: 'margin-left 0.3s ease',
            }}>
                <header className="portal-header" style={{ backgroundColor: '#ecf0f1', padding: '15px 20px', borderBottom: '1px solid #bdc3c7', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <p className="portal-kicker">Attendance Portal</p>
                        <h1>
                            {user?.role === 'lecturer' ? 'Không gian giảng viên' : 'Không gian sinh viên'}
                        </h1>
                    </div>
                    <div className="profile-box">
                        <p>{user?.name || user?.full_name || user?.email || 'Unknown user'}</p>
                        <button type="button" onClick={logout}>Đăng xuất</button>
                    </div>
                </header>

                <main className="portal-main" style={{ padding: '20px' }}>
                    <Outlet />
                </main>
            </div>
        </div>
    )
}
