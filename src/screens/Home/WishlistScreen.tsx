// src/screens/Home/WishlistScreen.tsx
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useQuery } from '@tanstack/react-query';
import { ProductCard } from '../../components/ProductCard';
import { useWishlist } from '../../hooks/useWishlist';
import { productApi } from '../../api/productApi';
import { Product } from '../../types/product';

type Props = NativeStackScreenProps<any, 'Wishlist'>;

export const WishlistScreen: React.FC<Props> = ({ navigation }) => {
  const { wishlistProductIds, toggleWishlist, isInWishlist } = useWishlist();

  // Fetch products for wishlist items
  const { data: wishlistProducts = [], isLoading } = useQuery({
    queryKey: ['wishlistProducts', wishlistProductIds],
    queryFn: async () => {
      if (wishlistProductIds.length === 0) return [];
      
      // Fetch all products and filter by wishlist IDs
      const allProducts = await productApi.getProducts({}, undefined, {
        page: 1,
        limit: 100,
      });
      
      return allProducts.products.filter((p: Product) =>
        wishlistProductIds.includes(p.id)
      );
    },
    enabled: wishlistProductIds.length > 0,
  });

  const renderHeader = () => (
    <View style={styles.header}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={styles.backButton}>← Quay lại</Text>
      </TouchableOpacity>
      <Text style={styles.headerTitle}>Yêu thích</Text>
      <View style={{ width: 80 }} />
    </View>
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyIcon}>❤️</Text>
      <Text style={styles.emptyTitle}>Danh sách yêu thích trống</Text>
      <Text style={styles.emptyText}>
        Hãy thêm sản phẩm yêu thích để dễ dàng tìm lại sau
      </Text>
      <TouchableOpacity
        style={styles.shopButton}
        onPress={() => navigation.navigate('Home')}
      >
        <Text style={styles.shopButtonText}>Khám phá ngay</Text>
      </TouchableOpacity>
    </View>
  );

  const renderProduct = ({ item }: { item: Product }) => (
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
        <View style={styles.loadingContainer}>
          <Text>Đang tải...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {renderHeader()}

      {wishlistProducts.length === 0 ? (
        renderEmpty()
      ) : (
        <View style={styles.contentContainer}>
          <Text style={styles.countText}>
            {wishlistProducts.length} sản phẩm
          </Text>
          <FlatList
            data={wishlistProducts}
            renderItem={renderProduct}
            keyExtractor={(item) => item.id}
            numColumns={2}
            contentContainerStyle={styles.list}
          />
        </View>
      )}
    </View>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyIcon: {
    fontSize: 80,
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 20,
  },
  shopButton: {
    backgroundColor: '#10B981',
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 8,
  },
  shopButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  contentContainer: {
    flex: 1,
  },
  countText: {
    fontSize: 14,
    color: '#6B7280',
    padding: 16,
    backgroundColor: '#fff',
  },
  list: {
    padding: 12,
  },
  productItem: {
    width: '50%',
    padding: 4,
  },
});
