import { useEffect, useState } from 'react';
import { Search, UserPlus, Edit2, Trash2, Mail, Building2, UserCheck, UserX, X } from 'lucide-react';
import './Employees.css';

const Employees = () => {
    const [employees, setEmployees] = useState([]);
    const [filteredEmployees, setFilteredEmployees] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Modal states
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState(null);

    // Form data
    const [formData, setFormData] = useState({
        employee_id: '',
        name: '',
        email: '',
        department_id: 1,
    });

    useEffect(() => {
        fetchEmployees();
    }, []);

    const fetchEmployees = async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await fetch('http://localhost:8000/employees/list');

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            setEmployees(data);
            setFilteredEmployees(data);
        } catch (error) {
            console.error('Error fetching employees:', error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (searchTerm === '') {
            setFilteredEmployees(employees);
        } else {
            const filtered = employees.filter((emp) =>
                emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                emp.employee_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                emp.email.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredEmployees(filtered);
        }
    }, [searchTerm, employees]);

    const handleAddEmployee = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:8000/employees/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || 'Failed to add employee');
            }

            await fetchEmployees();
            setShowAddModal(false);
            resetForm();
            alert('✅ Employee added successfully!');
        } catch (error) {
            alert(`❌ Error: ${error.message}`);
        }
    };

    const handleEditEmployee = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`http://localhost:8000/employees/${selectedEmployee.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || 'Failed to update employee');
            }

            await fetchEmployees();
            setShowEditModal(false);
            resetForm();
            alert('✅ Employee updated successfully!');
        } catch (error) {
            alert(`❌ Error: ${error.message}`);
        }
    };

    const handleDeleteEmployee = async () => {
        try {
            const response = await fetch(`http://localhost:8000/employees/${selectedEmployee.id}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Failed to delete employee');
            }

            await fetchEmployees();
            setShowDeleteModal(false);
            setSelectedEmployee(null);
            alert('✅ Employee deleted successfully!');
        } catch (error) {
            alert(`❌ Error: ${error.message}`);
        }
    };

    const openEditModal = (employee) => {
        setSelectedEmployee(employee);
        setFormData({
            employee_id: employee.employee_id,
            name: employee.name,
            email: employee.email,
            department_id: employee.department_id || 1,
        });
        setShowEditModal(true);
    };

    const openDeleteModal = (employee) => {
        setSelectedEmployee(employee);
        setShowDeleteModal(true);
    };

    const resetForm = () => {
        setFormData({
            employee_id: '',
            name: '',
            email: '',
            department_id: 1,
        });
        setSelectedEmployee(null);
    };

    const getInitials = (name) => {
        if (!name) return '?';
        return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
    };

    if (loading) {
        return (
            <div className="loading-container">
                <div className="spinner"></div>
                <p>Loading employees...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="error-container">
                <h2>Error Loading Employees</h2>
                <p>{error}</p>
                <button onClick={fetchEmployees} className="btn btn-primary">
                    Retry
                </button>
            </div>
        );
    }

    return (
        <div className="employees-page stagger-enter">
            <div className="page-header">
                <div>
                    <h1>Employees</h1>
                    <p>{employees.length} total employees</p>
                </div>
                <button onClick={() => setShowAddModal(true)} className="btn btn-primary">
                    <UserPlus size={18} />
                    Add Employee
                </button>
            </div>

            <div className="employees-controls">
                <div className="search-box">
                    <Search size={18} />
                    <input
                        type="text"
                        placeholder="Search by name, ID, or email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {filteredEmployees.length === 0 ? (
                <div className="card empty-state-card">
                    <div className="empty-state">
                        <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                            <rect x="8" y="8" width="32" height="32" rx="8" stroke="var(--text-muted)" strokeWidth="1.5" fill="none" />
                            <circle cx="24" cy="20" r="6" stroke="var(--text-muted)" strokeWidth="1.5" fill="none" />
                            <path d="M14 36c0-5.523 4.477-10 10-10s10 4.477 10 10" stroke="var(--text-muted)" strokeWidth="1.5" fill="none" strokeLinecap="round" />
                        </svg>
                        <h3>{searchTerm ? 'No results found' : 'No employees yet'}</h3>
                        <p>{searchTerm ? 'Try adjusting your search terms' : 'Add your first employee to get started'}</p>
                        {!searchTerm && (
                            <button onClick={() => setShowAddModal(true)} className="btn btn-primary btn-sm" style={{ marginTop: '12px' }}>
                                <UserPlus size={16} /> Add Employee
                            </button>
                        )}
                    </div>
                </div>
            ) : (
                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Employee</th>
                                <th>Employee ID</th>
                                <th>Email</th>
                                <th>Department</th>
                                <th>Face Status</th>
                                <th>Joined</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredEmployees.map((employee) => (
                                <tr key={employee.id}>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                            <div className="avatar-circle">
                                                {getInitials(employee.name)}
                                            </div>
                                            <span className="employee-name">{employee.name}</span>
                                        </div>
                                    </td>
                                    <td>
                                        <span className="emp-id">{employee.employee_id}</span>
                                    </td>
                                    <td>
                                        <div className="employee-email">
                                            <Mail size={14} />
                                            {employee.email}
                                        </div>
                                    </td>
                                    <td>
                                        <div className="employee-department">
                                            <Building2 size={14} />
                                            {employee.department?.name || 'Not Assigned'}
                                        </div>
                                    </td>
                                    <td>
                                        {employee.has_face_registered ? (
                                            <span className="badge badge-success">
                                                <UserCheck size={12} />
                                                Registered
                                            </span>
                                        ) : (
                                            <span className="badge badge-warning">
                                                <UserX size={12} />
                                                Pending
                                            </span>
                                        )}
                                    </td>
                                    <td style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', color: 'var(--text-muted)' }}>
                                        {new Date(employee.created_at).toLocaleDateString('en-US', {
                                            month: 'short',
                                            day: 'numeric',
                                            year: 'numeric',
                                        })}
                                    </td>
                                    <td>
                                        <div className="action-buttons">
                                            <button
                                                onClick={() => openEditModal(employee)}
                                                className="btn-icon btn-edit"
                                                title="Edit"
                                            >
                                                <Edit2 size={15} />
                                            </button>
                                            <button
                                                onClick={() => openDeleteModal(employee)}
                                                className="btn-icon btn-delete"
                                                title="Delete"
                                            >
                                                <Trash2 size={15} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Add Employee Drawer */}
            {showAddModal && (
                <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>Add New Employee</h2>
                            <button onClick={() => setShowAddModal(false)} className="btn-close">
                                <X size={18} />
                            </button>
                        </div>
                        <form onSubmit={handleAddEmployee}>
                            <div className="form-group">
                                <label>Employee ID</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.employee_id}
                                    onChange={(e) => setFormData({ ...formData, employee_id: e.target.value })}
                                    placeholder="EMP001"
                                />
                            </div>
                            <div className="form-group">
                                <label>Full Name</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="John Doe"
                                />
                            </div>
                            <div className="form-group">
                                <label>Email</label>
                                <input
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    placeholder="john@company.com"
                                />
                            </div>
                            <div className="form-group">
                                <label>Department</label>
                                <select
                                    value={formData.department_id}
                                    onChange={(e) => setFormData({ ...formData, department_id: parseInt(e.target.value) })}
                                >
                                    <option value={1}>Engineering</option>
                                    <option value={2}>HR</option>
                                    <option value={3}>Finance</option>
                                    <option value={4}>Marketing</option>
                                </select>
                            </div>
                            <div className="modal-actions">
                                <button type="button" onClick={() => setShowAddModal(false)} className="btn btn-outline">
                                    Cancel
                                </button>
                                <button type="submit" className="btn btn-primary">
                                    Add Employee
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Edit Employee Drawer */}
            {showEditModal && (
                <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>Edit Employee</h2>
                            <button onClick={() => setShowEditModal(false)} className="btn-close">
                                <X size={18} />
                            </button>
                        </div>
                        <form onSubmit={handleEditEmployee}>
                            <div className="form-group">
                                <label>Employee ID</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.employee_id}
                                    onChange={(e) => setFormData({ ...formData, employee_id: e.target.value })}
                                />
                            </div>
                            <div className="form-group">
                                <label>Full Name</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                            <div className="form-group">
                                <label>Email</label>
                                <input
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>
                            <div className="form-group">
                                <label>Department</label>
                                <select
                                    value={formData.department_id}
                                    onChange={(e) => setFormData({ ...formData, department_id: parseInt(e.target.value) })}
                                >
                                    <option value={1}>Engineering</option>
                                    <option value={2}>HR</option>
                                    <option value={3}>Finance</option>
                                    <option value={4}>Marketing</option>
                                </select>
                            </div>
                            <div className="modal-actions">
                                <button type="button" onClick={() => setShowEditModal(false)} className="btn btn-outline">
                                    Cancel
                                </button>
                                <button type="submit" className="btn btn-primary">
                                    Update Employee
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <div className="modal-overlay" onClick={() => setShowDeleteModal(false)}>
                    <div className="modal modal-sm" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>Confirm Delete</h2>
                            <button onClick={() => setShowDeleteModal(false)} className="btn-close">
                                <X size={18} />
                            </button>
                        </div>
                        <div className="modal-body">
                            <p>Are you sure you want to delete <strong>{selectedEmployee?.name}</strong>?</p>
                            <p className="text-warning">This action cannot be undone.</p>
                        </div>
                        <div className="modal-actions">
                            <button onClick={() => setShowDeleteModal(false)} className="btn btn-outline">
                                Cancel
                            </button>
                            <button onClick={handleDeleteEmployee} className="btn btn-danger">
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Employees;
