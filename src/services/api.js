import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api';

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

export default api;