import axios from 'axios';

// Get the base URL from environment or use default
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// Create axios instance
const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Handle auth errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// Auth API
export const authAPI = {
    login: (credentials) => {
        // Backend expects application/x-www-form-urlencoded
        const formData = new URLSearchParams();
        formData.append('username', credentials.username);
        formData.append('password', credentials.password);

        return api.post('/auth/login', formData, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        });
    },
    register: (data) => api.post('/auth/register', data),
    getProfile: () => api.get('/auth/me'),
};

// Employees API
export const employeesAPI = {
    getAll: () => api.get('/employees/list'),
    getById: (id) => api.get(`/employees/${id}`),
    update: (id, data) => api.put(`/employees/${id}`, data),
    delete: (id) => api.delete(`/employees/${id}`),
};

// Attendance API
export const attendanceAPI = {
    getToday: () => api.get('/attendance/today'),
    getHistory: (params) => api.get('/attendance/history', { params }),
    getByEmployee: (id, params) => api.get(`/attendance/employee/${id}`, { params }),
};

// Departments API
export const departmentsAPI = {
    getAll: () => api.get('/departments/'),
    getById: (id) => api.get(`/departments/${id}`),
    create: (data) => api.post('/departments/create', data),
    update: (id, data) => api.put(`/departments/${id}`, data),
    delete: (id) => api.delete(`/departments/${id}`),
};

// Payroll API
export const payrollAPI = {
    calculate: (data) => api.post('/payroll/calculate', data),
    calculateMonthly: (month, year) => api.post(`/payroll/calculate-monthly/${month}/${year}`),
    getSummary: () => api.get('/payroll/summary'),
    getByEmployee: (id) => api.get(`/payroll/employee/${id}`),
};

// Analytics API
export const analyticsAPI = {
    getDashboard: () => api.get('/analytics/dashboard'),
    getDepartment: (id) => api.get(`/analytics/department/${id}`),
    getTrends: (params) => api.get('/analytics/attendance-trends', { params }),
};

export default api;
