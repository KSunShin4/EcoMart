// src/screens/Home/HomeScreen.tsx
import React, { useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  FlatList,
  TouchableOpacity,
  Dimensions,
  RefreshControl,
} from 'react-native';
import { Image } from 'expo-image';
import { ProductCard } from '../../components/ProductCard';
import { ProductCardSkeleton } from '../../components/Skeleton';
import {
  useBanners,
  useCategories,
  useFlashSaleProducts,
  useFeaturedProducts,
} from '../../hooks/useProducts';
import { useWishlist } from '../../hooks/useWishlist';

type Props = {
  navigation: any;
};

const { width } = Dimensions.get('window');

export const HomeScreen: React.FC<Props> = ({ navigation }) => {
    console.log("HomeScreen rendered");
  const { data: banners, isLoading: bannersLoading, refetch: refetchBanners } = useBanners();
  const { data: categories, isLoading: categoriesLoading, refetch: refetchCategories } = useCategories();
  const { data: flashSaleProducts, isLoading: flashSaleLoading, refetch: refetchFlashSale } = useFlashSaleProducts();
  const { data: featuredProducts, isLoading: featuredLoading, refetch: refetchFeatured } = useFeaturedProducts();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await Promise.all([
      refetchBanners(),
      refetchCategories(),
      refetchFlashSale(),
      refetchFeatured(),
    ]);
    setRefreshing(false);
  }, []);

  // Banner auto-scroll
  const bannerRef = useRef<FlatList>(null);
  const [currentBannerIndex, setCurrentBannerIndex] = React.useState(0);

  React.useEffect(() => {
    if (!banners || banners.length === 0) return;

    const interval = setInterval(() => {
      const nextIndex = (currentBannerIndex + 1) % banners.length;
      setCurrentBannerIndex(nextIndex);
      bannerRef.current?.scrollToIndex({
        index: nextIndex,
        animated: true,
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [currentBannerIndex, banners]);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.menuButton}>
          <Text style={styles.menuIcon}>☰</Text>
          <Text style={styles.menuText}>MENU</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.searchBar}
          onPress={() => navigation.navigate('Search')}
        >
          <Text style={styles.searchIcon}>🔍</Text>
          <Text style={styles.searchPlaceholder}>
            Mua đơn tươi sống từ 150k - Freeship 3km
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Banner Section */}
        {bannersLoading ? (
          <View style={styles.bannerSkeleton} />
        ) : (
          <View style={styles.bannerContainer}>
            <FlatList
              ref={bannerRef}
              data={banners}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item) => item.id}
              onMomentumScrollEnd={(event) => {
                const index = Math.round(
                  event.nativeEvent.contentOffset.x / width
                );
                setCurrentBannerIndex(index);
              }}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.bannerItem}>
                  <Image
                    source={{ uri: item.image }}
                    style={styles.bannerImage}
                    contentFit="cover"
                    transition={200}
                  />
                  <View style={styles.bannerOverlay}>
                    <Text style={styles.bannerTitle}>{item.title}</Text>
                    <Text style={styles.bannerSubtitle}>{item.subtitle}</Text>
                  </View>
                </TouchableOpacity>
              )}
            />
            {/* Banner Indicators */}
            <View style={styles.indicatorContainer}>
              {banners?.map((_, index) => (
                <View
                  key={index}
                  style={[
                    styles.indicator,
                    currentBannerIndex === index && styles.activeIndicator,
                  ]}
                />
              ))}
            </View>
          </View>
        )}

        {/* Categories Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Danh mục</Text>
          </View>

          {categoriesLoading ? (
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {[1, 2, 3, 4].map((i) => (
                <View key={i} style={styles.categorySkeleton} />
              ))}
            </ScrollView>
          ) : (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.categoriesScroll}
            >
              {categories?.map((category) => (
                <TouchableOpacity
                  key={category.id}
                  style={styles.categoryItem}
                  onPress={() =>
                    navigation.navigate('ProductList', {
                      categoryId: category.id,
                      categoryName: category.name,
                    })
                  }
                >
                  <View style={styles.categoryImageContainer}>
                    <Image
                      source={{ uri: category.image }}
                      style={styles.categoryImage}
                      contentFit="cover"
                    />
                    {category.badge && (
                      <View style={styles.categoryBadge}>
                        <Text style={styles.categoryBadgeText}>
                          {category.badge}
                        </Text>
                      </View>
                    )}
                  </View>
                  <Text style={styles.categoryName} numberOfLines={2}>
                    {category.name}
                  </Text>
                  <Text style={styles.categoryCount}>
                    {category.productCount} sản phẩm
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}
        </View>

        {/* Flash Sale Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.flashSaleHeader}>
              <Text style={styles.flashSaleIcon}>⚡</Text>
              <Text style={styles.sectionTitle}>Flash Sale</Text>
            </View>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('ProductList', { isFlashSale: true })
              }
            >
              <Text style={styles.seeAllText}>Xem thêm →</Text>
            </TouchableOpacity>
          </View>

          {flashSaleLoading ? (
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {[1, 2, 3].map((i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </ScrollView>
          ) : (
            <FlatList
              data={flashSaleProducts}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <ProductCard
                  product={item}
                  onPress={() =>
                    navigation.navigate('ProductDetail', { productId: item.id })
                  }
                  onWishlistPress={() => toggleWishlist(item.id)}
                  isInWishlist={isInWishlist(item.id)}
                />
              )}
            />
          )}
        </View>

        {/* Featured Products Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Sản phẩm nổi bật</Text>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('ProductList', { isFeatured: true })
              }
            >
              <Text style={styles.seeAllText}>Xem thêm →</Text>
            </TouchableOpacity>
          </View>

          {featuredLoading ? (
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {[1, 2, 3].map((i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </ScrollView>
          ) : (
            <FlatList
              data={featuredProducts}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <ProductCard
                  product={item}
                  onPress={() =>
                    navigation.navigate('ProductDetail', { productId: item.id })
                  }
                  onWishlistPress={() => toggleWishlist(item.id)}
                  isInWishlist={isInWishlist(item.id)}
                />
              )}
            />
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  header: {
    backgroundColor: '#10B981',
    paddingTop: 50,
    paddingBottom: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  menuButton: {
    alignItems: 'center',
  },
  menuIcon: {
    fontSize: 24,
    color: '#fff',
  },
  menuText: {
    fontSize: 10,
    color: '#fff',
    fontWeight: '600',
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8,
  },
  searchIcon: {
    fontSize: 16,
  },
  searchPlaceholder: {
    flex: 1,
    fontSize: 13,
    color: '#9CA3AF',
  },
  scrollView: {
    flex: 1,
  },
  bannerContainer: {
    position: 'relative',
    height: 180,
    marginBottom: 16,
  },
  bannerSkeleton: {
    height: 180,
    backgroundColor: '#E0E0E0',
    marginBottom: 16,
  },
  bannerItem: {
    width,
    height: 180,
    position: 'relative',
  },
  bannerImage: {
    width: '100%',
    height: '100%',
  },
  bannerOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    padding: 16,
  },
  bannerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  bannerSubtitle: {
    fontSize: 12,
    color: '#fff',
  },
  indicatorContainer: {
    position: 'absolute',
    bottom: 8,
    alignSelf: 'center',
    flexDirection: 'row',
    gap: 6,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  activeIndicator: {
    backgroundColor: '#fff',
    width: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  flashSaleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  flashSaleIcon: {
    fontSize: 20,
  },
  seeAllText: {
    fontSize: 14,
    color: '#10B981',
    fontWeight: '600',
  },
  categoriesScroll: {
    paddingLeft: 16,
  },
  categoryItem: {
    width: 100,
    marginRight: 12,
    alignItems: 'center',
  },
  categorySkeleton: {
    width: 100,
    height: 120,
    backgroundColor: '#E0E0E0',
    borderRadius: 12,
    marginRight: 12,
  },
  categoryImageContainer: {
    position: 'relative',
    width: 100,
    height: 100,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 8,
  },
  categoryImage: {
    width: '100%',
    height: '100%',
  },
  categoryBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: '#EF4444',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  categoryBadgeText: {
    fontSize: 10,
    color: '#fff',
    fontWeight: 'bold',
  },
  categoryName: {
    fontSize: 12,
    color: '#1F2937',
    textAlign: 'center',
    fontWeight: '500',
  },
  categoryCount: {
    fontSize: 10,
    color: '#9CA3AF',
    textAlign: 'center',
    marginTop: 2,
  },
});
