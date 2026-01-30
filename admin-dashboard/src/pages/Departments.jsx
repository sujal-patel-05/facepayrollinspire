import { useState, useEffect } from 'react';
import './Departments.css';
import { Building2 } from 'lucide-react';
import { departmentsAPI } from '../services/api';

const Departments = () => {
    const [departments, setDepartments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadDepartments();
    }, []);

    const loadDepartments = async () => {
        try {
            const response = await departmentsAPI.getAll();
            setDepartments(response.data);
        } catch (error) {
            console.error('Failed to load departments:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="loading-container"><div className="spinner"></div></div>;
    }

    return (
        <div className="departments-page">
            <div className="page-header">
                <div>
                    <h1>Departments</h1>
                    <p>Manage organizational units</p>
                </div>
            </div>

            <div className="departments-grid">
                {departments.map((dept) => (
                    <div key={dept.id} className="department-card card">
                        <div className="dept-icon gradient-bg">
                            <Building2 size={24} color="white" />
                        </div>
                        <h3>{dept.name}</h3>
                        <p>{dept.description}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Departments;
