import { useEffect, useState } from 'react';
import { Clock, Calendar, UserCheck, Download, Filter, LogIn, LogOut as LogOutIcon, X } from 'lucide-react';
import './Attendance.css';

const Attendance = () => {
    const [attendanceRecords, setAttendanceRecords] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [filteredRecords, setFilteredRecords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [searchTerm, setSearchTerm] = useState('');

    const [showPunchModal, setShowPunchModal] = useState(false);
    const [punchType, setPunchType] = useState('in');
    const [selectedEmployeeId, setSelectedEmployeeId] = useState('');
    const [punchTime, setPunchTime] = useState(new Date().toTimeString().slice(0, 5));

    useEffect(() => {
        fetchData();
    }, [selectedDate]);

    const fetchData = async () => {
        try {
            setLoading(true);
            setError(null);

            const empRes = await fetch('http://localhost:8000/employees/list');
            if (!empRes.ok) throw new Error('Failed to fetch employees');
            const empData = await empRes.json();
            setEmployees(empData);

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
            const employee = employees.find(emp => emp.id === parseInt(selectedEmployeeId));
            if (!employee) {
                alert('Employee not found');
                return;
            }
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
        const diff = (end - start) / (1000 * 60 * 60);
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

    const getInitials = (name) => {
        if (!name) return '?';
        return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
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
        <div className="attendance-page stagger-enter">
            <div className="page-header">
                <div>
                    <h1>Attendance</h1>
                    <p>Track and manage employee attendance</p>
                </div>
                <div className="header-actions">
                    <button onClick={() => setShowPunchModal(true)} className="btn btn-primary">
                        <UserCheck size={18} />
                        Manual Punch
                    </button>
                    <button onClick={exportToCSV} className="btn btn-outline">
                        <Download size={18} />
                        Export
                    </button>
                </div>
            </div>

            <div className="stats-row">
                <div className="stat-card-sm">
                    <div className="stat-icon-sm" style={{ background: 'var(--success-subtle)' }}>
                        <UserCheck size={20} style={{ color: 'var(--success)' }} />
                    </div>
                    <div>
                        <h3>{presentCount}</h3>
                        <p>Present Today</p>
                    </div>
                </div>
                <div className="stat-card-sm">
                    <div className="stat-icon-sm" style={{ background: 'var(--error-subtle)' }}>
                        <Clock size={20} style={{ color: 'var(--error)' }} />
                    </div>
                    <div>
                        <h3>{absentCount}</h3>
                        <p>Absent Today</p>
                    </div>
                </div>
                <div className="stat-card-sm">
                    <div className="stat-icon-sm" style={{ background: 'var(--primary-subtle)' }}>
                        <Calendar size={20} style={{ color: 'var(--primary)' }} />
                    </div>
                    <div>
                        <h3>{attendanceRate}%</h3>
                        <p>Attendance Rate</p>
                    </div>
                </div>
            </div>

            <div className="attendance-controls">
                <div className="search-box">
                    <Filter size={18} />
                    <input
                        type="text"
                        placeholder="Search by name or ID..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="date-picker">
                    <Calendar size={18} />
                    <input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                    />
                </div>
            </div>

            {filteredRecords.length === 0 ? (
                <div className="card">
                    <div className="empty-state">
                        <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                            <circle cx="24" cy="24" r="18" stroke="var(--text-muted)" strokeWidth="1.5" fill="none" />
                            <path d="M24 14v10l7 7" stroke="var(--text-muted)" strokeWidth="1.5" strokeLinecap="round" fill="none" />
                        </svg>
                        <h3>{searchTerm ? 'No records found' : 'No check-ins today'}</h3>
                        <p>{searchTerm ? 'Try adjusting your filters' : 'Attendance records will appear here'}</p>
                    </div>
                </div>
            ) : (
                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Employee</th>
                                <th>Employee ID</th>
                                <th>Check In</th>
                                <th>Check Out</th>
                                <th>Hours</th>
                                <th>Status</th>
                                <th>Confidence</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredRecords.map((record) => {
                                const status = getAttendanceStatus(record);
                                return (
                                    <tr key={record.id}>
                                        <td>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                <div className="avatar-circle-sm">
                                                    {getInitials(record.employee?.name)}
                                                </div>
                                                <span style={{ fontWeight: 500 }}>{record.employee?.name || 'Unknown'}</span>
                                            </div>
                                        </td>
                                        <td>
                                            <span className="emp-id-mono">{record.employee?.employee_id || 'N/A'}</span>
                                        </td>
                                        <td style={{ fontFamily: 'var(--font-mono)', fontSize: '13px' }}>
                                            {formatTime(record.check_in_time)}
                                        </td>
                                        <td style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', color: 'var(--text-muted)' }}>
                                            {record.check_out_time ? formatTime(record.check_out_time) : '—'}
                                        </td>
                                        <td style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', color: 'var(--text-muted)' }}>
                                            {calculateWorkHours(record.check_in_time, record.check_out_time)}
                                        </td>
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

            {/* Manual Punch Drawer */}
            {showPunchModal && (
                <div className="modal-overlay" onClick={() => setShowPunchModal(false)}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>Manual Attendance</h2>
                            <button onClick={() => setShowPunchModal(false)} className="btn-close">
                                <X size={18} />
                            </button>
                        </div>
                        <form onSubmit={handleManualPunch}>
                            <div className="form-group">
                                <label>Punch Type</label>
                                <div className="punch-type-selector">
                                    <button
                                        type="button"
                                        className={`punch-btn ${punchType === 'in' ? 'active' : ''}`}
                                        onClick={() => setPunchType('in')}
                                    >
                                        <LogIn size={18} />
                                        Punch In
                                    </button>
                                    <button
                                        type="button"
                                        className={`punch-btn ${punchType === 'out' ? 'active' : ''}`}
                                        onClick={() => setPunchType('out')}
                                    >
                                        <LogOutIcon size={18} />
                                        Punch Out
                                    </button>
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Employee</label>
                                <select
                                    value={selectedEmployeeId}
                                    onChange={(e) => setSelectedEmployeeId(e.target.value)}
                                    required
                                >
                                    <option value="">Choose an employee...</option>
                                    {employees.map((emp) => (
                                        <option key={emp.id} value={emp.id}>
                                            {emp.employee_id} — {emp.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Time</label>
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
