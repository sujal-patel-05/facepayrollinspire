import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Login.css';
import { LogIn, User, Lock, Scan } from 'lucide-react';

const Login = () => {
    const [credentials, setCredentials] = useState({ username: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const result = await login(credentials);

        if (result.success) {
            navigate('/');
        } else {
            setError(result.error);
        }

        setLoading(false);
    };

    return (
        <div className="login-page">
            <div className="login-container">
                <div className="login-card card">
                    <div className="login-header">
                        <div className="login-logo">
                            <div className="logo-mark" style={{ width: '48px', height: '48px' }}>
                                <Scan size={28} />
                            </div>
                            <h1>FaceAI Admin</h1>
                        </div>
                        <p>Command center authentication</p>
                    </div>

                    <form onSubmit={handleSubmit} className="login-form">
                        {error && (
                            <div className="error-banner" style={{ marginBottom: '24px' }}>
                                <p>{error}</p>
                            </div>
                        )}

                        <div className="form-group">
                            <label>
                                USERNAME
                            </label>
                            <div className="search-box">
                                <User size={18} />
                                <input
                                    type="text"
                                    value={credentials.username}
                                    onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                                    placeholder="admin"
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label>
                                PASSWORD
                            </label>
                            <div className="search-box">
                                <Lock size={18} />
                                <input
                                    type="password"
                                    value={credentials.password}
                                    onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                        </div>

                        <button type="submit" className="btn btn-primary login-btn" disabled={loading} style={{ width: '100%', justifyContent: 'center', height: '44px', marginTop: '8px' }}>
                            {loading ? (
                                <div className="spinner" style={{ width: '20px', height: '20px' }}></div>
                            ) : (
                                <>
                                    <LogIn size={18} />
                                    Authenticate
                                </>
                            )}
                        </button>
                    </form>

                    <div className="login-footer">
                        <p>Standard credentials: <code style={{ color: 'var(--primary)', fontFamily: 'var(--font-mono)' }}>admin / admin123</code></p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
