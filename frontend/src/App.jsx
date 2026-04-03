import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import Employees from './pages/Employees';
import Attendance from './pages/Attendance';
import Departments from './pages/Departments';
import Payroll from './pages/Payroll';
import Analytics from './pages/Analytics';
import './styles/global.css';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                {/* Redirect root to dashboard */}
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="/login" element={<Navigate to="/dashboard" replace />} />

                {/* All pages directly accessible without login */}
                <Route
                    path="/dashboard"
                    element={
                        <Layout>
                            <Dashboard />
                        </Layout>
                    }
                />
                <Route
                    path="/employees"
                    element={
                        <Layout>
                            <Employees />
                        </Layout>
                    }
                />
                <Route
                    path="/attendance"
                    element={
                        <Layout>
                            <Attendance />
                        </Layout>
                    }
                />
                <Route
                    path="/departments"
                    element={
                        <Layout>
                            <Departments />
                        </Layout>
                    }
                />
                <Route
                    path="/payroll"
                    element={
                        <Layout>
                            <Payroll />
                        </Layout>
                    }
                />
                <Route
                    path="/analytics"
                    element={
                        <Layout>
                            <Analytics />
                        </Layout>
                    }
                />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
