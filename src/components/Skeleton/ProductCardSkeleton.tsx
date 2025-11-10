// src/components/Skeleton/ProductCardSkeleton.tsx
import React from 'react';
import { View, StyleSheet, Animated } from 'react-native';

export const ProductCardSkeleton: React.FC = () => {
  const animatedValue = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const opacity = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  });

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.image, { opacity }]} />
      <View style={styles.content}>
        <Animated.View style={[styles.title, { opacity }]} />
        <Animated.View style={[styles.price, { opacity }]} />
        <Animated.View style={[styles.discount, { opacity }]} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 160,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 8,
    marginRight: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  image: {
    width: '100%',
    height: 120,
    backgroundColor: '#E0E0E0',
    borderRadius: 8,
    marginBottom: 8,
  },
  content: {
    gap: 6,
  },
  title: {
    height: 16,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    width: '80%',
  },
  price: {
    height: 20,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    width: '60%',
  },
  discount: {
    height: 14,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    width: '40%',
  },
});
