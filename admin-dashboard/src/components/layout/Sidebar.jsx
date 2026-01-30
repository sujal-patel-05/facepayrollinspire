import { NavLink } from 'react-router-dom';
import {
    LayoutDashboard,
    Users,
    Clock,
    Building2,
    DollarSign,
    BarChart3,
    Home,
} from 'lucide-react';
import './Sidebar.css';

const Sidebar = () => {
    const menuItems = [
        { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
        { path: '/employees', icon: Users, label: 'Employees' },
        { path: '/attendance', icon: Clock, label: 'Attendance' },
        { path: '/departments', icon: Building2, label: 'Departments' },
        { path: '/payroll', icon: DollarSign, label: 'Payroll' },
        { path: '/analytics', icon: BarChart3, label: 'Analytics' },
    ];

    return (
        <aside className="sidebar">
            <div className="sidebar-header">
                <div className="logo">
                    <div className="logo-icon gradient-bg">
                        <Users size={24} color="white" />
                    </div>
                    <div className="logo-text">
                        <h2>HRMS</h2>
                        <p>Admin Panel</p>
                    </div>
                </div>
            </div>

            <nav className="sidebar-nav">
                {menuItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                            `nav-item ${isActive ? 'active' : ''}`
                        }
                    >
                        <item.icon size={20} />
                        <span>{item.label}</span>
                    </NavLink>
                ))}
            </nav>

            <div className="sidebar-footer">
                <NavLink to="/dashboard" className="logout-btn">
                    <Home size={20} />
                    <span>Home</span>
                </NavLink>
            </div>
        </aside>
    );
};

export default Sidebar;
