import React, { useState } from 'react';
import { useAuth } from '../auth/AuthContext';
import api from '../api/client';

export default function UserProfilePage() {
    const { user } = useAuth();

    if (!user) {
        return (
            <div className="stacked-grid">
                <div className="resource-panel">
                    <p>Đang tải thông tin người dùng...</p>
                </div>
            </div>
        );
    }

    // State for password change form
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleSubmitPasswordChange = async (event) => {
        event.preventDefault();
        setMessage('');
        setError('');

        if (!currentPassword || !newPassword || !confirmNewPassword) {
            setError('Vui lòng điền đầy đủ tất cả các trường.');
            return;
        }

        if (newPassword !== confirmNewPassword) {
            setError('Mật khẩu mới và xác nhận mật khẩu mới không khớp.');
            return;
        }

        if (newPassword.length < 8) { // Example minimum length
            setError('Mật khẩu mới phải có ít nhất 8 ký tự.');
            return;
        }

        setLoading(true);
        try {
            // Assuming a POST /auth/change-password endpoint
            await api.patch('/auth/change-password', {
                current_password: currentPassword,
                password: newPassword,
                password_confirmation: confirmNewPassword,
            });
            setMessage('Đổi mật khẩu thành công!');
            setCurrentPassword('');
            setNewPassword('');
            setConfirmNewPassword('');
        } catch (err) {
            console.error('Change password error:', err);
            setError(err.response?.data?.message || 'Đổi mật khẩu thất bại. Vui lòng kiểm tra lại mật khẩu hiện tại.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="stacked-grid">
            <div className="resource-panel">
                <div className="resource-head">
                    <div>
                        <h2>Thông tin cá nhân</h2>
                        <p>Xem chi tiết thông tin tài khoản của bạn.</p>
                    </div>
                </div>
                <article className="json-card" style={{ marginTop: '1.5rem' }}>
                    <div className="row">
                        <strong>Tên:</strong>
                        <span>{user.name}</span>
                    </div>
                    <div className="row">
                        <strong>Email:</strong>
                        <span>{user.email}</span>
                    </div>
                    {user.student_code && (
                        <div className="row">
                            <strong>Mã sinh viên:</strong>
                            <span>{user.student_code}</span>
                        </div>
                    )}
                    {user.code && !user.student_code && ( // For lecturer code
                        <div className="row">
                            <strong>Mã giảng viên:</strong>
                            <span>{user.code}</span>
                        </div>
                    )}
                    <div className="row">
                        <strong>Vai trò:</strong>
                        <span>{user.role === 'student' ? 'Sinh viên' : user.role === 'lecturer' ? 'Giảng viên' : user.role}</span>
                    </div>
                    {/* Thêm các thông tin khác nếu có trong đối tượng user */}
                </article>
            </div>

            {/* Password Change Section */}
            <div className="resource-panel" style={{ marginTop: '1.5rem' }}>
                <div className="resource-head">
                    <div>
                        <h2>Đổi mật khẩu</h2>
                        <p>Thay đổi mật khẩu tài khoản của bạn.</p>
                    </div>
                </div>
                <form onSubmit={handleSubmitPasswordChange} style={{ marginTop: '1.5rem' }}>
                    <div style={{ marginBottom: '1rem' }}>
                        <label htmlFor="current-password" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Mật khẩu hiện tại:</label>
                        <input
                            type="password"
                            id="current-password"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            disabled={loading}
                            style={{ width: '100%', padding: '0.75rem', border: '1px solid #ccc', borderRadius: '0.375rem' }}
                        />
                    </div>
                    <div style={{ marginBottom: '1rem' }}>
                        <label htmlFor="new-password" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Mật khẩu mới:</label>
                        <input
                            type="password"
                            id="new-password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            disabled={loading}
                            style={{ width: '100%', padding: '0.75rem', border: '1px solid #ccc', borderRadius: '0.375rem' }}
                        />
                    </div>
                    <div style={{ marginBottom: '1.5rem' }}>
                        <label htmlFor="confirm-new-password" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Xác nhận mật khẩu mới:</label>
                        <input
                            type="password"
                            id="confirm-new-password"
                            value={confirmNewPassword}
                            onChange={(e) => setConfirmNewPassword(e.target.value)}
                            disabled={loading}
                            style={{ width: '100%', padding: '0.75rem', border: '1px solid #ccc', borderRadius: '0.375rem' }}
                        />
                    </div>
                    <button type="submit" disabled={loading} style={{ padding: '0.75rem 1.5rem', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '0.375rem', cursor: 'pointer' }}>
                        {loading ? 'Đang đổi...' : 'Đổi mật khẩu'}
                    </button>
                </form>
                {message && <p style={{ color: 'green', marginTop: '1rem' }}>{message}</p>}
                {error && <p style={{ color: 'red', marginTop: '1rem' }}>{error}</p>}
            </div>
        </div>
    );
}