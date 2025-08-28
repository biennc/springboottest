import axios from 'axios';
import { Employee, EmployeeCreateDTO, EmployeeUpdateDTO, ApiResponse } from './types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Important for CORS with credentials
  timeout: 10000, // 10 second timeout
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    console.log(`Making ${config.method?.toUpperCase()} request to ${config.url}`);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor with better error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('API Error:', error);
    
    // Handle different types of errors
    if (error.code === 'ERR_NETWORK') {
      console.error('Network Error: Cannot connect to server');
    } else if (error.response?.status === 0) {
      console.error('CORS Error: Check if backend allows cross-origin requests');
    } else if (error.response) {
      console.error('HTTP Error:', error.response.status, error.response.data);
    }
    
    return Promise.reject(error);
  }
);

export const employeeApi = {
  // Get all employees
  getAll: async (): Promise<Employee[]> => {
    const response = await api.get<ApiResponse<Employee[]>>('/employees');
    return response.data.data;
  },

  // Get employee by ID
  getById: async (id: number): Promise<Employee> => {
    const response = await api.get<ApiResponse<Employee>>(`/employees/${id}`);
    return response.data.data;
  },

  // Create new employee
  create: async (data: EmployeeCreateDTO): Promise<Employee> => {
    const response = await api.post<ApiResponse<Employee>>('/employees', data);
    return response.data.data;
  },

  // Update employee
  update: async (id: number, data: EmployeeUpdateDTO): Promise<Employee> => {
    const response = await api.put<ApiResponse<Employee>>(`/employees/${id}`, data);
    return response.data.data;
  },

  // Delete employee
  delete: async (id: number): Promise<void> => {
    await api.delete<ApiResponse<null>>(`/employees/${id}`);
  },
};