import { useEffect, useState } from 'react';
import { Users, Clock, TrendingUp, Calendar, RefreshCw } from 'lucide-react';
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

            // Fetch employees
            const employeesRes = await fetch('http://localhost:8000/employees/list');
            if (!employeesRes.ok) throw new Error('Failed to fetch employees');
            const employees = await employeesRes.json();

            // Fetch today's attendance
            const attendanceRes = await fetch('http://localhost:8000/attendance/today');
            if (!attendanceRes.ok) throw new Error('Failed to fetch attendance');
            const attendance = await attendanceRes.json();

            // Calculate stats
            const totalEmps = employees.length;
            const todayAtt = attendance.length;
            const rate = totalEmps > 0 ? Math.round((todayAtt / totalEmps) * 100) : 0;

            setStats({
                totalEmployees: totalEmps,
                todayAttendance: todayAtt,
                attendanceRate: rate,
                departments: 4, // You can fetch this from /departments/ endpoint
            });

            // Get recent attendance (last 5 records)
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

        // Auto-refresh every 30 seconds
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
        });
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
        <div className="dashboard">
            <div className="dashboard-header">
                <div>
                    <h1>Dashboard Overview</h1>
                    <p>Welcome to your HRMS Admin Panel</p>
                </div>
                <div className="dashboard-actions">
                    <button onClick={fetchDashboardData} className="btn btn-outline" disabled={loading}>
                        <RefreshCw size={18} className={loading ? 'spinning' : ''} />
                        Refresh
                    </button>
                    <span className="last-updated">Last updated: {formatLastUpdated()}</span>
                </div>
            </div>

            {error && (
                <div className="error-banner">
                    <p>⚠️ {error}</p>
                    <button onClick={fetchDashboardData} className="btn btn-sm">Retry</button>
                </div>
            )}

            <div className="stats-grid">
                <div className="stat-card gradient-bg">
                    <div className="stat-icon">
                        <Users size={32} color="white" />
                    </div>
                    <div className="stat-content">
                        <h3>{stats.totalEmployees}</h3>
                        <p>Total Employees</p>
                        <span className="stat-trend">Registered in system</span>
                    </div>
                </div>

                <div className="stat-card" style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}>
                    <div className="stat-icon">
                        <Clock size={32} color="white" />
                    </div>
                    <div className="stat-content">
                        <h3>{stats.todayAttendance}</h3>
                        <p>Today's Attendance</p>
                        <span className="stat-trend">Checked in today</span>
                    </div>
                </div>

                <div className="stat-card" style={{ background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)' }}>
                    <div className="stat-icon">
                        <TrendingUp size={32} color="white" />
                    </div>
                    <div className="stat-content">
                        <h3>{stats.attendanceRate}%</h3>
                        <p>Attendance Rate</p>
                        <span className="stat-trend">Today's percentage</span>
                    </div>
                </div>

                <div className="stat-card" style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' }}>
                    <div className="stat-icon">
                        <Calendar size={32} color="white" />
                    </div>
                    <div className="stat-content">
                        <h3>{stats.departments}</h3>
                        <p>Departments</p>
                        <span className="stat-trend">Active departments</span>
                    </div>
                </div>
            </div>

            <div className="dashboard-content">
                <div className="card">
                    <div className="card-header">
                        <h2>Recent Attendance</h2>
                        <span className="badge badge-info">{recentAttendance.length} records</span>
                    </div>
                    {recentAttendance.length > 0 ? (
                        <div className="attendance-list">
                            {recentAttendance.map((record) => (
                                <div key={record.id} className="attendance-item">
                                    <div className="attendance-info">
                                        <h4>{record.employee?.name || `Employee #${record.employee_id}`}</h4>
                                        <p>Check-in: {formatTime(record.check_in_time)}</p>
                                    </div>
                                    <div className="attendance-confidence">
                                        <span className="badge badge-success">
                                            {Math.round((record.confidence_score || 0.9) * 100)}% Match
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="no-data">No attendance records for today</p>
                    )}
                </div>

                <div className="card">
                    <h2>Quick Actions</h2>
                    <div className="quick-actions">
                        <a href="/employees" className="action-btn">
                            <Users size={20} />
                            Manage Employees
                        </a>
                        <a href="/attendance" className="action-btn">
                            <Clock size={20} />
                            Mark Attendance
                        </a>
                        <a href="/payroll" className="action-btn">
                            <TrendingUp size={20} />
                            Generate Payroll
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
