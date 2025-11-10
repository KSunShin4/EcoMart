// src/api/client.ts
import axios from 'axios';
import { useAuthStore } from '../store/authStore';

const MOCK_API_URL = 'https://69105e2645e65ab24ac6b89c.mockapi.io';

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