// src/api/orderApi.ts
import client from './client';
import { CartItem } from '../store/cartStore';

interface OrderPayload {
    userId: string;
    totalAmount: number;
    items: {
        productId: string;
        name: string;
        thumbnail: string;
        price: number;
        quantity: number;
    }[];
}
interface Order {
    id: string;
    userId: string;
    createdAt: string;
    totalAmount: number;
    status: 'pending' | 'completed' | 'cancelled';
    items: {
        productId: string;
        name: string;
        thumbnail: string;
        price: number;
        quantity: number;
    }[];

    shipping_address: string;
}

export const orderApi = {
    createOrder: async (payload: OrderPayload) => {
        const response = await client.post('/orders', {
            ...payload,
            createdAt: new Date().toISOString(),
            status: 'pending', // Mặc định đơn hàng mới có trạng thái "pending"
        });
        return response.data;
    },

    getOrders: async (userId: string) => {
        const response = await client.get('/orders', { params: { userId, sortBy: 'createdAt', order: 'desc' } });
        return response.data;
    },
    getOrderById: async (orderId: string): Promise<Order> => {
        const response = await client.get(`/orders/${orderId}`);
        return response.data;
    },
}