import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add token to requests
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Auth API
export const authAPI = {
    login: (username, password) =>
        api.post('/auth/login', new URLSearchParams({ username, password }), {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }),
    register: (data) => api.post('/auth/register', data),
    getMe: () => api.get('/auth/me'),
};

// Departments API
export const departmentsAPI = {
    list: () => api.get('/departments/list'),
    create: (data) => api.post('/departments/create', data),
    update: (id, data) => api.put(`/departments/${id}`, data),
};

// Employees API
export const employeesAPI = {
    list: () => api.get('/employees/list'),
    get: (id) => api.get(`/employees/${id}`),
    update: (id, data) => api.put(`/employees/${id}`, data),
    delete: (id) => api.delete(`/employees/${id}`),
};

// Attendance API
export const attendanceAPI = {
    history: (params) => api.get('/attendance/history', { params }),
    today: () => api.get('/attendance/today'),
    employee: (id, params) => api.get(`/attendance/employee/${id}`, { params }),
};

// Payroll API
export const payrollAPI = {
    calculate: (data) => api.post('/payroll/calculate', data),
    calculateMonthly: (month, year, perDaySalary) =>
        api.post(`/payroll/calculate-monthly/${month}/${year}?per_day_salary=${perDaySalary}`),
    summary: (params) => api.get('/payroll/summary', { params }),
    employee: (id) => api.get(`/payroll/employee/${id}`),
};

// Analytics API
export const analyticsAPI = {
    dashboard: () => api.get('/analytics/dashboard'),
    departmentWise: (params) => api.get('/analytics/department-wise', { params }),
    monthlyTrends: (months) => api.get(`/analytics/monthly-trends?months=${months}`),
    absenteeism: (params) => api.get('/analytics/absenteeism', { params }),
    topPerformers: (params) => api.get('/analytics/top-performers', { params }),
};

export default api;
