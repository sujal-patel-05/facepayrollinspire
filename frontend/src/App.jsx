import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useState, useEffect } from 'react';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import AdminDashboard from './components/AdminDashboard';
import EmployeeManagement from './components/EmployeeManagement';
import AttendanceMonitor from './components/AttendanceMonitor';
import PayrollManagement from './components/PayrollManagement';
import Analytics from './components/Analytics';
import EmployeeDashboard from './components/EmployeeDashboard';

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        setIsAuthenticated(!!token);
        setIsLoading(false);
    }, []);

    if (isLoading) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh'
            }}>
                <div className="spinner"></div>
            </div>
        );
    }

    return (
        <>
            <BrowserRouter>
                <Routes>
                    <Route
                        path="/login"
                        element={
                            isAuthenticated ?
                                <Navigate to="/dashboard" /> :
                                <Login setIsAuthenticated={setIsAuthenticated} />
                        }
                    />
                    <Route
                        path="/dashboard/*"
                        element={
                            isAuthenticated ?
                                <Dashboard setIsAuthenticated={setIsAuthenticated} /> :
                                <Navigate to="/login" />
                        }
                    >
                        <Route index element={<AdminDashboard />} />
                        <Route path="employees" element={<EmployeeManagement />} />
                        <Route path="attendance" element={<AttendanceMonitor />} />
                        <Route path="payroll" element={<PayrollManagement />} />
                        <Route path="analytics" element={<Analytics />} />
                        <Route path="employee/:id" element={<EmployeeDashboard />} />
                    </Route>
                    <Route path="/" element={<Navigate to="/dashboard" />} />
                </Routes>
            </BrowserRouter>
            <Toaster position="top-right" />
        </>
    );
}

export default App;
