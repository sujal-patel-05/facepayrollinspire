import { useState, useEffect } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import toast from 'react-hot-toast';
import { analyticsAPI } from '../utils/api';

function Analytics() {
    const [trends, setTrends] = useState([]);
    const [deptStats, setDeptStats] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadAnalytics();
    }, []);

    const loadAnalytics = async () => {
        try {
            const [trendsRes, deptRes] = await Promise.all([
                analyticsAPI.monthlyTrends(6),
                analyticsAPI.departmentWise()
            ]);
            setTrends(trendsRes.data);
            setDeptStats(deptRes.data.departments || []);
        } catch (error) {
            toast.error('Failed to load analytics');
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) return <div className="loading-container"><div className="spinner"></div></div>;

    return (
        <div>
            <div className="page-header">
                <h1>Analytics</h1>
                <p>Attendance and payroll insights</p>
            </div>

            <div className="card" style={{ marginBottom: '24px' }}>
                <h2>Monthly Attendance Trends</h2>
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={trends}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="attendance_percentage" stroke="#3F72AF" strokeWidth={2} />
                    </LineChart>
                </ResponsiveContainer>
            </div>

            <div className="card">
                <h2>Department-wise Attendance</h2>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={deptStats}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="department_name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="attendance_percentage" fill="#3F72AF" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}

export default Analytics;
