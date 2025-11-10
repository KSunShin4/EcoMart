// __tests__/filterSort.test.ts

// Type definitions
interface Product {
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

interface ProductFilters {
  categoryId?: string;
  minPrice?: number;
  maxPrice?: number;
  type?: string[];
  season?: string[];
  search?: string;
}

interface ProductSort {
  field: 'price' | 'createdAt' | 'sold' | 'rating';
  order: 'asc' | 'desc';
}

// Mock products for testing
const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Mít Thái',
    nameEn: 'Thai Jackfruit',
    description: 'Mít Thái ngọt, thơm',
    price: 27000,
    originalPrice: 35000,
    discount: 23,
    unit: 'kg',
    unitValue: '1',
    images: [],
    thumbnail: '',
    categoryId: '1',
    stock: 31,
    sold: 156,
    rating: 4.5,
    reviewCount: 42,
    origin: 'Việt Nam',
    certifications: ['VietGAP'],
    season: 'summer',
    type: 'fresh',
    tags: ['trái cây'],
    isFeatured: true,
    isFlashSale: true,
    flashSaleEndTime: '2025-11-10T00:12:20',
    createdAt: '2025-11-01T10:00:00',
  },
  {
    id: '2',
    name: 'Táo Gala',
    nameEn: 'Gala Apple',
    description: 'Táo Gala nhập khẩu',
    price: 39000,
    originalPrice: 59000,
    discount: 35,
    unit: 'trái',
    unitValue: '8',
    images: [],
    thumbnail: '',
    categoryId: '1',
    stock: 45,
    sold: 89,
    rating: 4.2,
    reviewCount: 28,
    origin: 'New Zealand',
    certifications: ['Organic'],
    season: 'all',
    type: 'fresh',
    tags: ['trái cây', 'nhập khẩu'],
    isFeatured: true,
    isFlashSale: false,
    createdAt: '2025-10-15T10:00:00',
  },
  {
    id: '3',
    name: 'Thịt heo',
    nameEn: 'Pork',
    description: 'Thịt heo tươi',
    price: 89000,
    originalPrice: 89000,
    discount: 0,
    unit: 'kg',
    unitValue: '1',
    images: [],
    thumbnail: '',
    categoryId: '2',
    stock: 20,
    sold: 234,
    rating: 4.8,
    reviewCount: 67,
    origin: 'Việt Nam',
    certifications: [],
    season: 'all',
    type: 'fresh',
    tags: ['thịt'],
    isFeatured: false,
    isFlashSale: false,
    createdAt: '2025-11-05T10:00:00',
  },
  {
    id: '4',
    name: 'Chuối giả',
    nameEn: 'Banana',
    description: 'Chuối giả giống Nam Mỹ',
    price: 17000,
    originalPrice: 28000,
    discount: 37,
    unit: 'kg',
    unitValue: '1',
    images: [],
    thumbnail: '',
    categoryId: '1',
    stock: 75,
    sold: 345,
    rating: 4.6,
    reviewCount: 123,
    origin: 'Việt Nam',
    certifications: ['VietGAP'],
    season: 'all',
    type: 'fresh',
    tags: ['trái cây', 'hot'],
    isFeatured: true,
    isFlashSale: false,
    createdAt: '2025-11-08T10:00:00',
  },
];

// Filter function (mimics the client-side filtering in productApi)
function filterProducts(products: Product[], filters: ProductFilters): Product[] {
  let filteredProducts = products;

  if (filters.categoryId) {
    filteredProducts = filteredProducts.filter(p => p.categoryId === filters.categoryId);
  }

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

  if (filters.search) {
    const searchLower = filters.search.toLowerCase();
    filteredProducts = filteredProducts.filter(p =>
      p.name.toLowerCase().includes(searchLower) ||
      p.nameEn.toLowerCase().includes(searchLower) ||
      p.tags.some(tag => tag.toLowerCase().includes(searchLower))
    );
  }

  return filteredProducts;
}

// Sort function (mimics the client-side sorting in productApi)
function sortProducts(products: Product[], sort: ProductSort): Product[] {
  const sorted = [...products];
  sorted.sort((a, b) => {
    const aValue = a[sort.field];
    const bValue = b[sort.field];
    const multiplier = sort.order === 'asc' ? 1 : -1;
    return (aValue > bValue ? 1 : -1) * multiplier;
  });
  return sorted;
}

