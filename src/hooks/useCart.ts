// src/hooks/useCart.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useCartStore } from '../store/cartStore';
import { useAuthStore } from '../store/authStore';
import { orderApi } from '../api/orderApi';
import { Alert } from 'react-native';

export const useCart = () => {
    const queryClient = useQueryClient();
    const { items, totalItems, totalPrice, addToCart, removeFromCart, updateQuantity, clearCart } =
        useCartStore();

    const user = useAuthStore((state) => state.user);

    // Mutation để thực hiện "Đặt hàng"
    const checkoutMutation = useMutation({
        mutationFn: async () => {
            if (!user) throw new Error('Bạn cần đăng nhập để đặt hàng.');
            if (items.length === 0) throw new Error('Giỏ hàng trống.');

            const payload = {
                userId: user.id,
                totalAmount: totalPrice,
                items: items.map(item => ({
                    productId: item.product.id,
                    name: item.product.name,
                    thumbnail: item.product.thumbnail,
                    price: item.product.price,
                    quantity: item.quantity,
                })),
            };
            return orderApi.createOrder(payload);
        },
        onSuccess: () => {
            // Đặt hàng thành công
            Alert.alert('Thành công', 'Đơn hàng của bạn đã được tạo.');
            // Xoá giỏ hàng
            clearCart();
            // Vô hiệu hóa cache của 'orders' để màn hình Lịch sử đơn hàng fetch lại
            queryClient.invalidateQueries({ queryKey: ['orders'] });
        },
        onError: (error: any) => {
            Alert.alert('Lỗi', error.message || 'Đã có lỗi xảy ra khi đặt hàng.');
        },
    });

    return {
        cartItems: items,
        totalItems,
        totalPrice,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        checkout: checkoutMutation.mutate,
        isCheckingOut: checkoutMutation.isPending,
    };
};