import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

export const getEmployeeById = async (id: string) => {
  const { data } = await axios.get(`${API_URL}/employees/${id}`);
  return data;
};

export const getEmployeeAttendance = async (id: string) => {
  const { data } = await axios.get(`${API_URL}/attendance/${id}/`);
  return data; // Expected: [{ date: '2023-10-01', status: 'Present', checkIn: '09:00' }, ...]
};

export const updateAttendanceStatus = async (logId: string, newStatus: string) => {
  const { data } = await axios.patch(`${API_URL}/attendance/${logId}`, { status: newStatus });
  return data;
};