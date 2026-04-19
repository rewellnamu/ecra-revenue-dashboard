import axios from 'axios';

const BASE_URL = process.env.NODE_ENV === 'production'
  ? 'https://dashboard-backend-pxxr.onrender.com/api'
  : 'http://localhost:5000/api';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
});

// Dashboard 1
export const fetchRevenueReports = (filters = {}) => {
  return api.get('/dashboard1/reports', { params: filters });
};

export const fetchRevenueSummary = (filters = {}) => {
  return api.get('/dashboard1/summary', { params: filters });
};

// Dashboard 2
export const fetchWeeklyReports = (filters = {}) => {
  return api.get('/dashboard2/weekly', { params: filters });
};

export const fetchWeeklyTotals = (filters = {}) => {
  return api.get('/dashboard2/totals', { params: filters });
};

// Dashboard 3
export const fetchRevenueTargets = (filters = {}) => {
  return api.get('/dashboard3/targets', { params: filters });
};

// Sub Counties
export const fetchSubCounties = () => {
  return api.get('/sub-counties');
};

export default api;