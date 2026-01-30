import { useState } from 'react';
import './Payroll.css';
import { DollarSign, Calculator } from 'lucide-react';
import { payrollAPI } from '../services/api';

const Payroll = () => {
    const [formData, setFormData] = useState({
        employee_id: '',
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear(),
        per_day_salary: 1000,
    });
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await payrollAPI.calculate(formData);
            setResult(response.data);
        } catch (error) {
            console.error('Failed to calculate payroll:', error);
            alert('Failed to calculate payroll');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="payroll-page">
            <div className="page-header">
                <div>
                    <h1>Payroll</h1>
                    <p>Calculate employee salaries</p>
                </div>
            </div>

            <div className="payroll-content">
                <div className="card">
                    <h3>
                        <Calculator size={20} />
                        Calculate Payroll
                    </h3>
                    <form onSubmit={handleSubmit} className="payroll-form">
                        <div className="form-group">
                            <label>Employee ID</label>
                            <input
                                type="number"
                                value={formData.employee_id}
                                onChange={(e) => setFormData({ ...formData, employee_id: e.target.value })}
                                required
                            />
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label>Month</label>
                                <select
                                    value={formData.month}
                                    onChange={(e) => setFormData({ ...formData, month: parseInt(e.target.value) })}
                                >
                                    {Array.from({ length: 12 }, (_, i) => (
                                        <option key={i + 1} value={i + 1}>
                                            {new Date(2000, i).toLocaleString('default', { month: 'long' })}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Year</label>
                                <input
                                    type="number"
                                    value={formData.year}
                                    onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
                                    required
                                />
                            </div>
                        </div>
                        <div className="form-group">
                            <label>Per Day Salary (₹)</label>
                            <input
                                type="number"
                                value={formData.per_day_salary}
                                onChange={(e) => setFormData({ ...formData, per_day_salary: parseInt(e.target.value) })}
                                required
                            />
                        </div>
                        <button type="submit" className="btn btn-primary" disabled={loading}>
                            {loading ? <div className="spinner"></div> : 'Calculate Salary'}
                        </button>
                    </form>
                </div>

                {result && (
                    <div className="card result-card">
                        <h3>
                            <DollarSign size={20} />
                            Payroll Result
                        </h3>
                        <div className="result-details">
                            <div className="result-item">
                                <span>Employee</span>
                                <strong>{result.employee_name}</strong>
                            </div>
                            <div className="result-item">
                                <span>Present Days</span>
                                <strong>{result.present_days}</strong>
                            </div>
                            <div className="result-item">
                                <span>Per Day Salary</span>
                                <strong>₹{result.per_day_salary}</strong>
                            </div>
                            <div className="result-item total">
                                <span>Total Salary</span>
                                <strong>₹{result.total_salary}</strong>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Payroll;
