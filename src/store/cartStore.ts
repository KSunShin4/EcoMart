// src/store/cartStore.ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Product } from '../types/product';

export interface CartItem {
    product: Product;
    quantity: number;
}

interface CartState {
    items: CartItem[];
    totalItems: number;
    totalPrice: number;
    addToCart: (product: Product) => void;
    removeFromCart: (productId: string) => void;
    updateQuantity: (productId: string, quantity: number) => void;
    clearCart: () => void;
}

export const useCartStore = create<CartState>()(
    persist(
        (set, get) => ({
            items: [],
            totalItems: 0,
            totalPrice: 0,

            addToCart: (product) => {
                const items = get().items;
                const existingItem = items.find((item) => item.product.id === product.id);

                let updatedItems: CartItem[];
                if (existingItem) {
                    // Tăng số lượng nếu sản phẩm đã có trong giỏ
                    updatedItems = items.map((item) =>
                        item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
                    );
                } else {
                    // Thêm sản phẩm mới
                    updatedItems = [...items, { product, quantity: 1 }];
                }
                set({ items: updatedItems });
                get()._recalculateTotals();
            },

            removeFromCart: (productId) => {
                const updatedItems = get().items.filter((item) => item.product.id !== productId);
                set({ items: updatedItems });
                get()._recalculateTotals();
            },

            updateQuantity: (productId, quantity) => {
                if (quantity <= 0) {
                    get().removeFromCart(productId);
                    return;
                }
                const updatedItems = get().items.map((item) =>
                    item.product.id === productId ? { ...item, quantity } : item
                );
                set({ items: updatedItems });
                get()._recalculateTotals();
            },

            clearCart: () => {
                set({ items: [], totalItems: 0, totalPrice: 0 });
            },

            // Hàm nội bộ để tính toán lại tổng số lượng và giá tiền
            _recalculateTotals: () => {
                const items = get().items;
                const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
                const totalPrice = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
                set({ totalItems, totalPrice });
            },
        }),
        {
            name: 'cart-storage',
            storage: createJSONStorage(() => AsyncStorage),
            // Cần thêm hàm _recalculateTotals vào onRehydrate để đảm bảo state đúng khi load lại
            onRehydrateStorage: (state) => {
                return (state, error) => {
                    if (state) {
                        state._recalculateTotals();
                    }
                };
            },
        }
    )
);