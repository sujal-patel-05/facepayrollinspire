import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import './Dashboard.css';

function Dashboard({ setIsAuthenticated }) {
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        localStorage.removeItem('token');
        setIsAuthenticated(false);
        navigate('/login');
    };

    const navItems = [
        { path: '/dashboard', label: 'Overview', icon: '📊' },
        { path: '/dashboard/employees', label: 'Employees', icon: '👥' },
        { path: '/dashboard/attendance', label: 'Attendance', icon: '📅' },
        { path: '/dashboard/payroll', label: 'Payroll', icon: '💰' },
        { path: '/dashboard/analytics', label: 'Analytics', icon: '📈' },
    ];

    return (
        <div className="dashboard-layout">
            <aside className="sidebar">
                <div className="sidebar-header">
                    <h2>HRMS</h2>
                    <p>Admin Panel</p>
                </div>

                <nav className="sidebar-nav">
                    {navItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
                        >
                            <span className="nav-icon">{item.icon}</span>
                            <span className="nav-label">{item.label}</span>
                        </Link>
                    ))}
                </nav>

                <div className="sidebar-footer">
                    <button onClick={handleLogout} className="btn-logout">
                        🚪 Logout
                    </button>
                </div>
            </aside>

            <main className="main-content">
                <motion.div
                    key={location.pathname}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <Outlet />
                </motion.div>
            </main>
        </div>
    );
}

export default Dashboard;
