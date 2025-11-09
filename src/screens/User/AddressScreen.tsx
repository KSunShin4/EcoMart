// src/screens/User/AddressScreen.tsx
import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useQuery } from '@tanstack/react-query';
import * as userApi from '../../api/userApi';
import { Button } from '../../components/Button'; // Import Button

export const AddressScreen = () => {
  const navigation = useNavigation();

  // Dùng React Query để lấy dữ liệu từ Mock API
  const { data: addresses, isLoading, error } = useQuery({
    queryKey: ['addresses'],
    queryFn: userApi.getAddresses,
  });

  const renderAddress = ({ item }: { item: userApi.Address }) => (
    <View style={styles.addressCard}>
      <View style={styles.addressHeader}>
        <Text style={styles.addressName}>{item.name}</Text>
        <View style={styles.buttonGroup}>
          <TouchableOpacity><Text style={styles.editButton}>Sửa</Text></TouchableOpacity>
          <TouchableOpacity><Text style={styles.deleteButton}>Xóa</Text></TouchableOpacity>
        </View>
      </View>
      <Text style={styles.addressText}>{item.phone}</Text>
      <Text style={styles.addressText}>{item.fullAddress}</Text>
      {item.isDefault && <Text style={styles.defaultBadge}>Mặc định</Text>}
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>{'<'}</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Thông tin nhận hàng</Text>
      </View>

      {isLoading && <ActivityIndicator size="large" style={{ marginTop: 20 }} />}
      {error && <Text style={styles.errorText}>Không thể tải địa chỉ</Text>}
      
      <FlatList
        data={addresses}
        renderItem={renderAddress}
        keyExtractor={(item) => item.id}
        ListFooterComponent={
          <View style={{ padding: 16 }}>
            <Button 
              title="+ Thêm thông tin nhận hàng" 
              onPress={() => { /* TODO: Mở màn hình Thêm/Sửa địa chỉ */ }}
            />
          </View>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F5F5F5' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  backButton: { fontSize: 24, marginRight: 16 },
  headerTitle: { fontSize: 18, fontWeight: 'bold' },
  errorText: { textAlign: 'center', color: 'red', marginTop: 10 },
  addressCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 8,
  },
  addressHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  addressName: { fontSize: 16, fontWeight: 'bold' },
  buttonGroup: { flexDirection: 'row' },
  editButton: { color: '#00884A', marginRight: 16 },
  deleteButton: { color: 'red' },
  addressText: { fontSize: 14, color: '#333', marginTop: 4 },
  defaultBadge: {
    color: '#00884A',
    borderColor: '#00884A',
    borderWidth: 1,
    borderRadius: 4,
    padding: 4,
    marginTop: 8,
    alignSelf: 'flex-start',
  },
});