describe('Product Filtering', () => {
  it('should filter products by category', () => {
    const filters: ProductFilters = { categoryId: '1' };
    const result = filterProducts(mockProducts, filters);
    expect(result.length).toBe(3);
    expect(result.every(p => p.categoryId === '1')).toBe(true);
  });

  it('should filter products by minimum price', () => {
    const filters: ProductFilters = { minPrice: 30000 };
    const result = filterProducts(mockProducts, filters);
    expect(result.length).toBe(2);
    expect(result.every(p => p.price >= 30000)).toBe(true);
  });

  it('should filter products by maximum price', () => {
    const filters: ProductFilters = { maxPrice: 40000 };
    const result = filterProducts(mockProducts, filters);
    expect(result.length).toBe(3);
    expect(result.every(p => p.price <= 40000)).toBe(true);
  });

  it('should filter products by price range', () => {
    const filters: ProductFilters = { minPrice: 20000, maxPrice: 50000 };
    const result = filterProducts(mockProducts, filters);
    expect(result.length).toBe(2);
    expect(result.every(p => p.price >= 20000 && p.price <= 50000)).toBe(true);
  });

  it('should filter products by type', () => {
    const filters: ProductFilters = { type: ['fresh'] };
    const result = filterProducts(mockProducts, filters);
    expect(result.length).toBe(4);
    expect(result.every(p => p.type === 'fresh')).toBe(true);
  });

  it('should filter products by multiple types', () => {
    const filters: ProductFilters = { type: ['fresh', 'frozen'] };
    const result = filterProducts(mockProducts, filters);
    expect(result.every(p => ['fresh', 'frozen'].includes(p.type))).toBe(true);
  });

  it('should filter products by season', () => {
    const filters: ProductFilters = { season: ['summer'] };
    const result = filterProducts(mockProducts, filters);
    // Should include summer products and 'all' season products
    expect(result.length).toBeGreaterThan(0);
    expect(result.some(p => p.season === 'summer' || p.season === 'all')).toBe(true);
  });

  it('should filter products by search keyword', () => {
    const filters: ProductFilters = { search: 'mít' };
    const result = filterProducts(mockProducts, filters);
    expect(result.length).toBe(1);
    expect(result[0].name).toContain('Mít');
  });

  it('should filter products by search keyword (case insensitive)', () => {
    const filters: ProductFilters = { search: 'táo' };
    const result = filterProducts(mockProducts, filters);
    expect(result.length).toBeGreaterThan(0);
    expect(result[0].name).toContain('Táo');
  });

  it('should filter products by tag', () => {
    const filters: ProductFilters = { search: 'nhập khẩu' };
    const result = filterProducts(mockProducts, filters);
    expect(result.length).toBe(1);
    expect(result[0].tags.includes('nhập khẩu')).toBe(true);
  });

  it('should combine multiple filters', () => {
    const filters: ProductFilters = {
      categoryId: '1',
      minPrice: 20000,
      maxPrice: 40000,
      type: ['fresh'],
    };
    const result = filterProducts(mockProducts, filters);
    expect(result.length).toBe(2);
    expect(result.every(p =>
      p.categoryId === '1' &&
      p.price >= 20000 &&
      p.price <= 40000 &&
      p.type === 'fresh'
    )).toBe(true);
  });

  it('should return empty array when no products match filters', () => {
    const filters: ProductFilters = { minPrice: 1000000 };
    const result = filterProducts(mockProducts, filters);
    expect(result.length).toBe(0);
  });
});

describe('Product Sorting', () => {
  it('should sort products by price ascending', () => {
    const sort: ProductSort = { field: 'price', order: 'asc' };
    const result = sortProducts(mockProducts, sort);
    expect(result[0].price).toBe(17000);
    expect(result[result.length - 1].price).toBe(89000);
    for (let i = 0; i < result.length - 1; i++) {
      expect(result[i].price).toBeLessThanOrEqual(result[i + 1].price);
    }
  });

  it('should sort products by price descending', () => {
    const sort: ProductSort = { field: 'price', order: 'desc' };
    const result = sortProducts(mockProducts, sort);
    expect(result[0].price).toBe(89000);
    expect(result[result.length - 1].price).toBe(17000);
    for (let i = 0; i < result.length - 1; i++) {
      expect(result[i].price).toBeGreaterThanOrEqual(result[i + 1].price);
    }
  });

  it('should sort products by sold descending', () => {
    const sort: ProductSort = { field: 'sold', order: 'desc' };
    const result = sortProducts(mockProducts, sort);
    expect(result[0].sold).toBe(345);
    for (let i = 0; i < result.length - 1; i++) {
      expect(result[i].sold).toBeGreaterThanOrEqual(result[i + 1].sold);
    }
  });

  it('should sort products by rating descending', () => {
    const sort: ProductSort = { field: 'rating', order: 'desc' };
    const result = sortProducts(mockProducts, sort);
    expect(result[0].rating).toBe(4.8);
    for (let i = 0; i < result.length - 1; i++) {
      expect(result[i].rating).toBeGreaterThanOrEqual(result[i + 1].rating);
    }
  });

  it('should sort products by createdAt descending (newest first)', () => {
    const sort: ProductSort = { field: 'createdAt', order: 'desc' };
    const result = sortProducts(mockProducts, sort);
    expect(result[0].id).toBe('4'); // Created on Nov 8
    expect(result[result.length - 1].id).toBe('2'); // Created on Oct 15
  });

  it('should sort products by createdAt ascending (oldest first)', () => {
    const sort: ProductSort = { field: 'createdAt', order: 'asc' };
    const result = sortProducts(mockProducts, sort);
    expect(result[0].id).toBe('2'); // Created on Oct 15
    expect(result[result.length - 1].id).toBe('4'); // Created on Nov 8
  });
});

describe('Combined Filter and Sort', () => {
  it('should filter and sort products correctly', () => {
    // Filter by category 1 and sort by price ascending
    const filters: ProductFilters = { categoryId: '1' };
    const sort: ProductSort = { field: 'price', order: 'asc' };
    
    const filtered = filterProducts(mockProducts, filters);
    const result = sortProducts(filtered, sort);
    
    expect(result.length).toBe(3);
    expect(result[0].price).toBe(17000); // Chuối
    expect(result[1].price).toBe(27000); // Mít
    expect(result[2].price).toBe(39000); // Táo
  });

  it('should filter by price range and sort by rating', () => {
    const filters: ProductFilters = { minPrice: 20000, maxPrice: 90000 };
    const sort: ProductSort = { field: 'rating', order: 'desc' };
    
    const filtered = filterProducts(mockProducts, filters);
    const result = sortProducts(filtered, sort);
    
    expect(result.length).toBe(3);
    expect(result[0].rating).toBeGreaterThanOrEqual(result[1].rating);
  });
});
