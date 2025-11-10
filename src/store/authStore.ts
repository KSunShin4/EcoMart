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
export type AuthState = {
  accessToken: string | null;
  user: User | null;
  isAuthenticated: boolean; // Trạng thái đã đăng nhập hay chưa
  isLoggedIn: boolean; // Alias for isAuthenticated
  isLoading: boolean;       // Trạng thái đang tải (dùng cho Splash screen)

  // Các hàm (actions) để thay đổi state
  login: (token: string, user: User) => Promise<void>;
  logout: () => Promise<void>;
  checkAuthStatus: () => Promise<void>; // Hàm này sẽ chạy khi mở app
};

// DUMMY USER for development
const DUMMY_USER: User = {
  id: 'user_123',
  name: 'Phuong Tran',
  phone: '0123456789',
};

const DUMMY_TOKEN = 'dummy_access_token_123';

export const useAuthStore = create<AuthState>((set: any) => ({
  // Set dummy user as logged in by default for development
  accessToken: DUMMY_TOKEN,
  user: DUMMY_USER,
  isAuthenticated: true,
  isLoggedIn: true,
  isLoading: false, // Skip loading since we have dummy user

  // Hàm LƯU khi đăng nhập
  login: async (token: string, user: User) => {
    await AsyncStorage.setItem('accessToken', token);
    await AsyncStorage.setItem('user', JSON.stringify(user));
    set({ accessToken: token, user, isAuthenticated: true, isLoggedIn: true });
  },

  // Hàm XÓA khi đăng xuất
  logout: async () => {
    await AsyncStorage.removeItem('accessToken');
    await AsyncStorage.removeItem('user');
    set({ accessToken: null, user: null, isAuthenticated: false, isLoggedIn: false });
  },

  // Hàm KIỂM TRA khi mở app
  checkAuthStatus: async () => {
    // For development, keep dummy user logged in
    // Comment out this block to use real auth
    set({
      accessToken: DUMMY_TOKEN,
      user: DUMMY_USER,
      isAuthenticated: true,
      isLoggedIn: true,
      isLoading: false,
    });
    
    try {
      const token = await AsyncStorage.getItem('accessToken');
      const userString = await AsyncStorage.getItem('user');

      if (token && userString) {
        set({
          accessToken: token,
          user: JSON.parse(userString),
          isAuthenticated: true,
          isLoggedIn: true,
          isLoading: false,
        });
      } else {
        // Không có token, coi như chưa đăng nhập
        set({ isLoading: false, isAuthenticated: false, isLoggedIn: false });
      }
    } catch (e) {
      // Lỗi thì cũng coi như chưa đăng nhập
      set({ isLoading: false, isAuthenticated: false, isLoggedIn: false });
    }
  },
}));