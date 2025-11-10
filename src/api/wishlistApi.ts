// src/api/wishlistApi.ts
import client from './client';
import { WishlistItem } from '../types/product';

export const wishlistApi = {
  // Get user's wishlist
  getWishlist: async (userId: string): Promise<WishlistItem[]> => {
    const response = await client.get<WishlistItem[]>('/wishlist', {
      params: { userId },
    });
    return response.data;
  },

  // Add to wishlist
  addToWishlist: async (userId: string, productId: string): Promise<WishlistItem> => {
    const response = await client.post<WishlistItem>('/wishlist', {
      userId,
      productId,
      createdAt: new Date().toISOString(),
    });
    return response.data;
  },

  // Remove from wishlist
  removeFromWishlist: async (id: string): Promise<void> => {
    await client.delete(`/wishlist/${id}`);
  },

  // Check if product is in wishlist
  isInWishlist: async (userId: string, productId: string): Promise<boolean> => {
    const response = await client.get<WishlistItem[]>('/wishlist', {
      params: { userId, productId },
    });
    return response.data.length > 0;
  },
};
