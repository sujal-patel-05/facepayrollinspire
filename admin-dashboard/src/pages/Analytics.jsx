import { useState, useEffect } from 'react';
import './Analytics.css';
import { BarChart3, TrendingUp, Users, Clock } from 'lucide-react';
import { analyticsAPI } from '../services/api';

const Analytics = () => {
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadAnalytics();
    }, []);

    const loadAnalytics = async () => {
        try {
            const response = await analyticsAPI.getDashboard();
            setAnalytics(response.data);
        } catch (error) {
            console.error('Failed to load analytics:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="loading-container"><div className="spinner"></div></div>;
    }

    return (
        <div className="analytics-page">
            <div className="page-header">
                <div>
                    <h1>Analytics</h1>
                    <p>System insights and statistics</p>
                </div>
            </div>

            <div className="analytics-grid">
                <div className="card analytics-card">
                    <div className="analytics-icon" style={{ background: 'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)' }}>
                        <Users size={32} color="white" />
                    </div>
                    <h3>Total Employees</h3>
                    <p className="analytics-value">{analytics?.total_employees || 0}</p>
                </div>

                <div className="card analytics-card">
                    <div className="analytics-icon" style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}>
                        <Clock size={32} color="white" />
                    </div>
                    <h3>Today's Attendance</h3>
                    <p className="analytics-value">{analytics?.today_attendance || 0}</p>
                </div>

                <div className="card analytics-card">
                    <div className="analytics-icon" style={{ background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)' }}>
                        <TrendingUp size={32} color="white" />
                    </div>
                    <h3>Attendance Rate</h3>
                    <p className="analytics-value">{analytics?.attendance_percentage || 0}%</p>
                </div>

                <div className="card analytics-card">
                    <div className="analytics-icon" style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #ea580c 100%)' }}>
                        <BarChart3 size={32} color="white" />
                    </div>
                    <h3>Departments</h3>
                    <p className="analytics-value">5</p>
                </div>
            </div>

            <div className="card">
                <h3>System Overview</h3>
                <p className="overview-text">
                    Your HRMS system is running smoothly with {analytics?.total_employees || 0} registered employees.
                    Today's attendance rate is {analytics?.attendance_percentage || 0}%, with {analytics?.today_attendance || 0} employees checked in.
                </p>
            </div>
        </div>
    );
};

export default Analytics;
