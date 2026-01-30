import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { attendanceAPI } from '../utils/api';

function AttendanceMonitor() {
    const [attendance, setAttendance] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadAttendance();
    }, []);

    const loadAttendance = async () => {
        try {
            const res = await attendanceAPI.history();
            setAttendance(res.data);
        } catch (error) {
            toast.error('Failed to load attendance');
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) return <div className="loading-container"><div className="spinner"></div></div>;

    return (
        <div>
            <div className="page-header">
                <h1>Attendance Monitor</h1>
                <p>View all attendance records</p>
            </div>
            <div className="card">
                <table className="table">
                    <thead>
                        <tr>
                            <th>Employee</th>
                            <th>Date</th>
                            <th>Check-in Time</th>
                            <th>Confidence</th>
                        </tr>
                    </thead>
                    <tbody>
                        {attendance.map((att) => (
                            <tr key={att.id}>
                                <td>{att.employee?.name}</td>
                                <td>{new Date(att.date).toLocaleDateString()}</td>
                                <td>{new Date(att.check_in_time).toLocaleTimeString()}</td>
                                <td>{(att.confidence_score * 100).toFixed(1)}%</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default AttendanceMonitor;
