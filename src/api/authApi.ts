// src/api/authApi.ts
// src/api/authApi.ts
// Mock auth API cho development: Mockpapi không hỗ trợ flow OTP đầy đủ,
// nên ở môi trường dev chúng ta giả lập behavior ở client.

import client from './client';

/**
 * Yêu cầu gửi OTP (mock): chỉ giả lập delay và log
 */
export const requestLoginOTP = async (phone: string): Promise<void> => {
  // Nếu bạn muốn vẫn gọi backend thật (nếu có), uncomment dòng bên dưới
  // return client.post('/auth/request-otp', { phone });

  await new Promise((res) => setTimeout(res, 400));
  console.log('[mock] requestLoginOTP for', phone);
  return;
};

/**
 * Xác thực OTP (mock): chấp nhận mã '123456' trả về token + user mẫu
 */
export const verifyOTP = async (
  phone: string,
  otp: string
): Promise<{ data: { accessToken: string; user: { id: string; name: string; phone: string } } }> => {
  // Khi tích hợp vào backend, thay implementation bằng client.post
  await new Promise((res) => setTimeout(res, 500));

  if (otp !== '123456') {
    throw new Error('Mã OTP không đúng');
  }

  try {
    // Tìm user trên MockAPI theo phone (MockAPI hỗ trợ query param)
    const searchRes = await client.get('/users', { params: { phone } });
    let user: any = null;

    if (Array.isArray(searchRes.data) && searchRes.data.length > 0) {
      user = searchRes.data[0];
      // Đồng bộ tên thành "Nhóm 5" nếu khác (tuỳ chọn)
      if (user.name !== 'Nhóm 5') {
        try {
          const upd = await client.put(`/users/${user.id}`, { ...user, name: 'Nhóm 5' });
          user = upd.data;
        } catch (e) {
          // nếu update thất bại, giữ user hiện tại
          console.warn('[authApi] unable to update user name', e);
        }
      }
    } else {
      // Tạo user mới trên MockAPI
      const createRes = await client.post('/users', { name: 'Nhóm 5', phone });
      user = createRes.data;
    }

    return {
      data: {
        accessToken: 'mock-token-123456',
        user: { id: String(user.id), name: user.name ?? 'Nhóm 5', phone: user.phone ?? phone },
      },
    };
  } catch (err) {
    // Nếu có lỗi mạng với MockAPI, fallback về mock local (không persist)
    console.warn('[authApi] MockAPI unavailable, falling back to local mock user', err);
    return {
      data: {
        accessToken: 'mock-token-123456',
        user: { id: 'user-mock-1', name: 'Nhóm 5', phone },
      },
    };
  }
};