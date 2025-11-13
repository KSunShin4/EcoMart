// src/store/authStore.ts
import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Định nghĩa kiểu dữ liệu (Data Type) cho User
// Dựa trên "Hợp đồng dữ liệu" và API mock
export type User = {
  id: string;
  name: string;
  phone: string;
  gender?: string; // Giới tính: 'Anh' hoặc 'Chị'
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
  setUser: (user: User) => void;
  checkAuthStatus: () => Promise<void>; // Hàm này sẽ chạy khi mở app
};

// DUMMY USER for development
const DUMMY_USER: User = {
  id: 'user_123',
  name: 'Phuong Tran',
  phone: '0123456789',
  gender: 'Anh',
};

const DUMMY_TOKEN = 'dummy_access_token_123';

export const useAuthStore = create<AuthState>((set: any) => ({
  // Initial state - sẽ được cập nhật bởi checkAuthStatus
  accessToken: null,
  user: null,
  isAuthenticated: false,
  isLoggedIn: false,
  isLoading: true, // Bắt đầu với loading = true, sẽ được set false sau khi checkAuthStatus

  // Hàm LƯU khi đăng nhập
  // Lưu thông tin user vào AsyncStorage và cập nhật store
  // Lưu ý: Thông tin user đã được lưu vào MockAPI trong authApi.verifyOTP
  login: async (token: string, user: User) => {
    try {
      // Lưu vào AsyncStorage để persist qua các lần mở app
      await AsyncStorage.setItem('accessToken', token);
      await AsyncStorage.setItem('user', JSON.stringify(user));
      
      // Cập nhật store
      set({ accessToken: token, user, isAuthenticated: true, isLoggedIn: true });
      
      console.log('[authStore] User logged in and saved to AsyncStorage:', user);
    } catch (error) {
      console.error('[authStore] Error saving login data to AsyncStorage:', error);
      // Vẫn cập nhật store ngay cả khi lưu AsyncStorage thất bại
      set({ accessToken: token, user, isAuthenticated: true, isLoggedIn: true });
    }
  },

  // Cập nhật user trong store (không chạm accessToken)
  setUser: (user: User) => {
    AsyncStorage.setItem('user', JSON.stringify(user)).catch(() => {});
    set({ user });
  },

  // Hàm XÓA khi đăng xuất
  logout: async () => {
    await AsyncStorage.removeItem('accessToken');
    await AsyncStorage.removeItem('user');
    set({ accessToken: null, user: null, isAuthenticated: false, isLoggedIn: false });
  },

  // Hàm KIỂM TRA khi mở app
  // Load thông tin đăng nhập từ AsyncStorage
  checkAuthStatus: async () => {
    set({ isLoading: true });
    
    try {
      const token = await AsyncStorage.getItem('accessToken');
      const userString = await AsyncStorage.getItem('user');

      if (token && userString) {
        // Có thông tin đăng nhập trong AsyncStorage
        const user = JSON.parse(userString);
        set({
          accessToken: token,
          user: user,
          isAuthenticated: true,
          isLoggedIn: true,
          isLoading: false,
        });
        console.log('[authStore] User loaded from AsyncStorage:', user);
      } else {
        // Không có token, coi như chưa đăng nhập
        set({ 
          accessToken: null,
          user: null,
          isLoading: false, 
          isAuthenticated: false, 
          isLoggedIn: false 
        });
        console.log('[authStore] No saved login data found');
      }
    } catch (e) {
      // Lỗi thì cũng coi như chưa đăng nhập
      console.error('[authStore] Error loading auth status:', e);
      set({ 
        accessToken: null,
        user: null,
        isLoading: false, 
        isAuthenticated: false, 
        isLoggedIn: false 
      });
    }
  },
}));