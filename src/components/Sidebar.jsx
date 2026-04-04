import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = ({ onCollapseChange }) => {
    const location = useLocation();
    const [isCollapsed, setIsCollapsed] = useState(false);

    // Notify parent when collapse state changes
    React.useEffect(() => {
        if (onCollapseChange) {
            onCollapseChange(isCollapsed);
        }
    }, [isCollapsed, onCollapseChange]);

    const navItems = [
        { path: '/student/exam-schedules', label: 'Lịch thi', icon: '📅', role: 'student' },
        { path: '/student/attendance-results', label: 'Kết quả điểm danh', icon: '✅', role: 'student' },
        { path: '/student/face-registration', label: 'Đăng ký khuôn mặt', icon: '📷', role: 'student' },
        { path: '/lecturer/exam-schedules', label: 'Lịch coi thi', icon: '📋', role: 'lecturer' },
        { path: '/lecturer/today-exams', label: 'Ca thi hôm nay', icon: '📆', role: 'lecturer' },
        { path: '/lecturer/current-exam', label: 'Ca thi hiện tại', icon: '⏰', role: 'lecturer' },
        { path: '/profile', label: 'Hồ sơ', icon: '👤', role: 'all' },
        { path: '/logout', label: 'Đăng xuất', icon: '🚪', role: 'all' },
    ];

    // Placeholder: In a real application, you would get the user's role from context/state
    const currentUserRole = 'student'; // Change to 'lecturer' to see lecturer links

    const filteredNavItems = navItems.filter(item =>
        item.role === 'all' || item.role === currentUserRole
    );

    return (
        <>
            {/* Toggle Button */}
            <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                title={isCollapsed ? 'Mở sidebar' : 'Đóng sidebar'}
                style={{
                    position: 'fixed',
                    left: isCollapsed ? '10px' : '290px',
                    top: '20px',
                    zIndex: 10000,
                    backgroundColor: '#3b82f6',
                    color: 'white',
                    border: 'none',
                    borderRadius: '50%',
                    width: '45px',
                    height: '45px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    boxShadow: '0 4px 12px rgba(59, 130, 246, 0.4)',
                    transition: 'all 0.3s ease',
                    fontSize: '1.5rem',
                    fontWeight: 'bold',
                    outline: 'none'
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#2563eb';
                    e.currentTarget.style.transform = 'scale(1.1)';
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#3b82f6';
                    e.currentTarget.style.transform = 'scale(1)';
                }}
            >
                {isCollapsed ? '☰' : '✕'}
            </button>

            {/* Sidebar */}
            <div style={{
                width: isCollapsed ? '0px' : '280px',
                height: '100vh',
                backgroundColor: 'white',
                color: '#1f2937',
                padding: isCollapsed ? '0' : '20px',
                boxShadow: '2px 0 8px rgba(0,0,0,0.08)',
                position: 'fixed',
                top: 0,
                left: 0,
                overflowY: 'auto',
                overflowX: 'hidden',
                transition: 'width 0.3s ease, padding 0.3s ease',
                zIndex: 1000,
                borderRight: '1px solid #e5e7eb'
            }}>
                {!isCollapsed && (
                    <>
                        <div style={{ marginBottom: '30px', textAlign: 'center', paddingTop: '40px' }}>
                            <img src="/logo/STU_logo.webp" alt="STU Logo" style={{ maxWidth: '100px', height: 'auto' }} />
                            <h2 style={{ marginTop: '15px', fontSize: '1.3em', color: '#1f2937', fontWeight: '600' }}>Hệ thống điểm danh</h2>
                        </div>
                        <nav>
                            <ul style={{ listStyle: 'none', padding: 0 }}>
                                {filteredNavItems.map((item) => (
                                    <li key={item.path} style={{ marginBottom: '8px' }}>
                                        <Link
                                            to={item.path}
                                            style={{
                                                textDecoration: 'none',
                                                color: location.pathname === item.path ? '#3b82f6' : '#4b5563',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '12px',
                                                padding: '12px 16px',
                                                borderRadius: '8px',
                                                backgroundColor: location.pathname === item.path ? '#eff6ff' : 'transparent',
                                                transition: 'all 0.2s ease',
                                                fontWeight: location.pathname === item.path ? '600' : '400',
                                                border: location.pathname === item.path ? '1px solid #dbeafe' : '1px solid transparent'
                                            }}
                                            onMouseEnter={(e) => {
                                                if (location.pathname !== item.path) {
                                                    e.currentTarget.style.backgroundColor = '#f9fafb';
                                                    e.currentTarget.style.borderColor = '#e5e7eb';
                                                }
                                            }}
                                            onMouseLeave={(e) => {
                                                if (location.pathname !== item.path) {
                                                    e.currentTarget.style.backgroundColor = 'transparent';
                                                    e.currentTarget.style.borderColor = 'transparent';
                                                }
                                            }}
                                        >
                                            <span style={{ fontSize: '1.3rem' }}>{item.icon}</span>
                                            <span>{item.label}</span>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </nav>
                    </>
                )}
            </div>
        </>
    );
};

export default Sidebar;