// src/store/authStore.ts
import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Định nghĩa kiểu dữ liệu (Data Type) cho User
// Dựa trên "Hợp đồng dữ liệu" và API mock
type User = {
  id: string;
  name: string;
  phone: string;
  // Thêm các thông tin khác từ API /me nếu cần
};

// Định nghĩa kiểu dữ liệu cho State
type AuthState = {
  accessToken: string | null;
  user: User | null;
  isAuthenticated: boolean; // Trạng thái đã đăng nhập hay chưa
  isLoading: boolean;       // Trạng thái đang tải (dùng cho Splash screen)

  // Các hàm (actions) để thay đổi state
  login: (token: string, user: User) => Promise<void>;
  logout: () => Promise<void>;
  checkAuthStatus: () => Promise<void>; // Hàm này sẽ chạy khi mở app
};

export const useAuthStore = create<AuthState>((set: any) => ({
  accessToken: null,
  user: null,
  isAuthenticated: false,
  isLoading: true, // Ban đầu luôn là true

  // Hàm LƯU khi đăng nhập
  login: async (token: string, user: User) => {
    await AsyncStorage.setItem('accessToken', token);
    await AsyncStorage.setItem('user', JSON.stringify(user));
    set({ accessToken: token, user, isAuthenticated: true });
  },

  // Hàm XÓA khi đăng xuất
  logout: async () => {
    await AsyncStorage.removeItem('accessToken');
    await AsyncStorage.removeItem('user');
    set({ accessToken: null, user: null, isAuthenticated: false });
  },

  // Hàm KIỂM TRA khi mở app
  checkAuthStatus: async () => {
    try {
      const token = await AsyncStorage.getItem('accessToken');
      const userString = await AsyncStorage.getItem('user');

      if (token && userString) {
        set({
          accessToken: token,
          user: JSON.parse(userString),
          isAuthenticated: true,
          isLoading: false,
        });
      } else {
        // Không có token, coi như chưa đăng nhập
        set({ isLoading: false, isAuthenticated: false });
      }
    } catch (e) {
      // Lỗi thì cũng coi như chưa đăng nhập
      set({ isLoading: false, isAuthenticated: false });
    }
  },
}));