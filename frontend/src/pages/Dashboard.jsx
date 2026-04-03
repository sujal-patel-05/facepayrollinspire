import { useEffect, useState } from 'react';
import { Users, Clock, TrendingUp, TrendingDown, AlertTriangle, RefreshCw } from 'lucide-react';
import './Dashboard.css';

const Dashboard = () => {
    const [stats, setStats] = useState({
        totalEmployees: 0,
        todayAttendance: 0,
        attendanceRate: 0,
        departments: 0,
    });
    const [recentAttendance, setRecentAttendance] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [lastUpdated, setLastUpdated] = useState(new Date());

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            setError(null);

            const employeesRes = await fetch('http://localhost:8000/employees/list');
            if (!employeesRes.ok) throw new Error('Failed to fetch employees');
            const employees = await employeesRes.json();

            const attendanceRes = await fetch('http://localhost:8000/attendance/today');
            if (!attendanceRes.ok) throw new Error('Failed to fetch attendance');
            const attendance = await attendanceRes.json();

            const totalEmps = employees.length;
            const todayAtt = attendance.length;
            const rate = totalEmps > 0 ? Math.round((todayAtt / totalEmps) * 100) : 0;
            const absentCount = totalEmps - todayAtt;

            setStats({
                totalEmployees: totalEmps,
                todayAttendance: todayAtt,
                absentCount: absentCount,
                attendanceRate: rate,
                departments: 4,
            });

            setRecentAttendance(attendance.slice(0, 5));
            setLastUpdated(new Date());
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboardData();
        const interval = setInterval(fetchDashboardData, 30000);
        return () => clearInterval(interval);
    }, []);

    const formatTime = (timestamp) => {
        if (!timestamp) return 'N/A';
        return new Date(timestamp).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const formatLastUpdated = () => {
        return lastUpdated.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false,
        });
    };

    const getInitials = (name) => {
        if (!name) return '?';
        return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
    };

    if (loading && stats.totalEmployees === 0) {
        return (
            <div className="loading-container">
                <div className="spinner"></div>
                <p>Loading dashboard...</p>
            </div>
        );
    }

    return (
        <div className="dashboard stagger-enter">
            <div className="dashboard-header">
                <div>
                    <h1>Dashboard</h1>
                    <p>Welcome to your HRMS command center</p>
                </div>
                <div className="dashboard-actions">
                    <span className="last-updated">Updated {formatLastUpdated()}</span>
                    <button onClick={fetchDashboardData} className="btn btn-outline btn-sm" disabled={loading}>
                        <RefreshCw size={14} className={loading ? 'spinning' : ''} />
                        Refresh
                    </button>
                </div>
            </div>

            {error && (
                <div className="error-banner">
                    <p>⚠ {error}</p>
                    <button onClick={fetchDashboardData} className="btn btn-sm btn-outline">Retry</button>
                </div>
            )}

            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-icon" style={{ background: 'var(--primary-subtle)' }}>
                        <Users size={18} style={{ color: 'var(--primary)' }} />
                    </div>
                    <div className="stat-content">
                        <h3>{stats.totalEmployees.toLocaleString()}</h3>
                        <p>Total Employees</p>
                        <span className="stat-trend neutral">Registered in system</span>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon" style={{ background: 'var(--success-subtle)' }}>
                        <TrendingUp size={18} style={{ color: 'var(--success)' }} />
                    </div>
                    <div className="stat-content">
                        <h3>{stats.todayAttendance}</h3>
                        <p>Present Today</p>
                        <span className="stat-trend up">▲ {stats.attendanceRate}% rate</span>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon" style={{ background: 'var(--error-subtle)' }}>
                        <TrendingDown size={18} style={{ color: 'var(--error)' }} />
                    </div>
                    <div className="stat-content">
                        <h3>{stats.absentCount || 0}</h3>
                        <p>Absent</p>
                        <span className="stat-trend down">▼ Not checked in</span>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon" style={{ background: 'var(--warning-subtle)' }}>
                        <AlertTriangle size={18} style={{ color: 'var(--warning)' }} />
                    </div>
                    <div className="stat-content">
                        <h3>0</h3>
                        <p>Late Arrivals</p>
                        <span className="stat-trend neutral">After 9:00 AM</span>
                    </div>
                </div>
            </div>

            <div className="dashboard-content">
                <div className="card">
                    <div className="card-header">
                        <h2>Recent Attendance</h2>
                        <span className="badge badge-info">{recentAttendance.length} today</span>
                    </div>
                    {recentAttendance.length > 0 ? (
                        <div className="attendance-list">
                            {recentAttendance.map((record) => (
                                <div key={record.id} className="attendance-item">
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <div className="avatar-circle">
                                            {getInitials(record.employee?.name)}
                                        </div>
                                        <div className="attendance-info">
                                            <h4>{record.employee?.name || `Employee #${record.employee_id}`}</h4>
                                            <p>{formatTime(record.check_in_time)}</p>
                                        </div>
                                    </div>
                                    <span className="badge badge-success">
                                        {Math.round((record.confidence_score || 0.9) * 100)}%
                                    </span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="no-data">No attendance records for today</p>
                    )}
                </div>

                <div className="card">
                    <h2 style={{ marginBottom: '16px' }}>Quick Actions</h2>
                    <div className="quick-actions">
                        <a href="/employees" className="action-btn">
                            <Users size={18} />
                            Manage Employees
                        </a>
                        <a href="/attendance" className="action-btn">
                            <Clock size={18} />
                            View Attendance
                        </a>
                        <a href="/payroll" className="action-btn">
                            <TrendingUp size={18} />
                            Generate Payroll
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
