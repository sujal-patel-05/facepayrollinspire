import { NavLink } from 'react-router-dom';
import {
    LayoutDashboard,
    Users,
    Clock,
    Building2,
    DollarSign,
    BarChart3,
    LogOut,
    PanelLeftClose,
    PanelLeft,
    Scan,
} from 'lucide-react';
import './Sidebar.css';

const Sidebar = ({ collapsed, onToggle }) => {
    const mainItems = [
        { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
        { path: '/employees', icon: Users, label: 'Employees' },
        { path: '/attendance', icon: Clock, label: 'Attendance' },
    ];

    const managementItems = [
        { path: '/departments', icon: Building2, label: 'Departments' },
        { path: '/payroll', icon: DollarSign, label: 'Payroll' },
        { path: '/analytics', icon: BarChart3, label: 'Analytics' },
    ];

    return (
        <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
            <div className="sidebar-header">
                <div className="logo">
                    <div className="logo-mark">
                        <Scan size={20} />
                    </div>
                    {!collapsed && (
                        <span className="logo-text">FaceAI</span>
                    )}
                </div>
                <button className="collapse-btn" onClick={onToggle} title={collapsed ? 'Expand' : 'Collapse'}>
                    {collapsed ? <PanelLeft size={18} /> : <PanelLeftClose size={18} />}
                </button>
            </div>

            <nav className="sidebar-nav">
                {mainItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                            `nav-item ${isActive ? 'active' : ''}`
                        }
                        title={collapsed ? item.label : undefined}
                    >
                        <item.icon size={18} />
                        {!collapsed && <span>{item.label}</span>}
                    </NavLink>
                ))}

                {!collapsed && (
                    <div className="nav-section-label">MANAGEMENT</div>
                )}
                {collapsed && <div className="nav-divider" />}

                {managementItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                            `nav-item ${isActive ? 'active' : ''}`
                        }
                        title={collapsed ? item.label : undefined}
                    >
                        <item.icon size={18} />
                        {!collapsed && <span>{item.label}</span>}
                    </NavLink>
                ))}
            </nav>

            <div className="sidebar-footer">
                {!collapsed && (
                    <div className="user-profile">
                        <div className="user-avatar-sm">A</div>
                        <div className="user-details">
                            <span className="user-name-sm">Admin</span>
                            <span className="user-role-sm">HR Manager</span>
                        </div>
                    </div>
                )}
                <button className="sign-out-btn" title="Sign out">
                    <LogOut size={18} />
                    {!collapsed && <span>Sign out</span>}
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
