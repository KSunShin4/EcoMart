// src/types/product.ts

export interface Product {
  id: string;
  name: string;
  nameEn: string;
  description: string;
  price: number;
  originalPrice: number;
  discount: number;
  unit: string;
  unitValue: string;
  images: string[];
  thumbnail: string;
  categoryId: string;
  stock: number;
  sold: number;
  rating: number;
  reviewCount: number;
  origin: string;
  certifications: string[];
  season: 'spring' | 'summer' | 'autumn' | 'winter' | 'all';
  type: 'fresh' | 'frozen' | 'dried' | 'canned' | 'other';
  tags: string[];
  isFeatured: boolean;
  isFlashSale: boolean;
  flashSaleEndTime?: string;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  nameEn: string;
  icon: string;
  image: string;
  productCount: number;
  badge?: string;
  order: number;
}

export interface Banner {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  type: string;
  link: string;
  order: number;
  isActive: boolean;
}

export interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  userAvatar: string;
  rating: number;
  comment: string;
  images: string[];
  createdAt: string;
  helpful: number;
}

export interface SearchHistory {
  id: string;
  userId: string;
  keyword: string;
  createdAt: string;
}

export interface WishlistItem {
  id: string;
  userId: string;
  productId: string;
  createdAt: string;
}

export interface ProductFilters {
  categoryId?: string;
  minPrice?: number;
  maxPrice?: number;
  type?: string[];
  season?: string[];
  search?: string;
}

export interface ProductSort {
  field: 'price' | 'createdAt' | 'sold' | 'rating';
  order: 'asc' | 'desc';
}

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface ProductListResponse {
  products: Product[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}
