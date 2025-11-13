// src/components/Card.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

type CardProps = {
  title?: string;
  meta?: string; 
  children: React.ReactNode;
};

export const Card = ({ title, meta, children }: CardProps) => {
  const hasHeader = title || meta;

  return (
    <View style={styles.card}>
      {hasHeader && (
        <View style={styles.titleContainer}>
          {title && <Text style={styles.title}>{title}</Text>}
          {meta && <Text style={styles.meta}>{meta}</Text>}
        </View>
      )}
      {/* Container nội dung với padding ngang */}
      <View style={[styles.contentContainer, hasHeader && styles.contentWithHeader]}>
        {children}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    marginVertical: 8,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    overflow: 'hidden', 
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16, 
    paddingTop: 16, 
    paddingBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  meta: {
    fontSize: 14,
    color: '#6B7280',
  },
  contentContainer: { 
    paddingHorizontal: 16,
    paddingVertical: 4, // Thêm padding dọc nhỏ
  },
  contentWithHeader: {
    paddingTop: 0, // Không cần padding top nếu đã có header
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  }
});