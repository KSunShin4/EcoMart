// src/hooks/useOrders.ts
import { useQuery } from '@tanstack/react-query';
import { orderApi } from '../api/orderApi';
import { useAuthStore } from '../store/authStore';

export const useOrders = () => {
    const userId = useAuthStore((state) => state.user?.id);

    return useQuery({
        queryKey: ['orders', userId],
        queryFn: () => {
            if (!userId) return []; // Không fetch nếu chưa đăng nhập
            return orderApi.getOrders(userId);
        },
        enabled: !!userId, // Chỉ bật query khi userId tồn tại
    });
};
export const useOrder = (orderId: string) => {
    return useQuery({
        // Query key phải có orderId để phân biệt các query
        queryKey: ['order', orderId],
        queryFn: () => orderApi.getOrderById(orderId),
        // Chỉ chạy query này khi orderId có giá trị
        enabled: !!orderId,
    });
};