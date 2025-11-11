// src/screens/User/AccountScreen.tsx
import React from 'react';
import { SafeAreaView, StyleSheet, ScrollView, View, Text } from 'react-native';
import { useAuthStore } from '../../store/authStore';
import { useNavigation } from '@react-navigation/native';
import { Ionicons, MaterialCommunityIcons, FontAwesome5, Feather } from '@expo/vector-icons';

import { Card } from '../../components/Card';
import { ClickableRow } from '../../components/ClickableRow';
import { Button } from '../../components/Button';

type AccountNavigationProp = {
  navigate: (screen: 'EditProfile' | 'Address' | 'NotificationScreen') => void;
};

export const AccountScreen = () => {
  const navigation = useNavigation<AccountNavigationProp>();
  const user = useAuthStore((state: any) => state.user);
  const logoutAction = useAuthStore((state: any) => state.logout);

  const onLogout = () => {
    logoutAction();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView>
        <View style={styles.header}>
          <Text style={styles.userName}>{user?.name || 'Khách'}</Text>
          <Text style={styles.points}>Hạng Bạc - 6.495 điểm</Text>
        </View>
        
        <Card>
          <ClickableRow 
            text="Thông báo" 
            icon={<Ionicons name="notifications" size={22} color="#1B5E20" />}
            onPress={() => navigation.navigate('NotificationScreen')} 
          />
          <ClickableRow 
            text="Tiền Dư" 
            icon={<MaterialCommunityIcons name="wallet" size={22} color="#1B5E20" />}
            onPress={() => {}} 
          />
          <ClickableRow 
            text="Phiếu mua hàng" 
            icon={<Ionicons name="ticket" size={22} color="#1B5E20" />}
            onPress={() => {}} 
          />
          <ClickableRow 
            text="Ưu đãi đặc biệt" 
            icon={<MaterialCommunityIcons name="gift" size={22} color="#1B5E20" />}
            onPress={() => {}} 
          />
          <ClickableRow 
            text="Tích điểm đổi quà" 
            icon={<FontAwesome5 name="star" size={20} color="#1B5E20" />}
            onPress={() => {}} 
          />
        </Card>

        <Card title="Thông tin cá nhân">
          <ClickableRow 
            text="Sửa thông tin cá nhân" 
            icon={<Ionicons name="person" size={22} color="#1B5E20" />}
            onPress={() => navigation.navigate('EditProfile')} 
          />
          <ClickableRow 
            text="Địa chỉ nhận hàng" 
            icon={<Ionicons name="location" size={22} color="#1B5E20" />}
            onPress={() => navigation.navigate('Address')} 
          />
        </Card>

        <Card title="Hỗ trợ khách hàng">
          <ClickableRow 
            text="Tư vấn: 1900.1908" 
            icon={<Ionicons name="call" size={22} color="#1B5E20" />}
            onPress={() => {}} 
          />
          <ClickableRow 
            text="Khiếu nại: 1800.1067" 
            icon={<MaterialCommunityIcons name="message-alert" size={22} color="#1B5E20" />}
            onPress={() => {}} 
          />
          <ClickableRow 
            text="Tìm kiếm cửa hàng" 
            icon={<Ionicons name="location-sharp" size={22} color="#1B5E20" />}
            onPress={() => {}} 
          />
          <ClickableRow 
            text="Các chính sách khác" 
            icon={<Feather name="file-text" size={22} color="#1B5E20" />}
            onPress={() => {}} 
          />
        </Card>
        
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
    backgroundColor: '#F5F5F5',
  },
  header: {
    backgroundColor: '#FFFFFF',
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