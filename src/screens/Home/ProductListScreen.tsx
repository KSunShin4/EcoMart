// src/screens/Home/ProductListScreen.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
  ScrollView,
  Pressable,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ProductCard } from '../../components/ProductCard';
import { ProductListSkeleton } from '../../components/Skeleton';
import { useProducts } from '../../hooks/useProducts';
import { useWishlist } from '../../hooks/useWishlist';
import { ProductFilters, ProductSort } from '../../types/product';
import Ionicons from '@expo/vector-icons/Ionicons';

type Props = NativeStackScreenProps<any, 'ProductList'>;

const PRICE_RANGES = [
  { label: 'Dưới 50k', minPrice: 0, maxPrice: 50000 },
  { label: '50k - 100k', minPrice: 50000, maxPrice: 100000 },
  { label: '100k - 200k', minPrice: 100000, maxPrice: 200000 },
  { label: 'Trên 200k', minPrice: 200000, maxPrice: undefined },
];

const PRODUCT_TYPES = [
  { value: 'fresh', label: 'Tươi sống' },
  { value: 'frozen', label: 'Đông lạnh' },
  { value: 'dried', label: 'Khô' },
  { value: 'canned', label: 'Đóng hộp' },
];

const SEASONS = [
  { value: 'spring', label: 'Xuân' },
  { value: 'summer', label: 'Hè' },
  { value: 'autumn', label: 'Thu' },
  { value: 'winter', label: 'Đông' },
  { value: 'all', label: 'Quanh năm' },
];

const SORT_OPTIONS: { value: ProductSort; label: string }[] = [
  { value: { field: 'createdAt', order: 'desc' }, label: 'Mới nhất' },
  { value: { field: 'sold', order: 'desc' }, label: 'Bán chạy' },
  { value: { field: 'price', order: 'asc' }, label: 'Giá thấp → cao' },
  { value: { field: 'price', order: 'desc' }, label: 'Giá cao → thấp' },
  { value: { field: 'rating', order: 'desc' }, label: 'Đánh giá cao' },
];

export const ProductListScreen: React.FC<Props> = ({ navigation, route }) => {
  const { categoryId, categoryName, isFlashSale, isFeatured } = route.params || {};

  // State
  const [filters, setFilters] = useState<ProductFilters>({
    categoryId,
  });
  const [sort, setSort] = useState<ProductSort>(SORT_OPTIONS[0].value);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showSortModal, setShowSortModal] = useState(false);

  // Hooks
  const {
    products,
    isLoading,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useProducts({ filters, sort });

  const { toggleWishlist, isInWishlist } = useWishlist();

  // Update filters when params change
  useEffect(() => {
    const newFilters: ProductFilters = {};
    if (categoryId) newFilters.categoryId = categoryId;
    setFilters(newFilters);
  }, [categoryId]);

  // Filter by flash sale or featured
  const filteredProducts = React.useMemo(() => {
    let result = products;
    if (isFlashSale) {
      result = result.filter(p => p.isFlashSale);
    }
    if (isFeatured) {
      result = result.filter(p => p.isFeatured);
    }
    return result;
  }, [products, isFlashSale, isFeatured]);

  const handleApplyFilters = (newFilters: ProductFilters) => {
    setFilters({ ...filters, ...newFilters });
    setShowFilterModal(false);
  };

  const handleClearFilters = () => {
    setFilters({ categoryId });
    setShowFilterModal(false);
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        {/* <Text style={styles.backButton}>← Quay lại</Text> */}
        <Ionicons name="arrow-back-outline" size={24} color="white" />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>
        {categoryName || 'Sản phẩm'}
      </Text>
      <View style={{ width: 60 }} />
    </View>
  );

  const renderFilterBar = () => (
    <View style={styles.filterBar}>
      <TouchableOpacity
        style={styles.filterButton}
        onPress={() => setShowFilterModal(true)}
      >
        <Text style={styles.filterIcon}>🔽</Text>
        <Text style={styles.filterText}>Lọc</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.filterButton}
        onPress={() => setShowSortModal(true)}
      >
        <Text style={styles.filterIcon}>↕️</Text>
        <Text style={styles.filterText}>Sắp xếp</Text>
      </TouchableOpacity>

      <View style={styles.resultCount}>
        <Text style={styles.resultText}>
          {filteredProducts.length} sản phẩm
        </Text>
      </View>
    </View>
  );

  const renderProduct = ({ item }: any) => (
    <View style={styles.productItem}>
      <ProductCard
        product={item}
        onPress={() =>
          navigation.navigate('ProductDetail', { productId: item.id })
        }
        onWishlistPress={() => toggleWishlist(item.id)}
        isInWishlist={isInWishlist(item.id)}
      />
    </View>
  );

  if (isLoading) {
    return (
      <View style={styles.container}>
        {renderHeader()}
        <ProductListSkeleton />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {renderHeader()}
      {renderFilterBar()}

      <FlatList
        data={filteredProducts}
        renderItem={renderProduct}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.list}
        onEndReached={() => {
          if (hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
          }
        }}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          isFetchingNextPage ? (
            <View style={styles.loadingFooter}>
              <Text>Đang tải...</Text>
            </View>
          ) : null
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Không tìm thấy sản phẩm</Text>
          </View>
        }
      />

      {/* Filter Modal */}
      <FilterModal
        visible={showFilterModal}
        filters={filters}
        onClose={() => setShowFilterModal(false)}
        onApply={handleApplyFilters}
        onClear={handleClearFilters}
      />

      {/* Sort Modal */}
      <SortModal
        visible={showSortModal}
        currentSort={sort}
        onClose={() => setShowSortModal(false)}
        onSelect={(newSort) => {
          setSort(newSort);
          setShowSortModal(false);
        }}
      />
    </View>
  );
};

