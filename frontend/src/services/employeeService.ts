import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

export const getEmployees = async () => {
  const { data } = await axios.get(`${API_URL}/employees`);
  // Ensure we return the array (check if your API wraps it in { employees: [] })
  return data;
};

export const createEmployee = async (employee: { name: string; email: string; dept: string }) => {
  const { data } = await axios.post(`${API_URL}/employees/`, employee);
  return data;
};

export const deleteEmployee = async (id: string) => {
  await axios.delete(`${API_URL}/employees/${id}/`);
};