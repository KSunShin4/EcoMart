// src/api/authApi.ts
import client from './client';

/**
 * GỌI API THẬT: Gửi yêu cầu OTP
 */
export const requestLoginOTP = async (phone: string) => {
  return client.post('/auth/request-otp', { phone });
};

/**
 * GỌI API THẬT: Xác thực OTP
 */
export const verifyOTP = async (phone: string, otp: string) => {
  // Đảm bảo endpoint '/auth/login' trên MockAPI
  // trả về đúng cấu trúc { data: { accessToken, user } }
  return client.post('/auth/login', { phone, otp });
};