import { NavLink, Outlet } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'

const navMap = {
    student: [
        { to: '/student/exam-schedules', label: 'Lịch thi' },
        { to: '/student/attendance-results', label: 'Kết quả điểm danh' },
        { to: '/student/face-registration', label: ' Đăng ký khuôn mặt' },
    ],
    lecturer: [
        { to: '/lecturer/exam-schedules', label: 'Lịch thi phụ trách' },
        { to: '/lecturer/today-exams', label: 'Lịch thi hôm nay' },
        { to: '/lecturer/current-exam', label: 'Ca thi hiện tai' },
    ],
}

export default function PortalLayout() {
    const { user, logout } = useAuth()
    const items = navMap[user?.role] || []

    return (
        <div className="portal-shell" style={{ display: 'flex' }}>
            <nav className="portal-nav" style={{
                width: '250px',
                height: '100vh',
                backgroundColor: '#2c3e50',
                color: 'white',
                padding: '20px',
                boxShadow: '2px 0 5px rgba(0,0,0,0.1)',
                position: 'fixed',
                top: 0,
                left: 0,
                overflowY: 'auto',
                display: 'flex',
                flexDirection: 'column',
            }}>
                <div style={{ marginBottom: '30px', textAlign: 'center' }}>
                    <img src="/logo/STU_logo.webp" alt="STU Logo" style={{ maxWidth: '100px', height: 'auto' }} />
                    <h2 style={{ marginTop: '10px', fontSize: '1.2em' }}>Attendance System</h2>
                </div>
                <ul style={{ listStyle: 'none', padding: 0 }}>
                    {items.map((item) => (
                        <li key={item.to} style={{ marginBottom: '10px' }}>
                            <NavLink
                                to={item.to}
                                className={({ isActive }) => (isActive ? 'active-nav' : '')}
                                style={({ isActive }) => ({
                                    textDecoration: 'none',
                                    color: 'white',
                                    display: 'block',
                                    padding: '10px 15px',
                                    borderRadius: '5px',
                                    backgroundColor: isActive ? '#34495e' : 'transparent',
                                    transition: 'background-color 0.3s ease'
                                })}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor = '#34495e';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = e.currentTarget.classList.contains('active-nav') ? '#34495e' : 'transparent';
                                }}
                            >
                                {item.label}
                            </NavLink>
                        </li>
                    ))}
                </ul>
            </nav>

            <div style={{ marginLeft: '250px', flexGrow: 1 }}>
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
