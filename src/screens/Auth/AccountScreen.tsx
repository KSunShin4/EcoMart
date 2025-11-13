// src/screens/User/AccountScreen.tsx
import React from 'react';
import { SafeAreaView, StyleSheet, ScrollView, View, Text } from 'react-native';
import { useAuthStore } from '../../store/authStore';
import { useNavigation } from '@react-navigation/native';

import { Card } from '../../components/Card';
import { ClickableRow } from '../../components/ClickableRow';
// Xóa Button

// Định nghĩa kiểu cho navigation
type AccountNavigationProp = {
  navigate: (screen: 'EditProfile' | 'Address' | 'NotificationScreen') => void;
};

export const AccountScreen = () => {
  const navigation = useNavigation<AccountNavigationProp>();
  
  // Lấy hàm logout từ store
  const logoutAction = useAuthStore((state: any) => state.logout);

  const onLogout = () => {
    logoutAction();
    // RootNavigator sẽ tự động chuyển về màn hình Login
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView>
        {/* Phần Header (Mã vạch, điểm) - ĐÃ XÓA */}
        
        {/* Các thẻ chức năng (Thông báo, Tiền Dư...) - ĐÃ XÓA */}

        <Card title="Thông tin cá nhân">
          <ClickableRow 
            text="Sửa thông tin cá nhân" 
            onPress={() => navigation.navigate('EditProfile')} 
            icon="user"
          />
          <ClickableRow 
            text="Địa chỉ nhận hàng (1)" // Cập nhật text
            onPress={() => navigation.navigate('Address')} 
            icon="map-pin"
          />
        </Card>

        <Card 
          title="Hỗ trợ khách hàng"
          meta="Phiên bản: 2.0.27 (v1103)" // Thêm prop meta
        >
          <ClickableRow 
            text="Tư vấn: 1900.1908 (7:30 - 21:00)" // Cập nhật text
            onPress={() => { /* TODO */ }} 
            icon="phone" 
          />
          <ClickableRow 
            text="Khiếu nại: 1800.1067 (7:30 - 21:00)" // Cập nhật text
            onPress={() => { /* TODO */ }} 
            icon="phone-call" 
          />
          <ClickableRow 
            text="Tìm kiếm cửa hàng" 
            onPress={() => { /* TODO */ }} 
            icon="map-pin" // Đổi icon
          />
          <ClickableRow 
            text="Mua phiếu mua hàng" // Thêm
            onPress={() => { /* TODO */ }} 
            icon="tag" 
          />
          <ClickableRow 
            text="Các chính sách khác" 
            onPress={() => { /* TODO */ }} 
            icon="file-text" 
          />
          <ClickableRow 
            text="Cập nhật ứng dụng" // Thêm
            onPress={() => { /* TODO */ }} 
            icon="arrow-down-circle" 
          />
        </Card>
        
        {/* Nút Đăng xuất */}
        <View style={styles.logoutCardContainer}>
           <Card>
             <ClickableRow text="Đăng xuất" onPress={onLogout} icon="log-out" />
           </Card>
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
  // Đã xóa styles cho .header, .userName, .points
  logoutCardContainer: {
    marginTop: 8,
    marginBottom: 20,
  }
});