// src/screens/User/AccountScreen.tsx
import React from 'react';
import { SafeAreaView, StyleSheet, ScrollView, View, Text, TouchableOpacity } from 'react-native'; 
import { useAuthStore } from '../../store/authStore';
import { useNavigation } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons'; 
import QRCode from 'react-native-qrcode-svg';
import { useQuery } from '@tanstack/react-query';
import * as userApi from '../../api/userApi';

import { Card } from '../../components/Card';
import { ClickableRow } from '../../components/ClickableRow';

type AccountNavigationProp = {
  navigate: (screen: 'EditProfile' | 'Address' | 'NotificationScreen') => void;
};

export const AccountScreen = () => {
  const navigation = useNavigation<AccountNavigationProp>();
  
  const user = useAuthStore((state: any) => state.user);
  const logoutAction = useAuthStore((state: any) => state.logout);

  // Lấy số thông báo thực tế từ orders
  const { data: notifications } = useQuery({
    queryKey: ['notifications'],
    queryFn: userApi.getNotifications,
  });

  // Lấy số địa chỉ thực tế
  const { data: addresses } = useQuery({
    queryKey: ['addresses'],
    queryFn: userApi.getAddresses,
  });

  const notificationsCount = notifications?.length || 0;
  const addressesCount = addresses?.length || 0;

  const onLogout = () => {
    logoutAction();
  };
  
  // Lấy giá trị cho QR code (dựa theo text trong ảnh)
  const qrCodeValue = "186422"; 

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView>
        {/* Phần Header (QR code, điểm) */}
        <View style={styles.headerCard}>
          <View style={styles.headerInfo}>
            <Text style={styles.userName}>{user?.name || 'Khách'}</Text>
            <Text style={styles.points}>HẠNG BẠC - 6.495 điểm</Text>
          </View>
          
          {/* QR Code và nút Quét tích điểm nằm ngang hàng */}
          <View style={styles.qrSection}>
            <View style={styles.qrCodeContainer}>
              <View style={styles.qrCodeWrapper}>
                <QRCode 
                  value={qrCodeValue} 
                  size={90}
                />
              </View>
            </View>
            
            <TouchableOpacity style={styles.qrButton} activeOpacity={0.7}>
              <Feather name="grid" size={22} color="#10B981" />
              <Text style={styles.qrButtonText}>Quét tích điểm</Text>
            </TouchableOpacity>
          </View>
          
          <Text style={styles.barcodeText}>Đưa mã hoặc đọc số {qrCodeValue} để tích, sử dụng điểm</Text>
        </View>
        
        {/* Thẻ chức năng (không có title) */}
        <Card>
          <ClickableRow 
            text="Thông báo" 
            onPress={() => navigation.navigate('NotificationScreen')} 
            icon="bell"
            badge={notificationsCount > 0 ? notificationsCount : undefined}
          />
          <ClickableRow 
            text="Tiền Dư" 
            onPress={() => { /* TODO */ }} 
            icon="dollar-sign" 
            rightText="0đ"
            rightTextColor="#333" 
          />
          <ClickableRow 
            text="Phiếu mua hàng" 
            onPress={() => { /* TODO */ }} 
            icon="tag" 
          />
          <ClickableRow 
            text="Quà của tôi" 
            onPress={() => { /* TODO */ }} 
            icon="gift" 
            badge={3}
          />
          <ClickableRow 
            text="Ưu đãi đặc biệt" 
            onPress={() => { /* TODO */ }} 
            icon="star"
            badge="9+"
          />
          <ClickableRow 
            text="Tích điểm đổi quà" 
            onPress={() => { /* TODO */ }} 
            icon="award" 
            isLast
          />
        </Card>

        {/* Card Thông tin cá nhân */}
        <Card title="Thông tin cá nhân">
          <ClickableRow 
            text="Sửa thông tin cá nhân" 
            onPress={() => navigation.navigate('EditProfile')} 
            icon="user"
          />
          <ClickableRow 
            text={`Địa chỉ nhận hàng${addressesCount > 0 ? ` (${addressesCount})` : ''}`}
            onPress={() => navigation.navigate('Address')} 
            icon="map-pin"
            isLast
          />
        </Card>

        {/* Card Hỗ trợ khách hàng */}
        <Card 
          title="Hỗ trợ khách hàng"
          meta="Phiên bản: 2.0.27 (v1103)"
        >
          <ClickableRow 
            text="Tư vấn: 1900.1908 (7:30 - 21:00)"
            onPress={() => { /* TODO */ }} 
            icon="phone" 
          />
          <ClickableRow 
            text="Khiếu nại: 1800.1067 (7:30 - 21:00)"
            onPress={() => { /* TODO */ }} 
            icon="phone-call"
            rightText="Miễn phí"
          />
          <ClickableRow 
            text="Tìm kiếm cửa hàng" 
            onPress={() => { /* TODO */ }} 
            icon="map-pin"
          />
          <ClickableRow 
            text="Mua phiếu mua hàng"
            onPress={() => { /* TODO */ }} 
            icon="tag" 
          />
          <ClickableRow 
            text="Các chính sách khác" 
            onPress={() => { /* TODO */ }} 
            icon="file-text" 
          />
          <ClickableRow 
            text="Cập nhật ứng dụng"
            onPress={() => { /* TODO */ }} 
            icon="arrow-down-circle" 
            isLast
          />
        </Card>
        
        {/* Đăng xuất Card */}
        <Card>
           <ClickableRow 
              text="Đăng xuất" 
              onPress={onLogout} 
              icon="log-out" 
              isLast
              hideArrow
            />
        </Card>

        <View style={{ height: 20 }} /> 
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  headerCard: { 
    backgroundColor: '#E6F7F0', 
    padding: 16,
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#BFEAE0',
  },
  headerInfo: {
    marginBottom: 16,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  points: {
    fontSize: 14,
    color: '#4B5563', 
    fontWeight: '600',
    marginTop: 4,
    textTransform: 'uppercase', 
  },
  qrSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#BFEAE0',
  },
  qrCodeContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  qrCodeWrapper: {
    padding: 10,
    backgroundColor: 'white',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  qrButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    marginLeft: 20,
    backgroundColor: 'white',
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: '#10B981',
    minWidth: 110,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  qrButtonText: {
    fontSize: 11,
    color: '#10B981',
    fontWeight: '600',
    marginTop: 6,
    textAlign: 'center',
  },
  barcodeText: {
    fontSize: 12,
    color: '#4B5563',
    textAlign: 'center',
    marginTop: 8,
  },
});