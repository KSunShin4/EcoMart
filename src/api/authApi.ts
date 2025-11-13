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
 * Xác thực OTP và lưu thông tin đăng nhập vào MockAPI
 * Chấp nhận mã '123456' trả về token + user
 */
export const verifyOTP = async (
  phone: string,
  otp: string
): Promise<{ data: { accessToken: string; user: { id: string; name: string; phone: string; gender?: string } } }> => {
  // Nếu muốn tích hợp backend thật, thay implementation bằng client.post
  await new Promise((res) => setTimeout(res, 500));

  if (otp !== '123456') {
    throw new Error('Mã OTP không đúng');
  }

  try {
    let user: any = null;
    
    // Tìm user trên MockAPI theo phone (MockAPI hỗ trợ query param)
    try {
      const searchRes = await client.get('/users', { params: { phone } });
      
      if (Array.isArray(searchRes.data) && searchRes.data.length > 0) {
        // User đã tồn tại - lấy thông tin hiện tại từ MockAPI
        user = searchRes.data[0];
        console.log('[authApi] User found in MockAPI:', user);
      }
    } catch (searchError: any) {
      // Nếu lỗi 404, có thể resource chưa được tạo, sẽ thử tạo user mới
      if (searchError?.response?.status !== 404) {
        console.warn('[authApi] Error searching user:', searchError);
      }
    }
    
    // Nếu không tìm thấy user, tạo user mới
    if (!user) {
      try {
        const userData: any = {
          name: 'Nhóm 5', // Tên mặc định cho user mới
          phone: phone,
          // gender sẽ được thêm sau khi user chỉnh sửa profile
        };
        
        const createRes = await client.post('/users', userData);
        user = createRes.data;
        console.log('[authApi] New user created in MockAPI:', user);
      } catch (createError: any) {
        // Nếu không tạo được user (có thể do MockAPI chưa có resource /users)
        console.warn('[authApi] Cannot create user on MockAPI:', createError);
        console.error('[authApi] Create error details:', createError?.response?.data || createError?.message);
        
        // Fallback về mock local
        throw createError;
      }
    }

    // Trả về user với đầy đủ thông tin
    const userResponse = {
      id: String(user.id),
      name: user.name || 'Nhóm 5',
      phone: user.phone || phone,
      ...(user.gender && { gender: user.gender }),
    };

    return {
      data: {
        accessToken: 'mock-token-123456',
        user: userResponse,
      },
    };
  } catch (err: any) {
    // Nếu có lỗi với MockAPI, fallback về mock local (không persist)
    console.warn('[authApi] MockAPI unavailable, falling back to local mock user', err);
    console.error('[authApi] Error details:', err?.response?.data || err?.message);
    
    // Lưu ý: User với ID mock local sẽ được tạo trên MockAPI khi update profile
    return {
      data: {
        accessToken: 'mock-token-123456',
        user: { 
          id: `user-mock-${Date.now()}`, // Dùng timestamp để unique
          name: 'Nhóm 5', 
          phone,
          // Không có gender vì đây là mock local, sẽ được thêm khi update profile
        },
      },
    };
  }
};