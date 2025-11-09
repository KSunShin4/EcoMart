// src/screens/User/AccountScreen.tsx
import React from 'react';
import { SafeAreaView, StyleSheet, ScrollView, View, Text } from 'react-native';
import { useAuthStore } from '../../store/authStore';
import { useNavigation } from '@react-navigation/native';

import { Card } from '../../components/Card';
import { ClickableRow } from '../../components/ClickableRow';
import { Button } from '../../components/Button'; // Import nút Button

// Định nghĩa kiểu cho navigation
type AccountNavigationProp = {
  navigate: (screen: 'EditProfile' | 'Address') => void;
};

export const AccountScreen = () => {
  const navigation = useNavigation<AccountNavigationProp>();
  
  // Lấy thông tin user và hàm logout từ store
  const user = useAuthStore((state: any) => state.user);
  const logoutAction = useAuthStore((state: any) => state.logout);

  const onLogout = () => {
    logoutAction();
    // RootNavigator sẽ tự động chuyển về màn hình Login
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView>
        {/* Phần Header (Mã vạch, điểm) - Dựa trên */}
        <View style={styles.header}>
          <Text style={styles.userName}>{user?.name || 'Khách'}</Text>
          <Text style={styles.points}>Hạng Bạc - 6.495 điểm</Text>
          {/* Bạn có thể thêm component Mã vạch ở đây sau */}
        </View>
        
        {/* Các thẻ chức năng - Dựa trên */}
        <Card>
          <ClickableRow text="Thông báo" onPress={() => { /* TODO */ }} />
          <ClickableRow text="Tiền Dư" onPress={() => { /* TODO */ }} />
          <ClickableRow text="Phiếu mua hàng" onPress={() => { /* TODO */ }} />
          <ClickableRow text="Ưu đãi đặc biệt" onPress={() => { /* TODO */ }} />
          <ClickableRow text="Tích điểm đổi quà" onPress={() => { /* TODO */ }} />
        </Card>

        <Card title="Thông tin cá nhân">
          <ClickableRow 
            text="Sửa thông tin cá nhân" 
            onPress={() => navigation.navigate('EditProfile')} 
          />
          <ClickableRow 
            text="Địa chỉ nhận hàng (1)" 
            onPress={() => navigation.navigate('Address')} 
          />
        </Card>

        <Card title="Hỗ trợ khách hàng">
          <ClickableRow text="Tư vấn: 1900.1908" onPress={() => { /* TODO */ }} />
          <ClickableRow text="Khiếu nại: 1800.1067" onPress={() => { /* TODO */ }} />
          <ClickableRow text="Tìm kiếm cửa hàng" onPress={() => { /* TODO */ }} />
          <ClickableRow text="Các chính sách khác" onPress={() => { /* TODO */ }} />
        </Card>
        
        {/* Nút Đăng xuất */}
        <View style={styles.logoutButtonContainer}>
           <Button title="Đăng xuất" onPress={onLogout} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F5F5F5', // Màu nền xám nhạt
  },
  header: {
    backgroundColor: '#FFFFFF', // Giả lập phần header thẻ
    padding: 16,
    margin: 16,
    borderRadius: 8,
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  points: {
    fontSize: 16,
    color: '#666',
  },
  logoutButtonContainer: {
    paddingHorizontal: 16,
    marginBottom: 20,
  }
});