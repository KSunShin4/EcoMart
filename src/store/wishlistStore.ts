// src/store/wishlistStore.ts
import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { WishlistItem } from '../types/product';

interface WishlistState {
  wishlist: WishlistItem[];
  isLoading: boolean;
  
  addToWishlist: (productId: string) => void;
  removeFromWishlist: (productId: string) => void;
  clearWishlist: () => void;
  syncWishlist: (remoteWishlist: WishlistItem[]) => void;
  loadWishlist: () => Promise<void>;
}

const WISHLIST_STORAGE_KEY = '@wishlist';

export const useWishlistStore = create<WishlistState>((set, get) => ({
  wishlist: [],
  isLoading: false,

  addToWishlist: (productId: string) => {
    const newItem: WishlistItem = {
      id: `local_${Date.now()}`,
      userId: 'local',
      productId,
      createdAt: new Date().toISOString(),
    };

    const updatedWishlist = [...get().wishlist, newItem];
    set({ wishlist: updatedWishlist });
    AsyncStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(updatedWishlist));
  },

  removeFromWishlist: (productId: string) => {
    const updatedWishlist = get().wishlist.filter(
      (item) => item.productId !== productId
    );
    set({ wishlist: updatedWishlist });
    AsyncStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(updatedWishlist));
  },

  clearWishlist: () => {
    set({ wishlist: [] });
    AsyncStorage.removeItem(WISHLIST_STORAGE_KEY);
  },

  syncWishlist: (remoteWishlist: WishlistItem[]) => {
    // Merge local and remote wishlist when user logs in
    const localWishlist = get().wishlist;
    const localProductIds = localWishlist.map((item) => item.productId);
    
    // Keep remote items and add local items that don't exist remotely
    const merged = [
      ...remoteWishlist,
      ...localWishlist.filter(
        (item) => !remoteWishlist.some((r) => r.productId === item.productId)
      ),
    ];
    
    set({ wishlist: merged });
    AsyncStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(merged));
  },

  loadWishlist: async () => {
    try {
      set({ isLoading: true });
      const stored = await AsyncStorage.getItem(WISHLIST_STORAGE_KEY);
      if (stored) {
        set({ wishlist: JSON.parse(stored) });
      }
    } catch (error) {
      console.error('Error loading wishlist:', error);
    } finally {
      set({ isLoading: false });
    }
  },
}));
