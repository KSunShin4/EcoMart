// src/components/Skeleton/ProductListSkeleton.tsx
import React from 'react';
import { View, StyleSheet, Animated } from 'react-native';

export const ProductListSkeleton: React.FC = () => {
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
      {[1, 2, 3, 4].map((i) => (
        <View key={i} style={styles.item}>
          <Animated.View style={[styles.image, { opacity }]} />
          <View style={styles.content}>
            <Animated.View style={[styles.title, { opacity }]} />
            <Animated.View style={[styles.subtitle, { opacity }]} />
            <Animated.View style={[styles.price, { opacity }]} />
          </View>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  item: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  image: {
    width: 100,
    height: 100,
    backgroundColor: '#E0E0E0',
    borderRadius: 8,
    marginRight: 12,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    gap: 8,
  },
  title: {
    height: 18,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    width: '80%',
  },
  subtitle: {
    height: 14,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    width: '60%',
  },
  price: {
    height: 20,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    width: '40%',
  },
});
