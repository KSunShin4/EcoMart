// src/api/productApi.ts
import client from './client';
import {
  Product,
  Category,
  Banner,
  Review,
  ProductFilters,
  ProductSort,
  PaginationParams,
  ProductListResponse,
} from '../types/product';

export const productApi = {
  // Get products with filters and pagination
  getProducts: async (
    filters: ProductFilters = {},
    sort?: ProductSort,
    pagination: PaginationParams = { page: 1, limit: 10 }
  ): Promise<ProductListResponse> => {
    const params: any = {
      page: pagination.page,
      limit: pagination.limit,
    };

    // Add filters
    if (filters.categoryId) params.categoryId = filters.categoryId;
    if (filters.search) params.search = filters.search;

    // Add sorting
    if (sort) {
      params.sortBy = sort.field;
      params.order = sort.order;
    }

    const response = await client.get<Product[]>('/products', { params });

    // MockAPI returns array, we need to transform it
    const products = response.data;

    // Client-side filtering (since MockAPI has limited filter support)
    let filteredProducts = products;

    if (filters.minPrice !== undefined) {
      filteredProducts = filteredProducts.filter(p => p.price >= filters.minPrice!);
    }
    if (filters.maxPrice !== undefined) {
      filteredProducts = filteredProducts.filter(p => p.price <= filters.maxPrice!);
    }
    if (filters.type && filters.type.length > 0) {
      filteredProducts = filteredProducts.filter(p => filters.type!.includes(p.type));
    }
    if (filters.season && filters.season.length > 0) {
      filteredProducts = filteredProducts.filter(p => 
        filters.season!.includes(p.season) || p.season === 'all'
      );
    }

    // Client-side sorting
    if (sort) {
      filteredProducts.sort((a, b) => {
        const aValue = a[sort.field];
        const bValue = b[sort.field];
        const multiplier = sort.order === 'asc' ? 1 : -1;
        return (aValue > bValue ? 1 : -1) * multiplier;
      });
    }

    return {
      products: filteredProducts,
      total: filteredProducts.length,
      page: pagination.page,
      limit: pagination.limit,
      hasMore: filteredProducts.length >= pagination.limit,
    };
  },

  // Get single product
  getProduct: async (id: string): Promise<Product> => {
    const response = await client.get<Product>(`/products/${id}`);
    return response.data;
  },

  // Get categories
  getCategories: async (): Promise<Category[]> => {
    const response = await client.get<Category[]>('/categories');
    return response.data.sort((a, b) => a.order - b.order);
  },

  // Get banners
  getBanners: async (): Promise<Banner[]> => {
    const response = await client.get<Banner[]>('/banners');
    return response.data
      .filter(b => b.isActive)
      .sort((a, b) => a.order - b.order);
  },

  // Get flash sale products
  getFlashSaleProducts: async (): Promise<Product[]> => {
    const response = await client.get<Product[]>('/products', {
      params: { isFlashSale: true },
    });
    return response.data.filter(p => {
      if (!p.flashSaleEndTime) return false;
      return new Date(p.flashSaleEndTime) > new Date();
    });
  },

  // Get featured products
  getFeaturedProducts: async (): Promise<Product[]> => {
    const response = await client.get<Product[]>('/products', {
      params: { isFeatured: true },
    });
    return response.data;
  },

  // Get reviews for a product
  getReviews: async (productId: string): Promise<Review[]> => {
    const response = await client.get<Review[]>('/reviews', {
      params: { productId },
    });
    return response.data.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  },

  // Search products with suggestions
  searchProducts: async (keyword: string): Promise<Product[]> => {
    const response = await client.get<Product[]>('/products', {
      params: { search: keyword },
    });
    
    // Client-side search to match name or tags
    return response.data.filter(p =>
      p.name.toLowerCase().includes(keyword.toLowerCase()) ||
      p.nameEn.toLowerCase().includes(keyword.toLowerCase()) ||
      p.tags.some(tag => tag.toLowerCase().includes(keyword.toLowerCase()))
    );
  },
};