// Filter Modal Component
const FilterModal: React.FC<{
  visible: boolean;
  filters: ProductFilters;
  onClose: () => void;
  onApply: (filters: ProductFilters) => void;
  onClear: () => void;
}> = ({ visible, filters, onClose, onApply, onClear }) => {
  const [localFilters, setLocalFilters] = useState(filters);

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const toggleType = (type: string) => {
    const types = localFilters.type || [];
    const newTypes = types.includes(type)
      ? types.filter(t => t !== type)
      : [...types, type];
    setLocalFilters({ ...localFilters, type: newTypes });
  };

  const toggleSeason = (season: string) => {
    const seasons = localFilters.season || [];
    const newSeasons = seasons.includes(season)
      ? seasons.filter(s => s !== season)
      : [...seasons, season];
    setLocalFilters({ ...localFilters, season: newSeasons });
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Bộ lọc</Text>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.closeButton}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalBody}>
            {/* Price Range */}
            <View style={styles.filterSection}>
              <Text style={styles.filterSectionTitle}>Khoảng giá</Text>
              {PRICE_RANGES.map((range, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.filterOption,
                    localFilters.minPrice === range.minPrice &&
                    localFilters.maxPrice === range.maxPrice &&
                    styles.filterOptionActive,
                  ]}
                  onPress={() =>
                    setLocalFilters({
                      ...localFilters,
                      minPrice: range.minPrice,
                      maxPrice: range.maxPrice,
                    })
                  }
                >
                  <Text
                    style={[
                      styles.filterOptionText,
                      localFilters.minPrice === range.minPrice &&
                      localFilters.maxPrice === range.maxPrice &&
                      styles.filterOptionTextActive,
                    ]}
                  >
                    {range.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Product Type */}
            <View style={styles.filterSection}>
              <Text style={styles.filterSectionTitle}>Loại sản phẩm</Text>
              <View style={styles.filterGrid}>
                {PRODUCT_TYPES.map((type) => (
                  <TouchableOpacity
                    key={type.value}
                    style={[
                      styles.filterChip,
                      localFilters.type?.includes(type.value) &&
                      styles.filterChipActive,
                    ]}
                    onPress={() => toggleType(type.value)}
                  >
                    <Text
                      style={[
                        styles.filterChipText,
                        localFilters.type?.includes(type.value) &&
                        styles.filterChipTextActive,
                      ]}
                    >
                      {type.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Season */}
            <View style={styles.filterSection}>
              <Text style={styles.filterSectionTitle}>Mùa vụ</Text>
              <View style={styles.filterGrid}>
                {SEASONS.map((season) => (
                  <TouchableOpacity
                    key={season.value}
                    style={[
                      styles.filterChip,
                      localFilters.season?.includes(season.value) &&
                      styles.filterChipActive,
                    ]}
                    onPress={() => toggleSeason(season.value)}
                  >
                    <Text
                      style={[
                        styles.filterChipText,
                        localFilters.season?.includes(season.value) &&
                        styles.filterChipTextActive,
                      ]}
                    >
                      {season.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </ScrollView>

          <View style={styles.modalFooter}>
            <TouchableOpacity
              style={styles.clearButton}
              onPress={onClear}
            >
              <Text style={styles.clearButtonText}>Xóa bộ lọc</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.applyButton}
              onPress={() => onApply(localFilters)}
            >
              <Text style={styles.applyButtonText}>Áp dụng</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

// Sort Modal Component
const SortModal: React.FC<{
  visible: boolean;
  currentSort: ProductSort;
  onClose: () => void;
  onSelect: (sort: ProductSort) => void;
}> = ({ visible, currentSort, onClose, onSelect }) => {
  return (
    <Modal visible={visible} animationType="slide" transparent>
      <Pressable style={styles.modalOverlay} onPress={onClose}>
        <View style={styles.sortModalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Sắp xếp theo</Text>
          </View>
          {SORT_OPTIONS.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.sortOption,
                JSON.stringify(currentSort) === JSON.stringify(option.value) &&
                styles.sortOptionActive,
              ]}
              onPress={() => onSelect(option.value)}
            >
              <Text
                style={[
                  styles.sortOptionText,
                  JSON.stringify(currentSort) === JSON.stringify(option.value) &&
                  styles.sortOptionTextActive,
                ]}
              >
                {option.label}
              </Text>
              {JSON.stringify(currentSort) === JSON.stringify(option.value) && (
                <Text style={styles.checkmark}>✓</Text>
              )}
            </TouchableOpacity>
          ))}
        </View>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#10B981',
    paddingTop: 50,
    paddingBottom: 16,
    paddingHorizontal: 16,
  },
  backButton: {
    color: '#fff',
    fontSize: 16,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  filterBar: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 12,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  filterIcon: {
    fontSize: 14,
  },
  filterText: {
    fontSize: 14,
    color: '#1F2937',
    fontWeight: '500',
  },
  resultCount: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  resultText: {
    fontSize: 13,
    color: '#6B7280',
  },
  list: {
    padding: 12,
  },
  productItem: {
    width: '50%',
    padding: 4,
  },
  loadingFooter: {
    padding: 20,
    alignItems: 'center',
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#9CA3AF',
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
  },
  sortModalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  closeButton: {
    fontSize: 24,
    color: '#6B7280',
  },
  modalBody: {
    maxHeight: 400,
  },
  filterSection: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  filterSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
  },
  filterOption: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: '#F3F4F6',
  },
  filterOptionActive: {
    backgroundColor: '#D1FAE5',
  },
  filterOptionText: {
    fontSize: 14,
    color: '#1F2937',
  },
  filterOptionTextActive: {
    color: '#10B981',
    fontWeight: '600',
  },
  filterGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  filterChip: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  filterChipActive: {
    backgroundColor: '#D1FAE5',
    borderColor: '#10B981',
  },
  filterChipText: {
    fontSize: 13,
    color: '#6B7280',
  },
  filterChipTextActive: {
    color: '#10B981',
    fontWeight: '600',
  },
  modalFooter: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  clearButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
  },
  clearButtonText: {
    fontSize: 16,
    color: '#6B7280',
    fontWeight: '600',
  },
  applyButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#10B981',
    alignItems: 'center',
  },
  applyButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
  sortOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  sortOptionActive: {
    backgroundColor: '#F0FDF4',
  },
  sortOptionText: {
    fontSize: 15,
    color: '#1F2937',
  },
  sortOptionTextActive: {
    color: '#10B981',
    fontWeight: '600',
  },
  checkmark: {
    fontSize: 18,
    color: '#10B981',
  },
});
