// src/components/ClickableRow.tsx
import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';

type ClickableRowProps = {
  text: string;
  onPress: () => void;
  icon?: string | React.ReactNode; // Hỗ trợ cả string (Feather icon name) và ReactNode
  iconSize?: number;
  iconColor?: string;
  badge?: string | number; // Badge hiển thị số thông báo
  rightText?: string; // Text hiển thị bên phải
  rightTextColor?: string; // Màu của rightText
  isLast?: boolean; // Nếu là item cuối thì bỏ border bottom
  hideArrow?: boolean; // Ẩn mũi tên bên phải
};

export const ClickableRow = ({ 
  text, 
  onPress, 
  icon, 
  iconSize = 20,
  iconColor = '#333',
  badge,
  rightText,
  rightTextColor = '#333',
  isLast = false,
  hideArrow = false
}: ClickableRowProps) => {
  // Render icon: nếu là string thì dùng Feather, nếu là ReactNode thì render trực tiếp
  const renderIcon = () => {
    if (!icon) return null;
    
    if (typeof icon === 'string') {
      return (
        <Feather 
          name={icon as any} 
          size={iconSize} 
          color={iconColor} 
        />
      );
    }
    
    return icon;
  };

  return (
    <TouchableOpacity 
      onPress={onPress} 
      style={[
        styles.container,
        isLast && styles.containerLast
      ]}
    >
      {icon && (
        <View style={styles.iconContainer}>
          {renderIcon()}
        </View>
      )}
      <Text style={styles.text}>{text}</Text>
      
      {/* Badge */}
      {badge !== undefined && badge !== null && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{badge}</Text>
        </View>
      )}
      
      {/* Right text */}
      {rightText && (
        <Text style={[styles.rightText, { color: rightTextColor }]}>
          {rightText}
        </Text>
      )}
      
      {/* Arrow */}
      {!hideArrow && (
        <Text style={styles.arrow}>{'>'}</Text>
      )}
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
  containerLast: {
    borderBottomWidth: 0,
  },
  iconContainer: {
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
    width: 24,
  },
  text: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    marginLeft: 4,
  },
  badge: {
    backgroundColor: '#EF4444',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginRight: 8,
    minWidth: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  rightText: {
    fontSize: 14,
    marginRight: 8,
    fontWeight: '500',
  },
  arrow: {
    fontSize: 16,
    color: '#A9A9A9',
    marginLeft: 8,
  },
});