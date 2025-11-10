// src/hooks/useOrders.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
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
export const useUpdateOrderStatus = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ orderId, status }: { orderId: string; status: 'completed' | 'cancelled' }) =>
            orderApi.updateOrderStatus(orderId, status),

        onSuccess: (updatedOrder) => {
            // Khi cập nhật thành công, vô hiệu hóa (invalidate) cache để React Query tự động fetch lại dữ liệu mới.

            // 1. Invalidate cache cho chi tiết đơn hàng này.
            queryClient.invalidateQueries({ queryKey: ['order', updatedOrder.id] });

            // 2. Invalidate cache cho toàn bộ danh sách đơn hàng.
            const userId = useAuthStore.getState().user?.id;
            queryClient.invalidateQueries({ queryKey: ['orders', userId] });
        },
    });

}

