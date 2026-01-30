import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Login.css';
import { LogIn, User, Lock } from 'lucide-react';

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
                <div className="login-card">
                    <div className="login-header">
                        <div className="login-icon gradient-bg">
                            <User size={32} color="white" />
                        </div>
                        <h1>HRMS Admin</h1>
                        <p>Sign in to your account</p>
                    </div>

                    <form onSubmit={handleSubmit} className="login-form">
                        {error && (
                            <div className="error-message">
                                {error}
                            </div>
                        )}

                        <div className="form-group">
                            <label>
                                <User size={18} />
                                Username
                            </label>
                            <input
                                type="text"
                                value={credentials.username}
                                onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                                placeholder="Enter your username"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>
                                <Lock size={18} />
                                Password
                            </label>
                            <input
                                type="password"
                                value={credentials.password}
                                onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                                placeholder="Enter your password"
                                required
                            />
                        </div>

                        <button type="submit" className="btn btn-primary login-btn" disabled={loading}>
                            {loading ? (
                                <div className="spinner"></div>
                            ) : (
                                <>
                                    <LogIn size={20} />
                                    Sign In
                                </>
                            )}
                        </button>
                    </form>

                    <div className="login-footer">
                        <p>Default credentials: admin / admin123</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
