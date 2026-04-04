import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
    const location = useLocation();

    const navItems = [
        { path: '/student/exam-schedules', label: 'Exam Schedules (Student)', role: 'student' },
        { path: '/student/attendance-results', label: 'Attendance Results (Student)', role: 'student' },
        { path: '/student/face-registration', label: 'Face Registration (Student)', role: 'student' },
        { path: '/lecturer/exam-schedules', label: 'Exam Schedules (Lecturer)', role: 'lecturer' },
        { path: '/lecturer/today-exams', label: 'Today Exams (Lecturer)', role: 'lecturer' },
        { path: '/lecturer/current-exam', label: 'Current Exam (Lecturer)', role: 'lecturer' },
        { path: '/profile', label: 'Profile', role: 'all' },
        { path: '/logout', label: 'Logout', role: 'all' },
    ];

    // Placeholder: In a real application, you would get the user's role from context/state
    const currentUserRole = 'student'; // Change to 'lecturer' to see lecturer links

    const filteredNavItems = navItems.filter(item =>
        item.role === 'all' || item.role === currentUserRole
    );

    return (
        <div style={{
            width: '250px',
            height: '100vh',
            backgroundColor: '#2c3e50',
            color: 'white',
            padding: '20px',
            boxShadow: '2px 0 5px rgba(0,0,0,0.1)',
            position: 'fixed',
            top: 0,
            left: 0,
            overflowY: 'auto'
        }}>
            <div style={{ marginBottom: '30px', textAlign: 'center' }}>
                <img src="/logo/STU_logo.webp" alt="STU Logo" style={{ maxWidth: '100px', height: 'auto' }} />
                <h2 style={{ marginTop: '10px', fontSize: '1.2em' }}>Attendance System</h2>
            </div>
            <nav>
                <ul style={{ listStyle: 'none', padding: 0 }}>
                    {filteredNavItems.map((item) => (
                        <li key={item.path} style={{ marginBottom: '10px' }}>
                            <Link
                                to={item.path}
                                style={{
                                    textDecoration: 'none',
                                    color: 'white',
                                    display: 'block',
                                    padding: '10px 15px',
                                    borderRadius: '5px',
                                    backgroundColor: location.pathname === item.path ? '#34495e' : 'transparent',
                                    transition: 'background-color 0.3s ease'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#34495e'}
                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = location.pathname === item.path ? '#34495e' : 'transparent'}
                            >
                                {item.label}
                            </Link>
                        </li>
                    ))}
                </ul>
            </nav>
        </div>
    );
};

export default Sidebar;