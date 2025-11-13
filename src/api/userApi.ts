// src/api/userApi.ts
import { useAuthStore } from '../store/authStore';
import client from './client';

// Kiểu dữ liệu (type) cho một địa chỉ
export type Address = {
  id: string;
  userId?: string; // User ID để filter địa chỉ theo user
  name: string;
  phone: string;
  fullAddress: string;
  isDefault: boolean;
};

/**
 * Kiểm tra xem user ID có phải là mock local không
 */
const isMockLocalUserId = (userId: string): boolean => {
  return userId.startsWith('user-mock-');
};

/**
 * GỌI API: Cập nhật thông tin profile
 * MockAPI endpoint: PUT /users/:id hoặc POST /users (nếu user chưa tồn tại)
 * Body: { name: string, gender: string, phone: string }
 */
export const updateProfile = async (name: string, gender: string) => {
  const currentUser = useAuthStore.getState().user;
  const userId = currentUser?.id;
  
  if (!userId) {
    throw new Error('Không tìm thấy user ID');
  }
  
  // Lấy thông tin phone từ user hiện tại để đảm bảo không mất dữ liệu
  const phone = currentUser?.phone || '';
  
  try {
    // Nếu user ID là mock local, tạo user mới trên MockAPI
    if (isMockLocalUserId(userId)) {
      console.log('[userApi] User is mock local, creating new user on MockAPI');
      
      try {
        // Tạo user mới trên MockAPI
        const createRes = await client.post('/users', {
          name,
          gender,
          phone,
        });
        
        console.log('[userApi] New user created in MockAPI:', createRes.data);
        
        // Trả về response với user mới
        return createRes;
      } catch (createError: any) {
        console.error('[userApi] Error creating user on MockAPI:', createError);
        // Nếu không tạo được trên MockAPI, chỉ cập nhật local
        // Trả về mock response để không break flow
        return {
          data: {
            id: userId,
            name,
            gender,
            phone,
          },
        };
      }
    }
    
    // User đã tồn tại trên MockAPI, cập nhật thông tin
    try {
      const response = await client.put(`/users/${userId}`, { 
        name, 
        gender,
        phone,
      });
      
      console.log('[userApi] Profile updated in MockAPI:', response.data);
      return response;
    } catch (updateError: any) {
      // Nếu user không tồn tại trên MockAPI (404), thử tạo mới
      if (updateError?.response?.status === 404) {
        console.log('[userApi] User not found on MockAPI, creating new user');
        
        try {
          const createRes = await client.post('/users', {
            name,
            gender,
            phone,
          });
          
          console.log('[userApi] New user created in MockAPI after 404:', createRes.data);
          return createRes;
        } catch (createError: any) {
          console.error('[userApi] Error creating user after 404:', createError);
          throw updateError; // Ném lại lỗi gốc
        }
      }
      
      // Ném lại error nếu không phải 404
      throw updateError;
    }
  } catch (error: any) {
    console.error('[userApi] Error updating profile:', error);
    console.error('[userApi] Error details:', error?.response?.data || error?.message);
    
    // Nếu MockAPI không khả dụng, vẫn trả về data để app có thể hoạt động
    // User sẽ được lưu vào AsyncStorage mà không cần MockAPI
    if (error?.response?.status === 404 || error?.code === 'ERR_NETWORK') {
      console.warn('[userApi] MockAPI unavailable, returning local data');
      return {
        data: {
          id: userId,
          name,
          gender,
          phone,
        },
      };
    }
    
    // Ném lại error để component có thể xử lý
    throw error;
  }
};

/**
 * GỌI API: Lấy danh sách địa chỉ của user hiện tại
 */
export const getAddresses = async (): Promise<Address[]> => {
  const userId = useAuthStore.getState().user?.id;
  
  try {
    if (userId) {
      // Lọc địa chỉ theo userId nếu MockAPI hỗ trợ
      const response = await client.get('/addresses', { params: { userId } });
      return Array.isArray(response.data) ? response.data : [];
    }
    
    // Nếu không có userId, trả về mảng rỗng
    return [];
  } catch (error: any) {
    // Nếu resource chưa tồn tại, trả về mảng rỗng
    if (error?.response?.status === 404) {
      console.log('[userApi] Addresses resource not found, returning empty array');
      return [];
    }
    console.error('[userApi] Error getting addresses:', error);
    throw error;
  }
};

/**
 * GỌI API: Tạo địa chỉ mới
 */
