import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

export const getDashboardStats = async () => {
  const { data } = await axios.get(`${API_URL}/dashboard/stats`);
  return data; // Expected: { totalEmployees: 124, presentToday: 110, onLeave: 12, pending: 2 }
};

export const getRecentAttendance = async () => {
  const { data } = await axios.get(`${API_URL}/attendance/recent`);
  return data; // Expected: Array of recent logs
};

export const getDeptDistribution = async () => {
  const { data } = await axios.get(`${API_URL}/departments/stats`);
  return data; // Expected: [{ name: 'Engineering', count: 65, total: 100 }, ...]
};