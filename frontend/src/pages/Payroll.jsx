import { useState } from 'react';
import { DollarSign, Calculator, CalendarDays } from 'lucide-react';
import './Payroll.css';

const Payroll = () => {
    const [formData, setFormData] = useState({
        employee_id: '',
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear(),
    });
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.employee_id) {
            alert('Please enter an Employee ID');
            return;
        }
        try {
            setLoading(true);
            setError(null);
            setResult(null);

            const response = await fetch('http://localhost:8000/payroll/calculate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || 'Calculation failed');
            }

            const data = await response.json();
            setResult(data);
        } catch (error) {
            console.error('Payroll error:', error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const months = [
        { value: 1, label: 'January' },
        { value: 2, label: 'February' },
        { value: 3, label: 'March' },
        { value: 4, label: 'April' },
        { value: 5, label: 'May' },
        { value: 6, label: 'June' },
        { value: 7, label: 'July' },
        { value: 8, label: 'August' },
        { value: 9, label: 'September' },
        { value: 10, label: 'October' },
        { value: 11, label: 'November' },
        { value: 12, label: 'December' },
    ];

    return (
        <div className="payroll-page stagger-enter">
            <div className="page-header">
                <div>
                    <h1>Payroll</h1>
                    <p>Calculate employee salary based on attendance</p>
                </div>
            </div>

            <div className="payroll-content">
                <div className="card">
                    <form onSubmit={handleSubmit} className="payroll-form">
                        <h3>
                            <Calculator size={18} />
                            Calculate Payroll
                        </h3>
                        <div className="form-group">
                            <label>Employee ID</label>
                            <input
                                type="text"
                                placeholder="EMP001"
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
                                    {months.map(m => (
                                        <option key={m.value} value={m.value}>{m.label}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Year</label>
                                <input
                                    type="number"
                                    value={formData.year}
                                    onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
                                />
                            </div>
                        </div>
                        <button type="submit" className="btn btn-primary" disabled={loading}>
                            <DollarSign size={18} />
                            {loading ? 'Calculating...' : 'Calculate Payroll'}
                        </button>
                    </form>
                </div>

                <div className="card result-card">
                    {error && (
                        <div className="error-banner">
                            <p>{error}</p>
                        </div>
                    )}

                    {result ? (
                        <>
                            <h3>
                                <CalendarDays size={18} />
                                Salary Breakdown
                            </h3>
                            <div className="result-details">
                                <div className="result-item">
                                    <span>Employee</span>
                                    <strong>{result.employee_name}</strong>
                                </div>
                                <div className="result-item">
                                    <span>Period</span>
                                    <strong>{months.find(m => m.value === formData.month)?.label} {formData.year}</strong>
                                </div>
                                <div className="result-item">
                                    <span>Working Days</span>
                                    <strong>{result.working_days} days</strong>
                                </div>
                                <div className="result-item">
                                    <span>Days Attended</span>
                                    <strong>{result.days_attended} days</strong>
                                </div>
                                <div className="result-item">
                                    <span>Base Salary</span>
                                    <strong>₹{(result.base_salary || 0).toLocaleString()}</strong>
                                </div>
                                <div className="result-item">
                                    <span>Deductions</span>
                                    <strong style={{ color: 'var(--error)' }}>
                                        -₹{(result.deductions || 0).toLocaleString()}
                                    </strong>
                                </div>
                                <div className="result-item total">
                                    <span>Net Pay</span>
                                    <strong>₹{(result.net_salary || 0).toLocaleString()}</strong>
                                </div>
                            </div>

                            {/* Breakdown Bar */}
                            {result.working_days > 0 && (
                                <div className="breakdown-bar-container">
                                    <div className="breakdown-bar">
                                        <div
                                            className="breakdown-worked"
                                            style={{ width: `${(result.days_attended / result.working_days) * 100}%` }}
                                        ></div>
                                    </div>
                                    <div className="breakdown-legend">
                                        <span><span className="legend-dot worked"></span> Worked ({result.days_attended})</span>
                                        <span><span className="legend-dot absent"></span> Absent ({result.working_days - result.days_attended})</span>
                                    </div>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="empty-result">
                            <DollarSign size={40} />
                            <h3>Payroll Calculation</h3>
                            <p>Enter employee details and calculate salary to see results here</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Payroll;
