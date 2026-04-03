import { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Users, Clock, Calendar } from 'lucide-react';
import './Analytics.css';

const Analytics = () => {
    const [stats, setStats] = useState({
        totalAttedance: 0,
        averageConfidence: 0,
        peakTime: '09:15 AM',
        activeDepartments: 4
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Simulate loading analytical data
        const timer = setTimeout(() => {
            setStats({
                totalAttendance: 1240,
                averageConfidence: 0.94,
                peakTime: '09:15 AM',
                activeDepartments: 4
            });
            setLoading(false);
        }, 800);
        return () => clearTimeout(timer);
    }, []);

    if (loading) {
        return (
            <div className="loading-container">
                <div className="spinner"></div>
                <p>Analyzing attendance trends...</p>
            </div>
        );
    }

    return (
        <div className="analytics-page stagger-enter">
            <div className="page-header">
                <div>
                    <h1>Analytics</h1>
                    <p>Insights and attendance metrics</p>
                </div>
            </div>

            <div className="analytics-grid">
                <div className="card analytics-card">
                    <div className="analytics-icon">
                        <Users size={24} style={{ color: 'var(--primary)' }} />
                    </div>
                    <p>Total Records</p>
                    <h3 className="analytics-value">{(stats.totalAttendance || 0).toLocaleString()}</h3>
                </div>

                <div className="card analytics-card">
                    <div className="analytics-icon" style={{ background: 'var(--success-subtle)' }}>
                        <TrendingUp size={24} style={{ color: 'var(--success)' }} />
                    </div>
                    <p>Avg. Confidence</p>
                    <h3 className="analytics-value">{Math.round((stats.averageConfidence || 0) * 100)}%</h3>
                </div>

                <div className="card analytics-card">
                    <div className="analytics-icon" style={{ background: 'var(--warning-subtle)' }}>
                        <Clock size={24} style={{ color: 'var(--warning)' }} />
                    </div>
                    <p>Peak Check-in</p>
                    <h3 className="analytics-value">{stats.peakTime}</h3>
                </div>

                <div className="card analytics-card">
                    <div className="analytics-icon" style={{ background: 'var(--info-subtle)' }}>
                        <BarChart3 size={24} style={{ color: 'var(--info)' }} />
                    </div>
                    <p>Active Departments</p>
                    <h3 className="analytics-value">{stats.activeDepartments}</h3>
                </div>
            </div>

            <div className="dashboard-content">
                <div className="card">
                    <div className="card-header">
                        <h2>Attendance Trends</h2>
                        <span className="badge badge-info">Last 30 Days</span>
                    </div>
                    <div style={{ height: '240px', display: 'flex', alignItems: 'flex-end', gap: '8px', padding: '20px 0' }}>
                        {/* CSS Bar Chart Simulation */}
                        {[45, 60, 55, 75, 90, 85, 95, 80, 70, 85, 90, 100].map((val, i) => (
                            <div key={i} style={{ flex: 1, backgroundColor: 'var(--primary-subtle)', borderRadius: '4px 4px 0 0', position: 'relative', height: `${val}%` }}>
                                <div style={{ position: 'absolute', inset: 0, backgroundColor: 'var(--primary)', opacity: 0.6, borderRadius: '4px 4px 0 0' }}></div>
                            </div>
                        ))}
                    </div>
                    <div className="overview-text">
                        <p>Weekly attendance shows a <span style={{ color: 'var(--success)' }}>12% increase</span> compared to previous month. Peak volume occurs between 8:45 AM and 9:15 AM daily.</p>
                    </div>
                </div>

                <div className="card">
                    <div className="card-header">
                        <h2>Device Distribution</h2>
                    </div>
                    <div className="result-details" style={{ marginTop: '20px' }}>
                        <div className="result-item">
                            <span>Main Entrance (Gate A)</span>
                            <strong>642 scans</strong>
                        </div>
                        <div className="result-item">
                            <span>Lobby Tablet</span>
                            <strong>412 scans</strong>
                        </div>
                        <div className="result-item">
                            <span>HR Office Kiosk</span>
                            <strong>186 scans</strong>
                        </div>
                        <div className="overview-text" style={{ marginTop: '20px' }}>
                            <p>Most employees are using the Main Entrance device for daily check-ins.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Analytics;
