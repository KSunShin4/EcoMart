// src/components/ClickableRow.tsx
import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';

type ClickableRowProps = {
  text: string;
  onPress: () => void;
  // Bạn có thể thêm prop 'icon' ở đây sau
};

export const ClickableRow = ({ text, onPress }: ClickableRowProps) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      {/* TODO: Thêm Icon vào bên trái */}
      <Text style={styles.text}>{text}</Text>
      <Text style={styles.arrow}>{'>'}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  text: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  arrow: {
    fontSize: 16,
    color: '#A9A9A9',
  },
});