export const createAddress = async (data: Omit<Address, 'id'>): Promise<Address> => {
  const userId = useAuthStore.getState().user?.id;
  
  if (!userId) {
    throw new Error('Không tìm thấy user ID');
  }

  try {
    const response = await client.post('/addresses', {
      ...data,
      userId,
    });

    // Nếu đặt làm mặc định, bỏ mặc định của các địa chỉ khác
    if (data.isDefault && response.data.id) {
      await setDefaultAddress(userId, response.data.id);
      // Đảm bảo response có isDefault = true
      response.data.isDefault = true;
    }

    console.log('[userApi] Address created:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('[userApi] Error creating address:', error);
    throw error;
  }
};

/**
 * GỌI API: Cập nhật địa chỉ
 */
export const updateAddress = async (addressId: string, data: Partial<Address>): Promise<Address> => {
  const userId = useAuthStore.getState().user?.id;
  
  if (!userId) {
    throw new Error('Không tìm thấy user ID');
  }

  try {
    // Nếu đặt làm mặc định, bỏ mặc định của các địa chỉ khác
    if (data.isDefault) {
      await setDefaultAddress(userId, addressId);
    }

    const response = await client.put(`/addresses/${addressId}`, {
      ...data,
      userId,
    });

    console.log('[userApi] Address updated:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('[userApi] Error updating address:', error);
    throw error;
  }
};

/**
 * GỌI API: Xóa địa chỉ
 */
export const deleteAddress = async (addressId: string): Promise<void> => {
  try {
    await client.delete(`/addresses/${addressId}`);
    console.log('[userApi] Address deleted:', addressId);
  } catch (error: any) {
    console.error('[userApi] Error deleting address:', error);
    throw error;
  }
};

/**
 * Helper: Đặt địa chỉ mặc định (bỏ mặc định của các địa chỉ khác)
 */
const setDefaultAddress = async (userId: string, defaultAddressId: string | null): Promise<void> => {
  try {
    // Lấy tất cả địa chỉ của user
    const addresses = await getAddresses();
    
    if (!addresses || addresses.length === 0) {
      return;
    }
    
    // Cập nhật tất cả địa chỉ, bỏ mặc định nếu không phải địa chỉ được chọn
    const updatePromises = addresses
      .filter((addr) => addr.isDefault && addr.id !== defaultAddressId)
      .map((addr) => {
        const updatedAddr = { ...addr, isDefault: false };
        return client.put(`/addresses/${addr.id}`, updatedAddr).catch((err) => {
          console.warn(`[userApi] Error updating address ${addr.id}:`, err);
          return null;
        });
      });

    await Promise.all(updatePromises);
    
    // Nếu có địa chỉ được chọn làm mặc định, cập nhật nó
    if (defaultAddressId) {
      const defaultAddr = addresses.find((addr) => addr.id === defaultAddressId);
      if (defaultAddr && !defaultAddr.isDefault) {
        await client.put(`/addresses/${defaultAddressId}`, {
          ...defaultAddr,
          isDefault: true,
        }).catch((err) => {
          console.warn(`[userApi] Error setting default address ${defaultAddressId}:`, err);
        });
      }
    }
  } catch (error) {
    console.error('[userApi] Error setting default address:', error);
    // Không throw error để không ảnh hưởng đến flow chính
  }
};

/**
 * GỌI API: Lấy danh sách thông báo (từ orders)
 */
export const getNotifications = async () => {
  const userId = useAuthStore.getState().user?.id;
  
  if (!userId) {
    return [];
  }

  try {
    // Lấy danh sách đơn hàng của user
    const ordersResponse = await client.get('/orders', {
      params: { userId, sortBy: 'createdAt', order: 'desc', limit: 50 },
    });

    const orders = Array.isArray(ordersResponse.data) ? ordersResponse.data : [];

    // Tạo thông báo từ đơn hàng
    const notifications = orders.map((order: any) => {
      const statusText = getOrderStatusText(order.status);
      const statusEmoji = getOrderStatusEmoji(order.status);
      
      return {
        id: `order-${order.id}`,
        orderId: order.id,
        title: `${statusEmoji} Đơn hàng #${order.id.substring(0, 8)} - ${statusText}`,
        message: `Đơn hàng của bạn đang ${statusText.toLowerCase()}`,
        time: formatTime(order.createdAt),
        status: order.status,
        type: 'order',
      };
    });

    return notifications;
  } catch (error: any) {
    // Nếu resource chưa tồn tại, trả về mảng rỗng
    if (error?.response?.status === 404) {
      console.log('[userApi] Orders resource not found, returning empty notifications');
      return [];
    }
    console.error('[userApi] Error getting notifications:', error);
    return [];
  }
};

/**
 * Helper: Lấy text trạng thái đơn hàng
 */
const getOrderStatusText = (status: string): string => {
  switch (status) {
    case 'pending':
      return 'Đang xử lý';
    case 'completed':
      return 'Đã hoàn thành';
    case 'cancelled':
      return 'Đã hủy';
    default:
      return 'Đang xử lý';
  }
};

/**
 * Helper: Lấy emoji trạng thái đơn hàng
 */
const getOrderStatusEmoji = (status: string): string => {
  switch (status) {
    case 'pending':
      return '⏳';
    case 'completed':
      return '✅';
    case 'cancelled':
      return '❌';
    default:
      return '📦';
  }
};

/**
 * Helper: Format thời gian
 */
const formatTime = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (minutes < 1) return 'Vừa xong';
  if (minutes < 60) return `${minutes} phút trước`;
  if (hours < 24) return `${hours} giờ trước`;
  if (days < 7) return `${days} ngày trước`;
  
  return date.toLocaleDateString('vi-VN');
};