import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/client';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const response = await api.post('/auth/login', {
                email,
                password,
                device_name: 'web_browser',
            });
            localStorage.setItem('access_token', response.data.access_token);

            // Fetch user role and redirect
            const userResponse = await api.get('/auth/me');
            const userRole = userResponse.data.role;

            if (userRole === 'student') {
                navigate('/student/exam-schedules');
            } else if (userRole === 'lecturer') {
                navigate('/lecturer/exam-schedules');
            } else {
                navigate('/'); // Default redirect
            }

        } catch (err) {
            console.error('Login error:', err);
            setError('Login failed. Please check your credentials.');
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f0f2f5' }}>
            <div style={{ padding: '40px', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)', maxWidth: '400px', width: '100%' }}>
                <h2 style={{ textAlign: 'center', marginBottom: '30px', color: '#333' }}>Login</h2>
                <form onSubmit={handleLogin}>
                    <div style={{ marginBottom: '20px' }}>
                        <label htmlFor="email" style={{ display: 'block', marginBottom: '8px', color: '#555' }}>Email:</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', boxSizing: 'border-box' }}
                        />
                    </div>
                    <div style={{ marginBottom: '20px' }}>
                        <label htmlFor="password" style={{ display: 'block', marginBottom: '8px', color: '#555' }}>Password:</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', boxSizing: 'border-box' }}
                        />
                    </div>
                    {error && <p style={{ color: 'red', marginBottom: '15px', textAlign: 'center' }}>{error}</p>}
                    <button
                        type="submit"
                        style={{ width: '100%', padding: '12px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', fontSize: '16px', cursor: 'pointer', transition: 'background-color 0.3s ease' }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#0056b3'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#007bff'}
                    >
                        Login
                    </button>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;