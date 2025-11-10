// src/components/ProductCard/ProductCard.tsx
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Pressable,
} from 'react-native';
import { Image } from 'expo-image';
import { Product } from '../../types/product';

interface ProductCardProps {
  product: Product;
  onPress?: () => void;
  onWishlistPress?: () => void;
  isInWishlist?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onPress,
  onWishlistPress,
  isInWishlist = false,
}) => {
  const formatPrice = (price: number) => {
    return `${price.toLocaleString('vi-VN')}đ`;
  };

  const formatUnit = (value: string, unit: string) => {
    return `/${value}${unit}`;
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {/* Product Image */}
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: product.thumbnail }}
          style={styles.image}
          contentFit="cover"
          placeholder={require('../../../assets/favicon.png')}
          transition={200}
          cachePolicy="memory-disk"
        />
        
        {/* Wishlist Button */}
        <Pressable
          style={styles.wishlistButton}
          onPress={(e) => {
            e.stopPropagation();
            onWishlistPress?.();
          }}
        >
          <Text style={styles.wishlistIcon}>
            {isInWishlist ? '❤️' : '🤍'}
          </Text>
        </Pressable>

        {/* Discount Badge */}
        {product.discount > 0 && (
          <View style={styles.discountBadge}>
            <Text style={styles.discountText}>-{product.discount}%</Text>
          </View>
        )}

        {/* Flash Sale Badge */}
        {product.isFlashSale && (
          <View style={styles.flashSaleBadge}>
            <Text style={styles.flashSaleText}>⚡ Flash Sale</Text>
          </View>
        )}
      </View>

      {/* Product Info */}
      <View style={styles.content}>
        <Text style={styles.name} numberOfLines={2}>
          {product.name}
        </Text>

        <View style={styles.priceRow}>
          <Text style={styles.price}>
            {formatPrice(product.price)}
            <Text style={styles.unit}>{formatUnit(product.unitValue, product.unit)}</Text>
          </Text>
        </View>

        {product.originalPrice > product.price && (
          <Text style={styles.originalPrice}>
            {formatPrice(product.originalPrice)}
          </Text>
        )}

        {/* Stock Info */}
        <View style={styles.footer}>
          <View style={styles.stockContainer}>
            <Text style={styles.stockIcon}>🔥</Text>
            <Text style={styles.stockText}>Còn {product.stock} suất</Text>
          </View>
          
          {product.rating > 0 && (
            <View style={styles.ratingContainer}>
              <Text style={styles.ratingIcon}>⭐</Text>
              <Text style={styles.ratingText}>{product.rating.toFixed(1)}</Text>
            </View>
          )}
        </View>

        {/* End Time (for flash sale) */}
        {product.isFlashSale && product.flashSaleEndTime && (
          <Text style={styles.endTime} numberOfLines={1}>
            Kết thúc sau {new Date(product.flashSaleEndTime).toLocaleTimeString('vi-VN', {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 160,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginRight: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: 140,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  wishlistButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  wishlistIcon: {
    fontSize: 18,
  },
  discountBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: '#EF4444',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  discountText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  flashSaleBadge: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFA500',
    paddingVertical: 4,
    alignItems: 'center',
  },
  flashSaleText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: 'bold',
  },
  content: {
    padding: 12,
    gap: 4,
  },
  name: {
    fontSize: 14,
    color: '#1F2937',
    fontWeight: '500',
    marginBottom: 4,
    lineHeight: 18,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#10B981',
  },
  unit: {
    fontSize: 12,
    fontWeight: 'normal',
    color: '#6B7280',
  },
  originalPrice: {
    fontSize: 12,
    color: '#9CA3AF',
    textDecorationLine: 'line-through',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  stockContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  stockIcon: {
    fontSize: 12,
  },
  stockText: {
    fontSize: 11,
    color: '#EF4444',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  ratingIcon: {
    fontSize: 12,
  },
  ratingText: {
    fontSize: 11,
    color: '#F59E0B',
    fontWeight: '600',
  },
  endTime: {
    fontSize: 10,
    color: '#6B7280',
    marginTop: 4,
    fontStyle: 'italic',
  },
});
