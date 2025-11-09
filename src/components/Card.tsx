// src/components/Card.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

type CardProps = {
  title?: string; // Tiêu đề của thẻ, ví dụ: "Thông tin cá nhân"
  children: React.ReactNode;
};

export const Card = ({ title, children }: CardProps) => {
  return (
    <View style={styles.card}>
      {title && <Text style={styles.title}>{title}</Text>}
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 16,
    // Thêm một chút bóng (shadow) cho đẹp
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
});