// src/services/departmentService.ts
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

export const getDepartments = async () => {
    const { data } = await axios.get(`${API_URL}/departments`);
    return data;
};

export const createDepartment = async (dept: { name: string; description: string }) => {
    const { data } = await axios.post(`${API_URL}/departments/`, dept);
    return data;
};

export const deleteDepartment = async (id: number) => {
    await axios.delete(`${API_URL}/departments/${id}/`);
};