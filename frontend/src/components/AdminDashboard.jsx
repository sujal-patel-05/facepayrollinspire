import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { analyticsAPI, attendanceAPI } from '../utils/api';
import './AdminDashboard.css';

function AdminDashboard() {
    const [stats, setStats] = useState(null);
    const [recentAttendance, setRecentAttendance] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadDashboardData();
    }, []);

    const loadDashboardData = async () => {
        try {
            const [statsRes, attendanceRes] = await Promise.all([
                analyticsAPI.dashboard(),
                attendanceAPI.today()
            ]);

            setStats(statsRes.data);
            setRecentAttendance(attendanceRes.data.slice(0, 5));
        } catch (error) {
            toast.error('Failed to load dashboard data');
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return (
            <div className="loading-container">
                <div className="spinner"></div>
            </div>
        );
    }

    return (
        <div className="admin-dashboard">
            <div className="dashboard-header">
                <h1>Dashboard Overview</h1>
                <p>Welcome to the HRMS Admin Panel</p>
            </div>

            <div className="stats-grid">
                <motion.div
                    className="stat-card"
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                >
                    <div className="stat-icon">👥</div>
                    <div className="stat-content">
                        <h3>{stats?.total_employees || 0}</h3>
                        <p>Total Employees</p>
                    </div>
                </motion.div>

                <motion.div
                    className="stat-card"
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                >
                    <div className="stat-icon">📅</div>
                    <div className="stat-content">
                        <h3>{stats?.today_attendance || 0}</h3>
                        <p>Today's Attendance</p>
                    </div>
                </motion.div>

                <motion.div
                    className="stat-card"
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                >
                    <div className="stat-icon">📊</div>
                    <div className="stat-content">
                        <h3>{stats?.attendance_percentage || 0}%</h3>
                        <p>Attendance Rate</p>
                    </div>
                </motion.div>

                <motion.div
                    className="stat-card"
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                >
                    <div className="stat-icon">💰</div>
                    <div className="stat-content">
                        <h3>${stats?.monthly_payroll_cost || 0}</h3>
                        <p>Monthly Payroll</p>
                    </div>
                </motion.div>
            </div>

            <div className="dashboard-content">
                <div className="card">
                    <h2>Recent Attendance</h2>
                    {recentAttendance.length > 0 ? (
                        <div className="attendance-list">
                            {recentAttendance.map((att) => (
                                <div key={att.id} className="attendance-item">
                                    <div className="attendance-info">
                                        <strong>{att.employee.name}</strong>
                                        <span className="attendance-time">
                                            {new Date(att.check_in_time).toLocaleTimeString()}
                                        </span>
                                    </div>
                                    <span className="badge badge-success">Present</span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="empty-state">No attendance records today</p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default AdminDashboard;
