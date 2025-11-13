// src/api/client.ts
import axios from 'axios';
import { useAuthStore } from '../store/authStore';

/**
 * MockAPI Configuration
 * 
 * LƯU Ý: Để sử dụng MockAPI, bạn cần:
 * 1. Truy cập https://mockapi.io và tạo account
 * 2. Tạo một project mới
 * 3. Tạo resource có tên "users" với các fields:
 *    - name (string)
 *    - phone (string)
 *    - gender (string, optional)
 * 4. Lấy API endpoint và cập nhật MOCK_API_URL bên dưới
 * 
 * Hoặc MockAPI sẽ tự động tạo resource khi bạn POST lần đầu tiên.
 * Nếu gặp lỗi 404, có thể resource chưa được tạo - app sẽ tự động tạo khi cần.
 */
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