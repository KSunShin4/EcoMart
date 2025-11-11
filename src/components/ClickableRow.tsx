// src/components/ClickableRow.tsx
import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';

type ClickableRowProps = {
  text: string;
  onPress: () => void;
  icon?: React.ReactNode;
  iconSize?: number;
  iconColor?: string;
};

export const ClickableRow = ({ text, onPress, icon }: ClickableRowProps) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      {icon && <View style={styles.iconContainer}>{icon}</View>}
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
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  iconContainer: {
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    marginLeft: 4,
  },
  arrow: {
    fontSize: 16,
    color: '#A9A9A9',
    marginLeft: 8,
  },
});