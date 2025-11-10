// src/api/client.ts
import axios from 'axios';
import { useAuthStore } from '../store/authStore';

// New MockAPI base URL requested by user
const MOCK_API_URL = 'https://6911ba757686c0e9c20ec2e8.mockapi.io/';

const client = axios.create({
  baseURL: MOCK_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

client.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().accessToken;
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default client;