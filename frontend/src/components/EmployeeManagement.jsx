import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { employeesAPI, departmentsAPI } from '../utils/api';

function EmployeeManagement() {
    const [employees, setEmployees] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterDept, setFilterDept] = useState('');

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [empRes, deptRes] = await Promise.all([
                employeesAPI.list(),
                departmentsAPI.list()
            ]);
            setEmployees(empRes.data);
            setDepartments(deptRes.data);
        } catch (error) {
            toast.error('Failed to load employees');
        } finally {
            setIsLoading(false);
        }
    };

    const filteredEmployees = employees.filter(emp => {
        const matchesSearch = emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            emp.employee_id.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesDept = !filterDept || emp.department_id === parseInt(filterDept);
        return matchesSearch && matchesDept;
    });

    if (isLoading) {
        return <div className="loading-container"><div className="spinner"></div></div>;
    }

    return (
        <div>
            <div className="page-header">
                <h1>Employee Management</h1>
                <p>Manage registered employees</p>
            </div>

            <div className="card" style={{ marginBottom: '24px' }}>
                <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                    <input
                        type="text"
                        className="input"
                        placeholder="Search employees..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{ flex: 1, minWidth: '200px' }}
                    />
                    <select
                        className="input"
                        value={filterDept}
                        onChange={(e) => setFilterDept(e.target.value)}
                        style={{ minWidth: '200px' }}
                    >
                        <option value="">All Departments</option>
                        {departments.map(dept => (
                            <option key={dept.id} value={dept.id}>{dept.name}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="card">
                <table className="table">
                    <thead>
                        <tr>
                            <th>Employee ID</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Department</th>
                            <th>Face Registered</th>
                            <th>Joined</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredEmployees.map((emp) => (
                            <motion.tr
                                key={emp.id}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.3 }}
                            >
                                <td><strong>{emp.employee_id}</strong></td>
                                <td>{emp.name}</td>
                                <td>{emp.email}</td>
                                <td>{emp.department?.name || 'N/A'}</td>
                                <td>
                                    {emp.has_face_registered ? (
                                        <span className="badge badge-success">✓ Yes</span>
                                    ) : (
                                        <span className="badge badge-warning">✗ No</span>
                                    )}
                                </td>
                                <td>{new Date(emp.created_at).toLocaleDateString()}</td>
                            </motion.tr>
                        ))}
                    </tbody>
                </table>
                {filteredEmployees.length === 0 && (
                    <p className="empty-state">No employees found</p>
                )}
            </div>
        </div>
    );
}

export default EmployeeManagement;
