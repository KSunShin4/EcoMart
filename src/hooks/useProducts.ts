// src/hooks/useProducts.ts
import { useInfiniteQuery, useQuery, UseQueryResult } from '@tanstack/react-query';
import { productApi } from '../api/productApi';
import {
  Product,
  ProductFilters,
  ProductSort,
  ProductListResponse,
} from '../types/product';

export interface UseProductsParams {
  filters?: ProductFilters;
  sort?: ProductSort;
  limit?: number;
  enabled?: boolean;
}

export interface UseProductsResult {
  products: Product[];
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  hasNextPage: boolean;
  fetchNextPage: () => void;
  isFetchingNextPage: boolean;
  refetch: () => void;
}

export const useProducts = ({
  filters = {},
  sort,
  limit = 10,
  enabled = true,
}: UseProductsParams = {}): UseProductsResult => {
  const {
    data,
    isLoading,
    isError,
    error,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    refetch,
  } = useInfiniteQuery({
    queryKey: ['products', filters, sort, limit],
    queryFn: ({ pageParam = 1 }) =>
      productApi.getProducts(filters, sort, { page: pageParam, limit }),
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.hasMore ? allPages.length + 1 : undefined;
    },
    initialPageParam: 1,
    enabled,
  });

  const products = data?.pages.flatMap(page => page.products) ?? [];

  return {
    products,
    isLoading,
    isError,
    error: error as Error | null,
    hasNextPage: hasNextPage ?? false,
    fetchNextPage,
    isFetchingNextPage,
    refetch,
  };
};

export const useProduct = (id: string): UseQueryResult<Product, Error> => {
  return useQuery({
    queryKey: ['product', id],
    queryFn: () => productApi.getProduct(id),
    enabled: !!id,
  });
};

export const useCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: () => productApi.getCategories(),
    staleTime: 1000 * 60 * 60, // 1 hour
  });
};

export const useBanners = () => {
  return useQuery({
    queryKey: ['banners'],
    queryFn: () => productApi.getBanners(),
    staleTime: 1000 * 60 * 30, // 30 minutes
  });
};

export const useFlashSaleProducts = () => {
  return useQuery({
    queryKey: ['flashSale'],
    queryFn: () => productApi.getFlashSaleProducts(),
    staleTime: 1000 * 60, // 1 minute
  });
};

export const useFeaturedProducts = () => {
  return useQuery({
    queryKey: ['featured'],
    queryFn: () => productApi.getFeaturedProducts(),
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
};

export const useReviews = (productId: string) => {
  return useQuery({
    queryKey: ['reviews', productId],
    queryFn: () => productApi.getReviews(productId),
    enabled: !!productId,
  });
};
