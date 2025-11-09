// src/api/userApi.ts
import { useAuthStore } from '../store/authStore';
import client from './client';

// Kiểu dữ liệu (type) cho một địa chỉ
export type Address = {
  id: string;
  name: string;
  phone: string;
  fullAddress: string;
  isDefault: boolean;
};

/**
 * GỌI API THẬT: Cập nhật thông tin
 */
export const updateProfile = async (name: string, gender: string) => {
  const userId = useAuthStore.getState().user?.id;
  if (!userId) {
    throw new Error('Không tìm thấy user ID');
  }
  return client.put(`/users/${userId}`, { name, gender });
};

/**
 * GỌI API THẬT: Lấy danh sách địa chỉ
 */
export const getAddresses = async (): Promise<Address[]> => {
  const response = await client.get('/addresses');
  return response.data;
};

/**
 * GỌI API THẬT: Lấy danh sách thông báo
 */
export const getNotifications = async () => {
  const response = await client.get('/notifications');
  return response.data;
};