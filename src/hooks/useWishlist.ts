// src/hooks/useWishlist.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { wishlistApi } from '../api/wishlistApi';
import { WishlistItem } from '../types/product';
import { useAuthStore } from '../store/authStore';
import { useWishlistStore } from '../store/wishlistStore';

export interface UseWishlistResult {
  wishlist: WishlistItem[];
  wishlistProductIds: string[];
  isLoading: boolean;
  isInWishlist: (productId: string) => boolean;
  toggleWishlist: (productId: string) => void;
  addToWishlist: (productId: string) => void;
  removeFromWishlist: (productId: string) => void;
}

export const useWishlist = (): UseWishlistResult => {
  const queryClient = useQueryClient();
  const userId = useAuthStore((state) => state.user?.id);
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  
  // Local wishlist store for non-logged-in users
  const localWishlist = useWishlistStore((state) => state.wishlist);
  const addLocalWishlist = useWishlistStore((state) => state.addToWishlist);
  const removeLocalWishlist = useWishlistStore((state) => state.removeFromWishlist);

  // Fetch remote wishlist if logged in
  const {
    data: remoteWishlist = [],
    isLoading,
  } = useQuery({
    queryKey: ['wishlist', userId],
    queryFn: () => userId ? wishlistApi.getWishlist(userId) : [],
    enabled: isLoggedIn && !!userId,
  });

  // Add to wishlist mutation
  const addMutation = useMutation({
    mutationFn: (productId: string) => {
      if (!userId) return Promise.resolve({} as WishlistItem);
      return wishlistApi.addToWishlist(userId, productId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wishlist', userId] });
    },
  });

  // Remove from wishlist mutation
  const removeMutation = useMutation({
    mutationFn: async (productId: string) => {
      if (!userId) return;
      const wishlist = await wishlistApi.getWishlist(userId);
      const item = wishlist.find(w => w.productId === productId);
      if (item) {
        await wishlistApi.removeFromWishlist(item.id);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wishlist', userId] });
    },
  });

  const wishlist = isLoggedIn ? remoteWishlist : localWishlist;
  const wishlistProductIds = wishlist.map((w: WishlistItem) => w.productId);

  const isInWishlist = (productId: string): boolean => {
    return wishlistProductIds.includes(productId);
  };

  const addToWishlist = (productId: string) => {
    if (isLoggedIn) {
      addMutation.mutate(productId);
    } else {
      addLocalWishlist(productId);
    }
  };

  const removeFromWishlist = (productId: string) => {
    if (isLoggedIn) {
      removeMutation.mutate(productId);
    } else {
      removeLocalWishlist(productId);
    }
  };

  const toggleWishlist = (productId: string) => {
    if (isInWishlist(productId)) {
      removeFromWishlist(productId);
    } else {
      addToWishlist(productId);
    }
  };

  return {
    wishlist,
    wishlistProductIds,
    isLoading,
    isInWishlist,
    toggleWishlist,
    addToWishlist,
    removeFromWishlist,
  };
};
