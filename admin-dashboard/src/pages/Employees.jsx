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
        <div className="employees-page">
            <div className="page-header">
                <div>
                    <h1>Employees Management</h1>
                    <p>Total Employees: {employees.length}</p>
                </div>
                <button onClick={() => setShowAddModal(true)} className="btn btn-primary">
                    <UserPlus size={20} />
                    Add Employee
                </button>
            </div>

            <div className="employees-controls">
                <div className="search-box">
                    <Search size={20} />
                    <input
                        type="text"
                        placeholder="Search by name, ID, or email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {filteredEmployees.length === 0 ? (
                <div className="card">
                    <p className="no-data">
                        {searchTerm ? 'No employees found matching your search.' : 'No employees registered yet.'}
                    </p>
                </div>
            ) : (
                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Employee ID</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Department</th>
                                <th>Face Registered</th>
                                <th>Joined Date</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredEmployees.map((employee) => (
                                <tr key={employee.id}>
                                    <td>
                                        <strong>{employee.employee_id}</strong>
                                    </td>
                                    <td>
                                        <div className="employee-name">
                                            {employee.name}
                                        </div>
                                    </td>
                                    <td>
                                        <div className="employee-email">
                                            <Mail size={16} />
                                            {employee.email}
                                        </div>
                                    </td>
                                    <td>
                                        <div className="employee-department">
                                            <Building2 size={16} />
                                            {employee.department?.name || 'Not Assigned'}
                                        </div>
                                    </td>
                                    <td>
                                        {employee.has_face_registered ? (
                                            <span className="badge badge-success">
                                                <UserCheck size={14} />
                                                Registered
                                            </span>
                                        ) : (
                                            <span className="badge badge-warning">
                                                <UserX size={14} />
                                                Pending
                                            </span>
                                        )}
                                    </td>
                                    <td>
                                        {new Date(employee.created_at).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'short',
                                            day: 'numeric',
                                        })}
                                    </td>
                                    <td>
                                        <div className="action-buttons">
                                            <button
                                                onClick={() => openEditModal(employee)}
                                                className="btn-icon btn-edit"
                                                title="Edit"
                                            >
                                                <Edit2 size={16} />
                                            </button>
                                            <button
                                                onClick={() => openDeleteModal(employee)}
                                                className="btn-icon btn-delete"
                                                title="Delete"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Add Employee Modal */}
            {showAddModal && (
                <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>Add New Employee</h2>
                            <button onClick={() => setShowAddModal(false)} className="btn-close">
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleAddEmployee}>
                            <div className="form-group">
                                <label>Employee ID *</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.employee_id}
                                    onChange={(e) => setFormData({ ...formData, employee_id: e.target.value })}
                                    placeholder="e.g., EMP001"
                                />
                            </div>
                            <div className="form-group">
                                <label>Full Name *</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="e.g., John Doe"
                                />
                            </div>
                            <div className="form-group">
                                <label>Email *</label>
                                <input
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    placeholder="e.g., john@company.com"
                                />
                            </div>
                            <div className="form-group">
                                <label>Department *</label>
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

            {/* Edit Employee Modal */}
            {showEditModal && (
                <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>Edit Employee</h2>
                            <button onClick={() => setShowEditModal(false)} className="btn-close">
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleEditEmployee}>
                            <div className="form-group">
                                <label>Employee ID *</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.employee_id}
                                    onChange={(e) => setFormData({ ...formData, employee_id: e.target.value })}
                                />
                            </div>
                            <div className="form-group">
                                <label>Full Name *</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                            <div className="form-group">
                                <label>Email *</label>
                                <input
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>
                            <div className="form-group">
                                <label>Department *</label>
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
                                <X size={20} />
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
