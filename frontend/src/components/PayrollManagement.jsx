import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { payrollAPI } from '../utils/api';

function PayrollManagement() {
    const [payrolls, setPayrolls] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadPayroll();
    }, []);

    const loadPayroll = async () => {
        try {
            const res = await payrollAPI.summary();
            setPayrolls(res.data);
        } catch (error) {
            toast.error('Failed to load payroll');
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) return <div className="loading-container"><div className="spinner"></div></div>;

    return (
        <div>
            <div className="page-header">
                <h1>Payroll Management</h1>
                <p>Manage employee payroll</p>
            </div>
            <div className="card">
                <table className="table">
                    <thead>
                        <tr>
                            <th>Employee</th>
                            <th>Month/Year</th>
                            <th>Present Days</th>
                            <th>Total Days</th>
                            <th>Per Day Salary</th>
                            <th>Total Salary</th>
                        </tr>
                    </thead>
                    <tbody>
                        {payrolls.map((payroll) => (
                            <tr key={payroll.id}>
                                <td>{payroll.employee?.name}</td>
                                <td>{payroll.month}/{payroll.year}</td>
                                <td>{payroll.present_days}</td>
                                <td>{payroll.total_days}</td>
                                <td>${payroll.per_day_salary}</td>
                                <td><strong>${payroll.total_salary.toFixed(2)}</strong></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default PayrollManagement;
