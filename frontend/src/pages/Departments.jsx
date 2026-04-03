import { useState, useEffect } from 'react';
import { Building2, Users, Plus, X, Edit2, Trash2 } from 'lucide-react';
import './Departments.css';

const Departments = () => {
    const [departments, setDepartments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadDepartments();
    }, []);

    const loadDepartments = async () => {
        try {
            // In a real app, this would be an API call
            // const response = await departmentsAPI.getAll();
            // setDepartments(response.data);

            // Simulating API response based on provided file content
            setDepartments([
                { id: 1, name: 'Engineering', description: 'Core product development team', head: 'John Doe', count: 12 },
                { id: 2, name: 'Human Resources', description: 'People operations and recruiting', head: 'Jane Smith', count: 4 },
                { id: 3, name: 'Finance', description: 'Budgeting and payroll management', head: 'Robert Brown', count: 3 },
                { id: 4, name: 'Marketing', description: 'Brand and growth initiatives', head: 'Emily Davis', count: 6 },
            ]);
        } catch (error) {
            console.error('Failed to load departments:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="loading-container"><div className="spinner"></div><p>Loading departments...</p></div>;
    }

    return (
        <div className="departments-page stagger-enter">
            <div className="page-header">
                <div>
                    <h1>Departments</h1>
                    <p>Manage organizational units and teams</p>
                </div>
                <button className="btn btn-primary">
                    <Plus size={18} />
                    New Department
                </button>
            </div>

            <div className="departments-grid">
                {departments.map((dept) => (
                    <div key={dept.id} className="department-card card">
                        <div className="dept-header">
                            <div className="dept-icon-container">
                                <Building2 size={22} />
                            </div>
                            <div className="dept-actions">
                                <button className="btn-icon" title="Edit"><Edit2 size={14} /></button>
                                <button className="btn-icon" title="Delete"><Trash2 size={14} /></button>
                            </div>
                        </div>

                        <h3>{dept.name}</h3>
                        <p>{dept.description}</p>

                        <div className="dept-stats">
                            <div className="dept-stat-item">
                                <Users size={14} />
                                <span>{dept.count} Members</span>
                            </div>
                            <div className="dept-stat-item">
                                <span className="badge badge-info">Active</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {departments.length === 0 && (
                <div className="card">
                    <div className="empty-state">
                        <Building2 size={48} />
                        <h3>No Departments found</h3>
                        <p>Get started by creating your first department.</p>
                        <button className="btn btn-primary btn-sm" style={{ marginTop: '16px' }}>
                            <Plus size={16} /> Add Department
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Departments;
