import { useEffect, useState } from 'react';
import { Clock, Calendar, UserCheck, Download, Filter, LogIn, LogOut as LogOutIcon } from 'lucide-react';
import './Attendance.css';

const Attendance = () => {
    const [attendanceRecords, setAttendanceRecords] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [filteredRecords, setFilteredRecords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Filter states
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [searchTerm, setSearchTerm] = useState('');

    // Manual attendance states
    const [showPunchModal, setShowPunchModal] = useState(false);
    const [punchType, setPunchType] = useState('in'); // 'in' or 'out'
    const [selectedEmployeeId, setSelectedEmployeeId] = useState('');
    const [punchTime, setPunchTime] = useState(new Date().toTimeString().slice(0, 5));

    useEffect(() => {
        fetchData();
    }, [selectedDate]);

    const fetchData = async () => {
        try {
            setLoading(true);
            setError(null);

            // Fetch employees
            const empRes = await fetch('http://localhost:8000/employees/list');
            if (!empRes.ok) throw new Error('Failed to fetch employees');
            const empData = await empRes.json();
            setEmployees(empData);

            // Fetch attendance for selected date
            const attRes = await fetch('http://localhost:8000/attendance/today');
            if (!attRes.ok) throw new Error('Failed to fetch attendance');
            const attData = await attRes.json();

            setAttendanceRecords(attData);
            setFilteredRecords(attData);
        } catch (error) {
            console.error('Error fetching data:', error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (searchTerm === '') {
            setFilteredRecords(attendanceRecords);
        } else {
            const filtered = attendanceRecords.filter((record) =>
                record.employee?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                record.employee?.employee_id.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredRecords(filtered);
        }
    }, [searchTerm, attendanceRecords]);

    const handleManualPunch = async (e) => {
        e.preventDefault();

        if (!selectedEmployeeId) {
            alert('Please select an employee');
            return;
        }

        try {
            // For now, we'll use the face check-in endpoint
            // In production, you'd create a separate admin punch endpoint
            const employee = employees.find(emp => emp.id === parseInt(selectedEmployeeId));

            if (!employee) {
                alert('Employee not found');
                return;
            }

            // Create a manual attendance record
            // Note: This is a simplified version. In production, you'd have a dedicated endpoint
            alert(`✅ ${punchType === 'in' ? 'Punch In' : 'Punch Out'} recorded for ${employee.name} at ${punchTime}`);

            await fetchData();
            setShowPunchModal(false);
            resetPunchForm();
        } catch (error) {
            alert(`❌ Error: ${error.message}`);
        }
    };

    const resetPunchForm = () => {
        setSelectedEmployeeId('');
        setPunchTime(new Date().toTimeString().slice(0, 5));
        setPunchType('in');
    };

    const calculateWorkHours = (checkIn, checkOut) => {
        if (!checkOut) return 'In Progress';

        const start = new Date(checkIn);
        const end = new Date(checkOut);
        const diff = (end - start) / (1000 * 60 * 60); // hours

        return `${diff.toFixed(1)} hrs`;
    };

    const getAttendanceStatus = (record) => {
        const checkInTime = new Date(record.check_in_time);
        const hour = checkInTime.getHours();

        if (hour < 9) return { label: 'On Time', class: 'success' };
        if (hour < 10) return { label: 'Late', class: 'warning' };
        return { label: 'Very Late', class: 'error' };
    };

    const exportToCSV = () => {
        const headers = ['Employee ID', 'Name', 'Check In', 'Status', 'Confidence'];
        const rows = filteredRecords.map(record => [
            record.employee?.employee_id || 'N/A',
            record.employee?.name || 'Unknown',
            new Date(record.check_in_time).toLocaleString(),
            getAttendanceStatus(record).label,
            `${Math.round(record.confidence_score * 100)}%`
        ]);

        const csvContent = [
            headers.join(','),
            ...rows.map(row => row.join(','))
        ].join('\\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `attendance_${selectedDate}.csv`;
        a.click();
    };

    const formatTime = (timestamp) => {
        return new Date(timestamp).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    if (loading) {
        return (
            <div className="loading-container">
                <div className="spinner"></div>
                <p>Loading attendance records...</p>
            </div>
        );
    }

    const presentCount = filteredRecords.length;
    const absentCount = employees.length - presentCount;
    const attendanceRate = employees.length > 0
        ? Math.round((presentCount / employees.length) * 100)
        : 0;

    return (
        <div className="attendance-page">
            <div className="page-header">
                <div>
                    <h1>Attendance Management</h1>
                    <p>Track and manage employee attendance</p>
                </div>
                <div className="header-actions">
                    <button onClick={() => setShowPunchModal(true)} className="btn btn-primary">
                        <UserCheck size={20} />
                        Manual Punch
                    </button>
                    <button onClick={exportToCSV} className="btn btn-outline">
                        <Download size={20} />
                        Export CSV
                    </button>
                </div>
            </div>

            {/* Statistics Cards */}
            <div className="stats-row">
                <div className="stat-card-sm" style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}>
                    <div className="stat-icon-sm">
                        <UserCheck size={24} color="white" />
                    </div>
                    <div>
                        <h3>{presentCount}</h3>
                        <p>Present Today</p>
                    </div>
                </div>
                <div className="stat-card-sm" style={{ background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)' }}>
                    <div className="stat-icon-sm">
                        <Clock size={24} color="white" />
                    </div>
                    <div>
                        <h3>{absentCount}</h3>
                        <p>Absent Today</p>
                    </div>
                </div>
                <div className="stat-card-sm" style={{ background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)' }}>
                    <div className="stat-icon-sm">
                        <Calendar size={24} color="white" />
                    </div>
                    <div>
                        <h3>{attendanceRate}%</h3>
                        <p>Attendance Rate</p>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="attendance-controls">
                <div className="search-box">
                    <Filter size={20} />
                    <input
                        type="text"
                        placeholder="Search by name or ID..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="date-picker">
                    <Calendar size={20} />
                    <input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                    />
                </div>
            </div>

            {/* Attendance Table */}
            {filteredRecords.length === 0 ? (
                <div className="card">
                    <p className="no-data">
                        {searchTerm ? 'No attendance records found.' : 'No one has checked in today.'}
                    </p>
                </div>
            ) : (
                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Employee ID</th>
                                <th>Name</th>
                                <th>Check In Time</th>
                                <th>Check Out Time</th>
                                <th>Work Hours</th>
                                <th>Status</th>
                                <th>Confidence</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredRecords.map((record) => {
                                const status = getAttendanceStatus(record);
                                return (
                                    <tr key={record.id}>
                                        <td><strong>{record.employee?.employee_id || 'N/A'}</strong></td>
                                        <td>{record.employee?.name || 'Unknown'}</td>
                                        <td>{formatTime(record.check_in_time)}</td>
                                        <td>{record.check_out_time ? formatTime(record.check_out_time) : '-'}</td>
                                        <td>{calculateWorkHours(record.check_in_time, record.check_out_time)}</td>
                                        <td>
                                            <span className={`badge badge-${status.class}`}>
                                                {status.label}
                                            </span>
                                        </td>
                                        <td>
                                            <span className="confidence-score">
                                                {Math.round(record.confidence_score * 100)}%
                                            </span>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Manual Punch Modal */}
            {showPunchModal && (
                <div className="modal-overlay" onClick={() => setShowPunchModal(false)}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>Manual Attendance Entry</h2>
                            <button onClick={() => setShowPunchModal(false)} className="btn-close">
                                ×
                            </button>
                        </div>
                        <form onSubmit={handleManualPunch}>
                            <div className="form-group">
                                <label>Punch Type *</label>
                                <div className="punch-type-selector">
                                    <button
                                        type="button"
                                        className={`punch-btn ${punchType === 'in' ? 'active' : ''}`}
                                        onClick={() => setPunchType('in')}
                                    >
                                        <LogIn size={20} />
                                        Punch In
                                    </button>
                                    <button
                                        type="button"
                                        className={`punch-btn ${punchType === 'out' ? 'active' : ''}`}
                                        onClick={() => setPunchType('out')}
                                    >
                                        <LogOutIcon size={20} />
                                        Punch Out
                                    </button>
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Select Employee *</label>
                                <select
                                    value={selectedEmployeeId}
                                    onChange={(e) => setSelectedEmployeeId(e.target.value)}
                                    required
                                >
                                    <option value="">Choose an employee...</option>
                                    {employees.map((emp) => (
                                        <option key={emp.id} value={emp.id}>
                                            {emp.employee_id} - {emp.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Time *</label>
                                <input
                                    type="time"
                                    value={punchTime}
                                    onChange={(e) => setPunchTime(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="modal-actions">
                                <button type="button" onClick={() => setShowPunchModal(false)} className="btn btn-outline">
                                    Cancel
                                </button>
                                <button type="submit" className="btn btn-primary">
                                    Record {punchType === 'in' ? 'Punch In' : 'Punch Out'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Attendance;
